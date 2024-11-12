import Button from "@/components/elements/Button";
import { getJenisKelamin } from "@/lib/formater";
import {
  GridColDef,
  GridRowIdGetter,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Link from "next/link";

export const pasienTableColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Nama",
    headerAlign: "center",
    width: 200,
    align: "center",
  },
  {
    field: "jenisKelamin",
    headerName: "Jenis Kelamin",
    headerAlign: "center",
    width: 150,
    align: "center",
    valueGetter: (value, row, column, apiRef) =>
      getJenisKelamin(row.jenisKelamin),
  },
  {
    field: "nik",
    headerName: "NIK",
    headerAlign: "center",
    width: 150,
    align: "center",
  },
  {
    field: "noRekamMedis",
    headerName: "No Rekam Medis",
    headerAlign: "center",
    width: 150,
    align: "center",
    valueGetter: (value, row, column, apiRef) => row.noRekamMedis || "-",
  },
  {
    field: "action",
    headerName: "Detail",
    headerAlign: "center",
    width: 150,
    align: "center",
    sortable: false,
    renderCell: (value) => {
      return (
        <div className="w-full flex items-center justify-center h-full">
          <Link href={`/pasien/detail/${value.row.id}`}>
            <Button variant="outline" size="sm" fullRounded className="mx-auto">
              Detail
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const getRowIdPasiens: GridRowIdGetter<GridValidRowModel> = (row) =>
  row.id;
