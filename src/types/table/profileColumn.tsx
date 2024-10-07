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
            return row.profile?.name ?? "-"
        },
    },
    {
        field: "jenis_kelamin",
        headerName: "Jenis Kelamin",
        headerAlign: "center",
        width: 200,
        valueGetter: (value, row, column, apiRef) => {
            return row.profile?.jenis_kelamin ?? "-"
        },
    },
    {
        field: "tanggal_lahir",
        headerName: "Tanggal Lahir",
        headerAlign: "center",
        width: 200,
        valueGetter: (value, row, column, apiRef) => {
            return row.profile?.tanggal_lahir ?? "-"
          },
      
    },
    {
        field: "no_hp",
        headerName: "Nomor Telepon",
        headerAlign: "center",
        width: 200,
        valueGetter: (value, row, column, apiRef) => {
            return row.profile?.no_hp ?? "-"
        },
      
    },
    {
        field: "relative",
        headerName: "Hubungan",
        headerAlign: "center",
        width: 200,
        valueGetter: (value, row, column, apiRef) => {
            return row.profile?.relative ?? "-"
        },
    },
    {
        field: "action",
        headerName: "Action",
        headerAlign: "center",
        width: 200,
        align: "center",
        sortable: false,
        renderCell: (params: CustomGridValueGetterParams) => {
            return (
            <div className="w-full flex items-center gap-2 justify-center h-full">
                <Link href={``}>
                <Button variant="primary" size="sm" fullRounded className="mx-auto">
                    <BiSolidPencil />
                </Button>
                </Link>
                <Link href={``}>
                <Button variant="danger" size="lg" fullRounded className="mx-auto">
                    <FaRegTrashAlt/>
                </Button>
                </Link>
            </div>
            );
        },
    },
]

export const getRowIdProfile: GridRowIdGetter<GridValidRowModel> = (row) => row.id;
  