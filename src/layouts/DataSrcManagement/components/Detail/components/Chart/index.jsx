// import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
// import { useState } from "react";
// import Search from "~/examples/Search";
// import { formatDateSearch } from "~/utils/utils";
import BarChart from "./components/BarChart";
import DateRangePicker from "~/components/DateRangePicker";
import SelectBox from "~/components/SelectBox";
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import SelectDistrictBox from "~/components/SelectAreaGroup/SelectDistrictBox";
import { BarChartDataSample, DoughnutChartDataSample, typeChartOptions } from "~/utils/variable";
import ButtonFilter from "~/components/ButtonFilter";
import DefaultDoughnutChart from "~/examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import SuiBox from "~/components/SuiBox";
import { getChartByCriteria } from "~/api/common";
import useErrorMessage from "~/hooks/useErrorMessage";
import { generateColors, getStartDateDefault } from "~/utils/utils";
import VerticalBarChart from "~/examples/Charts/BarCharts/VerticalBarChart";
// import PieChart from "./components/PieChart";

const initialValues = {
  district: [],
  fromDate: getStartDateDefault(),
  endDate: new Date(),
  typeChart: "PIE_CHART",
  statsIndexId: "",
  groupId: "",
};
function Chart() {
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const { setErrorMessage } = useErrorMessage();
  const [titleChart, setTitleChart] = useState("");
  const [doughnutChartData, setDoughnutChartData] = useState(DoughnutChartDataSample);
  const [BarChartData, setBarChartData] = useState(BarChartDataSample);

  const fetchData = () => {
    const { district, fromDate, endDate, typeChart, statsIndexId, groupId } = queryFilter;
    if (statsIndexId) {
      getChartByCriteria({
        groups: district,
        fromDate: fromDate.toISOString(),
        toDate: endDate.toISOString(),
        chartCategory: typeChart,
        indexCode: statsIndexId,
      }).then((result) => {
        if (result.message.status === 200) {
          const { data } = result.message.data;
          const labelsList = data.blocks.map((block) => block.label);
          const valueList = data.blocks.map((block) => block.value);
          const unitValue = data?.defaultMeasurementUnit?.name;
          setTitleChart(data?.title);
          if (typeChart === "PIE_CHART") {
            const dataChart = {
              ...doughnutChartData,
              labels: labelsList,
              datasets: {
                ...doughnutChartData.datasets,
                data: valueList,
                backgroundColor: generateColors(valueList?.length),
              },
              unit: "",
            };
            setDoughnutChartData(dataChart);
          } else if (typeChart === "BAR_CHART") {
            const dataChart = {
              chart: {
                ...BarChartData.chart,
                labels: labelsList,
                datasets: [
                  { data: valueList, color: generateColors(1), label: unitValue || "", unit: "" },
                ],
              },
            };
            setBarChartData(dataChart);
          }
        } else {
          setErrorMessage(result?.message?.statusText);
        }
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [queryFilter]);

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  const handleClearFilter = () => {
    setQueryFilter(initialValues);
  };

  return (
    <>
      <Grid container item xs={12} columnSpacing={4} spacing={1} pb={2} mt={1}>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <SelectBox
            label="Nhóm chỉ tiêu"
            dataSource="/stats-index-groups/list"
            mapping={{ value: "id", label: "name" }}
            placeholder="Chọn nhóm chỉ tiêu"
            value={queryFilter.groupId}
            onChange={(e) => handleChange("groupId", e.value)}
            required={false}
            width="100%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <SelectBox
            label="Chỉ tiêu"
            dataSource={`/stats-indices${
              queryFilter.groupId ? "?groupId=" + queryFilter.groupId : ""
            }`}
            mapping={{ value: "code", label: "name" }}
            dependency={[queryFilter.groupId]}
            placeholder="Chọn chỉ tiêu"
            value={queryFilter.statsIndexId}
            onChange={(e) => handleChange("statsIndexId", e.value)}
            required={false}
            width="100%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <SelectBox
            isMulti
            label="Quận/huyện"
            dataSource="/area/districts?parentCode=T008"
            mapping={{ value: "areaCode", label: "name" }}
            placeholder="Tất cả"
            value={queryFilter.district}
            required={false}
            onChange={(e) =>
              handleChange(
                "district",
                e.map((item) => item.value)
              )
            }
            width="100%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <DateRangePicker
            value={[queryFilter.fromDate, queryFilter.endDate]}
            setDateRange={(e) => {
              setQueryFilter({ ...queryFilter, fromDate: e[0], endDate: e[1] });
            }}
            placeholder="Từ ngày - Đến ngày"
            label="Giai đoạn"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <SelectBox
            label="Loại biểu đồ"
            options={typeChartOptions}
            placeholder="Chọn loại biểu đồ"
            value={queryFilter.typeChart}
            onChange={(e) => handleChange("typeChart", e.value)}
            required={false}
            width="100%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <ButtonFilter onClear={handleClearFilter} onSearch={fetchData} />
        </Grid>
      </Grid>
      <Grid item xs={12} mt={2}>
        <SuiBox sx={{ backgroundColor: "#fff" }}>
          {queryFilter.typeChart === "PIE_CHART" ? (
            <DefaultDoughnutChart chart={doughnutChartData} height="30.25rem" title={titleChart} />
          ) : (
            <VerticalBarChart chart={BarChartData.chart} height="20.25rem" title={titleChart} />
          )}
        </SuiBox>
      </Grid>
      {/* <PieChart /> */}
    </>
  );
}

export default Chart;
