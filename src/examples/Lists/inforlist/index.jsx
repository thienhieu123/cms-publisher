/* eslint-disable no-unneeded-ternary */
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

// react-routers components
// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";

function InforList({ title, profiles }) {
  const renderInforList = profiles.map(({ name, description, bgColor }) => (
    <SuiBox
      key={name}
      component="li"
      display="flex"
      alignItems="center"
      py={1}
      mb={1}
      bgColor={bgColor ? bgColor : "light"}
      pr={2}
      pl={2}
      pb={1}
      pt={1}
      borderRadius="0.8rem"
    >
      <SuiBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
        <SuiTypography color={bgColor ? "white" : "black"} variant="caption">
          {name}
        </SuiTypography>
        <SuiTypography variant="button" color={bgColor ? "white" : "black"} fontWeight="medium">
          {description}
        </SuiTypography>
      </SuiBox>
    </SuiBox>
  ));

  return (
    <Card sx={{ height: "100%", boxShadow: "0rem 0rem 0rem 0rem #ffff" }}>
      <SuiBox py={2}>
        <SuiTypography variant="h5" fontSize="1.5rem" color="black" fontWeight="regular">
          {title}
        </SuiTypography>
      </SuiBox>
      <SuiBox>
        <SuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {renderInforList}
        </SuiBox>
      </SuiBox>
    </Card>
  );
}

// Typechecking props for the ProfilesList
InforList.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  profiles: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

export default InforList;
