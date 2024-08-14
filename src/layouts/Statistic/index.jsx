/* eslint-disable arrow-body-style */
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import StatisticDataTab from "./components/StatisticDataTabs/StatisticDataTab";
// import { useSoftUIController } from "~/context";
// import SuiTabs from "~/examples/Tabs";
// import { setStatisticCurrentTab } from "~/context/common/action";

// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import UpdateRequestList from "./components/StatisticDataTabs/UpdateRequestList";
// import { checkIsDataCollector, checkIsDataControl, filterPermissionTabs } from "~/utils/utils";
// import ApproveRequestList from "./components/StatisticDataTabs/ApproveRequestList";

// const tabList = [
//   {
//     id: 0,
//     label: "Thống kê dữ liệu",
//     Component: <StatisticDataTab />,
//     code: "STATISTIC_DATA_TAB",
//   },
//   {
//     id: 1,
//     label: "Yêu cầu cập nhật",
//     Component: <UpdateRequestList />,
//     code: "UPDATE_DATA_TAB",
//     // hide: !checkIsDataCollector(),
//   },
//   {
//     id: 2,
//     label: "Phê duyệt dữ liệu",
//     Component: <ApproveRequestList />,
//     code: "APPROVE_DATA_TAB",
//     // hide: !checkIsDataControl(),
//   },
// ];

function StatisticData(props) {
  // const [controller, dispatch] = useSoftUIController();
  // const { statisticCurrentTab } = controller.common;
  // const location = useLocation();

  // useEffect(() => {
  //   const tab = new URLSearchParams(location.search).get("tab");
  //   if (tab) setStatisticCurrentTab(dispatch, parseInt(tab, 10));
  //   else setStatisticCurrentTab(dispatch, 0);
  // }, [location.search]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <StatisticDataTab />
      {/* <div>
        <SuiTabs
          tabs={filterPermissionTabs(props.code, tabList)}
          currentTab={statisticCurrentTab}
          handleChangeTab={setStatisticCurrentTab}
        />
      </div> */}
    </DashboardLayout>
  );
}
export default StatisticData;
