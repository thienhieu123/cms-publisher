import { PieChart as Pie, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import AppBar from "@mui/material/AppBar";

const data = [
  { id: 0, value: 2, label: "Quận 1" },
  { id: 1, value: 15, label: "Quận 2" },
  { id: 2, value: 15, label: "Quận 3" },
  { id: 3, value: 20, label: "Quận 4" },
];

const size = {
  width: 600,
  height: 400,
};

const palette = ["red", "blue", "green", "#E43B26"];
const sum = data.reduce((accumulator, object) => accumulator + object.value, 0);
function PieChart() {
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
      <Pie
        colors={palette}
        series={[
          {
            arcLabel: (item) => `${((item.value / sum) * 100).toFixed(1)} %`,
            arcLabelMinAngle: 15,
            data,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "bold",
            fontSize: "16px",
          },
        }}
        {...size}
      />
    </AppBar>
  );
}

export default PieChart;
