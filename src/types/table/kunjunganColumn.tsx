import Button from "@/components/elements/Button";
import { LuPencil } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { Kunjungan } from "@/types/entities/kunjungan";
import {
  GridColDef,
  GridRowIdGetter,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Link from "next/link";

type CustomGridValueGetterParams = {
  row: Kunjungan;
};

export const kunjunganTableColumns: GridColDef[] = [
  {
    field: "sesi",
    headerName: "Sesi",
    headerAlign: "center",
    width: 200,
    valueGetter: (value, row, column, apiRef) => {
      return row.antrian?.sesi ?? "-"
    }
  },
  {
    field: "noAntrian",
    headerName: "No. Antrian",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return row.antrian?.noAntrian ?? "-"
    }
  },
  {
    field: "name",
    headerName: "Nama Pasien",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return row.profile?.name ?? "-"
    }
  },
  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    width: 400,
    align: "center",
    sortable: false,
    renderCell: (params: CustomGridValueGetterParams) => {
      return (
        <div className="w-full flex items-center gap-2 justify-center h-full">
          <Link href={`/home`}>
            <Button variant="outline" size="sm" fullRounded className="mx-auto">
              Detail Pasien
            </Button>
          </Link>
          <Link href={`/home`}>
            <Button variant="primary" size="sm" fullRounded className="mx-auto" leftIcon={LuPencil}>
            </Button>
          </Link>
          <Link href={`/home`}>
            <Button variant="danger" size="sm" fullRounded className="mx-auto" leftIcon={FaRegTrashAlt}>
            </Button>
          </Link>
        </div>
      );
    },
  },
];

// Fungsi untuk mendapatkan Row ID
export const getRowIdKunjungans: GridRowIdGetter<Kunjungan> = (row: Kunjungan) => row.id;