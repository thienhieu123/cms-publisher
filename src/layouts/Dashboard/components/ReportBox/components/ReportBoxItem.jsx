/* eslint-disable react/prop-types */
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

// import DoubleTick from "~/assets/images/icons/daikin-admin/dasboard/DoubleTick.svg";
// import IncidentWarning from "~/assets/images/icons/daikin-admin/dasboard/IncidentWarning.svg";
// import MoveWarning from "~/assets/images/icons/daikin-admin/dasboard/MoveWarning.svg";
import IconWarning from "~/assets/images/icons/IconWarning.svg";
// import PopupRoot from "~/components/Popup/PopupRoot";
// import { useState } from "react";
// import PopUpWarning from "./Warning";

// function ReportBoxItem({ date, id, messages, danger, noGutter, reportId, expieredDate }) {
function ReportBoxItem({ messages, danger, noGutter, code, setOpen }) {
  const isMessages = messages !== "";
  const isDanger = isMessages && danger;
  // const [openWarning, setOpenWarning] = useState(false);
  // const isNotDanger = isMessages && !danger;
  return (
    <SuiBox
      component="li"
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      py="5px"
      pl={3}
      mb={noGutter ? 0 : 1}
      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: `#FFF0EE`,
          borderRadius: "10px",
        },
      }}
      onClick={() => {
        setOpen(true);
      }}
    >
      {/* <PopupRoot
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "transparent",
        }}
        open={openWarning}
        setOpen={setOpenWarning}
        onClose={true}
      >
        <PopUpWarning close={() => setOpenWarning(false)} onPopUp={openWarning} />
      </PopupRoot> */}
      <SuiBox display="flex" alignItems="center">
        <SuiBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          lineHeight={0}
          mr="50px"
          height="2.3rem"
          width="2.3rem"
          // bgColor={isDanger || !isMessages ? "var(--red-30)" : "var(--green-30)"}
          borderRadius="20%"
        >
          {/* {!messages ? <SuiBox component="img" src={MoveWarning} /> : ""} */}
          {isDanger ? <SuiBox component="img" src={IconWarning} /> : ""}
          {/* {isNotDanger ? <SuiBox component="img" src={DoubleTick} /> : ""} */}
        </SuiBox>
      </SuiBox>
      <SuiBox lineHeight={1.3}>
        {/* {reportId && (
          <SuiTypography
            variant="button"
            color="black"
            fontSize="14px"
            sx={{
              fontWeight: "600",
            }}
          >
            {reportId}-
          </SuiTypography>
        )} */}
        {/* {date && (
          <SuiTypography
            display="block"
            variant="button"
            color="black"
            fontSize="14px"
            sx={{
              fontWeight: "600",
            }}
          >
            {date}
          </SuiTypography>
        )} */}
        <SuiTypography
          variant="caption"
          color="black"
          fontSize="14px"
          sx={{
            fontWeight: "600",
            textTransform: "none",
          }}
        >
          {messages}
        </SuiTypography>
        <SuiBox>
          {/* {id && (
            <SuiTypography variant="caption" fontWeight="regular" color="black" fontSize="13px">
              Mã thiết bị: {id}
            </SuiTypography>
          )} */}
          {code && (
            <SuiTypography variant="caption" fontWeight="regular" color="black" fontSize="13px">
              {code}
            </SuiTypography>
          )}
        </SuiBox>
      </SuiBox>
    </SuiBox>
  );
}

// Setting default values for the props of Invoice
ReportBoxItem.defaultProps = {
  noGutter: false,
  messages: "",
  danger: false,
  // reportId: "",
  code: "",
  // id: "",
};

// Typechecking props for the Invoice
ReportBoxItem.propTypes = {
  // date: PropTypes.string.isRequired,
  // id: PropTypes.string,
  messages: PropTypes.string,
  danger: PropTypes.bool,
  noGutter: PropTypes.bool,
  // reportId: PropTypes.string,
  code: PropTypes.string,
};

export default ReportBoxItem;
