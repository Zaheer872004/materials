import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import TableData from "../models/TableData";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from "axios";

// const columns: GridColDef[] = [
//   { field: "id", headerName: "ID", width: 90 },
//   {
//     field: "title",
//     headerName: "Title",
//     width: 300,
//     editable: true,
//   },
//   {
//     field: "userId",
//     headerName: "User ID",
//     width: 150,
//     editable: true,
//   },
//   {
//     field: "body",
//     headerName: "Body",
//     width: 300,
//     editable: true,
//   },
// ];



const url = `https://api.artic.edu/api/v1/artworks?page=${page}`;

export default function UserTable() {
  const [rows, setRows] = useState<TableData[] | []>([]);


  const sendingRequest = () => {

    const products = axios.get(url)
      .then((response) => response.data.json())
      .then((data) => setRows(data))
      .catch((error) => console.error(error));

    console.log(products);
  };

  useEffect(() => {
    sendingRequest();
  }, []);
  return (
// title, place_of_origin, artist_display, inscriptions, date_start, date_end
    <div>
      {
        <DataTable value={rows} tableStyle={{ minWidth: '50rem' }}>
        {rows.map((product) => (
            <Column key={product.data.id} field={product.field} header={product.header} />
        ))}
    </DataTable>
      }
    </div>

  );
}
