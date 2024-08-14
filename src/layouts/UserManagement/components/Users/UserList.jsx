import { Grid, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import ButtonFilter from "~/components/ButtonFilter";
import SelectBox from "~/components/SelectBox";
import SuiBox from "~/components/SuiBox";
import Table from "~/examples/Tables/Table";
import WhitePlusIcon from "~/assets/images/icons/white-plus.svg";
import { formatUnitTree, handleResponse, renderStatusTag } from "~/utils/utils";
import SuiTypography from "~/components/SuiTypography";
import { useNavigate } from "react-router-dom";
import { DeleteIconButton, LocknUnLockIconButton, ViewDetailIconButton } from "~/components/Button";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import SearchInput from "~/components/SearchInput";
import ExcelButton from "~/components/ExcelButton";
import {
  exportListUser,
  getListUser,
  getUnitTree,
  lockAndUnlockUser,
  removeUser,
} from "~/api/common";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { managementUserStatus } from "~/constants/config";
import TreeSelect from "~/components/TreeSelect";
import useErrorMessage from "~/hooks/useErrorMessage";
import PermissionWrapped from "~/components/PermissionWrapped";

const columns = [
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
  {
    name: "Người tạo",
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

const initialValues = {
  page: 0,
  size: 20,
  total: 0,
  searchText: "",
  unitId: "",
  roleId: "",
  createdByUserId: "",
  status: "",
};

export default function UserList() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [isLockUser, setIsLockUser] = useState(false);
  const [isUnlockUser, setIsUnlockUser] = useState(false);
  const [isRemoveUser, setIsRemoveUser] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [unitTree, setUnitTree] = useState([]);
  const { setErrorMessage } = useErrorMessage();
  const { setSuccessMessage } = useSuccessMessage();
  const navigate = useNavigate();

  const handleLockUserState = (status) => {
    status === "ACTIVATED" ? setIsUnlockUser(true) : setIsLockUser(true);
  };

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  const renderGroupBtn = (status, id) => {
    return (
      <Grid container ishiddentooltip="true">
        <SuiTypography component="span" sx={{ display: "flex", width: "100px" }}>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "USER_MANAGEMENT_TAB",
              "ADMINISTRATION_USER_DETAIL",
            ]}
          >
            <Grid item>
              <ViewDetailIconButton onClick={() => navigate(`/user-management/detail/${id}`)} />
            </Grid>
          </PermissionWrapped>
          <PermissionWrapped
            listCodeComponent={[
              "ADMINISTRATION",
              "USER_MANAGEMENT_TAB",
              "USER_MANAGEMENT_TAB_LOCK_ICON",
            ]}
          >
            <Grid item>
              <LocknUnLockIconButton
                status={status}
                handleClick={() => {
                  setCurrentUser(id);
                  handleLockUserState(status);
                }}
              />
            </Grid>
          </PermissionWrapped>

          {/* <Grid
            item
            onClick={() => {
              setCurrentUser(id);
              setIsRemoveUser(true);
            }}
          /> */}
        </SuiTypography>
      </Grid>
    );
  };

  const handleUnlockUser = () => {
    lockAndUnlockUser(currentUser, "ACTIVATED").then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Mở khóa người dùng thành công");
        setIsLockUser(false);
        fetchData();
      }
    });
  };
  const unlockUserPopup = () => {
    return (
      <ConfirmPopup
        open={isLockUser}
        setOpen={setIsLockUser}
        questionText="Bạn có đồng ý mở khóa người dùng này ?"
        NotiText="Người dùng sẽ được mở khóa"
        handleSubmit={handleUnlockUser}
      />
    );
  };

  const handleLockUser = () => {
    lockAndUnlockUser(currentUser, "INACTIVATED").then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Khóa người dùng thành công");
        setIsUnlockUser(false);
        fetchData();
      }
    });
  };
  const lockUserPopup = () => {
    return (
      <ConfirmPopup
        open={isUnlockUser}
        setOpen={setIsUnlockUser}
        questionText="Bạn có đồng ý khóa người dùng này ?"
        NotiText="Người dùng sẽ bị khóa"
        handleSubmit={handleLockUser}
      />
    );
  };

  const handleRemoveUser = () => {
    removeUser(currentUser).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Xóa người dùng thành công");
        setIsRemoveUser(false);
        fetchData();
      }
    });
  };

  const removeUserPopup = () => {
    return (
      <ConfirmPopup
        open={isRemoveUser}
        setOpen={setIsRemoveUser}
        questionText="Bạn có đồng ý xóa người dùng này?"
        NotiText="Người dùng sẽ bị xóa khỏi hệ thống"
        handleSubmit={handleRemoveUser}
      />
    );
  };

  const formatData = (arr) => {
    const res = arr.map((item, idx) => {
      return {
        STT: queryFilter.page * queryFilter.size + idx + 1,
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
        "Người tạo": "Admin",
        "Số điện thoại": item.profile.phoneNumber,
        "Trạng thái": renderStatusTag(item.status, managementUserStatus),
        "Hành động": renderGroupBtn(item.status, item.id),
      };
    });

    return res;
  };

  const fetchData = () => {
    const { page, size, searchText, unitId, roleId, createdByUserId, status } = queryFilter;
    getListUser(page, size, searchText, unitId, roleId, createdByUserId, status).then((res) => {
      if (res.success && res.message.status === 200) {
        const formatList = formatData(res.message.data.data.rows);
        setListUser(formatList);
        setQueryFilter({ ...queryFilter, total: res.message.data.data.rowCount });
      }
    });
  };

  const getUnitTreeList = () => {
    getUnitTree("ACTIVATED").then((result) => {
      const [status, dataResponse] = handleResponse(result);
      if (status) {
        const listUnit = formatUnitTree(result.message.data.data.children);
        setUnitTree(listUnit);
      } else {
        setErrorMessage(dataResponse);
      }
    });
  };

  useEffect(() => {
    getUnitTreeList();
    return () => {
      setUnitTree([]);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [queryFilter.page, queryFilter.size]);

  const handleClearFilter = () => {
    setQueryFilter(initialValues);
  };

  useEnterKeyEvent([], fetchData);

  const handleExcel = () => {
    const { page, size, searchText, unitId, roleId, createdByUserId, status } = queryFilter;
    exportListUser(page, size, searchText, unitId, roleId, createdByUserId, status).then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob?.message?.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_list.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} spacing={1}>
        {lockUserPopup()}
        {unlockUserPopup()}
        {removeUserPopup()}
        <Grid item xs={12} sm={8} lg={5} display="flex" alignItems="center" gap={2}>
          <SearchInput
            placeholder="Nhập tên người dùng, tên đăng nhập, số điện thoại, email"
            isOpenFilter={isOpenFilter}
            setIsOpenFilter={setIsOpenFilter}
            searchText={queryFilter.searchText}
            onChange={(e) => handleChange("searchText", e.target.value)}
            submit={fetchData}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={7} display="flex" justifyContent="end" alignItems="center">
          {/* <Grid
            onClick={() =>
              handleDownload(
                "https://kinhteso.gpmn.net:9201/api/v1/file-storage/serve-default?fileName=templates%2Fimport_users.xlsx",
                "import_users.xlsx"
              )
            }
          >
            <Typography sx={{ marginRight: "20px", fontSize: 16, cursor: "pointer" }}>
              Tải tệp mẫu thêm mới
            </Typography>
          </Grid> */}

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
                "USER_MANAGEMENT_TAB",
                "USER_MANAGEMENT_TAB_EXCEL_BTN",
              ]}
            >
              <ExcelButton onClick={handleExcel} />
            </PermissionWrapped>

            <PermissionWrapped
              listCodeComponent={[
                "ADMINISTRATION",
                "USER_MANAGEMENT_TAB",
                "ADMINISTRATION_USER_ADD",
              ]}
            >
              <ButtonControl
                hiddenCancel
                submitText="Thêm mới"
                imageSubmit={WhitePlusIcon}
                handleSubmit={() => {
                  navigate("/user-management/add-user");
                }}
              />
            </PermissionWrapped>
          </SuiBox>
        </Grid>
        {isOpenFilter && (
          <Grid container item xs={12} columnSpacing={4} spacing={1} pb={2} mt={1}>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <TreeSelect
                label="Cơ quan chuyên trách"
                data={unitTree}
                placeholder="Chọn cơ quan chuyên trách"
                required={false}
                value={queryFilter.unitId}
                width="100%"
                onChange={(e) => handleChange("unitId", e)}
              />
            </Grid>
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
                label="Người tạo"
                dataSource={`/users/list?status=ACTIVATED`}
                mapping={{ value: "id", label: "fullname" }}
                value={queryFilter?.createdByUserId}
                onChange={(e) => handleChange("createdByUserId", e.value)}
                placeholder="Tất cả"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <SelectBox
                label="Trạng thái"
                options={managementUserStatus}
                placeholder="Tất cả"
                value={queryFilter.status}
                onChange={(e) => setQueryFilter({ ...queryFilter, status: e.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <ButtonFilter onClear={handleClearFilter} onSearch={fetchData} />
            </Grid>
          </Grid>
        )}
      </Grid>
      <PermissionWrapped
        listCodeComponent={[
          "ADMINISTRATION",
          "USER_MANAGEMENT_TAB",
          "USER_MANAGEMENT_TAB_DATA_TABLE",
        ]}
      >
        <Grid item xs={12}>
          <Table
            size="13px"
            columns={columns}
            rows={listUser}
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
      </PermissionWrapped>
    </Grid>
  );
}
