import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import SearchInput from "~/components/SearchInput";
import SuiTypography from "~/components/SuiTypography";
import DateRangePicker from "~/components/DateRangePicker";
import SelectBox from "~/components/SelectBox";
import ButtonFilter from "~/components/ButtonFilter";
import Table from "~/examples/Tables/Table";
import { formatDate, getStartDateDefault, handleResponse, renderStatusTag } from "~/utils/utils";
import { DeleteIconButton, ViewDetailIconButton } from "~/components/Button";
import PopupRoot from "~/components/Popup/PopupRoot";
import RequestFromFolderPopup from "./components/RequestFromFolderPopup";
import RequestPopup from "./components/RequestPopup";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import useErrorMessage from "~/hooks/useErrorMessage";
import { getUpdateRequestList } from "~/api/common";
import moment from "moment";
import { requestStatusTable, requestTypeTable } from "~/constants/config";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { useSoftUIController } from "~/context";
import { setLoading } from "~/context/common/action";
import PermissionWrapped from "~/components/PermissionWrapped";

const initialValues = {
  page: 0,
  size: 20,
  sort: "createdDate,DESC",
  searchText: "",
  fromDate: getStartDateDefault(),
  toDate: new Date(),
  status: "",
  type: "",
};
const columns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên yêu cầu",
    sortable: true,
    align: "center",
  },
  {
    name: "Loại yêu cầu",
    sortable: true,
    align: "center",
  },
  {
    name: "Ngày tạo",
    sortable: true,
    align: "center",
  },
  {
    name: "Trạng thái",
    sortable: true,
    align: "center",
  },
  {
    name: "",
  },
];

export default function ApproveRequestList() {
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [isEditFromFolder, setIsEditFromFolder] = useState(false);
  const [isEditRequest, setIsEditRequest] = useState(false);
  const [isRemoveRequest, setIsRemoveRequest] = useState(false);
  const [statusDetail, setStatusDetail] = useState("");
  const [requestId, setRequestId] = useState("");
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const { setErrorMessage } = useErrorMessage();
  const [totalElements, setTotalElements] = useState(0);
  const [, dispatch] = useSoftUIController();

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  const fetchData = () => {
    setLoading(dispatch, true);
    const { page, size, fromDate, toDate, status, searchText, type } = queryFilter;
    getUpdateRequestList({
      page: page + 1,
      size: size,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      status: status,
      searchText: searchText,
      type: type,
    })
      .then((result) => {
        const [status, dataResponse] = handleResponse(result);
        if (status) {
          setData(dataResponse);
          setTotalElements(result?.message?.data?.data?.rowCount);
        } else {
          setErrorMessage(dataResponse);
          setData([]);
          setTotalElements(0);
        }
      })
      .finally(() => {
        setLoading(dispatch, false);
      });
  };

  useEffect(() => {
    fetchData();
    return () => {
      setData([]);
      setTotalElements(0);
    };
  }, [queryFilter.page, queryFilter.size]);

  const handleClearFilter = () => {
    setQueryFilter(initialValues);
  };

  const renderGroupBtn = (status, id, type) => {
    return (
      <Grid container ishiddentooltip="true">
        <SuiTypography component="span" sx={{ display: "flex", width: "200" }}>
          <ViewDetailIconButton
            onClick={(e) => {
              e.stopPropagation();
              setStatusDetail(status);
              setRequestId(id);
              type === "MANUAL" ? setIsEditRequest(true) : setIsEditFromFolder(true);
            }}
          />
          <DeleteIconButton
            onClick={() => {
              setRequestId(id);
              setIsRemoveRequest(true);
            }}
            hidden={status !== "CANCELLED"}
          />
        </SuiTypography>
      </Grid>
    );
  };

  useEffect(() => {
    const table = data?.map((item, idx) => ({
      STT: queryFilter.page * queryFilter.size + idx + 1,
      "Tên yêu cầu": item?.name,
      "Loại yêu cầu": item.type === "MANUAL" ? "Thêm mới trực tiếp" : "Thêm mới từ tệp",
      "Ngày tạo": formatDate(item.createdAt),
      "Trạng thái": renderStatusTag(item.status),
      "": renderGroupBtn(item.status, item.id, item.type),
    }));
    setTableData(table);
  }, [data]);

  const viewRequestFolderPopup = () => {
    return (
      <PopupRoot
        title="Thông tin yêu cầu từ tệp"
        open={isEditFromFolder}
        setOpen={setIsEditFromFolder}
      >
        <RequestFromFolderPopup
          feature="approve"
          requestId={requestId}
          status={statusDetail}
          handleCancel={() => setIsEditFromFolder(false)}
          handleSubmit={() => {
            setIsEditFromFolder(false);
            fetchData();
          }}
        />
      </PopupRoot>
    );
  };

  const viewRequestPopup = () => {
    return (
      <PopupRoot title="Thông tin yêu cầu" open={isEditRequest} setOpen={setIsEditRequest}>
        <RequestPopup
          feature="approve"
          status={statusDetail}
          requestId={requestId}
          handleCancel={() => setIsEditRequest(false)}
          handleSubmit={() => {
            setIsEditRequest(false);
            fetchData();
          }}
        />
      </PopupRoot>
    );
  };

  const removeRequestPopup = () => {
    return (
      <ConfirmPopup
        open={isRemoveRequest}
        setOpen={setIsRemoveRequest}
        questionText="Bạn có đồng ý xóa yêu cầu này ?"
        NotiText="Yêu cầu sẽ bị xóa khỏi hệ thống"
      />
    );
  };

  useEnterKeyEvent([], fetchData);

  return (
    <Grid container>
      {viewRequestFolderPopup()}
      {viewRequestPopup()}
      {removeRequestPopup()}
      <Grid item xs={12} sm={12} lg={12} xl={12} display="flex">
        <Grid item xs={12} sm={12} xl={5} lg={5}>
          <SearchInput
            isOpenFilter={isOpenFilter}
            setIsOpenFilter={setIsOpenFilter}
            placeholder="Nhập tên yêu cầu"
            searchText={queryFilter?.searchText}
            onChange={(e) => handleChange("searchText", e.target.value)}
            submit={fetchData}
          />
        </Grid>
      </Grid>
      {isOpenFilter && (
        <Grid container item xs={12} columnSpacing={4} spacing={1} pb={2} mt={1}>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <SelectBox
              label="Loại yêu cầu"
              options={requestTypeTable}
              placeholder="Tất cả"
              value={queryFilter.type}
              onChange={(e) => handleChange("type", e.value)}
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
            <ButtonFilter onClear={handleClearFilter} onSearch={fetchData} />
          </Grid>
        </Grid>
      )}
      <PermissionWrapped
        listCodeComponent={["STATISTICAL_VALUE", "APPROVE_DATA_TAB", "APPROVE_DATA_TAB_DATA_TABLE"]}
      >
        <Grid item xs={12}>
          <Table
            tablePadding
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
