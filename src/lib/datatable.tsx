import { useMediaQuery } from "@mui/material";
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
  flexColumnIndexes = [],
}: {
  columns: GridColDef[];
  rows: any[];
  useToolBar?: boolean;
  getRowId?: GridRowIdGetter;
  flexColumnIndexes?: number[];
}) {
  const isMobile = useMediaQuery("(max-width:768px)");

  const responsiveColumns = columns.map((col, index) => ({
    ...col,
    flex: isMobile
      ? undefined
      : flexColumnIndexes.includes(index)
      ? 1
      : undefined,
  }));

  return (
    <DataGrid
      slots={useToolBar ? { toolbar: GridToolbar } : undefined}
      getRowId={getRowId}
      rows={rows}
      columns={responsiveColumns}
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
