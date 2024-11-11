import Button from "@/components/elements/Button";
import {
  formatDate,
  formatDateOnly,
  getCurrency,
  getSatuanObat,
} from "@/lib/formater";
import {
  GridColDef,
  GridRowIdGetter,
  GridValidRowModel,
} from "@mui/x-data-grid";
import Link from "next/link";

export const obatTableColumn: GridColDef[] = [
  {
    field: "namaObat",
    headerName: "Nama Obat",
    headerAlign: "cettnter",
    width: 200,
    align: "center",
  },
  {
    field: "deskripsi",
    headerName: "Deskripsi",
    headerAlign: "center",
    width: 200,
    align: "center",
  },
  {
    field: "totalStok",
    headerName: "Stok",
    headerAlign: "center",
    width: 200,
    align: "center",
    renderCell: (value) =>
      `${value.row.totalStok} ${getSatuanObat(value.row.jenisSatuan)}`,
  },
  {
    field: "updatedAt",
    headerName: "Last Update",
    headerAlign: "center",
    width: 250,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `${formatDate(value)}`,
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
        <div className="w-full flex items-center justify-center h-full gap-2">
          <Link href={`/obat/detail/${value.row.id}`}>
            <Button variant="outline" size="sm" fullRounded className="mx-auto">
              Detail
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const restockColumn: GridColDef[] = [
  {
    field: "createdAt",
    headerName: "Tanggal Input",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `${formatDateOnly(value)}`,
  },
  {
    field: "tanggalPembelian",
    headerName: "Tanggal Pembelian",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `${formatDateOnly(value)}`,
  },
  {
    field: "tanggalKadaluarsa",
    headerName: "Tanggal Kadaluarsa",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `${formatDateOnly(value)}`,
  },
  {
    field: "kuantitas",
    headerName: "Kuantitas Pembelian",
    headerAlign: "center",
    width: 200,
    align: "center",
  },
];

export const pendingRestockColumn: GridColDef[] = [
  {
    field: "namaObat",
    headerName: "Nama Obat",
    headerAlign: "center",
    width: 180,
    align: "center",
  },
  {
    field: "hargaBeli",
    headerName: "Harga Beli",
    headerAlign: "center",
    width: 180,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `${getCurrency(value)}`,
  },
  {
    field: "createdAt",
    headerName: "Tanggal Input",
    headerAlign: "center",
    width: 180,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `${formatDateOnly(value)}`,
  },
  {
    field: "tanggalPembelian",
    headerName: "Tanggal Pembelian",
    headerAlign: "center",
    width: 180,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `${formatDateOnly(value)}`,
  },
  {
    field: "tanggalKadaluarsa",
    headerName: "Tanggal Kadaluarsa",
    headerAlign: "center",
    width: 180,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `${formatDateOnly(value)}`,
  },
  {
    field: "kuantitas",
    headerName: "Kuantitas Pembelian",
    headerAlign: "center",
    width: 100,
    align: "center",
  },
];


export const availableObatTableColumn: GridColDef[] = [
  {
    field: "namaObat",
    headerName: "Nama Obat",
    headerAlign: "center",
    width: 200,
    align: "center",
  },
  // {
  //   field: "deskripsi",
  //   headerName: "Deskripsi",
  //   headerAlign: "center",
  //   width: 200,
  //   align: "center",
  // },
  {
    field: "totalStok",
    headerName: "Stok Tersedia",
    headerAlign: "center",
    width: 150,
    align: "center",
    renderCell: (params) =>
      `${params.row.totalStok} ${getSatuanObat(params.row.jenisSatuan)}`,
  },
  // {
  //   field: "tanggalKadaluarsa",
  //   headerName: "Tanggal Kadaluarsa",
  //   headerAlign: "center",
  //   width: 180,
  //   align: "center",
  //   valueGetter: (value, row, column, apiRef) => `${formatDateOnly(value)}`,
  // },
];

export const getRowIdRestock: GridRowIdGetter<GridValidRowModel> = (row) =>
  row.id;

export const pemakaianObatColumn: GridColDef[] = [
  {
    field: "tanggal",
    headerName: "Tanggal Pemakaian",
    headerAlign: "center",
    width: 250,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `${formatDate(value)}`,
  },
  {
    field: "jumlah",
    headerName: "Kuantitas",
    headerAlign: "center",
    width: 200,
    align: "center",
  },
  {
    field: "keterangan",
    headerName: "Keterangan",
    headerAlign: "center",
    width: 200,
    align: "center",
    valueGetter: (value, row, column, apiRef) => `-`,
  },
];
