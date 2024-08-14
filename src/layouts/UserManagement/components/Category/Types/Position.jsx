import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import ButtonFilter from "~/components/ButtonFilter";
import SearchInput from "~/components/SearchInput";
import SelectBox from "~/components/SelectBox";
import SuiBox from "~/components/SuiBox";
import Table from "~/examples/Tables/Table";
import WhitePlusIcon from "~/assets/images/icons/white-plus.svg";
import { categoryStatusTable, managementCategoryStatus } from "~/constants/config";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import {
  addSubPosition,
  getSubListPosition,
  getUnitTree,
  removeSubPosition,
  updateSubPostion,
} from "~/api/common";
import PopupRoot from "~/components/Popup/PopupRoot";
import Input from "~/components/Input";
import { formatUnitTree, handleResponse, renderStatusTag } from "~/utils/utils";
import SuiTypography from "~/components/SuiTypography";
import { isRequired } from "~/utils/verify";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import TreeSelect from "~/components/TreeSelect";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { DeleteIconButton, EditIconButton, LocknUnLockIconButton } from "~/components/Button";
import { setLoading } from "~/context/common/action";
import { useSoftUIController } from "~/context";
import PermissionWrapped from "~/components/PermissionWrapped";

const positionColumns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã chức vụ",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên chức vụ",
    sortable: true,
    align: "center",
  },
  {
    name: "Cơ quan chuyên trách",
    sortable: true,
    align: "center",
  },
  {
    name: "Trạng thái",
    sortable: true,
    align: "center",
  },
  {
    name: "Hành động",
    sortable: false,
    align: "center",
  },
];

const initialValues = {
  page: 0,
  size: 20,
  total: 0,
  searchText: "",
  department: "",
  status: "",
};

const addPositionData = {
  positionCode: "",
  positionName: "",
  status: "ACTIVATED",
  department: "",
};

export default function Position() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [listSubPosition, setListSubPosition] = useState([]);
  const [isAddPopup, setIsAddPopup] = useState(false);
  const [isLockPopup, setIsLockPopup] = useState(false);
  const [isUnlockPopup, setIsUnlockPopup] = useState(false);
  const [isRemovePopup, setIsRemovePopup] = useState(false);
  const [addParams, setAddParams] = useState(addPositionData);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [unitTree, setUnitTree] = useState([]);
  const [, dispatch] = useSoftUIController();

  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();

  const renderGroupBtn = (position) => {
    return (
      <Grid container ishiddentooltip="true" onClick={() => setSelectedPosition(position)}>
        <SuiTypography
          component="span"
          sx={{ display: "flex", width: "140px", justifyContent: "center" }}
        >
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_EDIT_POSITION",
            ]}
          >
            <EditIconButton
              onClick={() => {
                setAddParams({
                  positionCode: position.positionCode,
                  positionName: position.positionName,
                  status: position.status,
                  department: position.unit?.id,
                });
                setIsAddPopup(true);
              }}
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_LOCK_POSITION",
            ]}
          >
            <LocknUnLockIconButton
              handleClick={(status) => {
                if (status === "ACTIVATED") setIsLockPopup(true);
                else setIsUnlockPopup(true);
              }}
              status={position.status}
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_DELETE_POSITION",
            ]}
          >
            <DeleteIconButton onClick={() => setIsRemovePopup(true)} />
          </PermissionWrapped>
        </SuiTypography>
      </Grid>
    );
  };

  const formatData = (data) => {
    return data?.map((item, index) => {
      return {
        STT: queryFilter.page * queryFilter.size + index + 1,
        "Mã chức vụ": item.positionCode,
        "Tên chức vụ": item.positionName,
        "Cơ quan chuyên trách": item.unit?.name,
        "Trạng thái": renderStatusTag(item.status, managementCategoryStatus),
        "Hành động": renderGroupBtn(item),
      };
    });
  };

  const fetchData = () => {
    setLoading(dispatch, true);
    getSubListPosition({
      page: queryFilter.page + 1,
      size: queryFilter.size,
      searchText: queryFilter.searchText,
      status: queryFilter.status,
      department: queryFilter.department,
    })
      .then((res) => {
        const [status, dataResponse] = handleResponse(res);
        if (status) {
          setListSubPosition(formatData(dataResponse));
          setQueryFilter({ ...queryFilter, total: res.message.data.data.rowCount });
        } else setErrorMessage(dataResponse);
      })
      .finally(() => setLoading(dispatch, false));
  };

  const getUnitTreeList = () => {
    getUnitTree("ACTIVATED").then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        const listUnit = formatUnitTree(res.message.data.data.children);
        setUnitTree(listUnit);
      } else setErrorMessage(dataResponse);
    });
  };

  useEffect(() => {
    getUnitTreeList();
  }, []);

  useEffect(() => {
    fetchData();
  }, [queryFilter.page, queryFilter.size]);

  const handleRemove = () => {
    removeSubPosition(selectedPosition.id).then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Xóa thành công");
        setIsRemovePopup(false);
        fetchData();
      } else setErrorMessage(dataResponse);
    });
  };
  const removePopup = () => (
    <ConfirmPopup
      open={isRemovePopup}
      setOpen={setIsRemovePopup}
      questionText="Bạn có đồng ý xóa chức vụ này?"
      NotiText="Chức vụ sẽ bị xóa khỏi hệ thống"
      handleSubmit={handleRemove}
    />
  );

  const handleLock = () => {
    updateSubPostion(selectedPosition.id, undefined, undefined, "INACTIVATED", undefined).then(
      (res) => {
        const [status, dataResponse] = handleResponse(res);
        if (status) {
          setSuccessMessage("Khóa thành công");
          setIsLockPopup(false);
          fetchData();
        } else setErrorMessage(dataResponse);
      }
    );
  };
  const lockPopup = () => (
    <ConfirmPopup
      open={isLockPopup}
      setOpen={setIsLockPopup}
      questionText="Bạn có đồng ý khóa nhóm chỉ tiêu này?"
      NotiText="Nhóm chỉ tiêu sẽ bị khóa trên hệ thống"
      handleSubmit={handleLock}
    />
  );

  const handleUnlock = () => {
    updateSubPostion(selectedPosition.id, undefined, undefined, "ACTIVATED", undefined).then(
      (res) => {
        const [status, dataResponse] = handleResponse(res);
        if (status) {
          setSuccessMessage("Mở khóa thành công");
          setIsUnlockPopup(false);
          fetchData();
        } else setErrorMessage(dataResponse);
      }
    );
  };
  const unlockPopup = () => (
    <ConfirmPopup
      open={isUnlockPopup}
      setOpen={setIsUnlockPopup}
      questionText="Bạn có đồng ý mở khóa chức vụ này?"
      NotiText="Chức vụ sẽ được mở khóa trên hệ thống"
      handleSubmit={handleUnlock}
    />
  );

  const verifyInfo = () => {
    try {
      isRequired(addParams.positionCode, "Mã chức vụ");
      isRequired(addParams.positionName, "Tên chức vụ");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const handleUpdateCategory = () => {
    verifyInfo();
    const { positionName, positionCode, status, department } = addParams;
    updateSubPostion(selectedPosition.id, positionCode, positionName, status, department).then(
      (res) => {
        const [status, dataResponse] = handleResponse(res);
        if (status) {
          setSuccessMessage("Cập nhật thành công");
          setIsAddPopup(false);
          fetchData();
        } else setErrorMessage(dataResponse);
      }
    );
  };

  const handleAddCategory = () => {
    verifyInfo();
    const { positionName, positionCode, status, department } = addParams;
    addSubPosition(positionCode, positionName, status, department).then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Tạo mới thành công");
        setIsAddPopup(false);
        fetchData();
      } else setErrorMessage(dataResponse);
    });
  };

  const addCategoryPopup = () => {
    return (
      <PopupRoot
        title={selectedPosition !== null ? "Cập nhật chức vụ" : "Thêm mới chức vụ"}
        open={isAddPopup}
        setOpen={setIsAddPopup}
        classNames="small-popup"
        closeIcon
      >
        <Grid container p={2} rowSpacing={1}>
          <Grid item xs={12} lg={12}>
            <TreeSelect
              label="Cơ quan chuyên trách"
              data={unitTree}
              placeholder="Chọn cơ quan chuyên trách"
              required={false}
              value={addParams.department}
              width="100%"
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  department: e,
                })
              }
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Input
              label="Mã chức vụ"
              placeholder="Nhập mã chức vụ"
              value={addParams.positionCode}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  positionCode: e.target.value,
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Input
              label="Tên chức vụ"
              placeholder="Nhập tên chức vụ"
              value={addParams.positionName}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  positionName: e.target.value,
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12} mb={"28px"}>
            <SelectBox
              label="Trạng thái"
              options={managementCategoryStatus}
              placeholder="Chọn trạng thái"
              value={addParams.status}
              isDisabled={!selectedPosition}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  status: e.value,
                })
              }
            />
          </Grid>
          <ButtonControl
            submitText="Lưu"
            justifyContent="center"
            handleCancel={() => setIsAddPopup(false)}
            handleSubmit={() => {
              if (selectedPosition) handleUpdateCategory();
              else handleAddCategory();
            }}
          />
        </Grid>
      </PopupRoot>
    );
  };

  useEnterKeyEvent([], fetchData);

  return (
    <>
      {removePopup()}
      {lockPopup()}
      {unlockPopup()}
      {addCategoryPopup()}
      <Grid item xs={12} sm={8} lg={8} display="flex" alignItems="center" gap={2}>
        <SearchInput
          placeholder="Nhập mã, tên chức vụ"
          isOpenFilter={isOpenFilter}
          setIsOpenFilter={setIsOpenFilter}
          searchText={queryFilter.searchText}
          onChange={(e) => setQueryFilter({ ...queryFilter, searchText: e.target.value })}
          submit={fetchData}
        />
      </Grid>
      <Grid item xs={12} sm={4} lg={4} display="flex" justifyContent="end" alignItems="center">
        <SuiBox
          display="flex"
          gap="20px"
          sx={{
            height: "40px",
          }}
        >
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_ADD_POSITION",
            ]}
          >
            <ButtonControl
              hiddenCancel
              submitText="Thêm mới"
              imageSubmit={WhitePlusIcon}
              handleSubmit={() => {
                setAddParams(addPositionData);
                setSelectedPosition(null);
                setIsAddPopup(true);
              }}
            />
          </PermissionWrapped>
        </SuiBox>
      </Grid>
      {isOpenFilter && (
        <Grid container item xs={12} columnSpacing={4} spacing={1} mt={1}>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <TreeSelect
              label="Cơ quan chuyên trách"
              data={unitTree}
              placeholder="Chọn cơ quan chuyên trách"
              required={false}
              value={queryFilter.department}
              width="100%"
              onChange={(e) =>
                setQueryFilter({
                  ...queryFilter,
                  department: e,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <SelectBox
              label="Trạng thái"
              options={categoryStatusTable}
              value={queryFilter.status}
              onChange={(e) => {
                setQueryFilter({ ...queryFilter, status: e.value });
              }}
              placeholder="Tất cả"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <ButtonFilter
              onClear={() =>
                setQueryFilter({ ...queryFilter, status: "", searchText: "", department: "" })
              }
              onSearch={fetchData}
            />
          </Grid>
        </Grid>
      )}
      <PermissionWrapped
        listCodeComponent={[
          "ADMINISTRATION",
          "CATEGORY_MANAGEMENT_TAB",
          "CATEGORY_MANAGEMENT_TAB_POSITION_TABLE",
        ]}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            border: "1px solid #eeecf8",
            marginTop: "10px",
            width: "100%",
          }}
        >
          <Table
            size="13px"
            tablePadding
            columns={positionColumns}
            rows={listSubPosition}
            borderRadius="1rem 1rem 0 0"
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
            totalElements={queryFilter.total}
          />
        </Box>
      </PermissionWrapped>
    </>
  );
}
