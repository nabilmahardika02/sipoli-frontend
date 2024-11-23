import {
  GridColDef,
  GridRowIdGetter,
  GridValidRowModel,
} from "@mui/x-data-grid";

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
