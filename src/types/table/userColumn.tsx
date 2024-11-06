import Button from "@/components/elements/Button";
import { formatDate } from "@/lib/formater";
import {
  GridColDef,
  GridRowIdGetter,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Link from "next/link";
import { Profile } from "../entities/profile";

export const userTableColumns: GridColDef[] = [
  {
    field: "username",
    headerName: "Username",
    headerAlign: "center",
    width: 200,
    align: "center",
  },
  {
    field: "role",
    headerName: "Role",
    headerAlign: "center",
    width: 200,
    align: "center",
  },
  {
    field: "nama",
    headerName: "Nama",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) =>
      row.role !== "PASIEN"
        ? row.listProfile[0].name
        : row.listProfile.find((profile: Profile) => profile.relative === 0)
            .name,
  },
  {
    field: "updatedAt",
    headerName: "Terakhir Diubah",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `${formatDate(value)}`,
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
          <Link href={`/akun/detail/${value.row.id}`}>
            <Button variant="outline" size="sm" fullRounded className="mx-auto">
              Detail
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const getRowIdUsers: GridRowIdGetter<GridValidRowModel> = (row) =>
  row.id;
