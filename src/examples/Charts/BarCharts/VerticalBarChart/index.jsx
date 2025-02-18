/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useMemo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Bar } from "react-chartjs-2";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";

// VerticalBarChart configurations
import configs from "~/examples/Charts/BarCharts/VerticalBarChart/configs";

// Soft UI Dashboard React base styles
import colors from "~/assets/theme/base/colors";

function VerticalBarChart({ title, description, height, chart }) {
  const chartDatasets = chart.datasets
    ? chart.datasets.map((dataset) => ({
        ...dataset,
        weight: 5,
        borderWidth: 0,
        borderRadius: 4,
        // backgroundColor: colors[dataset.color]
        //   ? colors[dataset.color || "dark"].main
        //   : colors.dark.main,
        backgroundColor: dataset.color ? dataset.color : colors.dark.main,
        fill: false,
        maxBarThickness: 35,
        datalabels: {
          anchor: "end",
          clamp: false,
          align: "end",
          offset: 0,
          //   formatter: (v) => `${v} %`,
        },
      }))
    : [];

  const { data, options } = configs(chart.labels || [], chartDatasets);

  const renderChart = (
    <SuiBox p={2} sx={{ background: "#fff" }}>
      {useMemo(
        () => (
          <SuiBox height={height}>
            <Bar data={data} options={options} />
          </SuiBox>
        ),
        [chart, height]
      )}
      {title || description ? (
        <SuiBox
          px={description ? 1 : 0}
          pt={description ? 1 : 0}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          {title && (
            <SuiBox mb={1}>
              <SuiTypography variant="h6">{title}</SuiTypography>
            </SuiBox>
          )}
          <SuiBox mb={2}>
            <SuiTypography component="div" variant="button" fontWeight="regular" color="text">
              {description}
            </SuiTypography>
          </SuiBox>
        </SuiBox>
      ) : null}
    </SuiBox>
  );

  return title || description ? <Card sx={{ boxShadow: "none" }}>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of VerticalBarChart
VerticalBarChart.defaultProps = {
  title: "",
  description: "",
  height: "19.125rem",
};

// Typechecking props for the VerticalBarChart
VerticalBarChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.any)).isRequired,
};

export default VerticalBarChart;
