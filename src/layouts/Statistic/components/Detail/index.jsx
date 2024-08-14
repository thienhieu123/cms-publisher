import { useSoftUIController } from "~/context";
import { setReportDetailCurrentTab } from "~/context/common/action";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import SuiTabs from "~/examples/Tabs";
import ViewDetail from "./components/Report/ViewDetail";
import Chart from "./components/Chart";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function Detail() {
  const [controller, dispatch] = useSoftUIController();
  const { reportDetailCurrentTab } = controller.common;
  const location = useLocation();

  const tabs = [
    {
      id: 0,
      label: "Báo cáo",
      Component: <ViewDetail />,
      code: "STATISTIC_REPORT_TAB",
      data: 0,
    },
    {
      id: 1,
      label: "Biểu đồ",
      Component: <Chart />,
      code: "STATISTIC_CHART_TAB",
      data: 0,
    },
  ];

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab) setReportDetailCurrentTab(dispatch, parseInt(tab, 10));
    else setReportDetailCurrentTab(dispatch, 0);
  }, [location.search]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiTabs
        tabs={tabs}
        currentTab={reportDetailCurrentTab}
        handleChangeTab={setReportDetailCurrentTab}
      />
    </DashboardLayout>
  );
}

export default Detail;
