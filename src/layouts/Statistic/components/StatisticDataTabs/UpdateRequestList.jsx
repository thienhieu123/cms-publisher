import { Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import SearchInput from "~/components/SearchInput";
import WhitePlusIcon from "~/assets/images/icons/white-plus.svg";
import WhiteNotePlusIcon from "~/assets/images/icons/white-note-plus.svg";
import SuiTypography from "~/components/SuiTypography";
import DateRangePicker from "~/components/DateRangePicker";
import SelectBox from "~/components/SelectBox";
import ButtonFilter from "~/components/ButtonFilter";
import Table from "~/examples/Tables/Table";
import {
  formatDate,
  getStartDateDefault,
  handleDownload,
  handleResponse,
  renderStatusTag,
} from "~/utils/utils";
import { DeleteIconButton, ViewDetailIconButton } from "~/components/Button";
import PopupRoot from "~/components/Popup/PopupRoot";
import RequestFromFolderPopup from "./components/RequestFromFolderPopup";
import RequestPopup from "./components/RequestPopup";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import { deleteUpdateRequest, getUpdateRequestList } from "~/api/common";
import useErrorMessage from "~/hooks/useErrorMessage";
import moment from "moment";
import { requestStatusTable, requestTypeTable } from "~/constants/config";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { setLoading } from "~/context/common/action";
import { useSoftUIController } from "~/context";
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

export default function UpdateRequestList() {
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [isAddFromFolder, setIsAddFromFolder] = useState(false);
  const [isEditFromFolder, setIsEditFromFolder] = useState(false);
  const [isNewRequest, setIsNewRequest] = useState(false);
  const [isEditRequest, setIsEditRequest] = useState(false);
  const [isRemoveRequest, setIsRemoveRequest] = useState(false);
  const { setErrorMessage } = useErrorMessage();
  const { setSuccessMessage } = useSuccessMessage();

  const [statusDetail, setStatusDetail] = useState("");
  const [requestId, setRequestId] = useState("");
  const [data, setData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [, dispatch] = useSoftUIController();

  const fetchData = () => {
    setLoading(dispatch, true);
    const { page, size, fromDate, toDate, status, searchText, type } = queryFilter;
    getUpdateRequestList({
      page: page + 1,
      size,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      status,
      searchText,
      type,
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

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
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
            hidden={status !== "CANCELED" && status !== "DRAFT"}
          />
        </SuiTypography>
      </Grid>
    );
  };

  const tableData = useMemo(() => {
    if (data?.length) {
      const table = data?.map((item, index) => ({
        STT: queryFilter.page * queryFilter.size + index + 1,
        "Tên yêu cầu": item?.name,
        "Loại yêu cầu": item.type === "MANUAL" ? "Thêm mới trực tiếp" : "Thêm mới từ tệp",
        "Ngày tạo": formatDate(item.createdAt),
        "Trạng thái": renderStatusTag(item.status),
        "": renderGroupBtn(item.status, item.id, item.type),
      }));
      return table;
    }
    return [];
  }, [data]);

  const deleteRequest = (requestId) => {
    if (requestId) {
      deleteUpdateRequest(requestId).then((result) => {
        const [status, dataResponse] = handleResponse(result);
        if (status) {
          setSuccessMessage("Đã xóa thành công");
          fetchData();
          setIsRemoveRequest(false);
        } else setErrorMessage(dataResponse);
      });
    }
  };

  const addFromFolderPopup = () => {
    return (
      <PopupRoot
        title="Thêm mới yêu cầu từ tệp"
        open={isAddFromFolder}
        setOpen={setIsAddFromFolder}
      >
        <RequestFromFolderPopup
          status=""
          handleCancel={() => setIsAddFromFolder(false)}
          handleSubmit={() => {
            setIsAddFromFolder(false);
            fetchData();
          }}
        />
      </PopupRoot>
    );
  };

  const editFromFolderPopup = () => {
    return (
      <PopupRoot
        title="Thông tin yêu cầu từ tệp"
        open={isEditFromFolder}
        setOpen={setIsEditFromFolder}
      >
        <RequestFromFolderPopup
          status={statusDetail}
          requestId={requestId}
          handleCancel={() => setIsEditFromFolder(false)}
          handleSubmit={() => {
            setIsEditFromFolder(false);
            fetchData();
          }}
        />
      </PopupRoot>
    );
  };

  const newRequestPopup = () => {
    return (
      <PopupRoot title="Thêm mới yêu cầu" open={isNewRequest} setOpen={setIsNewRequest}>
        <RequestPopup
          status=""
          handleCancel={() => setIsNewRequest(false)}
          handleSubmit={() => {
            setIsNewRequest(false);
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
        handleSubmit={() => deleteRequest(requestId)}
      />
    );
  };

  useEnterKeyEvent([], fetchData);

  return (
    <Grid container>
      {addFromFolderPopup()}
      {editFromFolderPopup()}
      {newRequestPopup()}
      {viewRequestPopup()}
      {removeRequestPopup()}
      <Grid item xs={12} sm={12} lg={12} xl={12} display="flex">
        <Grid item xs={12} sm={12} xl={5} lg={5}>
          <SearchInput
            isOpenFilter={isOpenFilter}
            setIsOpenFilter={setIsOpenFilter}
            placeholder="Nhập tên yêu cầu"
            onChange={(e) => handleChange("searchText", e.target.value)}
            searchText={queryFilter?.searchText}
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
          gap={2}
        >
          <PermissionWrapped
            listCodeComponent={[
              "STATISTICAL_VALUE",
              "UPDATE_DATA_TAB",
              "UPDATE_DATA_TAB_DOWNLOAD_PATTERN",
            ]}
          >
            <Grid
              onClick={() =>
                handleDownload(
                  "https://kinhteso.gpmn.net:9201/api/v1/file-storage/serve-default?fileName=templates%2Fimport_stats_values.xlsx",
                  "import_stats_values.xlsx"
                )
              }
            >
              <SuiTypography
                fontSize={14}
                color="#2E669D"
                whiteSpace="nowrap"
                sx={{ cursor: "pointer" }}
              >
                Tải tệp mẫu thêm mới
              </SuiTypography>
            </Grid>
          </PermissionWrapped>

          <PermissionWrapped
            listCodeComponent={[
              "STATISTICAL_VALUE",
              "UPDATE_DATA_TAB",
              "UPDATE_DATA_TAB_IMPORT_FILE",
            ]}
          >
            <Grid width="auto">
              <ButtonControl
                hiddenCancel
                submitText="Thêm mới từ tệp"
                imageSubmit={WhiteNotePlusIcon}
                handleSubmit={() => setIsAddFromFolder(true)}
              />
            </Grid>
          </PermissionWrapped>

          <PermissionWrapped
            listCodeComponent={[
              "STATISTICAL_VALUE",
              "UPDATE_DATA_TAB",
              "UPDATE_DATA_TAB_CREATE_BTN",
            ]}
          >
            <Grid width="auto">
              <ButtonControl
                hiddenCancel
                submitText="Thêm mới"
                imageSubmit={WhitePlusIcon}
                handleSubmit={() => setIsNewRequest(true)}
              />
            </Grid>
          </PermissionWrapped>
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
        listCodeComponent={["STATISTICAL_VALUE", "UPDATE_DATA_TAB", "UPDATE_DATA_TAB_DATA_TABLE"]}
      >
        <Grid item xs={12} mt={1}>
          <Table
            tablePadding
            size="13px"
            columns={columns}
            borderRadius="1rem 1rem 0 0"
            rows={tableData || dataSample}
            rowsCount={queryFilter.size}
            curPage={queryFilter.page}
            setRowsCount={(rowCount) =>
              setQueryFilter({
                ...queryFilter,
                size: rowCount,
                page: 1,
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
