import Button from "@/components/elements/Button";
import { formatDateOnly, getJenisKelamin, getRelative } from "@/lib/formater";
import {
  GridColDef,
  GridRowIdGetter,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Link from "next/link";

export const profileTableColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Nama",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return row.name || "-";
    },
  },
  {
    field: "jenisKelamin",
    headerName: "Jenis Kelamin",
    headerAlign: "center",
    width: 150,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return getJenisKelamin(row.jenisKelamin);
    },
  },
  {
    field: "tanggalLahir",
    headerName: "Tanggal Lahir",
    headerAlign: "center",
    width: 150,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return row.tanggalLahir ? formatDateOnly(row.tanggalLahir) : "-";
    },
  },
  {
    field: "noHp",
    headerName: "Nomor Telepon",
    headerAlign: "center",
    width: 150,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return row.noHp || "-";
    },
  },
  {
    field: "relative",
    headerName: "Hubungan",
    headerAlign: "center",
    width: 150,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return getRelative(row.relative);
    },
  },
  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    width: 150,
    align: "center",
    sortable: false,
    renderCell: (value) => {
      return (
        <div className="w-full flex items-center justify-center h-full">
          <Link href={`/akun/profile/update/${value.row.id}`}>
            <Button variant="outline" size="sm" fullRounded className="mx-auto">
              Edit
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const getRowIdProfile: GridRowIdGetter<GridValidRowModel> = (row) =>
  row.id;
