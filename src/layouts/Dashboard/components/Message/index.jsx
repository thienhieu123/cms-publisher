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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";

function Message({ avatar, name, message }) {
  return (
    <SuiBox
      component="li"
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      py={1}
      pr={1}
    >
      <SuiBox lineHeight={1} mr="5%">
        <SuiBox
          display="flex"
          alignItems="center"
          position="relative"
          minHeight="2rem"
          borderRadius="xl"
          width="2.2rem"
          height="2.2rem"
          sx={{
            backgroundImage: `url(${avatar})`,
            backgroundSize: "cover",
            backgroundPosition: "50%",
            overflow: "hidden",
          }}
        />
      </SuiBox>
      <SuiBox
        sx={{ width: "85%", textOverflow: "ellipsis" }}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        <SuiTypography width="100%" variant="button" fontWeight="regular" color="black">
          {name}
        </SuiTypography>
        <SuiTypography
          variant="button"
          fontWeight="regular"
          color="text"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          width="100%"
          overflow="hidden"
          sx={{
            "@media (max-width: 1200px)": {
              width: "100%",
            },
          }}
        >
          {message}
        </SuiTypography>
      </SuiBox>
    </SuiBox>
  );
}

// Typechecking props for the Invoice
Message.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Message;
