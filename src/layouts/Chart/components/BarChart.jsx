import { BarChart as Bar } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import AppBar from "@mui/material/AppBar";

const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: "Jan",
    District: "Quận 1",
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: "Fev",
    District: "Quận 3",
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: "Mar",
    District: "Quận 4",
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: "Apr",
    District: "Quận 5",
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: "May",
    District: "Quận 6",
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: "June",
    District: "Quận 7",
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: "July",
    District: "Quận 8",
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: "Aug",
    District: "Quận 10",
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: "Sept",
    District: "Quận 11",
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: "Oct",
    District: "Quận 12",
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: "Nov",
    District: "Q.Bình Tân",
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: "Dec",
    District: "Q. Bình Thạnh",
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: "Dec",
    District: "Q.Gò Vấp",
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: "Dec",
    District: "Q. Phú Nhuận",
  },
];
const valueFormatter = (value) => `${value} Triệu`;
const chartSetting = {
  series: [{ dataKey: "seoul", label: "Chi cho hạ tầng số", valueFormatter, color: "#FF7272" }],
  height: 400,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

function BarChart() {
  return (
    <AppBar
      sx={{
        // background: "transparent",
        background: "white",
        position: "relative",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.03)",
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    >
      <Bar
        dataset={dataset}
        xAxis={[{ scaleType: "band", dataKey: "District" }]}
        {...chartSetting}
        grid={{ horizontal: true }}
      />
    </AppBar>
  );
}

export default BarChart;
