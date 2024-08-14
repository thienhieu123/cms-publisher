import { useLocation } from "react-router-dom";
import { useSoftUIController } from "~/context";
import { setJobProposalCurrentTab } from "~/context/common/action";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import SuiTabs from "~/examples/Tabs";
import JobList from "./components/JobList";
import { useEffect } from "react";
import JobProposalList from "./components/JobProposalList";

const tabs = [
  {
    id: 0,
    label: "Công việc",
    Component: <JobList />,
    code: "JOB_TAB",
  },
  {
    id: 1,
    label: "Công việc đề xuất",
    Component: <JobProposalList />,
    code: "JOB_PROPOSAL_TAB",
  },
];

export default function JobProposal() {
  const [controller, dispatch] = useSoftUIController();
  const { jobProposalCurrentTab } = controller.common;
  const location = useLocation();

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab) setJobProposalCurrentTab(dispatch, parseInt(tab, 10));
    else setJobProposalCurrentTab(dispatch, 0);
  }, [location.search]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiTabs
        tabs={tabs}
        currentTab={jobProposalCurrentTab}
        handleChangeTab={setJobProposalCurrentTab}
      />
    </DashboardLayout>
  );
}
