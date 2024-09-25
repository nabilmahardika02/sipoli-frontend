import {
  DataGrid,
  GridColDef,
  GridRowIdGetter,
  GridToolbar,
} from "@mui/x-data-grid";

export default function DataTable({
  columns,
  rows,
  getRowId,
  useToolBar = true,
}: {
  columns: GridColDef[];
  rows: any[];
  useToolBar?: boolean;
  getRowId?: GridRowIdGetter;
}) {
  return (
    <DataGrid
      slots={useToolBar ? { toolbar: GridToolbar } : undefined}
      getRowId={getRowId}
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },
      }}
      pageSizeOptions={[5, 10, 20]}
      disableRowSelectionOnClick
    />
  );
}
