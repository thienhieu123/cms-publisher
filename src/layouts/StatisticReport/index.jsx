import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import { useSoftUIController } from "~/context";
import SuiTabs from "~/examples/Tabs";
import { setStatisticReportCurrentTab } from "~/context/common/action";
import StatisticReportList from "./Components/StatisticReportList";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { filterPermissionTabs } from "~/utils/utils";
import UpdateReportList from "./Components/UpdateReportList";
import ApproveReportList from "./Components/ApproveReportList";

const tabs = [
  {
    id: 0,
    label: "Báo cáo",
    Component: <StatisticReportList />,
    code: "STATISTICAL_REPORT_TAB",
  },
  {
    id: 1,
    label: "Yêu cầu cập nhật",
    Component: <UpdateReportList />,
    code: "UPDATE_REPORT_TAB",
  },
  {
    id: 2,
    label: "Phê duyệt báo cáo",
    Component: <ApproveReportList />,
    code: "APPROVE_REPORT_TAB",
  },
];
export default function StatisticReport(props) {
  const [controller, dispatch] = useSoftUIController();
  const { statisticReportCurrentTab } = controller.common;
  const location = useLocation();

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab) setStatisticReportCurrentTab(dispatch, parseInt(tab, 10));
    else setStatisticReportCurrentTab(dispatch, 0);
  }, [location.search]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiTabs
        tabs={filterPermissionTabs(props.code, tabs)}
        currentTab={statisticReportCurrentTab}
        handleChangeTab={setStatisticReportCurrentTab}
      />
    </DashboardLayout>
  );
}
