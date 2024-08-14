/* eslint-disable */
/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import Account from "~/layouts/Account";
import ChangePassword from "~/layouts/Account/changePassword";
import SignIn from "~/layouts/Authentication/SignIn";
import Forgot from "~/layouts/Authentication/Forgot";
import ResetPassword from "~/layouts/Authentication/Forgot/component/resetPassword";
import OTPSignin from "~/layouts/Authentication/SignIn/OTP";
import StatisticData from "~/layouts/Statistic";
import Chart from "~/layouts/Chart";
import Detail from "~/layouts/Statistic/components/Detail/index";
import StatisticReportDetail from "~/layouts/StatisticReport/Components/StatisticReportDetail";
import AccountIcon from "~/assets/images/icons/account.png";
import HomePage from "~/layouts/HomePage";
import HomeIcon from "~/assets/images/icons/HomeIcon.svg";
import Config from "~/assets/images/icons/Config.svg";
import DataSrc from "~/assets/images/icons/data-src.svg";
import ChartIcon from "~/assets/images/icons/Chart.svg";
import StatisticIcon from "~/assets/images/icons/Statistic.svg";
import StatisticDataIcon from "~/assets/images/icons/statistic-data.svg";
import StatisticReport from "~/layouts/StatisticReport";
import UserManagement from "./layouts/UserManagement";
import UserDetail from "./layouts/UserManagement/components/Users/UserDetail";
import { CategoriesList } from "./layouts/UserManagement/components/Category/CategoriesList";
import UserPermission from "./layouts/UserManagement/components/Users/UserPermission";
import JobProposal from "./layouts/JobProposal";
import DataSrcManagement from "./layouts/DataSrcManagement";
import RequestDataSrc from "./layouts/DataSrcManagement/components/DataSrcTabs/components/RequestDataSrc";
import AddNewFormula from "./layouts/UserManagement/components/Category/Types/AddNewFormula";

export const publicRoutes = [
  {
    code: "COMMON",
    type: "single",
    title: "QUẢN LÝ TÀI KHOẢN",
    box: "none",
    icon: AccountIcon,
    name: "Tài khoản / Quản lý tài khoản",
    key: "account-info",
    route: "/account-info",
    noCollapse: true,
    noneSidebar: true,
    component: <Account />,
  },
  {
    name: "Đổi mật khẩu",
    key: "update-password",
    box: "setting",
    route: "/account/update-password",
    component: <ChangePassword />,
    noneSidebar: true,
  },
  {
    name: "Đăng nhập",
    key: "sign-in",
    route: "/authentication/sign-in",
    component: <SignIn />,
    noneSidebar: true,
  },
  {
    name: "Quên mật khẩu",
    key: "forgot-password",
    route: "/authentication/forgot-password",
    component: <Forgot />,
    noneSidebar: true,
  },
  {
    name: "Xác nhập OTP đăng nhập",
    key: "confirm-otp-signin",
    route: "/authentication/sign-in/OTP",
    component: <OTPSignin />,
    noneSidebar: true,
  },
  {
    name: "Đổi mật khẩu",
    key: "change-password",
    route: "/change-password",
    component: <ResetPassword type="change" />,
    noneSidebar: true,
  },
];

export const privateRoutes = [
  {
    code: "HOME_PAGE",
    type: "single",
    title: "Nền tảng đo lường kinh tế số thành phố Hồ Chí Minh",
    icon: HomeIcon,
    name: "Trang chủ",
    key: "home",
    route: "/home",
    component: <HomePage />,
    box: "none",
  },
  {
    code: "STATISTICAL_VALUE",
    type: "parent",
    title: "Thống kê số liệu",
    icon: StatisticDataIcon,
    name: "Thống kê số liệu",
    key: "statistic-data",
    route: "/statistic-data",
    component: <StatisticData code={"STATISTICAL_VALUE"} />,
    box: "none",
    children: [
      {
        code: "STATISTICAL_VALUE_DETAIL",
        title: "Báo cáo chi tiết theo chỉ tiêu",
        icon: StatisticIcon,
        name: "Báo cáo chi tiết theo chỉ tiêu",
        key: "detail",
        route: "/statistic-data/detail/:id",
        component: <Detail />,
        box: "none",
        noneSidebar: true,
      },
    ],
  },
  {
    code: "STATISTICAL_CHART",
    type: "single",
    title: "Biểu đồ theo chỉ tiêu",
    box: "none",
    icon: ChartIcon,
    name: "Biểu đồ",
    key: "chart",
    route: "/chart",
    noCollapse: true,
    component: <Chart />,
  },
  {
    code: "STATISTICAL_REPORT",
    type: "parent",
    title: "Báo cáo",
    icon: StatisticIcon,
    name: "Báo cáo",
    key: "statistic-report",
    route: "/statistic-report",
    component: <StatisticReport code={"STATISTICAL_REPORT"} />,
    box: "none",
    children: [
      {
        code: "STATISTICAL_REPORT_ADD",
        title: "Thêm mới báo cáo",
        icon: StatisticIcon,
        name: "Thêm mới báo cáo",
        key: "add-report",
        route: "/statistic-report/add-report",
        component: <StatisticReportDetail statusFeature="add" />,
        box: "none",
        noneSidebar: true,
      },
      {
        code: "STATISTICAL_REPORT_EDIT",
        title: "Chỉnh sửa báo cáo",
        icon: StatisticIcon,
        name: "Chỉnh sửa báo cáo",
        key: "edit",
        route: "/statistic-report/edit/:id",
        component: <StatisticReportDetail statusFeature="edit" />,
        box: "none",
        noneSidebar: true,
      },
      {
        code: "STATISTICAL_REPORT_APPROVEMENT",
        title: "Phê duyệt báo cáo",
        icon: StatisticIcon,
        name: "Phê duyệt báo cáo",
        key: "approve",
        route: "/statistic-report/approve/:id",
        component: <StatisticReportDetail statusFeature="approve" />,
        box: "none",
        noneSidebar: true,
      },
      {
        code: "STATISTICAL_REPORT_DETAIL",
        title: "Báo cáo chi tiết",
        icon: StatisticIcon,
        name: "Báo cáo chi tiết",
        key: "detail",
        route: "/statistic-report/detail/:id",
        component: <StatisticReportDetail statusFeature="view" />,
        box: "none",
        noneSidebar: true,
      },
    ],
  },
  {
    code: "ADMINISTRATION",
    type: "parent",
    title: "Quản trị",
    icon: Config,
    name: "Quản trị",
    key: "user-management",
    route: "/user-management",
    component: <UserManagement code={"ADMINISTRATION"} />,
    box: "none",
    children: [
      {
        code: "ADMINISTRATION_CATEGORIES",
        title: "Danh mục",
        name: "Danh mục",
        key: "categories-list",
        route: "/user-management/categories-list",
        component: <CategoriesList />,
        box: "none",
        noneSidebar: true,
      },
      {
        code: "ADMINISTRATION_USER_ADD",
        title: "Thêm mới người dùng",
        icon: StatisticDataIcon,
        name: "Thêm mới người dùng",
        key: "add-user",
        route: "/user-management/add-user",
        component: <UserDetail />,
        box: "none",
        noneSidebar: true,
      },
      {
        code: "ADMINISTRATION_USER_DETAIL",
        title: "Xem chi tiết người dùng",
        icon: StatisticDataIcon,
        name: "Xem chi tiết người dùng",
        key: "detail",
        route: "/user-management/detail/:id",
        component: <UserDetail update />,
        box: "none",
        noneSidebar: true,
      },
      {
        code: "ADMINISTRATION_PERMISSION",
        title: "Phân quyền chức năng",
        name: "Phân quyền chức năng",
        key: "user-permission",
        route: "/user-management/user-permission/:id",
        component: <UserPermission />,
        box: "none",
        noneSidebar: true,
      },
      {
        code: "CATEGORY_MANAGEMENT_TAB_ADD_FORMULA",
        name: "Thêm mới công thức",
        title: "Thêm mới công thức",
        key: "formula-add-new",
        route: "/user-management/formula-add-new",
        component: <AddNewFormula />,
        noneSidebar: true,
      },
    ],
  },
  {
    code: "JOB_PROPOSAL",
    type: "parent",
    title: "Đề xuất công việc",
    icon: Config,
    name: "Đề xuất công việc",
    key: "job-proposal",
    route: "/job-proposal",
    component: <JobProposal code={"JOB_PROPOSAL"} />,
    box: "none",
  },
  {
    box: "none",
    code: "DATA_SOURCE_MANAGEMENT",
    type: "parent",
    title: "Quản lý nguồn dữ liệu",
    icon: DataSrc,
    name: "Quản lý nguồn dữ liệu",
    key: "data-source-management",
    route: "/data-source-management",
    component: <DataSrcManagement code={"DATA_SOURCE_MANAGEMENT"} />,
    children: [
      {
        code: "DATA_SRC_UPDATE_DATA_TAB_CREATE_BTN",
        title: "Thêm mới yêu cầu",
        name: "Thêm mới yêu cầu",
        key: "add-request",
        route: "/data-source-management/add-request",
        component: <RequestDataSrc />,
        box: "none",
        noneSidebar: true,
      },
      {
        code: "DATA_SRC_UPDATE_DATA_TAB_DETAIL",
        title: "Chi tiết yêu cầu",
        name: "Chi tiết yêu cầu",
        key: "detail",
        route: "/data-source-management/detail/:id",
        component: <RequestDataSrc update />,
        box: "none",
        noneSidebar: true,
      },
    ],
  },
  // {
  //   type: "single",
  //   title: "CẤU HÌNH CẢNH BÁO",
  //   box: "none",
  //   icon: Config,
  //   name: "Danh sách cảnh báo",
  //   key: "list-warning",
  //   route: "/list-warning",
  //   noCollapse: true,
  //   component: <ListWarning />,
  //   roles: ["ADMIN"],
  // },

  /*********************** Phần chung đăng nhập - otp - quên mật khẩu **************************/

  // {
  //   name: "Đổi mật khẩu lần đầu",
  //   key: "reset-firsttime",
  //   route: "/authentication/sign-in/reset-firsttime",
  //   component: <ResetPasswordFirsttime type="first" />,
  //   noneSidebar: true,
  // },
];
