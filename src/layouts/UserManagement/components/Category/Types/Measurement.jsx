import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import ButtonFilter from "~/components/ButtonFilter";
import SearchInput from "~/components/SearchInput";
import SelectBox from "~/components/SelectBox";
import SuiBox from "~/components/SuiBox";
import Table from "~/examples/Tables/Table";
import WhitePlusIcon from "~/assets/images/icons/white-plus.svg";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import {
  addSubMeasurement,
  getSubListMeasurement,
  removeSubMeasurement,
  updateSubMeasurement,
} from "~/api/common";
import PopupRoot from "~/components/Popup/PopupRoot";
import Input from "~/components/Input";
import { handleResponse, renderStatusTag } from "~/utils/utils";
import SuiTypography from "~/components/SuiTypography";
import { isRequired } from "~/utils/verify";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import RadioButton from "~/components/SuiRadioButton/SuiRadioButtonRoot";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { categoryStatusTable, managementCategoryStatus } from "~/constants/config";
import { DeleteIconButton, EditIconButton, LocknUnLockIconButton } from "~/components/Button";
import { useSoftUIController } from "~/context";
import { setLoading } from "~/context/common/action";
import PermissionWrapped from "~/components/PermissionWrapped";

const unitColumns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã đơn vị đo",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên đơn vị đo",
    sortable: true,
    align: "center",
  },
  {
    name: "Giới hạn",
    sortable: true,
    align: "center",
  },
  {
    name: "Kiểu đơn vị đo",
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

const addUnitData = {
  code: "",
  name: "",
  status: "ACTIVATED",
  minValue: "",
  maxValue: "",
  valueType: "INTEGER",
};

export default function Measurement() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [listSubUnit, setListSubUnit] = useState([]);
  const [isAddPopup, setIsAddPopup] = useState(false);
  const [isLockPopup, setIsLockPopup] = useState(false);
  const [isUnlockPopup, setIsUnlockPopup] = useState(false);
  const [isRemovePopup, setIsRemovePopup] = useState(false);
  const [addParams, setAddParams] = useState(addUnitData);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [, dispatch] = useSoftUIController();

  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();

  const renderGroupBtn = (unit) => {
    return (
      <Grid container ishiddentooltip="true" onClick={() => setSelectedUnit(unit)}>
        <SuiTypography
          component="span"
          sx={{ display: "flex", width: "140px", justifyContent: "center" }}
        >
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_EDIT_UNIT",
            ]}
          >
            <EditIconButton
              onClick={() => {
                setAddParams({
                  code: unit.code,
                  name: unit.name,
                  status: unit.status,
                  minValue: unit.minValue,
                  maxValue: unit.maxValue,
                  valueType: unit.valueType,
                });
                setIsAddPopup(true);
              }}
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_LOCK_UNIT",
            ]}
          >
            <LocknUnLockIconButton
              handleClick={(status) =>
                status === "ACTIVATED" ? setIsLockPopup(true) : setIsUnlockPopup(true)
              }
              status={unit.status}
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_DELETE_UNIT",
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
        "Mã đơn vị đo": item.code,
        "Tên đơn vị đo": item.name,
        "Giới hạn": `${item.minValue} - ${item.maxValue}`,
        "Kiểu đơn vị đo": item.valueType === "INTEGER" ? "Số nguyên dương" : "Số thập phân",
        "Trạng thái": renderStatusTag(item.status, managementCategoryStatus),
        "Hành động": renderGroupBtn(item),
      };
    });
  };

  const fetchData = () => {
    setLoading(dispatch, true);
    getSubListMeasurement({
      page: queryFilter.page + 1,
      size: queryFilter.size,
      searchText: queryFilter.searchText,
      status: queryFilter.status,
    })
      .then((res) => {
        const [status, dataResponse] = handleResponse(res);
        if (status) {
          setListSubUnit(formatData(res.message.data.data.rows));
          setQueryFilter({ ...queryFilter, total: res.message.data.data.rowCount });
        } else setErrorMessage(dataResponse);
      })
      .finally(() => setLoading(dispatch, false));
  };

  useEffect(() => {
    fetchData();
  }, [queryFilter.page, queryFilter.size]);

  const handleRemove = () => {
    removeSubMeasurement(selectedUnit.id).then((res) => {
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
      questionText="Bạn có đồng ý xóa đơn vị đo này?"
      NotiText="Đơn vị đo sẽ bị xóa khỏi hệ thống"
      handleSubmit={handleRemove}
    />
  );

  const handleLock = () => {
    updateSubMeasurement(selectedUnit.id, undefined, undefined, "INACTIVATED").then((res) => {
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
      questionText="Bạn có đồng ý khóa đơn vị đo này?"
      NotiText="Đơn vị đo sẽ bị khóa trên hệ thống"
      handleSubmit={handleLock}
    />
  );

  const handleUnlock = () => {
    updateSubMeasurement(selectedUnit.id, undefined, undefined, "ACTIVATED").then((res) => {
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
      questionText="Bạn có đồng ý mở khóa đơn vị đo này?"
      NotiText="Đơn vị đo sẽ được mở khóa trên hệ thống"
      handleSubmit={handleUnlock}
    />
  );

  const verifyInfo = () => {
    try {
      isRequired(addParams.code, "Mã đơn vị đo");
      isRequired(addParams.name, "Tên đơn vị đo");
      isRequired(addParams.maxValue, "Giới hạn cao nhất");
      isRequired(addParams.minValue, "Giới hạn thấp nhất nhất");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const handleUpdateCategory = () => {
    verifyInfo();
    const { name, code, status, minValue, maxValue, valueType } = addParams;
    updateSubMeasurement(selectedUnit.id, code, name, status, minValue, maxValue, valueType).then(
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
    const { name, code, status, minValue, maxValue, valueType } = addParams;
    addSubMeasurement(code, name, status, +minValue, +maxValue, valueType).then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Tạo mới thành công");
        setIsAddPopup(false);
        fetchData();
      } else setErrorMessage(dataResponse);
    });
  };

  const verifyLimit = (character, currentValue) => {
    const intRegex = new RegExp("^[0-9]*$");
    const floatRegex = new RegExp("^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)*$");
    if (addParams.valueType === "INTEGER" && intRegex.test(character)) return character;
    else if (addParams.valueType === "FLOAT" && floatRegex.test(character)) return character;
    else return currentValue;
  };

  const addCategoryPopup = () => {
    return (
      <PopupRoot
        title={selectedUnit !== null ? "Cập nhật đơn vị" : "Thêm mới đơn vị"}
        open={isAddPopup}
        setOpen={setIsAddPopup}
        classNames="small-popup"
        closeIcon
      >
        <Grid container p={2} rowSpacing={1} columnSpacing={1}>
          <Grid item xs={12} lg={12}>
            <Input
              label="Mã đơn vị đo"
              placeholder="Nhập mã đơn vị đo"
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
              label="Tên đơn vị đo"
              placeholder="Nhập tên đơn vị đo"
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
          <Grid item xs={12} lg={6}>
            <Input
              label="Giới hạn thấp nhất"
              placeholder="Nhập giới hạn thấp nhất"
              value={addParams.minValue}
              onChange={(e) => {
                const character = verifyLimit(e.target.value, addParams.minValue);
                setAddParams({
                  ...addParams,
                  minValue: character,
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Input
              label="Giới hạn cao nhất"
              placeholder="Nhập giới hạn cao nhất"
              value={addParams.maxValue}
              onChange={(e) => {
                const character = verifyLimit(e.target.value, addParams.maxValue);
                setAddParams({
                  ...addParams,
                  maxValue: character,
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <RadioButton
              id={"number"}
              text="Số nguyên dương"
              value={"INTEGER"}
              onChange={(e) => setAddParams({ ...addParams, valueType: e.target.value })}
              checked={addParams.valueType === "INTEGER"}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <RadioButton
              id={"float"}
              text="Số thập phân"
              value={"FLOAT"}
              onChange={(e) => setAddParams({ ...addParams, valueType: e.target.value })}
              checked={addParams.valueType === "FLOAT"}
            />
          </Grid>
          <Grid item xs={12} mb={"28px"}>
            <SelectBox
              label="Trạng thái"
              options={managementCategoryStatus}
              placeholder="Chọn trạng thái"
              width="100%"
              value={addParams.status}
              isDisabled={selectedUnit === null}
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
              if (selectedUnit) handleUpdateCategory();
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
          placeholder="Nhập mã, tên đơn vị đo"
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
              "CATEGORY_MANAGEMENT_TAB_ADD_UNIT",
            ]}
          >
            <ButtonControl
              hiddenCancel
              submitText="Thêm mới"
              imageSubmit={WhitePlusIcon}
              handleSubmit={() => {
                setAddParams(addUnitData);
                setSelectedUnit(null);
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
          "CATEGORY_MANAGEMENT_TAB_UNIT_TABLE",
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
            columns={unitColumns}
            rows={listSubUnit}
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
