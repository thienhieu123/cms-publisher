import { Box, Grid, IconButton, Tooltip } from "@mui/material";
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
  getDataSourceList,
  getSubListCategory,
  removeDataSource,
  removeSubCategory,
  updateDataSource,
  updateSubCategory,
} from "~/api/common";
import PopupRoot from "~/components/Popup/PopupRoot";
import Input from "~/components/Input";
import { renderStatusTag } from "~/utils/utils";
import SuiTypography from "~/components/SuiTypography";
import { isRequired } from "~/utils/verify";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { DeleteIconButton, EditIconButton, LocknUnLockIconButton } from "~/components/Button";
import PermissionWrapped from "~/components/PermissionWrapped";
import useRelationIndices from "~/hooks/useRelationIndices";

const categoryColumns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã dữ liệu",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên dữ liệu",
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
    name: "Đơn vị",
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
  indice: "",
  department: "",
  unit: "",
  status: "",
};

const addCategoryData = {
  group: "",
  code: "",
  name: "",
  indice: "",
  department: "",
  measurementUnitId: "",
  sectorId: "",
  relatedIndexIds: [],
  status: "ACTIVATED",
};

export default function DataSource() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [listSubCategory, setListSubCategory] = useState([]);
  const [isAddPopup, setIsAddPopup] = useState(false);
  const [isLockPopup, setIsLockPopup] = useState(false);
  const [isUnlockPopup, setIsUnlockPopup] = useState(false);
  const [isRemovePopup, setIsRemovePopup] = useState(false);
  const [addParams, setAddParams] = useState(addCategoryData);
  const [selectedDataSrc, setSelectedDataSrc] = useState(null);

  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();

  const renderGroupBtn = (dataSrc) => {
    return (
      <Grid container ishiddentooltip="true" onClick={() => setSelectedDataSrc(dataSrc)}>
        <SuiTypography
          component="span"
          sx={{ display: "flex", width: "140px", justifyContent: "center" }}
        >
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_EDIT_DATA_SOURCE",
            ]}
          >
            <EditIconButton
              onClick={() => {
                setAddParams({
                  code: dataSrc.code,
                  name: dataSrc.name,
                  status: dataSrc.status,
                  unit: dataSrc.deafaultMeasurementUnit?.id,
                  group: dataSrc.group?.id,
                });
                setIsAddPopup(true);
              }}
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_LOCK_DATA_SOURCE",
            ]}
          >
            <LocknUnLockIconButton
              status={dataSrc.status}
              handleClick={(status) =>
                status === "ACTIVATED" ? setIsLockPopup(true) : setIsUnlockPopup(true)
              }
            />
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "CATEGORY_MANAGEMENT_TAB",
              "CATEGORY_MANAGEMENT_TAB_DELETE_DATA_SOURCE",
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
        "Mã dữ liệu": item.code,
        "Tên dữ liệu": item.group?.name,
        "Tên nhóm chỉ tiêu": item.name,
        "Tên chỉ tiêu": item.name,
        "Đơn vị": item.deafaultMeasurementUnit?.name,
        "Trạng thái": renderStatusTag(item.status, managementCategoryStatus),
        "Hành động": renderGroupBtn(item),
      };
    });
  };

  const fetchData = () => {
    getDataSourceList(
      queryFilter.page,
      queryFilter.size,
      queryFilter.searchText,
      queryFilter.group,
      queryFilter.indice,
      queryFilter.department,
      queryFilter.unit,
      queryFilter.status
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
    removeDataSource(selectedDataSrc.id).then((res) => {
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
      questionText="Bạn có đồng ý xóa dữ liệu?"
      NotiText="Dữ liệu sẽ bị xóa khỏi hệ thống"
      handleSubmit={handleRemove}
    />
  );

  const handleLock = () => {
    updateDataSource(
      selectedDataSrc.id,
      "INACTIVATED",
      undefined,
      undefined,
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
      questionText="Bạn có đồng ý khóa dữ liệu này?"
      NotiText="Dữ liệu sẽ bị khóa trên hệ thống"
      handleSubmit={handleLock}
    />
  );

  const handleUnlock = () => {
    updateDataSource(
      selectedDataSrc.id,
      "ACTIVATED",
      undefined,
      undefined,
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
      questionText="Bạn có đồng ý mở khóa dữ liệu này?"
      NotiText="Dữ liệu sẽ được mở khóa trên hệ thống"
      handleSubmit={handleUnlock}
    />
  );

  const verifyInfo = () => {
    try {
      isRequired(addParams.code, "Mã dữ liệu");
      isRequired(addParams.name, "Tên dữ liệu");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const handleUpdateCategory = () => {
    verifyInfo();
    const { name, code, status, unit, group } = addParams;
    updateSubCategory(selectedDataSrc.id, code, name, status, unit, group).then((res) => {
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

  const [blockChild, setBlockChild] = useState(true);
  const editFieldList = useRelationIndices(
    addParams.group,
    () => setAddParams({ ...addParams, indice: [] }),
    blockChild
  );
  const addCategoryPopup = () => {
    return (
      <PopupRoot
        title={selectedDataSrc !== null ? "Cập nhật nguồn dữ liệu" : "Thêm mới nguồn dữ liệu"}
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
              isHaveAllOptions={false}
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
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <SelectBox
              label="Chỉ tiêu"
              isMulti
              options={editFieldList.parentList}
              isHaveAllOptions={false}
              value={queryFilter.indice}
              onChange={(e) => {
                setQueryFilter({ ...queryFilter, indice: e.value });
              }}
              placeholder="Tất cả"
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <SelectBox
              label="Ngành"
              dataSource={``} //chưa có api
              mapping={{ value: "id", label: "name" }}
              value={queryFilter.department}
              onChange={(e) => {
                setQueryFilter({ ...queryFilter, department: e.value });
              }}
              placeholder="Tất cả"
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Input
              label="Mã dữ liệu"
              placeholder="Nhập mã dữ liệu"
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
              label="Tên dữ liệu"
              placeholder="Nhập tên dữ liệu"
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
              isDisabled={selectedDataSrc === null}
            />
          </Grid>
          <ButtonControl
            submitText="Lưu"
            justifyContent="center"
            handleCancel={() => setIsAddPopup(false)}
            handleSubmit={() => {
              if (selectedDataSrc) handleUpdateCategory();
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
          placeholder="Nhập mã, tên nguồn dữ liệu"
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
              "CATEGORY_MANAGEMENT_TAB_ADD_DATA_SOURCE",
            ]}
          >
            <ButtonControl
              hiddenCancel
              submitText="Thêm mới"
              imageSubmit={WhitePlusIcon}
              handleSubmit={() => {
                setAddParams(addCategoryData);
                setSelectedDataSrc(null);
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
              isMulti
              options={searchFieldList.parentList}
              value={queryFilter.group}
              onChange={(e) => {
                setQueryFilter({ ...queryFilter, group: e });
              }}
              placeholder="Tất cả"
              isHaveAllOptions={false}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <SelectBox
              label="Chỉ tiêu"
              isMulti
              options={searchFieldList.childrenList}
              value={queryFilter.indice}
              onChange={(e) => {
                setQueryFilter({ ...queryFilter, indice: e });
              }}
              placeholder="Tất cả"
              isHaveAllOptions={false}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <SelectBox
              label="Ngành"
              dataSource={``} //chưa có api
              mapping={{ value: "id", label: "name" }}
              value={queryFilter.department}
              onChange={(e) => {
                setQueryFilter({ ...queryFilter, department: e.value });
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
          "CATEGORY_MANAGEMENT_TAB_DATA_SOURCE_TABLE",
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
