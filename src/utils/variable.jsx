export const DoughnutChartDataSample = {
  labels: [],
  datasets: {
    label: "",
    data: [],
    backgroundColor: [
      "#FF3784",
      "#36A2EB",
      "#4BC0C0",
      "#F77825",
      "#9966FF",
      "#00A8C6",
      "#379F7A",
      "#CC2738",
      "#8B628A",
      "#8FBE00",
      "#8B628A",
      "#8FBE00",
    ],
  },
  cutout: "0%",
};

export const BarChartDataSample = {
  chart: {
    labels: [],
    datasets: [{ label: "", data: [], color: "#FF7272", unit: "a12" }],
  },
};

export const typeChartOptions = [
  { value: "PIE_CHART", label: "Biểu đồ tròn" },
  { value: "BAR_CHART", label: "Biểu đồ cột" },
];
