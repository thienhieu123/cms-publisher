import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
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
  addDepartment,
  addSubCategory,
  getDeparmentList,
  getSubListCategory,
  removeDepartment,
  removeSubCategory,
  updateDepartment,
  updateSubCategory,
} from "~/api/common";
import PopupRoot from "~/components/Popup/PopupRoot";
import Input from "~/components/Input";
import { getListValueAsString, getValueInList, renderStatusTag } from "~/utils/utils";
import SuiTypography from "~/components/SuiTypography";
import { isRequired } from "~/utils/verify";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { DeleteIconButton, EditIconButton, LocknUnLockIconButton } from "~/components/Button";
import PermissionWrapped from "~/components/PermissionWrapped";
import useRelationIndices from "~/hooks/useRelationIndices";

const departmentColumns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã ngành",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên ngành",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên nhóm chỉ tiêu",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên chỉ tiêu",
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
  group: [],
  indice: [],
  status: "",
};

const addDepartmentData = {
  group: [],
  code: "",
  name: "",
  indice: [],
  status: "ACTIVATED",
};

export default function Department() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [listDepartment, setListDepartment] = useState([]);
  const [isAddPopup, setIsAddPopup] = useState(false);
  const [isLockPopup, setIsLockPopup] = useState(false);
  const [isUnlockPopup, setIsUnlockPopup] = useState(false);
  const [isRemovePopup, setIsRemovePopup] = useState(false);
  const [addParams, setAddParams] = useState(addDepartmentData);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();

  const renderGroupBtn = (department) => {
    return (
      <Grid container ishiddentooltip="true" onClick={() => setSelectedDepartment(department)}>
        <SuiTypography
          component="span"
          sx={{ display: "flex", width: "140px", justifyContent: "center" }}
        >
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_EDIT_DEPARTMENT",
            ]}
          >
            <EditIconButton
              onClick={() => {
                console.log("check: ", getValueInList(department?.statsIndices, ["group", "id"]));
                setAddParams({
                  code: department.code,
                  name: department.name,
                  status: department.status,
                  indice: getValueInList(department?.statsIndices, ["id"]),
                  group: getValueInList(department?.statsIndices, ["group", "id"]),
                });
                setIsAddPopup(true);
              }}
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_LOCK_DEPARTMENT",
            ]}
          >
            <LocknUnLockIconButton
              status={department.status}
              handleClick={(status) =>
                status === "ACTIVATED" ? setIsLockPopup(true) : setIsUnlockPopup(true)
              }
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_DELETE_DEPARTMENT",
            ]}
          >
            <DeleteIconButton onClick={() => setIsRemovePopup(true)} />
          </PermissionWrapped>
        </SuiTypography>
      </Grid>
    );
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        STT: index + 1 + queryFilter.page * queryFilter.size,
        "Mã ngành": item.code,
        "Tên ngành": item.name,
        "Tên nhóm chỉ tiêu": getListValueAsString(item.statsIndices, ["group", "name"]),
        "Tên chỉ tiêu": getListValueAsString(item.statsIndices, ["name"]),
        "Trạng thái": renderStatusTag(item.status, managementCategoryStatus),
        "Hành động": renderGroupBtn(item),
      };
    });
  };

  const fetchData = () => {
    getDeparmentList(
      queryFilter.page,
      queryFilter.size,
      queryFilter.searchText,
      getValueInList(queryFilter.group),
      getValueInList(queryFilter.indice),
      queryFilter.status
    ).then((res) => {
      if (res.success && res.message.status === 200) {
        setListDepartment(formatData(res.message.data.data.rows));
        setQueryFilter({ ...queryFilter, total: res.message.data.data.rowCount });
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [queryFilter.page, queryFilter.size]);

  const handleRemove = () => {
    removeDepartment(selectedDepartment.id).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Xóa thành công");
        setIsRemovePopup(false);
        fetchData();
      }
    });
  };
  const removePopup = () => (
    <ConfirmPopup
      open={isRemovePopup}
      setOpen={setIsRemovePopup}
      questionText="Bạn có đồng ý xóa ngành này?"
      NotiText="Ngành sẽ bị xóa khỏi hệ thống"
      handleSubmit={handleRemove}
    />
  );

  const handleLock = () => {
    console.log("handle lock");
    updateDepartment(selectedDepartment.id, "INACTIVATED", undefined, undefined, undefined).then(
      (res) => {
        if (res.success && res.message.status === 200) {
          setSuccessMessage("Khóa thành công");
          setIsLockPopup(false);
          fetchData();
        }
      }
    );
  };
  const lockPopup = () => (
    <ConfirmPopup
      open={isLockPopup}
      setOpen={setIsLockPopup}
      questionText="Bạn có đồng ý khóa ngành này?"
      NotiText="Ngành sẽ bị khóa trên hệ thống"
      handleSubmit={handleLock}
    />
  );

  const handleUnlock = () => {
    updateDepartment(selectedDepartment.id, "ACTIVATED", undefined, undefined).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Mở khóa thành công");
        setIsUnlockPopup(false);
        fetchData();
      }
    });
  };
  const unlockPopup = () => (
    <ConfirmPopup
      open={isUnlockPopup}
      setOpen={setIsUnlockPopup}
      questionText="Bạn có đồng ý mở khóa ngành này?"
      NotiText="Ngành sẽ được mở khóa trên hệ thống"
      handleSubmit={handleUnlock}
    />
  );

  const verifyInfo = () => {
    try {
      isRequired(addParams.code, "Mã ngành");
      isRequired(addParams.name, "Tên ngành");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const handleUpdateDepartment = () => {
    verifyInfo();
    const { name, code, status, indice, group } = addParams;
    updateDepartment(
      selectedDepartment.id,
      status,
      code,
      name,
      getValueInList(group),
      getValueInList(indice)
    ).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Cập nhật thành công");
        setIsAddPopup(false);
        fetchData();
      }
    });
  };

  const handleAddDepartment = () => {
    verifyInfo();
    const { name, code, status, indice, group } = addParams;
    addDepartment(code, name, getValueInList(group), getValueInList(indice), status).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Tạo mới thành công");
        setIsAddPopup(false);
        fetchData();
      }
    });
  };

  const [blockChild, setBlockChild] = useState(true);
  const editFieldList = useRelationIndices(
    addParams.group,
    () => setAddParams({ ...addParams, indice: [] }),
    blockChild
  );
  const addCategoryPopup = () => {
    return (
      <PopupRoot
        title={selectedDepartment !== null ? "Cập nhật ngành" : "Thêm mới ngành"}
        open={isAddPopup}
        setOpen={setIsAddPopup}
        classNames="small-popup"
        closeIcon
      >
        <Grid container p={2} rowSpacing={1}>
          <Grid item xs={12} lg={12}>
            <SelectBox
              label="Nhóm chỉ tiêu"
              isMulti
              options={editFieldList.parentList}
              placeholder="Chọn nhóm chỉ tiêu"
              width="100%"
              value={addParams.group}
              onChange={(e) => {
                setBlockChild(false);
                setAddParams({
                  ...addParams,
                  group: e,
                });
              }}
              isHaveAllOptions={false}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <SelectBox
              isMulti
              label="Chỉ tiêu"
              options={editFieldList.childrenList}
              value={addParams.indice}
              onChange={(e) => {
                setAddParams({ ...addParams, indice: e });
              }}
              placeholder="Chọn chỉ tiêu"
              isHaveAllOptions={false}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Input
              label="Mã ngành"
              placeholder="Nhập mã ngành"
              value={addParams.code}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  code: e.target.value,
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Input
              label="Tên ngành"
              placeholder="Nhập tên ngành"
              value={addParams.name}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  name: e.target.value,
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
              width="100%"
              value={addParams.status}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  status: e.value,
                })
              }
              isDisabled={selectedDepartment === null}
            />
          </Grid>
          <ButtonControl
            submitText="Lưu"
            justifyContent="center"
            handleCancel={() => setIsAddPopup(false)}
            handleSubmit={() => {
              if (selectedDepartment) handleUpdateDepartment();
              else handleAddDepartment();
            }}
          />
        </Grid>
      </PopupRoot>
    );
  };

  useEffect(() => {
    fetchData();
  }, [queryFilter.page, queryFilter.size]);

  useEnterKeyEvent([], fetchData);

  const searchFieldList = useRelationIndices(queryFilter.group, () =>
    setQueryFilter({ ...queryFilter, indice: [] })
  );

  return (
    <>
      {removePopup()}
      {lockPopup()}
      {unlockPopup()}
      {addCategoryPopup()}
      <Grid item xs={12} sm={8} lg={8} display="flex" alignItems="center" gap={2}>
        <SearchInput
          placeholder="Nhập mã, tên ngành"
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
              "CATEGORY_MANAGEMENT_TAB_ADD_DEPARTMENT",
            ]}
          >
            <ButtonControl
              hiddenCancel
              submitText="Thêm mới"
              imageSubmit={WhitePlusIcon}
              handleSubmit={() => {
                setAddParams(addDepartmentData);
                setSelectedDepartment(null);
                setIsAddPopup(true);
              }}
            />
          </PermissionWrapped>
        </SuiBox>
      </Grid>
      {isOpenFilter && (
        <Grid container item xs={12} columnSpacing={4} spacing={1} mt={1}>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <SelectBox
              isMulti
              label="Nhóm chỉ tiêu"
              options={searchFieldList.parentList}
              value={queryFilter.group}
              onChange={(e) => {
                setQueryFilter({ ...queryFilter, group: e });
              }}
              isHaveAllOptions={false}
              placeholder="Tất cả"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <SelectBox
              isMulti
              label="Chỉ tiêu"
              options={searchFieldList.childrenList}
              value={queryFilter.indice}
              onChange={(e) => {
                setQueryFilter({ ...queryFilter, indice: e });
              }}
              isHaveAllOptions={false}
              placeholder="Tất cả"
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
                setQueryFilter({ ...queryFilter, status: "", searchText: "", group: "", unit: "" })
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
          "CATEGORY_MANAGEMENT_TAB_DEPARTMENT_TABLE",
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
            columns={departmentColumns}
            rows={listDepartment}
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
