import { useMediaQuery } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowClassNameParams,
  GridRowIdGetter,
  GridToolbar,
  GridValidRowModel,
} from "@mui/x-data-grid";

export default function DataTable({
  columns,
  rows,
  getRowId,
  useToolBar = true,
  flexColumnIndexes = [],
  rowClassName,
  showPerPage,
  initialPageSize,
}: {
  columns: GridColDef[];
  rows: any[];
  useToolBar?: boolean;
  getRowId?: GridRowIdGetter;
  flexColumnIndexes?: number[];
  rowClassName?:
    | ((params: GridRowClassNameParams<GridValidRowModel>) => string)
    | undefined;
  showPerPage?: number[];
  initialPageSize?: number;
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
          paginationModel: { pageSize: initialPageSize ? initialPageSize : 10 },
        },
      }}
      getRowClassName={rowClassName}
      sx={{
        "& .MuiButtonBase-root": {
          color: "#721E49",
        },
      }}
      pageSizeOptions={showPerPage ? showPerPage : [5, 10, 20]}
      disableRowSelectionOnClick
    />
  );
}
