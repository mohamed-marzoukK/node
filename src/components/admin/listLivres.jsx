"use client"
import { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable , useMaterialReactTable} from 'material-react-table';
import { Box } from '@mui/material';
import Image from "next/image"
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
const Listlivres = ({livres}) => {
const[searchTitre,setsearchTitre]=useState()
const[livresdata,setLivresData]=useState(livres)
// fetching state
const [isError, setIsError] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [isRefetching, setIsRefetching] = useState(false);
const [rowCount, setRowCount] = useState(0);
//table state
const [columnFilters, setColumnFilters] = useState([]);
const [globalFilter, setGlobalFilter] = useState('');
const [sorting, setSorting] = useState([]);
const [pagination, setPagination] = useState({
pageIndex: 0,
pageSize: 10,
});
useEffect(() => {
const fetchData = async () => {
if (!livres.length) {
setIsLoading(true);
}
try {
let url = process.env.URL +"/api/livres"+
`?page=${pagination.pageIndex+1}&limit=${pagination.pageSize}`
const response = await fetch(url);
const data = await response.json();
setLivresData(data.livres);
setRowCount(data.nbRows);
} catch (error) {
setIsError(true);
console.error(error);
return;
}
setIsError(false);
setIsLoading(false);
setIsRefetching(false);
};
fetchData();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [
columnFilters,
globalFilter,
pagination.pageIndex,
pagination.pageSize,
sorting,
]);
const handlefind = (e) => {
const searchTerm = e.target.value;
setsearchTitre(searchTerm);
if (searchTerm === '') {
setLivresData(livres);
} else {
setLivresData(livres.filter((item) => {
return item.titre.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
}));
}
};
const columns = useMemo(
() => [
{
accessorKey: 'couverture',
header: 'Image',
Cell: ({ cell}) => (
<Box
sx={{
display: 'flex',
alignItems: 'center',
gap: '1rem',
}}
>
<Image
src={cell.getValue()}
alt="livre image"
height="100"
width="100"
style={{maxWidth:'100px', maxHeight: "100px" }}
priority={false}
/>
</Box>),
},
{
accessorKey: 'isbn',
header: 'ISBN',
size: 100,
},
{
accessorKey: 'titre',
header: 'TITRE',
size: 100,
},
{
accessorKey: 'editeurs.maisonedit',
header: 'Editeur',
size: 100,
},
{
accessorKey: 'annedition',
header: 'Année Edition',
size: 100,
},
{
accessorKey: 'prix',
header: 'Prix',
size: 100,
},
{
accessorKey: 'qtestock',
header: 'Stock',
size: 100,
},
{
accessorKey: 'specialites.nomspecialite',
header: 'Spécialité',
size: 100,
},
{
accessorFn: (originalRow) => originalRow.livre_auteur.map((aut,i)=>{
return <div key={i}>{aut.auteurs.nomauteur}</div>
}),
id: 'aut.auteurs.id',
header: 'Auteurs',
},
],
[livresdata],
);
const table = useMaterialReactTable({
columns,
data: livresdata,
getRowId: (row) => row.id,
enableRowSelection: true,
initialState: { showColumnFilters: true },
manualFiltering: true,
manualPagination: true,
manualSorting: true,
muiToolbarAlertBannerProps: isError
? {
color: 'error',
children: 'Error loading data',
}
: undefined,
onColumnFiltersChange: setColumnFilters,
onGlobalFilterChange: setGlobalFilter,
onPaginationChange: setPagination,
onSortingChange: setSorting,
rowCount,
state: {
columnFilters,
globalFilter,
isLoading,
pagination,
showAlertBanner: isError,
showProgressBars: isRefetching,
sorting,
},
});
return (
<div className="container">
<h1 className="text-3xl font-semibold">Liste des livres</h1>
<form className="row">
<div className="col-md-4 d-flex align-items-center">
<span className="input-group-text"><ManageSearchIcon/></span>
<input className="form-control col-md-2" type="search" placeholder="Raccourci
Filtre Titre" aria-label="Search" onChange={(e)=>handlefind(e)}/>
</div>
</form>
<MaterialReactTable table={table} />
</div>
)
}
export default Listlivres