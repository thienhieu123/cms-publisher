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
  addSubGroupCategory,
  getSubListGroupCategory,
  removeSubGroupCategory,
  updateSubGroupCategory,
} from "~/api/common";
import PopupRoot from "~/components/Popup/PopupRoot";
import Input from "~/components/Input";
import { handleResponse, renderStatusTag } from "~/utils/utils";
import SuiTypography from "~/components/SuiTypography";
import { isRequired } from "~/utils/verify";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { DeleteIconButton, EditIconButton, LocknUnLockIconButton } from "~/components/Button";
import PermissionWrapped from "~/components/PermissionWrapped";

const categoryColumns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã nhóm chỉ tiêu",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên nhóm chỉ tiêu",
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
  status: "",
};

const addCategoryData = {
  code: "",
  name: "",
  status: "ACTIVATED",
};

export default function GroupCategory() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [listSubCategory, setListSubCategory] = useState([]);
  const [isAddPopup, setIsAddPopup] = useState(false);
  const [isLockPopup, setIsLockPopup] = useState(false);
  const [isUnlockPopup, setIsUnlockPopup] = useState(false);
  const [isRemovePopup, setIsRemovePopup] = useState(false);
  const [addParams, setAddParams] = useState(addCategoryData);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();

  const renderGroupBtn = (category) => {
    return (
      <Grid container ishiddentooltip="true" onClick={() => setSelectedCategory(category)}>
        <SuiTypography
          component="span"
          sx={{ display: "flex", width: "140px", justifyContent: "center" }}
        >
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_EDIT_GROUP_CATEGORY",
            ]}
          >
            <EditIconButton
              onClick={() => {
                setAddParams({
                  code: category.code,
                  name: category.name,
                  status: category.status,
                });
                setIsAddPopup(true);
              }}
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_LOCK_GROUP_CATEGORY",
            ]}
          >
            <LocknUnLockIconButton
              status={category.status}
              handleClick={() =>
                category.status === "ACTIVATED" ? setIsLockPopup(true) : setIsUnlockPopup(true)
              }
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_DELETE_GROUP_CATEGORY",
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
        STT: queryFilter.page * queryFilter.size + index + 1,
        "Mã nhóm chỉ tiêu": item.code,
        "Tên nhóm chỉ tiêu": item.name,
        "Trạng thái": renderStatusTag(item.status, managementCategoryStatus),
        "Hành động": renderGroupBtn(item),
      };
    });
  };

  const fetchData = () => {
    getSubListGroupCategory(
      queryFilter.page,
      queryFilter.size,
      queryFilter.searchText,
      queryFilter.status
    ).then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setListSubCategory(formatData(res.message.data.data.rows));
        setQueryFilter({ ...queryFilter, total: res.message.data.data.rowCount });
      } else setErrorMessage(dataResponse);
    });
  };

  useEffect(() => {
    fetchData();
  }, [queryFilter.page, queryFilter.size]);

  const handleRemove = () => {
    removeSubGroupCategory(selectedCategory.id).then((res) => {
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
      questionText="Bạn có đồng ý xóa nhóm chỉ tiêu này?"
      NotiText="Nhóm chỉ tiêu sẽ bị xóa khỏi hệ thống"
      handleSubmit={handleRemove}
    />
  );

  const handleLock = () => {
    updateSubGroupCategory(selectedCategory.id, undefined, undefined, "INACTIVATED").then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Khóa thành công");
        setIsLockPopup(false);
        fetchData();
      } else setErrorMessage(dataResponse);
    });
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
    updateSubGroupCategory(selectedCategory.id, undefined, undefined, "ACTIVATED").then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Mở khóa thành công");
        setIsUnlockPopup(false);
        fetchData();
      } else setErrorMessage(dataResponse);
    });
  };
  const unlockPopup = () => (
    <ConfirmPopup
      open={isUnlockPopup}
      setOpen={setIsUnlockPopup}
      questionText="Bạn có đồng ý mở khóa nhóm chỉ tiêu này?"
      NotiText="Nhóm chỉ tiêu sẽ được mở khóa trên hệ thống"
      handleSubmit={handleUnlock}
    />
  );

  const verifyInfo = () => {
    try {
      isRequired(addParams.code, "Mã nhóm chỉ tiêu");
      isRequired(addParams.name, "Tên nhóm chỉ tiêu");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const handleUpdateCategory = () => {
    verifyInfo();
    const { name, code, status } = addParams;
    updateSubGroupCategory(selectedCategory.id, code, name, status).then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Cập nhật thành công");
        setIsAddPopup(false);
        fetchData();
      } else setErrorMessage(dataResponse);
    });
  };

  const handleAddCategory = () => {
    verifyInfo();
    const { name, code, status } = addParams;
    addSubGroupCategory(code, name, status).then((res) => {
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
        title={selectedCategory !== null ? "Cập nhật nhóm chỉ tiêu" : "Thêm mới nhóm chỉ tiêu"}
        open={isAddPopup}
        setOpen={setIsAddPopup}
        classNames="small-popup"
        closeIcon
      >
        <Grid container p={2} rowSpacing={1}>
          <Grid item xs={12} lg={12}>
            <Input
              label="Mã nhóm chỉ tiêu"
              placeholder="Nhập mã nhóm chỉ tiêu"
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
              label="Tên nhóm chỉ tiêu"
              placeholder="Nhập tên nhóm chỉ tiêu"
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
              value={addParams.status}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  status: e.value,
                })
              }
              isDisabled={selectedCategory === null}
            />
          </Grid>
          <ButtonControl
            submitText="Lưu"
            justifyContent="center"
            handleCancel={() => setIsAddPopup(false)}
            handleSubmit={() => {
              if (selectedCategory) handleUpdateCategory();
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
          placeholder="Nhập mã, nhóm chỉ tiêu"
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
              "CATEGORY_MANAGEMENT_TAB_ADD_GROUP_CATEGORY",
            ]}
          >
            <ButtonControl
              hiddenCancel
              submitText="Thêm mới"
              imageSubmit={WhitePlusIcon}
              handleSubmit={() => {
                setAddParams(addCategoryData);
                setSelectedCategory(null);
                setIsAddPopup(true);
              }}
            />
          </PermissionWrapped>
        </SuiBox>
      </Grid>
      {isOpenFilter && (
        <Grid container item xs={12} columnSpacing={4} spacing={1} mt={1}>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
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
              onClear={() => setQueryFilter({ ...queryFilter, status: "", searchText: "" })}
              onSearch={fetchData}
            />
          </Grid>
        </Grid>
      )}

      <PermissionWrapped
        listCodeComponent={[
          "ADMINISTRATION",
          "CATEGORY_MANAGEMENT_TAB",
          "CATEGORY_MANAGEMENT_TAB_GROUP_CATEGORY_TABLE",
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
            columns={categoryColumns}
            rows={listSubCategory}
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
