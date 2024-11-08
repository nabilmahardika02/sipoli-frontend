import { HasilPemeriksaan } from "@/types/entities/hasilPemeriksaan";
import { GridColDef, GridRowIdGetter } from "@mui/x-data-grid";
import Link from "next/link";
import Button from "@/components/elements/Button";

export const hasilPemeriksaanTables: GridColDef[] = [
  {
    field: "tanggal",
    headerName: "Tanggal Kunjungan",
    headerAlign: "center",
    align: "center",
    width: 200,
    valueGetter: (params) => {
      const tanggal = params.row?.tanggal;
      if (tanggal) {
        const date = new Date(tanggal);
        return date.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return "-";
    },
  },
  {
    field: "action",
    headerName: "Detail",
    headerAlign: "center",
    width: 200,
    align: "center",
    sortable: false,
    renderCell: (params) => (
      <Link href={`/rekam-medis/${params.row.id}`}>
        <Button variant="outline" size="sm" fullRounded>
          Detail
        </Button>
      </Link>
    ),
  },
];

// Fungsi untuk mendapatkan Row ID
export const getRowIdHasilPemeriksaan: GridRowIdGetter<HasilPemeriksaan> = (row) => row.id;
