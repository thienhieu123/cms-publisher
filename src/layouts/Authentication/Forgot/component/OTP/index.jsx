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

// import { useState } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";
import PropType from "prop-types";
// @mui material components
// import Card from "@mui/material/Card";
// import Checkbox from "@mui/material/Checkbox";
// import * as React from "react";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
// import SuiInput from "~/components/SuiInput";
import SuiButton from "~/components/SuiButton";
// import TextField from "@mui/material/TextField";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OtpInput from "react-otp-input";
import "./Otp.css";
import { useState } from "react";
// import { verifyOTPForgotPassword, getOTPForgotPassword } from "~/api/common";
import { isRequired, isMinLength } from "~/utils/verify";
import { setAlertMessage } from "~/context/common/action";
import { useSoftUIController } from "~/context";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";

function OTP(props) {
  // const { setStep, phoneNumber, handleError } = props;
  const { setStep, phoneNumber } = props;
  const navigate = useNavigate();
  const [outDate, setOutDate] = useState(false);
  const [otp, setOTP] = useState("");
  const [, dispatch] = useSoftUIController();
  // const getOtpAgain = () => {
  //   getOTPForgotPassword(phoneNumber).then((res) => {
  //     if (res.message.status === 200) {
  //       setAlertMessage(dispatch, {
  //         message: `Đã gửi lại mã OTP`,
  //         type: "success",
  //         openAlert: true,
  //       });
  //       setOTP("");
  //     } else {
  //       setAlertMessage(dispatch, {
  //         message: res.message?.data.message,
  //         type: "error",
  //         openAlert: true,
  //       });
  //     }
  //   });
  // };
  const verifyOTP = (value) => {
    try {
      isRequired(value, "Mã OTP");
      isMinLength(value, "Mã OTP", 6);
    } catch (e) {
      setAlertMessage(dispatch, {
        message: e,
        type: "error",
        openAlert: true,
      });
      return false;
    }
    return true;
  };
  const handleSubmit = () => {
    const verifyResult = verifyOTP(otp);
    if (verifyResult)
      if (otp === "error") {
        setOutDate(true);
      } else {
        setStep((current) => current + 1);
        // verifyOTPForgotPassword(phoneNumber, otp).then((result) => {
        //   if (result.message.status === 200) {
        //     setStep((current) => current + 1);
        //   } else if (result.message.status !== 200) {
        //     handleError(result.message.data.message);
        //   }
        // });
      }
  };

  useEnterKeyEvent([phoneNumber, otp], handleSubmit);
  return (
    // <BasicLayout
    //   title="Welcome!"
    //   description="Use these awesome forms to login or create new account in your project for free."
    //   image={curved6}
    // >

    // </BasicLayout>
    <SuiBox>
      <SuiTypography
        sx={{
          position: "relative",
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "7px",
        }}
        textAlign="center"
      >
        Khôi phục đăng nhập
      </SuiTypography>
      <SuiBox display="flex" mb="26px" justifyContent="center">
        <SuiTypography
          sx={{
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "400",
            color: "#B5B5C3",
            textTransform: "none",
          }}
          textAlign="center"
          onClick={() => navigate("/authentication/sign-in")}
        >
          Trở về
        </SuiTypography>
        <SuiTypography
          textAlign="center"
          onClick={() => navigate("/authentication/sign-in")}
          sx={{
            cursor: "pointer",
            marginLeft: "6px",
            fontSize: "18px",
            fontWeight: "400",
            color: "var(--blue-blue-100)",
            textTransform: "none",
          }}
        >
          Đăng nhập
        </SuiTypography>
      </SuiBox>
      <SuiBox pt={0} mb={3} textAlign="center">
        <SuiTypography
          sx={{
            fontSize: "14px",
            width: "100%",
            color: "var(--gray-80)",
            textTransform: "none",
          }}
          // variant="h5"
          fontWeight="400"
        >
          {outDate
            ? "Mã OTP hết hạn, vui lòng nhập lại mã OTP mới"
            : "Vui lòng nhập mã OTP đã được gửi đến số điện thoại"}
        </SuiTypography>
        <SuiTypography
          sx={{
            fontSize: "14px",
            width: "100%",
            color: "#7e8299",
            fontWeight: "700",
          }}
        >
          {`${phoneNumber.substr(0, 3)}*****${phoneNumber.substr(8, 2)}`}
        </SuiTypography>
      </SuiBox>
      <SuiBox pt={0} pb={3} px={3}>
        <SuiBox component="form" role="form">
          {/* <SuiTypography
            sx={{
              fontSize: "14px",
              color: "var(--gray-100)",
              fontWeight: "600",
            }}
            mb={0.7}
          >
            Mã OTP
          </SuiTypography> */}
          <OtpInput
            onChange={(e) => setOTP(e)}
            value={otp}
            numInputs={6}
            separator={<span> </span>}
            isInputNum
            inputStyle="inputStyle"
          />
          <SuiBox p={0} display="flex" justifyContent="center" mt="26px">
            <SuiTypography
              sx={{
                position: "relative",
                fontSize: "14px",
                color: "var(--gray-80)",
                fontWeight: "500",
                textTransform: "none",
              }}
            >
              {outDate ? null : "Không nhận được mã OTP"}
            </SuiTypography>
            <SuiTypography
              sx={{
                cursor: "pointer",
                fontSize: "14px",
                color: "var(--blue-blue-100)",
                textDecoration: "underline",
                fontWeight: "500",
                textTransform: "none",
              }}
              ml={0.5}
              // onClick={() => getOtpAgain()}
            >
              Gửi lại OTP
            </SuiTypography>
          </SuiBox>
          <SuiBox mt={4} mb={1} textAlign="center">
            <SuiButton
              size="small"
              color="var(--red-200)"
              circular
              sx={{
                background: "var(--red-200)",
                borderRadius: "5px",
                padding: "8px 24px",
                width: "100%",
              }}
              onClick={handleSubmit}
            >
              <SuiTypography whiteSpace="nowrap" variant="body2" color="white" fontSize="14px">
                Xác nhận
              </SuiTypography>
            </SuiButton>
          </SuiBox>
        </SuiBox>
      </SuiBox>
    </SuiBox>
  );
}

OTP.defaultProps = {
  phoneNumber: "",
  setStep: () => {},
  // handleError: () => {},
};

OTP.propTypes = {
  phoneNumber: PropType.string,
  setStep: PropType.func,
  // handleError: PropType.func,
};

export default OTP;
