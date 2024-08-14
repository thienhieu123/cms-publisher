/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  //   gridPageCountSelector,
  GridPagination,
  //   useGridApiContext,
  //   useGridSelector,
} from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";

function Pagination(props) {
  const pageCount = Math.ceil(props.count / 8);
  return (
    <MuiPagination
      color="primary"
      className={props.className}
      count={pageCount}
      page={props.page + 1}
      onChange={(event, newPage) => {
        props.onPageChange(event, newPage - 1);
      }}
    />
  );
}
function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}
export default function ListWarning({ data }) {
  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid
        pagination
        slots={{
          pagination: CustomPagination,
        }}
        columns={[{ field: "messages" }, { field: "expieredDate" }, { field: "danger" }]}
        rows={data}
        {...data}
        initialState={{
          ...data.initialState,
          pagination: { paginationModel: { pageSize: 8 } },
        }}
      />
    </Box>
  );
}
