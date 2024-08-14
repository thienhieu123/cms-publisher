import { ArrowBackIosNewOutlined, ArrowForwardIosOutlined } from "@mui/icons-material";
import { Pagination, TablePagination, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

const PaginateButton = styled("button")({
  backgroundColor: "transparent",
  padding: "4px",
  fontSize: "14px",
  lineHeight: "20px",
  width: "32px",
  height: "32px",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
});

function TablePaginationActions({
  count: totalElements,
  rowsPerPage,
  onPageChange,
  page: curPage,
}) {
  const pageCount = Math.ceil(totalElements / rowsPerPage);
  const onPaginationChange = (e, selectedPage) => {
    onPageChange(e, selectedPage - 1);
  };
  return (
    <Pagination
      count={pageCount}
      onChange={onPaginationChange}
      sx={({ breakpoints }) => ({
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
        [breakpoints.down("sm")]: {
          justifyContent: "center",
        },

        "& .MuiPagination-ul": {
          gap: "6px",
          flexWrap: "nowrap",
        },
      })}
      renderItem={(props) => {
        // eslint-disable-next-line react/prop-types
        const { page, type } = props;
        let children = null;
        if (type === "start-ellipsis" || type === "end-ellipsis") {
          children = "…";
        } else if (type === "page") {
          children = (
            <PaginateButton
              type="button"
              style={{
                fontWeight: page - 1 === curPage ? "bold" : undefined,
                border: page - 1 === curPage ? "none" : "1px solid #E1E3E9",
                color: page - 1 === curPage ? "#00B6DE" : "#3F4254",
              }}
              {...props}
            >
              {page}
            </PaginateButton>
          );
        } else if (type === "previous") {
          children = (
            <Tooltip title="Về Trước" placement="top">
              <span>
                <PaginateButton
                  style={{ border: "none" }}
                  type="button"
                  disabled={page === 0}
                  {...props}
                >
                  <ArrowBackIosNewOutlined />
                </PaginateButton>
              </span>
            </Tooltip>
          );
        } else if (type === "next") {
          children = (
            <Tooltip title="Tiếp Theo" placement="top">
              <span>
                <PaginateButton
                  style={{ border: "none" }}
                  type="button"
                  disabled={page >= Math.ceil(totalElements / rowsPerPage) - 1}
                  {...props}
                >
                  <ArrowForwardIosOutlined />
                </PaginateButton>
              </span>
            </Tooltip>
          );
        }
        return children;
      }}
    />
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  curPage: PropTypes.number,
};

TablePaginationActions.defaultProps = {
  curPage: 0,
};

function LabelDisplayedRows(totalElements) {
  return (
    <span style={{ display: "flex", fontSize: "12px", fontWeight: "400" }}>
      trong tổng số <b style={{ marginLeft: 4, color: "#F10035" }}>{totalElements}</b>
    </span>
  );
}

function TablePaginationCustom({
  totalElements,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  rowsPerPageOptions,
}) {
  const onRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <TablePagination
      sx={({ breakpoints }) => ({
        boxShadow: "none",
        border: "none",
        borderRadius: "0 0 1rem 1rem",
        paddingLeft: "10px",
        // marginTop: "24px",
        background: "white",
        ".MuiInputBase-root": {
          width: "auto !important",
          [breakpoints.down("sm")]: {
            margin: 0,
          },
        },
        ".MuiTablePagination-spacer": {
          flex: 0,
        },
        ".MuiToolbar-root": {
          padding: 0,
          "> .MuiInputBase-root": {
            margin: "0 25px 0 10px",
            padding: "4px 0px",
            border: "1px solid #F10035 !important",
            borderRadius: "4px !important",
            "> .MuiInputBase-input:focus": {
              backgroundColor: "transparent !important",
            },
            "> .MuiTablePagination-select": {
              fontWeight: "600",
              // border: "1px solid #F10035 !important",
              color: "var(--red-200)",
              // marginLeft: "-12px",
              // minWidth: "24px !important",
              paddingRight: "30px !important",
              paddingLeft: "0px !important",
              marginLeft: "0px !important",
            },
            "> .MuiSvgIcon-root": {
              top: "3px !important",
              right: "-22px",
              width: "1.5rem !important",
              height: "1.5rem !important",
            },
          },
        },
        [breakpoints.down("sm")]: {
          "& .MuiToolbar-root": {
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "12px",
          },
        },
        "@media (max-width: 500px)": {
          bottom: "-80px !important",
        },
      })}
      labelRowsPerPage={
        <Typography component="span" fontSize={12} fontWeight={400} sx={{ marginLeft: "32px" }}>
          Hiển thị
        </Typography>
      }
      labelDisplayedRows={() => LabelDisplayedRows(totalElements)}
      rowsPerPageOptions={rowsPerPageOptions}
      rowsPerPage={rowsPerPage}
      component="div"
      count={totalElements}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={onRowsPerPageChange}
      ActionsComponent={TablePaginationActions}
    />
  );
}
export default TablePaginationCustom;

TablePaginationCustom.defaultProps = {
  rowsPerPage: 5,
  page: 0,
  setPage: () => {},
  setRowsPerPage: () => {},
  rowsPerPageOptions: [20, 50, 100, 200],
};

TablePaginationCustom.propTypes = {
  totalElements: PropTypes.number.isRequired,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  setPage: PropTypes.func,
  setRowsPerPage: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
};
