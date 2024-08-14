import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SuiBox from "~/components/SuiBox";
import VerticalBarChart from "~/examples/Charts/BarCharts/VerticalBarChart";
import GreenArrowUp from "~/assets/images/icons/green-arrow-up.svg";
import { BarChartDataSample } from "~/utils/variable";
import { getDashboardIncreaseList } from "~/api/common";
import { handleResponse } from "~/utils/utils";
import useErrorMessage from "~/hooks/useErrorMessage";

export default function ChartDashboard({}) {
  const [time, setTime] = useState("YEAR");
  const [BarChartData, setBarChartData] = useState(BarChartDataSample);
  const setErrorMessage = useErrorMessage();

  const fetchData = async () => {
    try {
      const response = await getDashboardIncreaseList({ indexCode: time });
      const [status, dataResponse] = handleResponse(response);
      if (status) {
        const dataChart = {
          chart: {
            ...BarChartData.chart,
            labels: dataResponse?.map((data) => data?.district),
            datasets: [
              { data: dataResponse?.map((data) => data.increase_percent), color: "#F8ADAD" },
            ],
          },
        };
        setBarChartData(dataChart);
      }
    } catch (err) {
      setErrorMessage(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [time]);

  return (
    <>
      <Grid item xs={12} display="flex" justifyContent="space-between">
        <Grid item xs={11}>
          <Typography fontSize={24} fontWeight={600} color="#2D3442">
            Biểu đồ giá trị tăng thêm kinh tế số theo quận/huyện
          </Typography>
        </Grid>
        <Grid item>
          <Select value={time} onChange={(event) => setTime(event.target.value)}>
            <MenuItem value="MONTH">Tháng này</MenuItem>
            <MenuItem value="QUARTER">Qúy này</MenuItem>
            <MenuItem value="YEAR">Năm này</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={12} xl={12} display="flex" justifyContent="center" mt={1}>
        <SuiBox sx={{ border: "1px solid #F10035", width: "100%" }} />
      </Grid>
      <Grid item xs={12} mt={2}>
        <VerticalBarChart
          chart={BarChartData?.chart}
          height="20.25rem"
          title="Thống kê các chỉ tiêu kinh tế số theo từng quận/huyện ở thành phố Hồ Chí Minh"
        />
      </Grid>
    </>
  );
}
