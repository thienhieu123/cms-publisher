import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import TreeView from "~/components/TreeView/TreeView";
import { formatUnitTree } from "~/utils/utils";
import RadioButton from "~/components/SuiRadioButton/SuiRadioButtonRoot";
import Input from "~/components/Input";
import TextArea from "~/components/TextArea";
import ButtonControl from "~/components/ButtonControl";
import PopupRoot from "~/components/Popup/PopupRoot";
import {
  addPermissionComponent,
  editPermissionComponent,
  getListApi,
  getRolePermissionByRoleId,
} from "~/api/common";
import { useLocation } from "react-router-dom";
import SelectBox from "~/components/SelectBox";
import useErrorMessage from "~/hooks/useErrorMessage";
import useSuccessMessage from "~/hooks/useSuccessMessage";

const initParams = {
  permission: "", //1. canView = canEdit = true, //2. only canView = true, //3. both false
  type: "",
  name: "",
  code: "",
  id: "",
  parentId: "",
  apiIds: [],
  groupId: [],
  description: "",
};
export default function UserPermission() {
  const [permissionTree, setPermissionTree] = useState([]);
  const [fullTree, setFullTree] = useState([]);
  const [filterTree, setFilterTreeTree] = useState([]);
  const [currentPermission, setCurrentPermission] = useState(initParams);
  const [params, setParams] = useState(initParams);
  const [isAddPopup, setIsAddPopup] = useState(false);
  const location = useLocation();
  const userID = location.pathname.split("/")[3];
  const [listAddApi, setListAddApi] = useState([]);
  const [listEditApi, setListEditApi] = useState([]);
  const { setErrorMessage } = useErrorMessage();
  const { setSuccessMessage } = useSuccessMessage();

  const formatPermissionTree = (rawArr, parentCode, layer) => {
    let children = [];
    let filterChildren = [];
    rawArr?.map((item) => {
      if (item.code === parentCode) {
        //cho những module ko có tab hoặc code tab trùng với code module
        item.codeUnique = `${item.code}${item.createdAt}`;
      }
      item.value = item.id;
      item.label = item.name;
      item.parentCode = parentCode;
      item.layer = layer ? layer + 1 : 1;
      if (item.children?.length === 0) {
        children.push(item);
        if (item.canView) filterChildren.push(item);
        delete item.children;
      } else {
        const child = formatPermissionTree(item.children, item.code, item.layer);
        const obj = {
          ...item,
          children: child.children,
        };
        children.push(obj);

        const objFilter = {
          ...item,
          children: child.filterChildren,
        };
        if (objFilter.canView) filterChildren.push(objFilter);
      }
    });
    return {
      children,
      filterChildren,
    };
  };

  const fetchData = () => {
    getRolePermissionByRoleId(userID).then((res) => {
      if (res.success && res.message.status === 200) {
        const listPermission = formatPermissionTree(res.message.data.data.modules);
        setPermissionTree(listPermission.children);
        setFullTree(listPermission.children);
        setFilterTreeTree(listPermission.filterChildren);
      }
    });
  };

  const convertCan2Permission = (canView, canEdit) => {
    console.log(canView, canEdit, typeof canEdit);
    if (canEdit || (canView && typeof canEdit === "undefined")) return "1";
    else if (canView && canEdit === false) {
      return "2";
    } else return "3";
  };

  const convertPermission2Can = (permission) => {
    if (permission === "1") {
      return {
        canView: true,
        canEdit: true,
      };
    } else if (permission === "2") {
      return {
        canView: true,
        canEdit: false,
      };
    } else
      return {
        canView: false,
        canEdit: false,
      };
  };

  const convertGroupApi = (arr) => {
    return arr.map((item) => item.id);
  };

  const convertListApi = (arr) => {
    const res = [];
    arr.map((item) => {
      item.apis.map((ele) => {
        res.push(ele.id);
      });
    });
    return res;
  };

  const handleGetListApi = async (arr) => {
    return new Promise((resolve, reject) => {
      Promise.all(
        arr.map(async (item) => {
          const listApi = await getListApi(item.id || item);
          return listApi;
        })
      ).then((value) => {
        let result = [];
        value.map((element) => {
          if (element.success) {
            element.message.data.data.map((item) => {
              item.label = item.functionName;
              item.value = item.id;
              return item;
            });
            result = result.concat(element.message.data.data);
          }
        });
        resolve(result);
        // console.log("val:", result);
      });
    });
  };

  useEffect(() => {
    if (currentPermission.groupId?.length > 0) {
      handleGetListApi(currentPermission.groupId).then((res) => {
        setListEditApi(res);
      });
    }
  }, [currentPermission.groupId]);

  useEffect(() => {
    if (params.groupId?.length > 0) {
      handleGetListApi(params.groupId).then((res) => {
        setListAddApi(res);
      });
    }
  }, [params.groupId]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = () => {
    const { id, code, name, type, apiIds, description } = currentPermission;
    const { canEdit, canView } = convertPermission2Can(currentPermission.permission);
    const apiIdList = apiIds.map((item) => item.id || item);
    editPermissionComponent(
      userID,
      id,
      code,
      name,
      type,
      apiIdList,
      description,
      canView,
      canEdit
    ).then((res) => {
      if (res.success && res.message.status === 200) {
        setSuccessMessage("Cập nhật thành công");
        fetchData();
      } else {
        setErrorMessage(res.message.data.error.response.message);
      }
    });
  };

  const handleAdd = () => {
    const { parentId, code, name, type, apiIds, description } = params;
    const { canEdit, canView } = convertPermission2Can(params.permission);
    const apiIdList = apiIds.map((item) => item.id);
    //call api update
    addPermissionComponent(
      userID,
      parentId,
      code,
      name,
      type,
      apiIdList,
      description,
      canView,
      canEdit
    ).then((res) => {
      if (res.success && res.message.status === 200) {
        fetchData();
        setParams(initParams);
        setIsAddPopup(false);
        setSuccessMessage("Tạo mới thành công");
      } else {
        setErrorMessage(res.message.data.error.response.message);
      }
    });
  };
  const addPermissionPopup = () => {
    return (
      <PopupRoot
        title="Thêm mới đối tượng"
        open={isAddPopup}
        setOpen={setIsAddPopup}
        disableBackDropClick
      >
        <Grid item xs={12}>
          <Grid container p={2} rowSpacing={1} columnSpacing={1}>
            <Grid item xs={12} md={6}>
              <Input
                label="ParentId"
                placeholder={"Nhập parentId"}
                value={params.parentId}
                onChange={(e) =>
                  setParams({
                    ...params,
                    parentId: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectBox
                isHaveAllOptions={false}
                label="Loại đối tượng"
                placeholder="Chọn loại đối tượng"
                required={false}
                dataSource="/sys-components/groups"
                mapping={{ value: "id", label: "name" }}
                width="100%"
                value={params.type}
                onChange={(e) =>
                  setParams({
                    ...params,
                    type: e.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Tên đối tượng"
                placeholder={"Nhập tên đối tượng"}
                value={params.name}
                onChange={(e) =>
                  setParams({
                    ...params,
                    name: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Mã đối tượng"
                placeholder={"Nhập mã đối tượng"}
                value={params.code}
                onChange={(e) =>
                  setParams({
                    ...params,
                    code: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectBox
                isHaveAllOptions={false}
                label="Nhóm API"
                placeholder="Chọn nhóm api"
                required={false}
                dataSource="/sys-apis/groups"
                mapping={{ value: "id", label: "name" }}
                width="100%"
                isMulti
                value={params.groupId}
                onChange={(e) =>
                  setParams({
                    ...params,
                    groupId: e,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectBox
                isHaveAllOptions={false}
                label="API"
                placeholder="Chọn api"
                required={false}
                isMulti
                options={listAddApi}
                width="100%"
                value={params.apiIds}
                onChange={(e) =>
                  setParams({
                    ...params,
                    apiIds: e,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextArea
                label="Mô tả"
                width="100%"
                placeholder={"Nhập mô tả"}
                value={params.description}
                onChange={(e) =>
                  setParams({
                    ...params,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RadioButton
                id={4}
                text="Hiển thị"
                value={"1"}
                onChange={(e) => setParams({ ...params, permission: e.target.value })}
                checked={params.permission === "1"}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RadioButton
                id={5}
                text="Hiển thị - vô hiệu hóa"
                value={"2"}
                onChange={(e) => setParams({ ...params, permission: e.target.value })}
                checked={params.permission === "2"}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RadioButton
                id={6}
                text="Không hiển thị"
                value={"3"}
                onChange={(e) => setParams({ ...params, permission: e.target.value })}
                checked={params.permission === "3"}
              />
            </Grid>
          </Grid>
          <Grid sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <Grid width="fit-content">
              <ButtonControl
                submitText="Tạo mới"
                cancelText="Hủy"
                isHideImageSubmit
                isHideImageCancel
                handleCancel={() => {
                  setParams(initParams);
                  setIsAddPopup(false);
                }}
                handleSubmit={handleAdd}
              />
            </Grid>
          </Grid>
        </Grid>
      </PopupRoot>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {addPermissionPopup()}
      <Grid container item xs={12}>
        {/* Part leftside */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ background: "white", borderRadius: "10px 0 0 10px" }}
          p={2}
          pr={0}
        >
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
              Danh sách đối tượng phân quyền
            </Typography>

            <Grid mt={"10px"}>
              <ButtonControl
                cancelText="Filter Tree"
                submitText="Full Tree"
                isHideImageSubmit
                isHideImageCancel
                handleSubmit={() => setPermissionTree(fullTree)}
                handleCancel={() => setPermissionTree(filterTree)}
                justifyContent="center"
              />
            </Grid>

            <Divider
              sx={{
                background: "#d4d4d4",
              }}
            />
            <TreeView
              data={permissionTree}
              onChange={(per) => {
                setCurrentPermission({
                  id: per.id,
                  name: per.name,
                  code: per.code,
                  type: per.type?.id,
                  groupId: convertGroupApi(per.apiGroups),
                  apiIds: convertListApi(per.apiGroups),
                  description: per.description,
                  permission: convertCan2Permission(per.canView, per.canEdit),
                });
              }}
            />
          </Box>
        </Grid>

        {/* Part rightside */}
        <Grid item xs={12} md={8} sx={{ background: "white", borderRadius: "0 10px 10px 0" }} p={2}>
          <Grid sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              sx={{
                color: "#16151C",
                fontWeight: 600,
                fontSize: "20px",
                margin: "10px 0px 0px 10px",
                textAlign: "center",
              }}
            >
              Thông tin đối tượng
            </Typography>
            <Grid width="fit-content" sx={{ marginTop: "5px", marginRight: "5px" }}>
              <ButtonControl
                hiddenCancel
                submitText="Thêm mới"
                isHideImageSubmit
                handleSubmit={() => setIsAddPopup(true)}
              />
            </Grid>
          </Grid>

          <Grid container p={2} rowSpacing={1} columnSpacing={1}>
            <Grid item xs={12} md={6}>
              <Input
                label="Id"
                value={currentPermission.id}
                onChange={(e) =>
                  setCurrentPermission({
                    ...currentPermission,
                    id: e.target.value,
                  })
                }
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectBox
                isHaveAllOptions={false}
                label="Loại đối tượng"
                placeholder="Chọn loại đối tượng"
                required={false}
                dataSource="/sys-components/groups"
                mapping={{ value: "id", label: "name" }}
                width="100%"
                value={currentPermission.type}
                onChange={(e) =>
                  setCurrentPermission({
                    ...currentPermission,
                    type: e.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Tên đối tượng"
                placeholder={"Nhập tên đối tượng"}
                value={currentPermission.name}
                onChange={(e) =>
                  setCurrentPermission({
                    ...currentPermission,
                    name: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input
                label="Mã đối tượng"
                placeholder={"Nhập mã đối tượng"}
                value={currentPermission.code}
                onChange={(e) =>
                  setCurrentPermission({
                    ...currentPermission,
                    code: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectBox
                label="Nhóm API"
                placeholder="Chọn nhóm api"
                required={false}
                dataSource="/sys-apis/groups"
                mapping={{ value: "id", label: "name" }}
                width="100%"
                isMulti
                isHaveAllOptions={false}
                value={currentPermission.groupId}
                onChange={(e) =>
                  setCurrentPermission({
                    ...currentPermission,
                    groupId: e,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectBox
                label="API"
                placeholder="Chọn api"
                required={false}
                isMulti
                options={listEditApi}
                width="100%"
                value={currentPermission.apiIds}
                onChange={(e) =>
                  setCurrentPermission({
                    ...currentPermission,
                    apiIds: e,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextArea
                label="Mô tả"
                width="100%"
                placeholder={"Nhập mô tả"}
                value={currentPermission.description}
                onChange={(e) =>
                  setCurrentPermission({
                    ...currentPermission,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RadioButton
                id={1}
                text="Hiển thị"
                value={"1"}
                onChange={(e) =>
                  setCurrentPermission({ ...currentPermission, permission: e.target.value })
                }
                checked={currentPermission.permission === "1"}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RadioButton
                id={2}
                text="Hiển thị - vô hiệu hóa"
                value={"2"}
                onChange={(e) =>
                  setCurrentPermission({ ...currentPermission, permission: e.target.value })
                }
                checked={currentPermission.permission === "2"}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RadioButton
                id={3}
                text="Không hiển thị"
                value={"3"}
                onChange={(e) =>
                  setCurrentPermission({ ...currentPermission, permission: e.target.value })
                }
                checked={currentPermission.permission === "3"}
              />
            </Grid>
          </Grid>
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Grid width="fit-content">
              <ButtonControl
                disabledSubmit={!currentPermission.id}
                hiddenCancel
                submitText="Cập nhật"
                isHideImageSubmit
                handleSubmit={() => handleUpdate()}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
