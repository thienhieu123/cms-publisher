import { BottomNavigation, BottomNavigationAction, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import DateRangePicker from "~/components/DateRangePicker";
import SelectBox from "~/components/SelectBox";
import ButtonFilter from "~/components/ButtonFilter";
import useErrorMessage from "~/hooks/useErrorMessage";
import SearchInput from "~/components/SearchInput";
import WhitePlusIcon from "~/assets/images/icons/white-plus.svg";
import ButtonControl from "~/components/ButtonControl";
import {
  checkIsDataCollector,
  formatDate,
  getStartDateDefault,
  handleResponse,
  renderStatusTag,
} from "~/utils/utils";
import Table from "~/examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import { DeleteIconButton, EditIconButton, ViewDetailIconButton } from "~/components/Button";
import SuiTypography from "~/components/SuiTypography";
import { requestStatusTable } from "~/constants/config";
import { deleteReport, getStatisticReportList } from "~/api/common";
import moment from "moment";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { useSoftUIController } from "~/context";
import { setLoading } from "~/context/common/action";
import PermissionWrapped from "~/components/PermissionWrapped";

const initialValues = {
  searchText: "",
  fromDate: getStartDateDefault(),
  toDate: new Date(),
  statsIndexId: "",
  groupId: "",
  status: "",
  size: 20,
  page: 0,
};
const columns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên báo cáo",
    sortable: true,
    align: "center",
  },
  {
    name: "Loại chỉ tiêu",
    sortable: true,
    align: "center",
  },
  {
    name: "Chỉ tiêu",
    sortable: true,
    align: "center",
  },
  {
    name: "Ngày tạo",
    sortable: true,
    align: "center",
  },
  {
    name: "Trạng thái phê duyệt",
    sortable: true,
    align: "center",
  },
  {
    name: "",
  },
];
export default function UpdateReportList() {
  const navigate = useNavigate();
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [optionFilter, setOptionFilter] = useState(0);
  const isDataCollector = checkIsDataCollector();
  const [tableData, setTableData] = useState([]);
  const [isDeletePopup, setIsDeletePopup] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const { setErrorMessage } = useErrorMessage();
  const { setSuccessMessage } = useSuccessMessage();
  const [, dispatch] = useSoftUIController();

  const sortValue = useMemo(() => {
    switch (optionFilter) {
      case 1:
        return "createdAt:asc";
      case 2:
        return "createdAt:desc";
      case 3:
        return "name:asc";
      case 4:
        return "name:desc";
      default:
        return "";
    }
  }, [optionFilter]);

  const fetchData = () => {
    setLoading(dispatch, true);
    const { page, size, searchText, statsIndexId, fromDate, toDate, groupId, status } = queryFilter;
    getStatisticReportList({
      searchText: searchText,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      statsIndexId: statsIndexId,
      groupId: groupId,
      page: page + 1,
      size: size,
      isList: false,
      status: status,
      sort: sortValue,
    })
      .then((response) => {
        const [status, dataResponse] = handleResponse(response);
        if (status) {
          const table = dataResponse?.map((item, idx) => ({
            STT: page * size + idx + 1,
            "Tên báo cáo": item?.name,
            "Loại chỉ tiêu": item?.statsIndex?.group?.name,
            "Chỉ tiêu": item?.statsIndex?.name,
            "Ngày tạo": formatDate(item?.createdAt),
            "Trạng thái phê duyệt": renderStatusTag(item?.isDraft ? "DRAFT" : item?.status),
            "": renderGroupBtn(item?.isDraft ? "DRAFT" : item?.status, item?.id),
          }));
          setTableData(table);
          setTotalElements(response?.message?.data?.data?.rowCount);
        } else {
          setErrorMessage(dataResponse);
          setTableData([]);
          setTotalElements(0);
        }
      })
      .finally(() => setLoading(dispatch, false));
  };

  useEffect(() => {
    fetchData();
    return () => {
      setTableData([]);
      setTotalElements(0);
    };
  }, [queryFilter.page, queryFilter.size, sortValue]);

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  const handleClearFilter = () => {
    setQueryFilter(initialValues);
  };

  const handleAddRequest = () => {
    navigate("/statistic-report/add-report");
  };

  const handleRemove = () => {
    if (deleteReportId)
      deleteReport(deleteReportId).then((response) => {
        const [status, dataResponse] = handleResponse(response);
        if (status) {
          setSuccessMessage("Báo cáo được xóa thành công");
          setIsDeletePopup(false);
          fetchData();
        } else setErrorMessage(dataResponse);
      });
  };

  const deleteConfirmPopup = () => {
    return (
      <ConfirmPopup
        open={isDeletePopup}
        setOpen={setIsDeletePopup}
        NotiText="Báo cáo sẽ bị xóa khỏi hệ thống "
        questionText="Bạn có đồng ý xóa báo cáo này?"
        handleSubmit={handleRemove}
      />
    );
  };

  const renderGroupBtn = (status, id, type) => {
    return (
      <Grid container ishiddentooltip="true">
        <SuiTypography component="span" sx={{ display: "flex", width: "200" }}>
          <PermissionWrapped
            listCodeComponent={[
              "STATISTICAL_REPORT",
              "UPDATE_REPORT_TAB",
              "STATISTICAL_REPORT_DETAIL",
            ]}
          >
            <ViewDetailIconButton
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/statistic-report/detail/${id}`);
              }}
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "STATISTICAL_REPORT",
              "UPDATE_REPORT_TAB",
              "STATISTICAL_REPORT_EDIT",
            ]}
          >
            <EditIconButton
              onClick={() => {
                navigate(`/statistic-report/edit/${id}`);
              }}
              hidden={status !== "DRAFT"}
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "STATISTICAL_REPORT",
              "UPDATE_REPORT_TAB",
              "STATISTICAL_REPORT_REMOVE",
            ]}
          >
            <DeleteIconButton
              onClick={() => {
                setDeleteReportId(id);
                setIsDeletePopup(true);
              }}
              hidden={status !== "DRAFT" && status !== "CANCELED"}
            />
          </PermissionWrapped>
        </SuiTypography>
      </Grid>
    );
  };

  useEnterKeyEvent([], fetchData);

  return (
    <Grid container spacing={2}>
      {deleteConfirmPopup()}
      <Grid item xs={12} sm={8} lg={5} display="flex" alignItems="center" gap={2}>
        <SearchInput
          isOpenFilter={isOpenFilter}
          setIsOpenFilter={setIsOpenFilter}
          placeholder="Nhập tên báo cáo"
          onChange={(e) => handleChange("searchText", e.target.value)}
          searchText={queryFilter.searchText}
          submit={fetchData}
        />
      </Grid>
      <PermissionWrapped
        listCodeComponent={["STATISTICAL_REPORT", "UPDATE_REPORT_TAB", "STATISTICAL_REPORT_ADD"]}
      >
        <Grid item xs={12} sm={4} lg={7} justifyContent="end" alignItems="center">
          <ButtonControl
            hiddenCancel
            submitText="Thêm mới"
            imageSubmit={WhitePlusIcon}
            handleSubmit={handleAddRequest}
          />
        </Grid>
      </PermissionWrapped>

      {isOpenFilter && (
        <Grid container item xs={12} spacing={1} columnSpacing={4}>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <SelectBox
              label="Nhóm chỉ tiêu"
              dataSource="/stats-index-groups/list"
              mapping={{ value: "id", label: "name" }}
              placeholder="Tất cả"
              value={queryFilter.groupId}
              onChange={(e) => handleChange("groupId", e.value)}
              required={false}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <SelectBox
              label="Chỉ tiêu"
              dataSource={`/stats-indices${
                queryFilter.groupId ? "?groupId=" + queryFilter.groupId : ""
              }`}
              mapping={{ value: "id", label: "name" }}
              dependency={[queryFilter.groupId]}
              placeholder="Tất cả"
              value={queryFilter.statsIndexId}
              onChange={(e) => handleChange("statsIndexId", e.value)}
              required={false}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <SelectBox
              label="Trạng thái"
              options={requestStatusTable}
              placeholder="Tất cả"
              value={queryFilter.status}
              onChange={(e) => handleChange("status", e.value)}
              required={false}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <DateRangePicker
              value={[queryFilter.fromDate, queryFilter.toDate]}
              setDateRange={(e) => {
                setQueryFilter({ ...queryFilter, fromDate: e[0], toDate: e[1] });
              }}
              placeholder="Từ ngày - Đến ngày"
              label="Ngày tạo"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4} display="flex" justifyContent="left">
            <ButtonFilter onClear={handleClearFilter} onSearch={fetchData} />
          </Grid>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          paddingTop: isOpenFilter && "0 !important",
        }}
      >
        <BottomNavigation
          showLabels
          value={optionFilter}
          onChange={(event, newValue) => {
            setOptionFilter(newValue);
          }}
          sx={{
            display: "flex",
            justifyContent: "start",
            background: "transparent",
            "& .MuiBottomNavigationAction-root": {
              alignItems: "flex-start",
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "14px",
              fontWeight: 700,
            },
          }}
        >
          <BottomNavigationAction label="Nổi bật" />
          <BottomNavigationAction label="Mới nhất" />
          <BottomNavigationAction label="Cũ nhất" />
          <BottomNavigationAction label="A-Z" />
          <BottomNavigationAction label="Z-A" />
        </BottomNavigation>
      </Grid>
      <PermissionWrapped
        listCodeComponent={[
          "STATISTICAL_REPORT",
          "UPDATE_REPORT_TAB",
          "UPDATE_REPORT_TAB_DATA_TABLE",
        ]}
      >
        <Grid item xs={12}>
          <Table
            size="13px"
            columns={columns}
            borderRadius="1rem 1rem 0 0"
            rows={tableData}
            rowsCount={queryFilter.size}
            curPage={queryFilter.page}
            setRowsCount={(rowCount) =>
              setQueryFilter({
                ...queryFilter,
                size: rowCount,
                page: 0,
              })
            }
            setCurPage={(nextPage) =>
              setQueryFilter({
                ...queryFilter,
                page: nextPage,
              })
            }
            totalElements={totalElements}
          />
        </Grid>
      </PermissionWrapped>
    </Grid>
  );
}
