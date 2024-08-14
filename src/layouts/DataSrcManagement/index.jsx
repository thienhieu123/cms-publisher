/* eslint-disable arrow-body-style */
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import { useSoftUIController } from "~/context";
import SuiTabs from "~/examples/Tabs";
import { setDataSrcCurrentTab } from "~/context/common/action";
import DataSrcTab from "./components/DataSrcTabs/DataSrcTab";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import UpdateRequestList from "./components/DataSrcTabs/UpdateRequestList";
import { filterPermissionTabs } from "~/utils/utils";
import ApproveReportList from "./components/DataSrcTabs/ApproveReportList";

const tabList = [
  {
    id: 0,
    label: "Dữ liệu tham số",
    Component: <DataSrcTab />,
    code: "DATA_SRC_TAB",
  },
  {
    id: 1,
    label: "Yêu cầu cập nhật",
    Component: <UpdateRequestList />,
    code: "DATA_SRC_UPDATE_DATA_TAB",
  },
  {
    id: 2,
    label: "Phê duyệt yêu cầu",
    Component: <ApproveReportList />,
    code: "DATA_SRC_APPROVE_DATA_TAB",
  },
];

function DataSrcManagement(props) {
  const [controller, dispatch] = useSoftUIController();
  const { dataSrcCurrentTab } = controller.common;
  const location = useLocation();

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab) setDataSrcCurrentTab(dispatch, parseInt(tab, 10));
    else setDataSrcCurrentTab(dispatch, 0);
  }, [location.search]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        <SuiTabs
          tabs={filterPermissionTabs(props.code, tabList)}
          currentTab={dataSrcCurrentTab}
          handleChangeTab={setDataSrcCurrentTab}
        />
      </div>
    </DashboardLayout>
  );
}
export default DataSrcManagement;
