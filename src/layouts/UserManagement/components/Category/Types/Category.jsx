import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
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
  addSubCategory,
  getSubListCategory,
  removeSubCategory,
  updateSubCategory,
} from "~/api/common";
import PopupRoot from "~/components/Popup/PopupRoot";
import Input from "~/components/Input";
import { renderStatusTag } from "~/utils/utils";
import DeleteIcon from "~/assets/images/icons/red-trash-bin.svg";
import LockIcon from "~/assets/images/icons/red-lock.svg";
import UnLockIcon from "~/assets/images/icons/black-unlock.svg";
import EditIcon from "~/assets/images/icons/edit-icon.svg";
import SuiTypography from "~/components/SuiTypography";
import { isRequired } from "~/utils/verify";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import {
  DeleteIconButton,
  EditIconButton,
  LocknUnLockIconButton,
  SettingIconButton,
} from "~/components/Button";
import PermissionWrapped from "~/components/PermissionWrapped";
import RadioButton from "~/components/SuiRadioButton/SuiRadioButtonRoot";

const categoryColumns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã chỉ tiêu",
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
    name: "Đơn vị đo",
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
  group: "",
  unit: "",
  status: "",
};

const addCategoryData = {
  group: "",
  code: "",
  name: "",
  unit: "",
  status: "ACTIVATED",
};

export default function Category() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [listSubCategory, setListSubCategory] = useState([]);
  const [isAddPopup, setIsAddPopup] = useState(false);
  const [isLockPopup, setIsLockPopup] = useState(false);
  const [isUnlockPopup, setIsUnlockPopup] = useState(false);
  const [isSettingPopup, setIsSettingPopup] = useState(false);
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
              "CATEGORY_MANAGEMENT_TAB_EDIT_CATEGORY",
            ]}
          >
            <EditIconButton
              onClick={() => {
                setAddParams({
                  code: category.code,
                  name: category.name,
                  status: category.status,
                  unit: category.deafaultMeasurementUnit?.id,
                  group: category.group?.id,
                });
                setIsAddPopup(true);
              }}
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_LOCK_CATEGORY",
            ]}
          >
            <LocknUnLockIconButton
              status={category.status}
              handleClick={(status) =>
                status === "ACTIVATED" ? setIsLockPopup(true) : setIsUnlockPopup(true)
              }
            />
          </PermissionWrapped>

          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_SETTING_CATEGORY",
            ]}
          >
            <SettingIconButton onClick={() => setIsSettingPopup(true)} />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_DELETE_CATEGORY",
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
        "Mã chỉ tiêu": item.code,
        "Tên nhóm chỉ tiêu": item.group?.name,
        "Tên chỉ tiêu": item.name,
        "Đơn vị đo": item.deafaultMeasurementUnit?.name,
        "Trạng thái": renderStatusTag(item.status, managementCategoryStatus),
        "Hành động": renderGroupBtn(item),
      };
    });
  };

  const fetchData = () => {
    getSubListCategory(
      queryFilter.page,
      queryFilter.size,
      queryFilter.searchText,
      queryFilter.status,
      queryFilter.unit,
      queryFilter.group
    ).then((res) => {
      if (res.success && res.message.status === 200) {
        setListSubCategory(formatData(res.message.data.data.rows));
        setQueryFilter({ ...queryFilter, total: res.message.data.data.rowCount });
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [queryFilter.page, queryFilter.size]);

  const handleRemove = () => {
    removeSubCategory(selectedCategory.id).then((res) => {
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
      questionText="Bạn có đồng ý xóa chỉ tiêu này?"
      NotiText="Chỉ tiêu sẽ bị xóa khỏi hệ thống"
      handleSubmit={handleRemove}
    />
  );

  const handleLock = () => {
    updateSubCategory(
      selectedCategory.id,
      undefined,
      undefined,
      "INACTIVATED",
      undefined,
      undefined
    ).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Khóa thành công");
        setIsLockPopup(false);
        fetchData();
      }
    });
  };
  const lockPopup = () => (
    <ConfirmPopup
      open={isLockPopup}
      setOpen={setIsLockPopup}
      questionText="Bạn có đồng ý khóa chỉ tiêu này?"
      NotiText="Chỉ tiêu sẽ bị khóa trên hệ thống"
      handleSubmit={handleLock}
    />
  );

  const handleUnlock = () => {
    updateSubCategory(
      selectedCategory.id,
      undefined,
      undefined,
      "ACTIVATED",
      undefined,
      undefined
    ).then((res) => {
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
      questionText="Bạn có đồng ý mở khóa chỉ tiêu này?"
      NotiText="Chỉ tiêu sẽ được mở khóa trên hệ thống"
      handleSubmit={handleUnlock}
    />
  );

  const fakeFormulaList = [
    {
      id: 1,
      name: "Công thức 1",
      formulaStr: "(x + y) / z",
    },
    {
      id: 2,
      name: "Công thức 2",
      formulaStr: "x * y",
    },
    {
      id: 3,
      name: "Công thức 3",
      formulaStr: "x / y",
    },
  ];
  const [formulaList, setFormulaList] = useState(fakeFormulaList);
  const [chosenFormula, setChosenFormula] = useState();
  const settingPopup = () => {
    return (
      <PopupRoot
        title={"Chọn công thức"}
        open={isSettingPopup}
        setOpen={setIsSettingPopup}
        // classNames="small-popup"
      >
        <Grid container p={2} rowSpacing={1}>
          {formulaList.map((item) => {
            return (
              <Grid item container xs={12} lg={12} alignItems={"center"}>
                <Grid item xs={12} md={4}>
                  <RadioButton
                    id={item.id}
                    text={item.name}
                    value={item.id}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setChosenFormula(e.target.value);
                    }}
                    checked={chosenFormula == item.id}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Input value={item.formulaStr} disabled />
                </Grid>
              </Grid>
            );
          })}
          <Grid item xs={12} lg={12}></Grid>

          <ButtonControl
            submitText="Lưu"
            justifyContent="center"
            handleCancel={() => setIsSettingPopup(false)}
            handleSubmit={() => {}}
          />
        </Grid>
      </PopupRoot>
    );
  };

  const verifyInfo = () => {
    try {
      isRequired(addParams.code, "Mã chỉ tiêu");
      isRequired(addParams.name, "Tên chỉ tiêu");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const handleUpdateCategory = () => {
    verifyInfo();
    const { name, code, status, unit, group } = addParams;
    updateSubCategory(selectedCategory.id, code, name, status, unit, group).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Cập nhật thành công");
        setIsAddPopup(false);
        fetchData();
      }
    });
  };

  const handleAddCategory = () => {
    verifyInfo();
    const { name, code, status, unit, group } = addParams;
    addSubCategory(code, name, status, unit, group).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Tạo mới thành công");
        setIsAddPopup(false);
        fetchData();
      }
    });
  };

  const addCategoryPopup = () => {
    return (
      <PopupRoot
        title={selectedCategory !== null ? "Cập nhật chỉ tiêu" : "Thêm mới chỉ tiêu"}
        open={isAddPopup}
        setOpen={setIsAddPopup}
        classNames="small-popup"
        closeIcon
      >
        <Grid container p={2} rowSpacing={1}>
          <Grid item xs={12} lg={12}>
            <SelectBox
              label="Nhóm chỉ tiêu"
              dataSource={`/stats-index-groups/list?status=ACTIVATED`}
              mapping={{ value: "id", label: "name" }}
              placeholder="Chọn nhóm chỉ tiêu"
              width="100%"
              value={addParams.group}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  group: e.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Input
              label="Mã chỉ tiêu"
              placeholder="Nhập mã chỉ tiêu"
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
              label="Tên chỉ tiêu"
              placeholder="Nhập tên chỉ tiêu"
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
          <Grid item xs={12}>
            <SelectBox
              label="Đơn vị"
              dataSource={`/measurement-units/list?status=ACTIVATED`}
              mapping={{ value: "id", label: "name" }}
              placeholder="Chọn đơn vị"
              width="100%"
              value={addParams.unit}
              onChange={(e) => {
                setAddParams({
                  ...addParams,
                  unit: e.value,
                });
              }}
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

  useEffect(() => {
    fetchData();
  }, [queryFilter.page, queryFilter.size]);

  useEnterKeyEvent([], fetchData);

  return (
    <>
      {removePopup()}
      {lockPopup()}
      {unlockPopup()}
      {addCategoryPopup()}
      {settingPopup()}
      <Grid item xs={12} sm={8} lg={8} display="flex" alignItems="center" gap={2}>
        <SearchInput
          placeholder="Nhập mã, tên chỉ tiêu"
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
              "CATEGORY_MANAGEMENT_TAB_ADD_CATEGORY",
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
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <SelectBox
              label="Nhóm chỉ tiêu"
              dataSource={`/stats-index-groups/list?status=ACTIVATED`}
              mapping={{ value: "id", label: "name" }}
              value={queryFilter.group}
              onChange={(e) => {
                setQueryFilter({ ...queryFilter, group: e.value });
              }}
              placeholder="Tất cả"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <SelectBox
              label="Đơn vị"
              dataSource={`/measurement-units/list?status=ACTIVATED`}
              mapping={{ value: "id", label: "name" }}
              value={queryFilter.unit}
              onChange={(e) => {
                setQueryFilter({ ...queryFilter, unit: e.value });
              }}
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
          "CATEGORY_MANAGEMENT_TAB_CATEGORY_TABLE",
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
