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
    width: 300,
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
    width: 250,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return row.tanggalLahir ? formatDateOnly(row.tanggalLahir) : "-";
    },
  },
  {
    field: "noHp",
    headerName: "Nomor Telepon",
    headerAlign: "center",
    width: 195,
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
];

export const getRowIdProfile: GridRowIdGetter<GridValidRowModel> = (row) =>
  row.id;
