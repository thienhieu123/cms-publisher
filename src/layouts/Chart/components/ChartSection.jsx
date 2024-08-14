import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonFilter from "~/components/ButtonFilter";
import DateRangePicker from "~/components/DateRangePicker";
import SelectDistrictBox from "~/components/SelectAreaGroup/SelectDistrictBox";
import SelectBox from "~/components/SelectBox";
import SuiBox from "~/components/SuiBox";
import VerticalBarChart from "~/examples/Charts/BarCharts/VerticalBarChart";
import DefaultDoughnutChart from "~/examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import { BarChartDataSample, DoughnutChartDataSample, typeChartOptions } from "~/utils/variable";
import CloseIcon from "@mui/icons-material/Close";
import { getChartByCriteria } from "~/api/common";
import useErrorMessage from "~/hooks/useErrorMessage";
import moment from "moment/moment";
import { generateColors, getStartDateDefault } from "~/utils/utils";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";

const initialValues = {
  district: [],
  fromDate: getStartDateDefault(),
  toDate: new Date(),
  typeChart: "PIE_CHART",
  criteria: "",
  groupId: "",
};
const styleCloseIcon = {
  display: "flex",
  width: "100%",
  justifyContent: "flex-end",
  margin: "15px 5px 0 0 ",
  zIndex: "2",
};

export default function ChartSection({ initialProps, onClose, updateState }) {
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [id, setId] = useState(null);
  const { setErrorMessage } = useErrorMessage();
  const [doughnutChartData, setDoughnutChartData] = useState(DoughnutChartDataSample);
  const [BarChartData, setBarChartData] = useState(BarChartDataSample);
  const [titleChart, setTitleChart] = useState("");
  useEffect(() => {
    if (initialProps) {
      const { id, ...rest } = initialProps;
      if (rest) setQueryFilter(rest);
      setId(id);
    }
  }, [initialProps]);

  const fetchData = () => {
    const { district, fromDate, toDate, typeChart, criteria } = queryFilter;
    if (criteria) {
      getChartByCriteria({
        groups: district,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        chartCategory: typeChart,
        indexCode: criteria,
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
    } else {
      setErrorMessage("Vui lòng chọn chỉ tiêu");
      setDoughnutChartData(DoughnutChartDataSample);
      setBarChartData(BarChartDataSample);
      setTitleChart("");
    }
  };

  const handleChange = (name, value) => {
    updateState(id, { [name]: value });
  };

  const handleClearFilter = () => {
    updateState(id, initialValues);
  };

  useEffect(() => {
    if (id !== null && queryFilter?.criteria) {
      fetchData();
    }
  }, []);

  const handleClose = () => {
    onClose(id);
  };

  useEnterKeyEvent([], fetchData);

  return (
    <Grid container spacing={2}>
      <div style={styleCloseIcon}>
        <CloseIcon className="close" sx={{ cursor: "pointer" }} onClick={handleClose} />
      </div>
      <Grid container item xs={12} spacing={3} paddingTop="0 !important">
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
            isHaveAllOptions={false}
            width="100%"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <SelectBox
            label="Nhóm chỉ tiêu"
            dataSource="/stats-index-groups/list"
            mapping={{ value: "id", label: "name" }}
            placeholder="Chọn nhóm chỉ tiêu"
            value={queryFilter.groupId}
            onChange={(e) => handleChange("groupId", e.value)}
            required={false}
            isHaveAllOptions={false}
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
            value={queryFilter.criteria}
            isHaveAllOptions={false}
            onChange={(e) => handleChange("criteria", e.value)}
            required
            width="100%"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <DateRangePicker
            value={[queryFilter.fromDate, queryFilter.toDate]}
            setDateRange={(e) => {
              updateState(id, { fromDate: e[0], toDate: e[1] });
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
      <Grid item xs={12}>
        <SuiBox sx={{ backgroundColor: "#fff" }}>
          {queryFilter.typeChart === "PIE_CHART" ? (
            <DefaultDoughnutChart chart={doughnutChartData} height="30.25rem" title={titleChart} />
          ) : (
            <VerticalBarChart chart={BarChartData.chart} height="20.25rem" title={titleChart} />
          )}
        </SuiBox>
      </Grid>
    </Grid>
  );
}
