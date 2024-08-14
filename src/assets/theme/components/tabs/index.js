/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Soft UI Dashboard React base styles
// import colors from "~/assets/theme/base/colors";
import borders from "~/assets/theme/base/borders";
// import boxShadows from "~/assets/theme/base/boxShadows";

// Soft UI Dashboard React helper functions
// import pxToRem from "~/assets/theme/functions/pxToRem";

// const { info } = colors;
const { borderRadius } = borders;
// const { tabsBoxShadow } = boxShadows;

const tabs = {
  styleOverrides: {
    root: {
      position: "relative",
      // backgroundColor: grey[100],
      borderRadius: borderRadius.lg,
      minHeight: "unset",
      // padding: pxToRem(10),
    },

    flexContainer: {
      height: "100%",
      position: "relative",
      zIndex: 10,
      padding: "0px 16px",
    },

    fixed: {
      overflow: "unset !important",
      overflowX: "unset !important",
    },

    vertical: {
      "& .MuiTabs-indicator": {
        width: "100%",
      },
    },

    indicator: {
      // padding: pxToRem(2),
      // borderRadius: borderRadius.md,
      // backgroundColor: info.main,
      // boxShadow: tabsBoxShadow.indicator,
      height: "15px",
      backgroundColor: "initial",
      borderBottom: "2px solid red",
      borderRadius: borderRadius.md,
      transition: "all 500ms ease",
    },
  },
};

export default tabs;
