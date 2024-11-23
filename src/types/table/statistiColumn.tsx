import Button from "@/components/elements/Button";
import {
  GridColDef,
  GridRowIdGetter,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Link from "next/link";

export const statisticTableColumn: GridColDef[] = [
  {
    field: "label",
    headerName: "Kategori",
    headerAlign: "center",
    width: 150,
    align: "center",
  },
  {
    field: "amount",
    headerName: "Jumlah",
    headerAlign: "center",
    width: 150,
    align: "center",
  },
];

export const getRowIdStatistic: GridRowIdGetter<GridValidRowModel> = (row) =>
  row.label;

export const rujukanTableColumn: GridColDef[] = [
  {
    field: "tujuan",
    headerName: "RS Tujuan",
    headerAlign: "center",
    width: 150,
    align: "center",
  },
  {
    field: "dokter",
    headerName: "Dokter Tujuan",
    headerAlign: "center",
    width: 150,
    align: "center",
  },
  {
    field: "action",
    headerName: "Detail Kunjungan",
    headerAlign: "center",
    width: 150,
    align: "center",
    sortable: false,
    renderCell: (value) => {
      return (
        <div className="w-full flex items-center justify-center h-full gap-2">
          <Link href={`/kunjungan/${value.row.idKunjungan}`}>
            <Button variant="outline" size="sm" fullRounded className="mx-auto">
              Detail
            </Button>
          </Link>
        </div>
      );
    },
  },
];
