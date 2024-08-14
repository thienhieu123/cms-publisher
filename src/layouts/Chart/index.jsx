import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import ChartSection from "./components/ChartSection";
import ButtonControl from "~/components/ButtonControl";
import WhitePlus from "~/assets/images/icons/white-plus.svg";
import { Grid } from "@mui/material";
import { useState } from "react";
import { getStartDateDefault } from "~/utils/utils";
import PermissionWrapped from "~/components/PermissionWrapped";

const initialValues = {
  district: [],
  fromDate: getStartDateDefault(),
  toDate: new Date(),
  typeChart: "PIE_CHART",
  criteria: "",
  groupId: "",
};
function Chart() {
  const [chartArray, setChartArray] = useState([
    {
      id: 0,
      ...initialValues,
    },
  ]);

  const handleAddSection = () => {
    const newArr = [
      ...chartArray,
      {
        id: chartArray?.length,
        ...initialValues,
      },
    ];
    setChartArray(newArr);
  };

  const handleRemoveSection = (id) => {
    if (chartArray?.length > 1) {
      const newArr = chartArray.filter((item) => item.id !== id);
      const sortArr = newArr.map((item, index) => ({ ...item, id: index })); // update id
      setChartArray(sortArr);
    }
  };

  const handleUpdateSection = (id, newState) => {
    const newArr = chartArray.map((item) => {
      if (item.id === id) {
        const key = Object.keys(newState)[0];
        return key === "groupId"
          ? { ...item, ...newState, criteria: "" }
          : { ...item, ...newState };
      }
      return item;
    });
    setChartArray(newArr);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <PermissionWrapped
        listCodeComponent={["STATISTICAL_CHART", "CHART_VIEW", "CHART_VIEW_ADD_BTN"]}
      >
        <ButtonControl
          hiddenCancel
          submitText="Thêm mới"
          imageSubmit={WhitePlus}
          handleSubmit={handleAddSection}
        />
      </PermissionWrapped>

      <PermissionWrapped
        listCodeComponent={["STATISTICAL_CHART", "CHART_VIEW", "CHART_VIEW_CHART_LIST"]}
      >
        <Grid container gap={3} display="grid" mt="5px">
          {chartArray?.map((item, index) => (
            <Grid item xs={12} sm={12} lg={12} xl={12} p={2} className="card-content" key={index}>
              <ChartSection
                key={index}
                initialProps={item}
                onClose={handleRemoveSection}
                updateState={handleUpdateSection}
              />
            </Grid>
          ))}
        </Grid>
      </PermissionWrapped>
    </DashboardLayout>
  );
}

export default Chart;
