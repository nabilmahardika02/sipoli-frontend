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

export const kunjunganTableColumns: GridColDef[] = [
  {
    field: "sesi",
    headerName: "Sesi",
    headerAlign: "center",
    align: "center",
    width: 100,
    valueGetter: (value, row, column, apiRef) => {
      return row.antrian?.sesi ?? "-";
    },
  },
  {
    field: "noAntrian",
    headerName: "No. Antrian",
    headerAlign: "center",
    width: 100,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return row.antrian.noAntrian ?? "-";
    },
  },
  {
    field: "tanggal",
    headerName: "Tanggal",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) => {
      return formatDateOnly(row.tanggal) ?? "-";
    },
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
    sortable: true,
    valueGetter: (value, row, column, apiRef) => {
      row.status;
    },
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
          color = "green";
          break;
      }
      return <span style={{ color: color }}>{statusText}</span>;
    },
  },
];

// Fungsi untuk mendapatkan Row ID
export const getRowIdKunjungans: GridRowIdGetter<GridValidRowModel> = (row) =>
  row.id;
