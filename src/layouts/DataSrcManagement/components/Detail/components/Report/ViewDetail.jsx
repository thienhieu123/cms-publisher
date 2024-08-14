import { useEffect, useState } from "react";
import SuiBox from "~/components/SuiBox";
import Grid from "@mui/material/Grid";
import Table from "~/examples/Tables/Table";
import ExcelButton from "~/components/ExcelButton";
import PdfButton from "~/components/PdfButton";
import WordButton from "~/components/WordButton";
import DateRangePicker from "~/components/DateRangePicker";
import SelectBox from "~/components/SelectBox";
import ButtonFilter from "~/components/ButtonFilter";
import SelectDistrictBox from "~/components/SelectAreaGroup/SelectDistrictBox";
import { getStatisticDataReportDetail } from "~/api/common";
import useErrorMessage from "~/hooks/useErrorMessage";
import { getLocalUserInfo } from "~/utils/storage";
import SearchInput from "~/components/SearchInput";
import { IconButton, Tooltip } from "@mui/material";
import BlueEditIcon from "~/assets/images/icons/blue-pen-edit.svg";
import PopupRoot from "~/components/Popup/PopupRoot";
import AddNewData from "./AddNewData";
import { useParams } from "react-router-dom";
import { checkIsDataCollector, getStartDateDefault, handleResponse } from "~/utils/utils";
import moment from "moment";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";

const columns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã quận/huyện",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên quận/huyện",
    sortable: true,
    align: "center",
  },
  {
    name: "Ngày bắt đầu",
    sortable: true,
    align: "center",
  },
  {
    name: "Ngày kết thúc",
    sortable: true,
    align: "center",
  },
  {
    name: "Giá trị",
    sortable: true,
    align: "center",
  },
  {
    name: "Đơn vị",
    align: "center",
    sortable: true,
    // isHidden: true,
  },
  {
    name: "",
  },
];

const initialValues = {
  page: 0,
  size: 20,
  sort: "createdDate,DESC",
  searchText: "",
  startDate: getStartDateDefault(),
  endDate: new Date(),
  statsIndexId: "",
  groupId: "",
  district: "",
  rangeValue: "",
};
function ViewDetail() {
  const params = useParams();
  const indicesId = params?.id;
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const { setErrorMessage } = useErrorMessage();
  const [isAddData, setIsAddData] = useState(false);
  const [isEditData, setEditAddData] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  //   const isDataCollector = userInfo?.roles.includes("DATA_COLLECTOR");
  const fetchData = () => {
    getStatisticDataReportDetail(indicesId).then((response) => {
      const [status, dataResponse] = handleResponse(response);
      if (status && dataResponse) {
        const table = dataResponse?.map((item, idx) => ({
          STT: queryFilter.page * queryFilter.size + idx + 1,
          "Mã quận/huyện": item?.districtCode,
          "Tên quận/huyện": item?.districtName,
          "Ngày bắt đầu": moment(item?.startDate).format("DD/MM/YYYY"),
          "Ngày kết thúc": moment(item?.endDate).format("DD/MM/YYYY"),
          "Giá trị": item?.value,
          "Đơn vị": item?.measurementUnitName,
          "": checkIsDataCollector() && (
            <IconButton onClick={() => setEditAddData(true)}>
              <Tooltip title="Cập nhật số liệu" placement="top">
                <SuiBox component="img" src={BlueEditIcon} alt="BlueEditIcon" />
              </Tooltip>
            </IconButton>
          ),
        }));
        setTotalElements(response?.message?.data?.data?.rowCount || 0);
        setDataTable(table);
      } else {
        setErrorMessage(dataResponse);
        setDataTable([]);
        setTotalElements(0);
      }
    });
  };

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  const handleClearFilter = () => {
    setQueryFilter(initialValues);
  };

  useEffect(() => {
    fetchData();
    return () => {
      setDataTable([]);
      setTotalElements(0);
    };
  }, [queryFilter.page, queryFilter.size]);
  const popupAddNewData = () => {
    return (
      <PopupRoot title="Thêm mới số liệu" open={isAddData} setOpen={setIsAddData}>
        <Grid p={2}>
          <AddNewData handleCancel={() => setIsAddData(false)} />
        </Grid>
      </PopupRoot>
    );
  };

  const popupUpdateData = () => {
    return (
      <PopupRoot title="Cập nhật số liệu" open={isEditData} setOpen={setEditAddData}>
        <Grid p={2}>
          <AddNewData handleCancel={() => setEditAddData(false)} />
        </Grid>
      </PopupRoot>
    );
  };

  useEnterKeyEvent([], fetchData);

  return (
    <Grid sx={{ background: "transparent !important" }}>
      {popupAddNewData()}
      {popupUpdateData()}
      <Grid container item xs={12} spacing={1}>
        <Grid item xs={12} sm={12} xl={5} lg={5}>
          <SearchInput
            isOpenFilter={isOpenFilter}
            placeholder="Nhập mã, tên quận/huyện"
            searchText={queryFilter.searchText}
            setIsOpenFilter={setIsOpenFilter}
            onChange={(e) => handleChange("searchText", e.target.value)}
            submit={fetchData}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          xl={7}
          lg={7}
          display="flex"
          justifyContent="end"
          alignItems="center"
          gap={1}
        >
          <ExcelButton />
          <PdfButton />
          <WordButton />
        </Grid>
        {isOpenFilter && (
          <Grid container item xs={12} columnSpacing={4} spacing={1} pb={2} mt={1}>
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
              <SelectDistrictBox
                value={queryFilter.district}
                onChange={(e) => handleChange("district", e.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <DateRangePicker
                value={[queryFilter.startDate, queryFilter.endDate]}
                setDateRange={(e) => {
                  setQueryFilter({ ...queryFilter, startDate: e[0], endDate: e[1] });
                }}
                placeholder="Từ ngày - Đến ngày"
                label="Giai đoạn"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <SelectBox
                label="Mức giá trị"
                options={[]}
                placeholder="Tất cả"
                value={queryFilter.rangeValue}
                onChange={(e) => handleChange("rangeValue", e.value)}
                required={false}
                width="100%"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <ButtonFilter onClear={handleClearFilter} onSearch={fetchData} />
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Table
          tablePadding
          size="13px"
          columns={columns}
          borderRadius="1rem 1rem 0 0"
          rows={dataTable}
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
    </Grid>
  );
}

export default ViewDetail;
