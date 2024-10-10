import Button from "@/components/elements/Button";
import { Profile } from "@/types/entities/profile";
import { FaRegTrashAlt } from "react-icons/fa";
import { BiSolidPencil } from "react-icons/bi";
import {
    GridColDef,
    GridRowIdGetter,
    GridValidRowModel,
} from "@mui/x-data-grid";
import Link from "next/link";
import { getRelative, getJenisKelamin } from "@/lib/formater";

const jenisKelamin = [
    {
      value: false,
      text: "Laki-laki",
    },
    {
      value: true,
      text: "Perempuan",
    },
];

type CustomGridValueGetterParams = {
    row: Profile;
};  

export const profileTableColumns: GridColDef[] = [
    {
        field: "name",
        headerName: "Nama",
        headerAlign: "center",
        width: 200,
        valueGetter: (value, row, column, apiRef) => {
            return row.name || "-"
        },
    },
    {
        field: "jenisKelamin",
        headerName: "Jenis Kelamin",
        headerAlign: "center",
        width: 200,
        valueGetter: (value, row, column, apiRef) => {
            return getJenisKelamin(row.jenisKelamin)
        },
    },
    {
        field: "tanggalLahir",
        headerName: "Tanggal Lahir",
        headerAlign: "center",
        width: 200,
        valueGetter: (value, row, column, apiRef) => {
            return row.tanggalLahir || "-"
          },
      
    },
    {
        field: "noHp",
        headerName: "Nomor Telepon",
        headerAlign: "center",
        width: 200,
        valueGetter: (value, row, column, apiRef) => {
            return row.noHp || "-"
        },
      
    },
    {
        field: "relative",
        headerName: "Hubungan",
        headerAlign: "center",
        width: 200,
        valueGetter: (value, row, column, apiRef) => {
            return getRelative(row.relative)
        },
    },
]

export const getRowIdProfile: GridRowIdGetter<GridValidRowModel> = (row) => row.id;
  