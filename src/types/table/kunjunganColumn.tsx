import Button from "@/components/elements/Button";
import { formatDateOnly } from "@/lib/formater";
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

export const kunjunganTables: GridColDef[] = [
  {
    field: "tanggal",
    headerName: "Tanggal Kunjungan",
    headerAlign: "center",
    align: "center",
    width: 200,
    valueGetter: (value, row, column, apiRef) =>
      formatDateOnly(row.tanggal) || "-",
  },
  {
    field: "name",
    headerName: "Nama Pasien",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return row.profile?.name ?? "-";
    },
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    width: 150,
    align: "center",
    renderCell: (params) => {
      const status = params.row.status;
      let statusText = "";
      let color = "";
      switch (status) {
        case 0:
          statusText = "Belum Dilayani";
          color = "red";
          break;
        case 1:
          statusText = "Sedang Dilayani";
          color = "blue";
          break;
        case 2:
          statusText = "Selesai";
          color = "green";
          break;
        case 3:
          statusText = "Dibatalkan";
          color = "gray";
          break;
      }
      return <span style={{ color: color }}>{statusText}</span>;
    },
  },
  {
    field: "action",
    headerName: "Detail",
    headerAlign: "center",
    width: 200,
    align: "center",
    sortable: false,
    renderCell: (params: CustomGridValueGetterParams) => {
      return (
        <div className="w-full flex items-center gap-2 justify-center h-full">
          <Link href={`/kunjungan/${params.row.id}`}>
            <Button variant="outline" size="sm" fullRounded className="mx-auto">
              Detail
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const getRowIdKunjungan: GridRowIdGetter<GridValidRowModel> = (row) =>
  row.id;
