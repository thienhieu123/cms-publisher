import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import UserList from "./components/Users/UserList";
import UnitList from "~/layouts/UserManagement/components/Units/UnitList";
import { useSoftUIController } from "~/context";
import { useLocation } from "react-router-dom";
import { setUserManagementCurrentTab } from "~/context/common/action";
import { useEffect } from "react";
import SuiTabs from "~/examples/Tabs";
import RoleList from "./components/Role/RoleList";
import CategoriesTypeList from "./components/Category/CategoriesTypeList";
import { filterPermissionTabs } from "~/utils/utils";

const tabs = [
  {
    id: 0,
    label: "Người dùng",
    Component: <UserList />,
    code: "USER_MANAGEMENT_TAB",
  },
  {
    id: 1,
    label: "Vai trò",
    Component: <RoleList />,
    code: "ROLE_MANAGEMENT_TAB",
  },
  {
    id: 2,
    label: "Đơn vị",
    Component: <UnitList />,
    code: "UNIT_MANAGEMENT_TAB",
  },
  {
    id: 3,
    label: "Danh mục",
    Component: <CategoriesTypeList />,
    code: "CATEGORY_MANAGEMENT_TAB",
  },
];

export default function UserManagement(props) {
  const [controller, dispatch] = useSoftUIController();
  const { userManagementCurrentTab } = controller.common;
  const location = useLocation();

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab) setUserManagementCurrentTab(dispatch, parseInt(tab, 10));
    else setUserManagementCurrentTab(dispatch, 0);
  }, [location.search]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiTabs
        tabs={filterPermissionTabs(props.code, tabs)}
        currentTab={userManagementCurrentTab}
        handleChangeTab={setUserManagementCurrentTab}
      />
    </DashboardLayout>
  );
}
