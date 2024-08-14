/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import react, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// @mui material components
import { Checkbox, Grid, IconButton, Table as MuiTable, TableCell } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";

// Soft UI Dashboard React base styles
import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
  UnfoldMoreOutlined,
} from "@mui/icons-material";
import borders from "~/assets/theme/base/borders";
import colors from "~/assets/theme/base/colors";
import typography from "~/assets/theme/base/typography";
import "~/examples/Tables/style/style.css";
import moment from "moment";
import TablePaginationCustom from "../../../components/Table/TablePaginationCustom";

function Table({
  title,
  badgeColor,
  badgeData,
  header,
  headerLabel,
  isPagination,
  link,
  linkIndex,
  individual,
  status,
  type,
  isShowTooltip,
  columns,
  rows,
  size,
  color,
  rowsCount,
  setRowsCount,
  borderRadius,
  boxShadow,
  inner,
  height,
  maxHeight,
  hideTitle,
  alignSize,
  margin,
  highlight,
  odd,
  curPage,
  setCurPage,
  totalElements,
  isRowSelectable,
  isSingleRowSelected,
  isDisabledSingleRow,
  selectedRows,
  setSelectedRows,
  theadBgColor,
  theadColor,
  tablePadding,
  rowsPerPageOptions,
  onRowClick,
  linkExpand,
  ...rest
}) {
  const [dataTable, setDataTable] = useState([]);

  const navigate = useNavigate();
  const { light } = colors;
  const { fontWeightBold } = typography;
  const { borderWidth } = borders;

  // --------Handle sort-----------
  const [sort, setSort] = useState({
    orderBy: "",
    order: "none",
  });

  const renderSortButton = (column) => {
    if (column === sort.orderBy) {
      switch (sort.order) {
        case "asc": {
          return <KeyboardArrowUpOutlined style={{ color: "var(--red-300)" }} />;
        }
        case "desc": {
          return <KeyboardArrowDownOutlined style={{ color: "var(--red-300)" }} />;
        }
        default:
          return <UnfoldMoreOutlined style={{ color: "var(--red-300)" }} />;
      }
    }
    return <UnfoldMoreOutlined style={{ color: "var(--red-300)" }} />;
  };

  const comparator = (a, b) => {
    const newOrder = sort.order === "desc" ? -1 : 1;
    if (a instanceof Date && b instanceof Date) {
      // compare dates
      return (a - b) * newOrder;
    }
    if (typeof a === "string" && typeof b === "string") {
      return a.localeCompare(b) * newOrder;
    }
    return (a < b ? -1 : a > b ? 1 : 0) * newOrder;
  };

  function isDateString(dateString) {
    // const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    // return dateRegex.test(dateString);
    const case1 = moment(dateString, "DD/MM/YYYY", true).isValid();
    const case2 = moment(dateString, "DD/MM/YYYY HH:mm A", true).isValid();
    return case1 || case2;
  }

  function dynamicSort(property) {
    return (a, b) => {
      let sortValueA = a[property];
      let sortValueB = b[property];
      // sort date
      if (isDateString(sortValueA)) {
        sortValueA = moment(sortValueA, "DD/MM/YYYY HH:mm A").toDate();
        sortValueB = moment(sortValueB, "DD/MM/YYYY HH:mm A").toDate();
      }
      // sort string
      if (typeof sortValueA === "string" && typeof sortValueB === "string") {
        sortValueA =
          typeof a === "string" ? a.toLocaleLowerCase() : a[property]?.toLocaleLowerCase();
        sortValueB =
          typeof b === "string" ? b.toLocaleLowerCase() : b[property]?.toLocaleLowerCase();
      }

      if (typeof sortValueA === "object" && typeof sortValueB === "object") {
        if (typeof sortValueA.getMonth === "function") {
          sortValueA = new Date(sortValueA?.props?.value || sortValueA);
          sortValueB = new Date(sortValueB?.props?.value || sortValueB);
        } else {
          sortValueA =
            typeof sortValueA?.props?.value === "string"
              ? sortValueA?.props?.value?.toLocaleLowerCase()
              : sortValueA?.props?.value;
          sortValueB =
            typeof sortValueB?.props?.value === "string"
              ? sortValueB?.props?.value?.toLocaleLowerCase()
              : sortValueB?.props?.value;
        }
      }

      return comparator(sortValueA, sortValueB);
    };
  }

  const handleSortClick = (fieldName) => () => {
    let newOrder = "asc";
    if (sort.orderBy === fieldName) {
      switch (sort.order) {
        case "asc":
          newOrder = "desc";
          break;
        case "desc":
          newOrder = "none";
          break;
        default:
          newOrder = "asc";
      }
    }
    setSort({
      order: newOrder,
      orderBy: fieldName,
    });
  };

  useEffect(() => {
    const tmpDataTable = [...rows];
    if (sort.order !== "none") {
      tmpDataTable.sort(dynamicSort(sort.orderBy));
    }
    setDataTable(tmpDataTable);
  }, [sort.order, sort.orderBy, rows]);

  // --------End handle sort-----------

  // --------Handle select -----------

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const isSelected = (row) =>
    selectedRows.map((item) => Object.values(item)[0]).indexOf(Object.values(row)[0]) !== -1;
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = dataTable.map((row) => row).filter((item) => !isDisabledSingleRow(item));
      setSelectedRows(newSelected);
      setIsSelectedAll(true);
      return;
    }
    setIsSelectedAll(false);
    setSelectedRows([]);
  };

  const handleClick = (event, row) => {
    const selectedIndex = selectedRows
      .map((item) => Object.values(item)[0])
      .indexOf(Object.values(row)[0]);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }
    if (!isDisabledSingleRow(row) && isSingleRowSelected) {
      //lấy lựa chọn cuối cùng
      setSelectedRows(newSelected.length > 0 ? [newSelected[newSelected.length - 1]] : []);
    } else if (!isDisabledSingleRow(row) && !isSingleRowSelected) setSelectedRows(newSelected);
  };

  useEffect(() => {
    if (isRowSelectable) setSelectedRows([]);
  }, [curPage]);

  // --------End handle select -----------

  const renderColumns = (
    <>
      {isRowSelectable && !isSingleRowSelected ? (
        <TableCell padding="checkbox" sx={{ background: "#FFF0EE" }}>
          <Checkbox
            color="primary"
            sx={{ borderColor: "#B5B5C3" }}
            checked={dataTable?.length > 0 && isSelectedAll}
            onClick={(e) => handleSelectAllClick(e)}
          />
        </TableCell>
      ) : isSingleRowSelected ? (
        <TableCell padding="checkbox" sx={{ background: "#FFF0EE" }}></TableCell>
      ) : null}
      {columns.map(
        ({ name, alignHeader, sortable = false, isHidden = false }) =>
          !isHidden && (
            <SuiBox
              display={hideTitle ? "none" : "table-cell"}
              key={name}
              component="th"
              py="18px"
              px={2}
              textAlign={alignHeader ?? "left"}
              fontSize={13}
              lineHeight="18px"
              textTransform="uppercase"
              fontWeight={fontWeightBold}
              color={theadColor}
              whiteSpace="nowrap"
              bgColor={theadBgColor}
              onClick={sortable ? handleSortClick(name) : () => {}}
              sx={{
                cursor: "pointer",
                letterSpacing: "0.05rem",
              }}
            >
              <Grid
                container
                gap={1}
                alignItems="center"
                flexWrap="nowrap"
                justifyContent={alignHeader ?? "center"}
              >
                {name}
                {sortable ? (
                  <IconButton size="small" sx={{ padding: 0 }}>
                    {renderSortButton(name)}
                  </IconButton>
                ) : null}
              </Grid>
            </SuiBox>
          )
      )}
    </>
  );

  function addExpandLink(row) {
    let urlExpand = "";
    linkExpand.forEach(
      // eslint-disable-next-line no-return-assign
      (item, index) =>
        (urlExpand += index === 0 ? `?${item}=${row[item]}` : `&${item}=${row[item]}`)
    );
    return urlExpand;
  }

  const renderRows = dataTable.map((row, key) => {
    const rowKey = `row-${key}`;
    let isItemSelected = false;
    if (isRowSelectable) {
      isItemSelected = isSelected(row);
    }
    const tableRow = (
      <>
        {isRowSelectable ? (
          <TableCell
            padding="checkbox"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e, row);
            }}
            sx={{ border: "none" }}
          >
            <Checkbox
              color="primary"
              key={key}
              checked={isItemSelected}
              disabled={isDisabledSingleRow(row)}
            />
          </TableCell>
        ) : null}
        {columns.map(({ name, align = "center", isHidden }, index) => {
          let template;
          if (isHidden) return template;
          if (typeof name !== "string") {
            template = (
              <SuiBox
                key={index}
                component="td"
                py={0.4}
                px={2}
                textAlign={align}
                onClick={() => (onRowClick ? onRowClick(row) : {})}
                borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${light.main}` : null}
                sx={{
                  minWidth: hideTitle && index === 0 ? alignSize : "auto",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  wordBreak: "break-all",
                }}
                width="max-content"
              >
                <SuiTypography
                  variant="button"
                  fontWeight="regular"
                  color={color}
                  fontSize={size}
                  sx={{ display: "inline-block", width: "max-content" }}
                >
                  {row[name.key]}
                </SuiTypography>
              </SuiBox>
            );
          } else {
            let tooltip = "";
            if (typeof row[name] !== "string" && row[name]?.props?.tooltip)
              tooltip = row[name]?.props?.tooltip;
            const ishiddentooltip = row[name]?.props?.ishiddentooltip;
            template = (
              <SuiBox
                key={index}
                onClick={() => (onRowClick ? onRowClick(row) : {})}
                component="td"
                py={0.4}
                px={2}
                textAlign={align}
                borderBottom={row.hasBorder ? `${borderWidth[1]} solid ${light.main}` : null}
                sx={{
                  minWidth: hideTitle && index === 0 ? alignSize : "auto",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  wordBreak: "break-all",
                }}
                // height="1vw"
                width="max-content"
              >
                <SuiTypography
                  title={ishiddentooltip ? null : tooltip || row[name]}
                  variant="button"
                  fontWeight="regular"
                  color="black"
                  fontSize={size}
                  textTransform="none"
                  sx={{
                    display: "inline-block",
                    width: "max-content",
                    maxWidth: "320px",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {row[name]}
                </SuiTypography>
              </SuiBox>
            );
          }

          return template;
        })}
      </>
    );

    return (
      <TableRow
        onClick={(e) => {
          if (link && e.target.tagName !== "INPUT") {
            const urlExpand = addExpandLink(row);
            if (row[linkIndex][0] === "#") {
              navigate(
                `${link}/%23${row[linkIndex]
                  .substring(1)
                  .toString()
                  .replace("/", "%2F")}${urlExpand}`,
                {
                  state: {
                    isIndividual: row[individual],
                    status: row[status],
                    type: row[type],
                  },
                }
              );
            } else {
              navigate(`${link}/${row[linkIndex].toString().replace("/", "%2F")}${urlExpand}`, {
                state: {
                  isIndividual: row[individual],
                  status: row[status],
                  type: row[type],
                },
              });
            }
          }
        }}
        key={rowKey}
        sx={{
          borderTop: "1.2px solid #e9ecef",
          borderBottom: "1.2px solid #e9ecef",
          backgroundColor: "#F3F6F9",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
          ":nth-of-type(odd)": {
            backgroundColor: "#fff",
          },
          "&:last-child": {
            border: "none",
          },

          "& span": {
            fontWeight: row.unRead ? "700 !important" : "",
            color: "black !important",
          },
        }}
      >
        {tableRow}
      </TableRow>
    );
  });

  const renderEmptyRows = dataTable?.length === 0 && (
    <SuiBox
      component="tr"
      py={0.4}
      px={2}
      sx={{
        minWidth: "auto",
        paddingTop: "10px",
        paddingBottom: "10px",
        wordBreak: "break-all",
      }}
      width="max-content"
    >
      <td colSpan={columns?.length} style={{ display: "table-cell", textAlign: "center" }}>
        <SuiTypography
          variant="button"
          fontWeight="regular"
          color="hsl(0, 0%, 50%)"
          fontSize={size}
          textTransform="none"
          sx={{
            display: "inline-block",
            width: "max-content",
            maxWidth: "320px",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            fontStyle: "italic",
          }}
        >
          Không có dữ liệu hiển thị
        </SuiTypography>
      </td>
    </SuiBox>
  );

  return react.useMemo(
    () => (
      <>
        <TableContainer
          style={{
            padding: tablePadding ? "15px" : 0,
            boxShadow: boxShadow || "0px 4px 20px rgba(94, 98, 120, 0.04)",
            borderRadius: borderRadius || "8px",
            overflowX: "auto",
          }}
          {...rest}
        >
          <MuiTable>
            <SuiBox component="thead" sx={{ backgroundColor: "#E1E3E9", zIndex: 2 }}>
              <TableRow>{renderColumns}</TableRow>
            </SuiBox>

            <TableBody
              sx={{
                cursor: linkIndex ? "pointer" : "default",
                height,
              }}
            >
              {renderRows}
              {renderEmptyRows}
            </TableBody>
          </MuiTable>
        </TableContainer>
        {isPagination ? (
          <TablePaginationCustom
            totalElements={totalElements}
            page={curPage}
            setPage={setCurPage}
            rowsPerPage={rowsCount}
            setRowsPerPage={setRowsCount}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        ) : null}
      </>
    ),
    [columns, dataTable, curPage, rowsCount, sort.order, sort.orderBy, selectedRows, totalElements]
  );
}

Table.defaultProps = {
  title: "",
  header: "",
  headerLabel: "",
  badgeData: null,
  link: "",
  linkIndex: "",
  individual: "",
  status: "",
  type: "",
  isShowTooltip: false,
  badgeColor: "info",
  columns: [],
  rows: [{}],
  isPagination: true,
  borderRadius: "1rem",
  boxShadow: "",
  inner: true,
  height: "100%",
  maxHeight: "100%",
  hideTitle: false,
  margin: "none",
  highlight: false,
  alignSize: "400px",
  odd: false,
  curPage: 0,
  setCurPage: () => {},
  totalElements: 0,
  isRowSelectable: false,
  isDisabledSingleRow: () => {},
  selectedRows: [],
  linkExpand: [],
  setSelectedRows: () => {},
  theadBgColor: "#FFF0EE",
  theadColor: "#73777A",
  tablePadding: true,
  size: "13px",
};

Table.propTypes = {
  title: PropTypes.string,
  badgeColor: PropTypes.string,
  badgeData: PropTypes.number,
  header: PropTypes.string,
  link: PropTypes.string,
  linkIndex: PropTypes.string,
  individual: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
  isShowTooltip: PropTypes.bool,
  headerLabel: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  rows: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  //   isDisabledSingleRow: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  isDisabledSingleRow: PropTypes.func,
  isPagination: PropTypes.bool,
  borderRadius: PropTypes.string,
  boxShadow: PropTypes.string,
  inner: PropTypes.bool,
  height: PropTypes.string,
  maxHeight: PropTypes.string,
  hideTitle: PropTypes.bool,
  marginBottom: PropTypes.string,
  highlight: PropTypes.bool,
  alignSize: PropTypes.string,
  odd: PropTypes.bool,
  curPage: PropTypes.number,
  setCurPage: PropTypes.func,
  totalElements: PropTypes.number,
  isRowSelectable: PropTypes.bool,
  setSelectedRows: PropTypes.func,
  theadBgColor: PropTypes.string,
  theadColor: PropTypes.string,
  tablePadding: PropTypes.bool,
  linkExpand: PropTypes.arrayOf(PropTypes.string),
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  size: PropTypes.string,
};

export default Table;
