import { Box, Card, Checkbox, Divider, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import ButtonFilter from "~/components/ButtonFilter";
import Input from "~/components/Input";
import SelectBox from "~/components/SelectBox";
import SuiBox from "~/components/SuiBox";
import Table from "~/examples/Tables/Table";
import EditIcon from "~/assets/images/icons/edit-icon.svg";
import WhitePlusIcon from "~/assets/images/icons/white-plus.svg";
import { formatUnitTree, renderStatusTag } from "~/utils/utils";
import SuiTypography from "~/components/SuiTypography";
import DeleteIcon from "~/assets/images/icons/red-trash-bin.svg";
import LockIcon from "~/assets/images/icons/red-lock.svg";
import UnLockIcon from "~/assets/images/icons/black-unlock.svg";
import SettingIcon from "~/assets/images/icons/red-people-setting.svg";
import PopupRoot from "~/components/Popup/PopupRoot";
import Confirm from "~/assets/images/icons/yellow-confirm.svg";
import TreeView from "~/components/TreeView/TreeView";
import { isRequired, verifyEmail, verifyPhoneNumber } from "~/utils/verify";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import SearchInput from "~/components/SearchInput";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import { DeleteIconButton, LocknUnLockIconButton, ViewDetailIconButton } from "~/components/Button";
import {
  createUnit,
  getListUser,
  getRolePermissionByUserId,
  getUnitTree,
  removeUnit,
  updateUnit,
} from "~/api/common";
import { managementUnitStatus, managementUserStatus } from "~/constants/config";
import TreeSelect from "~/components/TreeSelect";
import { RichTreeView } from "@mui/x-tree-view";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import PermissionWrapped from "~/components/PermissionWrapped";

const userColumns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên đăng nhập",
    sortable: true,
    align: "center",
  },
  {
    name: "Họ và tên",
    sortable: true,
    align: "center",
  },
  {
    name: "Vai trò",
    sortable: true,
    align: "center",
  },
  {
    name: "Cơ quan chuyên trách",
    sortable: true,
    align: "center",
  },
  {
    name: "Chức vụ",
    sortable: true,
    align: "center",
  },
  {
    name: "Email",
    sortable: true,
    align: "center",
  },
  {
    name: "Số điện thoại",
    sortable: true,
    align: "center",
  },
  // {
  //   name: "Người tạo",
  //   sortable: true,
  //   align: "center",
  // },
  {
    name: "Trạng thái",
    sortable: true,
    align: "center",
  },
  // {
  //   name: "Hành động",
  //   sortable: true,
  //   align: "center",
  // },
];

const unitColumns = [
  {
    name: "Tên đơn vị",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã đơn vị",
    sortable: true,
    align: "center",
  },
  {
    name: "Trạng thái",
    sortable: true,
    align: "center",
  },
  {
    name: "Thao tác",
    sortable: false,
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
    name: "Truy cập",
    sortable: false,
    align: "center",
  },
];

const initialValues = {
  page: 0,
  size: 20,
  total: 0,
  searchText: "",
  roleId: "",
  status: "",
};

const addUnitData = {
  unitCode: "",
  unitName: "",
  unitParent: "",
  status: "ACTIVATED",
  phoneNumber: "",
  email: "",
  address: "",
};

const initialPermissionFilter = {
  page: 0,
  size: 20,
  total: 0,
  searchText: "",
  groupId: "",
};

export default function UnitList() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [isOpenPermissionFilter, setIsOpenPermissionFilter] = useState(true);
  const [listPermission, setListPermission] = useState([]);
  const [storePermission, setStorePermission] = useState();
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [permissionFilter, setPermissionFilter] = useState(initialPermissionFilter);
  const [addParams, setAddParams] = useState(addUnitData);
  const [isLockUnit, setIsLockUnit] = useState(false);
  const [isUnlockUnit, setIsUnlockUnit] = useState(false);
  const [isAddUnit, setIsAddUnit] = useState(false);
  const [isRemoveUnit, setIsRemoveUnit] = useState(false);
  const [isAllowance, setIsAllowance] = useState(false);
  const [unitSelectedId, setUnitSelectedId] = useState(null);
  const [unitTree, setUnitTree] = useState([]);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [currentListUser, setCurrentListUser] = useState([]);
  const [toggleSearch, setToggleSearch] = useState(false);
  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  // const renderUserGroupBtn = (status, id) => {
  //   return (
  //     <Grid container ishiddentooltip="true">
  //       <SuiTypography component="span" sx={{ display: "flex", width: "100px" }}>
  //         <Grid item>
  //           <ViewDetailIconButton onClick={() => navigate(`/user-management/${id}`)} />
  //         </Grid>
  //         <Grid item>
  //           <LocknUnLockIconButton status={status} handleClick={() => handleLockUnit(status)} />
  //         </Grid>
  //         <Grid item>
  //           <DeleteIconButton />
  //         </Grid>
  //       </SuiTypography>
  //     </Grid>
  //   );
  // };

  const renderUnitGroupBtn = (status, id, unit) => {
    return (
      <Grid container ishiddentooltip="true" onClick={() => setUnitSelectedId(id)}>
        <SuiTypography component="span" sx={{ display: "flex", width: "140px" }}>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "UNIT_MANAGEMENT_TAB",
              "UNIT_MANAGEMENT_TAB_EDIT_ICON",
            ]}
          >
            <IconButton
              onClick={() => {
                setAddParams({
                  unitCode: unit.code,
                  unitName: unit.name,
                  unitParent: unit.parentCode,
                  status: unit.status,
                  phoneNumber: unit.phoneNumber,
                  email: unit.email,
                  address: unit.address,
                });
                setIsAddUnit(true);
              }}
            >
              <Tooltip title="Chỉnh sửa" placement="top">
                <SuiBox component="img" src={EditIcon} alt="EditIcon" />
              </Tooltip>
            </IconButton>
          </PermissionWrapped>

          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "UNIT_MANAGEMENT_TAB",
              "UNIT_MANAGEMENT_TAB_LOCK_ICON",
            ]}
          >
            <Grid item>
              <IconButton
                onClick={() => {
                  if (status === "ACTIVATED") setIsLockUnit(true);
                  else setIsUnlockUnit(true);
                }}
              >
                <Tooltip title={status === "ACTIVATED" ? "Khóa" : "Mở khóa"} placement="top">
                  <SuiBox
                    component="img"
                    src={status === "ACTIVATED" ? UnLockIcon : LockIcon}
                    alt="Lock/Unlock"
                  />
                </Tooltip>
              </IconButton>
            </Grid>
          </PermissionWrapped>

          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "UNIT_MANAGEMENT_TAB",
              "UNIT_MANAGEMENT_TAB_DELETE_ICON",
            ]}
          >
            <Grid item>
              <IconButton onClick={() => setIsRemoveUnit(true)}>
                <Tooltip title="Xóa" placement="top">
                  <SuiBox component="img" src={DeleteIcon} alt="DeleteIcon" />
                </Tooltip>
              </IconButton>
            </Grid>
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "UNIT_MANAGEMENT_TAB",
              "UNIT_MANAGEMENT_TAB_PERMISSION_ICON",
            ]}
          >
            <Grid item display={"flex"}>
              <IconButton onClick={() => setIsAllowance(true)}>
                <Tooltip title="Phân quyền" placement="top">
                  <SuiBox component="img" src={SettingIcon} alt="SettingIcon" />
                </Tooltip>
              </IconButton>
            </Grid>
          </PermissionWrapped>
        </SuiTypography>
      </Grid>
    );
  };

  const findCurrentUnit = (arr, id) => {
    const curUnit = arr.find((item) => item.id === id);
    setCurrentUnit({
      id: curUnit.id,
      "Tên đơn vị": curUnit.name,
      "Mã đơn vị": curUnit.code,
      "Trạng thái": renderStatusTag(curUnit.status, managementUnitStatus),
      "Thao tác": renderUnitGroupBtn(curUnit.status, curUnit.id, curUnit),
    });
  };

  const handleLockUnit = () => {
    updateUnit(
      currentUnit.id,
      undefined,
      undefined,
      "INACTIVATED",
      undefined,
      undefined,
      undefined,
      undefined
    ).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Khóa đơn vị thành công");
        setIsLockUnit(false);
        fetchData((arr) => findCurrentUnit(arr, currentUnit.id));
      } else {
        setErrorMessage("Khóa đơn vị thất bại");
      }
    });
  };

  const lockUnitPopup = () => {
    return (
      <PopupRoot open={isLockUnit} setOpen={setIsLockUnit}>
        <Grid container px={3} pb={3} display="flex" direction="column">
          <Grid item xs={12} lg={12} mb={2}>
            <SuiBox component="img" src={Confirm} mb={1} />
            <Typography fontSize="18px" fontWeight={700}>
              Bạn có đồng ý khóa đơn vị này?
            </Typography>
            <Typography fontSize="14px" fontWeight={400}>
              Đơn vị bị khóa sẽ không được gán tên người dùng
            </Typography>
          </Grid>
          <ButtonControl
            justifyContent="center"
            cancelText="Hủy"
            submitText="Đồng ý"
            handleCancel={() => setIsLockUnit(false)}
            handleSubmit={handleLockUnit}
          />
        </Grid>
      </PopupRoot>
    );
  };

  const handleUnlockUnit = () => {
    updateUnit(
      currentUnit.id,
      undefined,
      undefined,
      "ACTIVATED",
      undefined,
      undefined,
      undefined,
      undefined
    ).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Mở khóa đơn vị thành công");
        setIsUnlockUnit(false);
        fetchData((arr) => findCurrentUnit(arr, currentUnit.id));
      } else {
        setErrorMessage("Mở khóa đơn vị thất bại");
      }
    });
  };

  const unlockUnitPopup = () => {
    return (
      <PopupRoot open={isUnlockUnit} setOpen={setIsUnlockUnit} closeIcon>
        <Grid container px={3} pb={3} display="flex" direction="column">
          <Grid item xs={12} lg={12} mb={2}>
            <SuiBox component="img" src={Confirm} mb={1} />
            <Typography fontSize="18px" fontWeight={700}>
              Bạn có đồng ý mở khóa đơn vị này ?
            </Typography>
            <Typography fontSize="14px" fontWeight={400}>
              Đơn vị được mở khóa sẽ được gán tên người dùng vào
            </Typography>
          </Grid>
          <ButtonControl
            justifyContent="center"
            cancelText="Hủy"
            submitText="Đồng ý"
            handleCancel={() => setIsUnlockUnit(false)}
            handleSubmit={handleUnlockUnit}
          />
        </Grid>
      </PopupRoot>
    );
  };

  const handleRemoveUnit = () => {
    removeUnit(currentUnit.id).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Xóa đơn vị thành công");
        setIsRemoveUnit(false);
        setCurrentUnit(null);
        fetchData();
      }
    });
  };

  const removeUnitPopup = () => {
    return (
      <ConfirmPopup
        open={isRemoveUnit}
        setOpen={setIsRemoveUnit}
        questionText="Bạn có đồng ý xóa đơn vị này?"
        NotiText="Đơn vị sẽ bị xóa khỏi hệ thống"
        handleSubmit={handleRemoveUnit}
      />
    );
  };

  const verifyAddInfo = () => {
    try {
      isRequired(addParams.unitCode, "Mã đơn vị");
      isRequired(addParams.unitName, "Tên đơn vị");
      verifyEmail(addParams.email);
      verifyPhoneNumber(addParams.phoneNumber);
    } catch (e) {
      setErrorMessage(e);
    }
  };

  const handleAddUnit = () => {
    verifyAddInfo();
    createUnit(
      addParams.unitCode,
      addParams.unitName,
      addParams.status,
      addParams.unitParent,
      addParams.phoneNumber,
      addParams.email,
      addParams.address
    ).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Tạo đơn vị thành công");
        setIsAddUnit(false);
        fetchData();
      } else {
        console.log(res.message?.data?.error?.response?.message[0]);
        setErrorMessage(res.message?.data?.error?.response?.message[0]);
      }
    });
  };

  const handleUpdateUnit = () => {
    verifyAddInfo();
    updateUnit(
      currentUnit.id,
      addParams.unitCode,
      addParams.unitName,
      addParams.status,
      addParams.unitParent,
      addParams.phoneNumber,
      addParams.email,
      addParams.address
    ).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Cập nhật đơn vị thành công");
        setIsAddUnit(false);
        fetchData((arr) => findCurrentUnit(arr, currentUnit.id));
      } else {
        setErrorMessage("Cập nhật đơn vị thất bại");
      }
    });
  };

  const handleClearPermissionFilter = () => {
    setPermissionFilter(initialPermissionFilter);
  };

  const isChecked = (title, arr) => {
    const item = arr.find((item) => item.name === title);
    return item?.isChecked;
  };

  const renderPermissionCheckBox = (checkValue, header, index) => (
    <Checkbox
      tooltip={header}
      title={header}
      size="string"
      key={"checkbox".concat(index)}
      checked={checkValue}
      sx={{
        margin: "0px",
        borderColor: "#F10035",
        "&.Mui-checked": {
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -1 22 22'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e")`,
          backgroundColor: "#F10035",
        },
      }}
      onChange={() => {
        const newPermission = storePermission[index].jobs.map((item) => {
          if (item.name === header) item.isChecked = !checkValue;
          return item;
        });

        storePermission[index] = newPermission;
        setStorePermission([...storePermission]);
      }}
    />
  );

  const formatPermission = (arr) => {
    const res = arr.map((item, index) => {
      return {
        STT: permissionFilter.page * permissionFilter.size + index + 1,
        "Tên nhóm chỉ tiêu": item.sysCategory.group,
        "Tên chỉ tiêu": item.sysCategory.name,
        "Truy cập": renderPermissionCheckBox(isChecked("Truy cập", item.jobs), "Truy cập", index),
      };
    });

    return res;
  };

  const fakeListPermission = [
    {
      jobs: [
        {
          name: "Truy cập",
          isChecked: true,
        },
      ],
      sysCategory: {
        group: "Quy mô kinh tế số",
        name: "Tỷ trọng giá trị tăng thêm",
      },
    },
    {
      jobs: [
        {
          name: "Truy cập",
          isChecked: true,
        },
      ],
      sysCategory: {
        group: "Quy mô kinh tế số",
        name: "Chi cho chuyển đổi số",
      },
    },
    {
      jobs: [
        {
          name: "Truy cập",
          isChecked: true,
        },
      ],
      sysCategory: {
        group: "Quy mô kinh tế số",
        name: "Tỷ lệ chi cho nghiên cứu",
      },
    },
    {
      jobs: [
        {
          name: "Truy cập",
          isChecked: true,
        },
      ],
      sysCategory: {
        group: "Quy mô kinh tế số",
        name: "Số doanh nghiệp công",
      },
    },
    {
      jobs: [
        {
          name: "Truy cập",
          isChecked: true,
        },
      ],
      sysCategory: {
        group: "Quy mô kinh tế số",
        name: "Doanh thu dịch vụ viễn thông",
      },
    },
    {
      jobs: [
        {
          name: "Truy cập",
          isChecked: true,
        },
      ],
      sysCategory: {
        group: "Hạ tầng số",
        name: "Dung lượng băng thông",
      },
    },
    {
      jobs: [
        {
          name: "Truy cập",
          isChecked: true,
        },
      ],
      sysCategory: {
        group: "Hạ tầng số",
        name: "Tỷ lệ hộ gia đình có máy tính",
      },
    },
    {
      jobs: [
        {
          name: "Truy cập",
          isChecked: true,
        },
      ],
      sysCategory: {
        group: "Hạ tầng số",
        name: "Tỷ lệ dân số được phủ sóng",
      },
    },
    {
      jobs: [
        {
          name: "Truy cập",
          isChecked: true,
        },
      ],
      sysCategory: {
        group: "Hạ tầng số",
        name: "Lưu lượng internet",
      },
    },
    {
      jobs: [
        {
          name: "Truy cập",
          isChecked: true,
        },
      ],
      sysCategory: {
        group: "Hạ tầng số",
        name: "Phạm vi phủ sóng mạng internet",
      },
    },
  ];

  const fetchPermission = () => {
    const { page, size, searchText, groupId } = permissionFilter;
    getRolePermissionByUserId(currentUnit.id, page, size, searchText, groupId).then((res) => {
      if (res.success && res.message.status === 200) {
        // console.log("res:", res.message.data.data[0].permissionOnCategories);
        // const formatData = formatPermission(res.message.data.data[0].permissionOnCategories);
        const formatData = formatPermission(fakeListPermission);
        setListPermission(formatData);
        // setStorePermission(res.message.data.data[0].permissionOnCategories);
        // setPermissionFilter({
        //   ...permissionFilter,
        //   total: res.message.data.data[0].permissionOnCategories.length,
        // });
      }
    });
  };
  useEffect(() => {
    if (currentUnit) fetchPermission();
  }, [currentUnit, permissionFilter.page, permissionFilter.size]);

  const handleUpdatePermission = () => {
    updateRolePermission(currentUnit.id, storePermission).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Cập nhật phân quyền thành công");
        setIsAllowance(false);
      }
    });
  };

  const permissionPopup = () => {
    return (
      <PopupRoot title="Phân quyền truy cập dữ liệu" open={isAllowance} setOpen={setIsAllowance}>
        <Grid container p={1}>
          <Grid item xs={12} sm={8} ml={2}>
            <SearchInput
              isOpenFilter={isOpenPermissionFilter}
              setIsOpenFilter={setIsOpenPermissionFilter}
              placeholder="Nhập tên chỉ tiêu"
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
                  label="Nhóm chỉ tiêu"
                  value={permissionFilter.groupId}
                  onChange={(e) => setPermissionFilter({ ...permissionFilter, groupId: e.value })}
                  dataSource="/stats-index-groups/list"
                  mapping={{ value: "id", label: "name" }}
                  placeholder="Tất cả"
                  required={false}
                  width="100%"
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
              tablePadding
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
            handleCancel={() => setIsAllowance(false)}
            handleSubmit={handleUpdatePermission}
            submitText="Xác nhận"
            isHideImageSubmit
            justifyContent="center"
          />
        </Grid>
      </PopupRoot>
    );
  };

  const addUnitPopup = () => {
    return (
      <PopupRoot
        title={unitSelectedId !== null ? "Cập nhật đơn vị" : "Thêm mới đơn vị"}
        open={isAddUnit}
        setOpen={setIsAddUnit}
        classNames="small-popup"
        closeIcon
      >
        <Grid container p={2} rowSpacing={1}>
          <Grid item xs={12} lg={12}>
            <Input
              label="Mã đơn vị"
              placeholder="Nhập mã đơn vị"
              value={addParams.unitCode}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  unitCode: e.target.value,
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Input
              label="Tên đơn vị"
              placeholder={"Nhập tên đơn vị"}
              value={addParams.unitName}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  unitName: e.target.value,
                })
              }
              required
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <TreeSelect
              label="Đơn vị cấp trên"
              data={unitTree}
              placeholder="Chọn đơn vị cấp trên"
              required={false}
              value={addParams.unitParent}
              width="100%"
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  unitParent: e,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <SelectBox
              label="Trạng thái"
              options={managementUnitStatus}
              placeholder="Chọn trạng thái"
              width="100%"
              isDisabled={!unitSelectedId}
              value={addParams.status}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  status: e.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Input
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={addParams.phoneNumber}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  phoneNumber: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Input
              label="Email"
              placeholder="Nhập email"
              value={addParams.email}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  email: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} lg={12} mb={"28px"}>
            <Input
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
              value={addParams.address}
              onChange={(e) =>
                setAddParams({
                  ...addParams,
                  address: e.target.value,
                })
              }
            />
          </Grid>
          <ButtonControl
            submitText="Lưu"
            justifyContent="center"
            handleCancel={() => setIsAddUnit(false)}
            handleSubmit={() => {
              if (unitSelectedId) handleUpdateUnit();
              else handleAddUnit();
            }}
          />
        </Grid>
      </PopupRoot>
    );
  };

  const fetchData = (cb) => {
    getUnitTree().then((result) => {
      if (result?.success && result?.message?.status === 200) {
        const listUnit = formatUnitTree(result.message.data.data.children);
        setUnitTree(listUnit);
        if (cb) cb(listUnit);
      }
    });
  };

  useEffect(() => {
    fetchData();
    return () => {
      setUnitTree([]);
    };
  }, []);

  const formatData = (arr) => {
    const res = arr.map((item, idx) => {
      return {
        STT: queryFilter.page * 10 + idx + 1,
        "Tên đăng nhập": item.username,
        "Họ và tên": item.profile.fullname,
        "Vai trò": (
          <Tooltip title={item?.roleNames?.join(",") || ""} placement="top">
            <Typography fontSize={13} className="tooltip-content" width={200}>
              {item?.roleNames?.join(", ")}
            </Typography>
          </Tooltip>
        ),
        "Cơ quan chuyên trách": item.profile?.position?.unit?.name,
        "Chức vụ": item.profile?.position?.positionName,
        Email: item.profile.email,
        // "Người tạo": "Admin",
        "Số điện thoại": item.profile.phoneNumber,
        "Trạng thái": renderStatusTag(item.status, managementUserStatus),
        // "Hành động": renderUserGroupBtn(item.status, item.id),
      };
    });

    return res;
  };

  useEffect(() => {
    if (currentUnit) {
      const { page, size, searchText, status, roleId } = queryFilter;
      getListUser(page, size, searchText, currentUnit.id, roleId, undefined, status).then(
        (result) => {
          if (result?.success && result?.message?.status === 200) {
            const formatList = formatData(result.message.data.data.rows);
            setCurrentListUser(formatList);
            setQueryFilter({ ...queryFilter, total: result.message.data.data.rowCount });
          }
        }
      );
    }
  }, [currentUnit, queryFilter.page, queryFilter.size, toggleSearch]);

  useEnterKeyEvent([], () => setToggleSearch((old) => !old));

  return (
    <Grid container>
      <Grid container item xs={12} spacing={1}>
        {removeUnitPopup()}
        {addUnitPopup()}
        {lockUnitPopup()}
        {unlockUnitPopup()}
        {permissionPopup()}
      </Grid>
      <Card sx={{ marginTop: "0px", width: "100%" }}>
        <Grid container item xs={12} spacing={2} padding={2}>
          {/* Part leftside */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                border: "1px solid #eeecf8",
              }}
            >
              <Typography
                sx={{
                  color: "#16151C",
                  fontWeight: 600,
                  fontSize: "20px",
                  margin: "10px 0px 0px 10px",
                }}
              >
                Đơn vị
              </Typography>
              <Divider
                sx={{
                  background: "#d4d4d4",
                }}
              />
              <TreeView
                data={unitTree}
                onChange={(unit) => {
                  setCurrentUnit({
                    id: unit.id,
                    "Tên đơn vị": unit.name,
                    "Mã đơn vị": unit.code,
                    "Trạng thái": renderStatusTag(unit.status, managementUnitStatus),
                    "Thao tác": renderUnitGroupBtn(unit.status, unit.id, unit),
                  });
                }}
              />
            </Box>
          </Grid>

          {/* Part rightside */}
          <Grid item xs={12} md={8}>
            {/* Danh sách đơn vị */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                border: "1px solid #eeecf8",
                marginBottom: "10px",
              }}
            >
              <Grid container mt={"10px"} pr={"10px"}>
                <Grid item xs={12} sm={12} lg={5}>
                  <Typography
                    sx={{
                      color: "#16151C",
                      fontWeight: 600,
                      fontSize: "20px",
                      margin: "10px 0px 0px 10px",
                    }}
                  >
                    Danh sách đơn vị
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  lg={7}
                  display="flex"
                  justifyContent="end"
                  alignItems="center"
                >
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
                        "UNIT_MANAGEMENT_TAB",
                        "UNIT_MANAGEMENT_TAB_ADD_BTN",
                      ]}
                    >
                      <ButtonControl
                        hiddenCancel
                        submitText="Thêm mới"
                        imageSubmit={WhitePlusIcon}
                        handleSubmit={() => {
                          setUnitSelectedId(null);
                          setAddParams(addUnitData);
                          setIsAddUnit(true);
                        }}
                      />
                    </PermissionWrapped>
                  </SuiBox>
                </Grid>
              </Grid>

              <Divider
                sx={{
                  background: "#d4d4d4",
                }}
              />
              <PermissionWrapped
                listCodeComponent={[
                  "ADMINISTRATION",
                  "UNIT_MANAGEMENT_TAB",
                  "UNIT_MANAGEMENT_TAB_UNIT_TABLE",
                ]}
              >
                <Table
                  size="13px"
                  tablePadding
                  columns={unitColumns}
                  rows={currentUnit ? [currentUnit] : []}
                  borderRadius="1rem 1rem 0 0"
                  border={0}
                  rowsCount={queryFilter.size}
                  curPage={queryFilter.page}
                  isPagination={false}
                  // setRowsCount={(rowCount) =>
                  //   setQueryFilter({
                  //     ...queryFilter,
                  //     size: rowCount,
                  //     page: 0,
                  //   })
                  // }
                  // setCurPage={(nextPage) =>
                  //   setQueryFilter({
                  //     ...queryFilter,
                  //     page: nextPage,
                  //   })
                  // }
                  // totalElements={1}
                />
              </PermissionWrapped>
            </Box>

            {/* Danh sách người dùng */}
            <Box
              container
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                border: "1px solid #eeecf8",
              }}
            >
              <Typography
                sx={{
                  color: "#16151C",
                  fontWeight: 600,
                  fontSize: "20px",
                  margin: "10px 0px 0px 10px",
                }}
              >
                Danh sách người dùng
              </Typography>

              <Divider
                sx={{
                  background: "#d4d4d4",
                }}
              />
              <Box px={"20px"} display={"flex"} flexDirection={"column"}>
                <Grid item xs={12} sm={8} lg={8} display="flex" alignItems="center" gap={2}>
                  <SearchInput
                    placeholder="Nhập tên người dùng, tên đăng nhập, số điện thoại, email"
                    isOpenFilter={isOpenFilter}
                    setIsOpenFilter={setIsOpenFilter}
                    searchText={queryFilter.searchText}
                    onChange={(e) => handleChange("searchText", e.target.value)}
                    submit={() => setToggleSearch((old) => !old)}
                  />
                </Grid>
                {isOpenFilter && (
                  <Grid container item xs={12} columnSpacing={1} pb={2} mt={1}>
                    <Grid item xs={12} sm={6} lg={4} xl={4}>
                      <SelectBox
                        label="Vai trò"
                        dataSource={`/roles/list?status=ACTIVATED`}
                        mapping={{ value: "id", label: "roleName" }}
                        value={queryFilter?.roleId}
                        onChange={(e) => handleChange("roleId", e.value)}
                        placeholder="Tất cả"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4} xl={4}>
                      <SelectBox
                        label="Trạng thái"
                        options={managementUnitStatus}
                        value={queryFilter.status}
                        onChange={(e) => {
                          setQueryFilter({ ...queryFilter, status: e.value });
                        }}
                        placeholder="Tất cả"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4} xl={4}>
                      <ButtonFilter
                        onSearch={() => setToggleSearch((old) => !old)}
                        onClear={() =>
                          setQueryFilter({ ...queryFilter, status: "", roleId: "", searchText: "" })
                        }
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>

              <PermissionWrapped
                listCodeComponent={[
                  "ADMINISTRATION",
                  "UNIT_MANAGEMENT_TAB",
                  "UNIT_MANAGEMENT_TAB_USER_TABLE",
                ]}
              >
                <Table
                  size="13px"
                  tablePadding
                  columns={userColumns}
                  rows={currentListUser}
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
              </PermissionWrapped>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
