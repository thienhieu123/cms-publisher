import { Checkbox, Grid, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import SearchInput from "~/components/SearchInput";
import SelectBox from "~/components/SelectBox";
import ButtonFilter from "~/components/ButtonFilter";
import Table from "~/examples/Tables/Table";
import { handleResponse, renderStatusTag } from "~/utils/utils";
import WhitePlusIcon from "~/assets/images/icons/white-plus.svg";
import RedPeopleIcon from "~/assets/images/icons/red-people-setting.svg";
import SuiTypography from "~/components/SuiTypography";
import SuiBox from "~/components/SuiBox";
import PopupRoot from "~/components/Popup/PopupRoot";
import { RoleDetail } from "./RoleDetail";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import { DeleteIconButton, LocknUnLockIconButton, ViewDetailIconButton } from "~/components/Button";
import {
  createRole,
  getListRoles,
  getRoleDetail,
  getRolePermissionByUserId,
  removeRole,
  updateRole,
  updateRolePermission,
} from "~/api/common";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import { managementRoleStatus } from "~/constants/config";
import useErrorMessage from "~/hooks/useErrorMessage";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã vai trò",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên vai trò",
    sortable: true,
    align: "center",
  },
  {
    name: "Mô tả",
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
    sortable: true,
    align: "center",
  },
];

const columnsPermission = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên module",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên chức năng",
    sortable: true,
    align: "center",
  },
  {
    name: "Xem tất cả",
    sortable: false,
    align: "center",
  },
  {
    name: "Xem",
    sortable: false,
    align: "center",
  },
  {
    name: "Thêm",
    sortable: false,
    align: "center",
  },
  {
    name: "Xóa",
    sortable: false,
    align: "center",
  },
  {
    name: "Sửa",
    sortable: false,
    align: "center",
  },
];

const allowance_features = [
  {
    id: "home",
    label: "Trang chủ",
    children: [],
  },
  {
    id: "report",
    label: "Báo cáo",
    children: [],
  },
  {
    id: "charts",
    label: "Biểu đồ",
    children: [],
  },
  {
    id: "data",
    label: "Thống kê số liệu",
    children: [],
  },
  {
    id: "admin",
    label: "Quản trị",
    children: [
      { id: "user", label: "Người dùng" },
      { id: "role", label: "Vai trò" },
      { id: "unit", label: "Đơn vị" },
      { id: "category", label: "Danh mục" },
    ],
  },
];

const initialValues = {
  page: 0,
  size: 20,
  total: 0,
  searchText: "",
  status: "",
};

const initialPermissionFilter = {
  page: 0,
  size: 20,
  total: 0,
  searchText: "",
  moduleId: "",
};
export default function RoleList() {
  const navigate = useNavigate();
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [isOpenPermissionFilter, setIsOpenPermissionFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [permissionFilter, setPermissionFilter] = useState(initialPermissionFilter);
  const [isAddRole, setIsAddRole] = useState(false);
  const [isLockRole, setIsLockRole] = useState(false);
  const [isUnlockRole, setIsUnlockRole] = useState(false);
  const [isUpdateRole, setUpdateRole] = useState(false);
  const [isDecentralization, setIsDecentralization] = useState(false);
  const [isRemoveRole, setIsRemoveRole] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [listRoles, setListRoles] = useState([]);
  // const [listPermission, setListPermission] = useState([]);
  const [storePermission, setStorePermission] = useState();
  const [currentRole, setCurrentRole] = useState();
  const [roleInfo, setRoleInfo] = useState({
    roleCode: "",
    roleName: "",
    description: "",
  });

  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();

  const handleLockUser = (status) => {
    status === "INACTIVATED" ? setIsUnlockRole(true) : setIsLockRole(true);
  };
  const handleSelectedItemsChange = (event, ids) => {
    setSelectedItems(ids);
  };

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  const renderGroupBtn = (status, id) => {
    return (
      <Grid container onClick={() => setCurrentRole(id)} ishiddentooltip="true">
        <SuiTypography component="span" sx={{ display: "flex", width: "200" }}>
          <ViewDetailIconButton onClick={() => setUpdateRole(true)} />
          <IconButton>
            <Tooltip title="Phân quyền" placement="top">
              <SuiBox
                component="img"
                src={RedPeopleIcon}
                alt="phân quyền icon"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user-management/user-permission/${id}`);
                  // setIsDecentralization(true);
                  setCurrentRole(id);
                }}
              />
            </Tooltip>
          </IconButton>
          <LocknUnLockIconButton
            status={status}
            handleClick={(status) => {
              setCurrentRole(id);
              handleLockUser(status);
            }}
          />
          <DeleteIconButton onClick={() => setIsRemoveRole(true)} />
        </SuiTypography>
      </Grid>
    );
  };

  const handleCreateRole = (params) => {
    createRole(params.roleCode, params.roleName, params.description).then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Tạo mới vai trò thành công");
        setIsAddRole(false);
        fetchData();
      } else {
        setErrorMessage(dataResponse);
      }
    });
  };
  const addRolePopup = () => {
    return (
      <PopupRoot
        title="Thêm mới vai trò"
        open={isAddRole}
        setOpen={setIsAddRole}
        classNames={"small-popup"}
      >
        <RoleDetail setOpen={setIsAddRole} handleCreate={handleCreateRole} />
      </PopupRoot>
    );
  };

  const handleUpdateRole = (params) => {
    updateRole(currentRole, params.roleCode, params.roleName, params.description).then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Cập nhật vai trò thành công");
        setUpdateRole(false);
        fetchData();
      } else {
        setErrorMessage(dataResponse);
      }
    });
  };
  const updateRolePopup = () => {
    return (
      <PopupRoot title="Cập nhật vai trò" open={isUpdateRole} setOpen={setUpdateRole}>
        <RoleDetail
          setOpen={setUpdateRole}
          isUpdate
          initialProps={roleInfo}
          handleUpdate={handleUpdateRole}
        />
      </PopupRoot>
    );
  };

  const handleUnlockRole = () => {
    updateRole(
      currentRole,
      roleInfo?.roleCode,
      roleInfo?.roleName,
      roleInfo?.description,
      "ACTIVATED"
    ).then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Mở khóa vai trò thành công");
        setIsUnlockRole(false);
        fetchData();
      } else {
        setErrorMessage(dataResponse);
      }
    });
  };
  const unlockRolePopup = () => {
    return (
      <ConfirmPopup
        open={isUnlockRole}
        setOpen={setIsUnlockRole}
        questionText="Bạn có đồng ý mở khóa vai trò này?"
        NotiText="Vai trò sẽ được mở khóa trên hệ thống"
        handleSubmit={handleUnlockRole}
      />
    );
  };

  const handleLockRole = () => {
    updateRole(
      currentRole,
      roleInfo?.roleCode,
      roleInfo?.roleName,
      roleInfo?.description,
      "INACTIVATED"
    ).then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Khóa vai trò thành công");
        setIsLockRole(false);
        fetchData();
      } else {
        setErrorMessage(dataResponse);
      }
    });
  };
  const lockRolePopup = () => {
    return (
      <ConfirmPopup
        open={isLockRole}
        setOpen={setIsLockRole}
        questionText="Bạn có đồng ý khóa vai trò này ?"
        NotiText="Vai trò sẽ bị khóa khỏi hệ thống"
        handleSubmit={handleLockRole}
      />
    );
  };

  const handleRemoveRole = () => {
    removeRole(currentRole).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Xóa vai trò thành công");
        setIsRemoveRole(false);
        fetchData();
      }
    });
  };
  const removeUserPopup = () => {
    return (
      <ConfirmPopup
        open={isRemoveRole}
        setOpen={setIsRemoveRole}
        questionText="Bạn có đồng ý xóa vai trò này?"
        NotiText="Vai trò sẽ bị xóa khỏi hệ thống"
        handleSubmit={handleRemoveRole}
      />
    );
  };

  const handleClearPermissionFilter = () => {
    setPermissionFilter(initialPermissionFilter);
  };

  const isChecked = (code, arr) => {
    const item = arr.find((item) => item.code === code);
    return item?.isChecked;
  };

  const renderPermissionCheckBox = (checkValue, header, index, disabled) => (
    <Checkbox
      tooltip={header}
      title={header}
      size="string"
      key={"checkbox".concat(index)}
      checked={checkValue}
      disabled={disabled}
      sx={{
        margin: "0px",
        borderColor: "#F10035",
        "&.Mui-checked": {
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e")`,
          backgroundColor: "#F10035",
        },

        "&.Mui-disabled": {
          backgroundColor: "#c9c9c9",
          cursor: "not-allowed",
        },
      }}
      onChange={() => {
        const newPermission = storePermission[index].jobs.map((item) => {
          if (item.code === header) item.isChecked = !checkValue;
          return item;
        });

        storePermission[index].jobs = newPermission;
        setStorePermission([...storePermission]);
      }}
    />
  );

  const checkUnablePermission = (moduleCode, tabCode) => {
    if (moduleCode === "HOME_PAGE" || tabCode === "ADMINISTRATION_ROLES") {
      return true;
    }
    return false;
  };
  const formatPermission = (arr) => {
    const res = arr?.map((item, index) => {
      return {
        STT: permissionFilter.page * permissionFilter.size + index + 1,
        "Tên module": item.sysFunction.sysModule.name,
        "Tên chức năng": item.sysFunction.name,
        "Xem tất cả": renderPermissionCheckBox(
          isChecked("VIEW_ALL", item.jobs),
          "VIEW_ALL",
          index,
          checkUnablePermission(item.sysFunction.sysModule.code, item.sysFunction.code)
        ),
        Xem: renderPermissionCheckBox(
          isChecked("VIEW", item.jobs),
          "VIEW",
          index,
          checkUnablePermission(item.sysFunction.sysModule.code, item.sysFunction.code)
        ),
        Thêm: renderPermissionCheckBox(
          isChecked("CREATE", item.jobs),
          "CREATE",
          index,
          checkUnablePermission(item.sysFunction.sysModule.code, item.sysFunction.code)
        ),
        Xóa: renderPermissionCheckBox(
          isChecked("DELETE", item.jobs),
          "DELETE",
          index,
          checkUnablePermission(item.sysFunction.sysModule.code, item.sysFunction.code)
        ),
        Sửa: renderPermissionCheckBox(
          isChecked("UPDATE", item.jobs),
          "UPDATE",
          index,
          checkUnablePermission(item.sysFunction.sysModule.code, item.sysFunction.code)
        ),
      };
    });
    return res || [];
  };

  const fetchPermission = () => {
    const { page, size, searchText, moduleId } = permissionFilter;
    getRolePermissionByUserId(currentRole, page, size, searchText, moduleId).then((res) => {
      if (res.success && res.message.status === 200) {
        console.log("res:", res.message.data.data.rows);
        setStorePermission(res.message.data.data.rows);
        setPermissionFilter({
          ...permissionFilter,
          total: res.message.data.data.rowCount,
        });
      }
    });
  };

  const listPermission = formatPermission(storePermission);

  useEffect(() => {
    if (currentRole) fetchPermission();
  }, [currentRole, permissionFilter.page, permissionFilter.size]);

  const handleUpdatePermission = () => {
    updateRolePermission(currentRole, storePermission).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Cập nhật phân quyền thành công");
        setIsDecentralization(false);
      }
    });
  };

  const decentralizationPopup = () => {
    return (
      <PopupRoot
        title="Phân quyền chức năng"
        open={isDecentralization}
        setOpen={setIsDecentralization}
        callbackFn={() => setCurrentRole(null)}
      >
        <Grid container p={1}>
          <Grid item xs={12} sm={8} ml={2}>
            <SearchInput
              isOpenFilter={isOpenPermissionFilter}
              setIsOpenFilter={setIsOpenPermissionFilter}
              placeholder="Nhập tên chức năng"
              searchText={permissionFilter?.searchText}
              onChange={(e) =>
                setPermissionFilter({ ...permissionFilter, searchText: e.target.value })
              }
              submit={fetchPermission}
            />
          </Grid>
          {isOpenPermissionFilter && (
            <Grid
              container
              item
              xs={12}
              lg={12}
              columnSpacing={4}
              spacing={1}
              pb={2}
              mt={1}
              ml={"-15px"}
            >
              <Grid item xs={12} sm={6} lg={4} xl={4}>
                <SelectBox
                  label="Tên module"
                  value={permissionFilter.moduleId}
                  onChange={(e) => setPermissionFilter({ ...permissionFilter, moduleId: e.value })}
                  dataSource="/sys-categories/list"
                  mapping={{ value: "id", label: "name" }}
                  placeholder="Tất cả"
                  required={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4} xl={4}>
                <ButtonFilter onSearch={fetchPermission} onClear={handleClearPermissionFilter} />
              </Grid>
            </Grid>
          )}
          <Grid item xs={12}>
            <Table
              size="13px"
              columns={columnsPermission}
              rows={listPermission}
              borderRadius="1rem 1rem 0 0"
              rowsCount={permissionFilter.size}
              curPage={permissionFilter.page}
              setRowsCount={(rowCount) =>
                setPermissionFilter({
                  ...permissionFilter,
                  size: rowCount,
                  page: 0,
                })
              }
              setCurPage={(nextPage) =>
                setPermissionFilter({
                  ...permissionFilter,
                  page: nextPage,
                })
              }
              totalElements={permissionFilter.total}
            />
          </Grid>

          <ButtonControl
            handleCancel={() => {
              setIsDecentralization(false);
              setCurrentRole(null);
            }}
            handleSubmit={handleUpdatePermission}
            submitText="Xác nhận"
            isHideImageSubmit
            justifyContent="center"
          />
        </Grid>
      </PopupRoot>
    );
  };

  const formatData = (arr) => {
    const res = arr.map((item, index) => {
      return {
        STT: queryFilter.page * queryFilter.size + index + 1,
        "Mã vai trò": item.roleCode,
        "Tên vai trò": item.roleName,
        "Mô tả": item.description,
        "Trạng thái": renderStatusTag(item.status),
        "Hành động": renderGroupBtn(item.status, item.id),
      };
    });

    return res;
  };

  const fetchData = () => {
    const { page, size, searchText, status } = queryFilter;
    getListRoles(page, size, searchText, status).then((res) => {
      if (res.success && res.message.status === 200) {
        const formatList = formatData(res.message.data.data.rows);
        setListRoles(formatList);
        setQueryFilter({ ...queryFilter, total: res.message.data.data.rowCount });
      }
    });
  };

  useEffect(() => {
    fetchData();
    return () => {
      setListRoles([]);
    };
  }, [queryFilter.page, queryFilter.size]);

  const handleClearFilter = () => {
    setQueryFilter(initialValues);
  };

  useEffect(() => {
    if (currentRole) {
      getRoleDetail(currentRole).then((res) => {
        if (res.success && res.message.status === 200) {
          setRoleInfo(res.message.data.data);
        }
      });
    }
  }, [currentRole]);

  useEnterKeyEvent([], fetchData);

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} sm={12} lg={12} spacing={1}>
        {addRolePopup()}
        {lockRolePopup()}
        {unlockRolePopup()}
        {decentralizationPopup()}
        {removeUserPopup()}
        {updateRolePopup()}
        <Grid item xs={12} sm={8} lg={5}>
          <SearchInput
            isOpenFilter={isOpenFilter}
            setIsOpenFilter={setIsOpenFilter}
            placeholder="Nhập mã, tên vai trò"
            searchText={queryFilter?.searchText}
            onChange={(e) => setQueryFilter({ ...queryFilter, searchText: e.target.value })}
            submit={fetchData}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={7} justifyContent="end" alignItems="center">
          <ButtonControl
            hiddenCancel
            submitText="Thêm mới"
            imageSubmit={WhitePlusIcon}
            handleSubmit={() => setIsAddRole(true)}
          />
        </Grid>
        {isOpenFilter && (
          <Grid container item xs={12} lg={12} columnSpacing={4} spacing={1} pb={2} mt={1}>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <SelectBox
                label="Trạng thái"
                value={queryFilter.status}
                onChange={(e) => handleChange("status", e.value)}
                options={managementRoleStatus}
                placeholder="Tất cả"
                required={false}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <ButtonFilter onSearch={fetchData} onClear={handleClearFilter} />
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Table
          size="13px"
          tablePadding
          columns={columns}
          rows={listRoles}
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
      </Grid>
    </Grid>
  );
}
