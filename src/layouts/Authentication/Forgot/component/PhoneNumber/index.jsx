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
// import { Link } from "react-router-dom";

// @mui material components
import PropType from "prop-types";
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import SuiButton from "~/components/SuiButton";
import { useNavigate } from "react-router-dom";
import { useSoftUIController } from "~/context";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { isRequired, verifyPhoneNumber } from "~/utils/verify";
// import { getOTPForgotPassword } from "~/api/common";
import InputPhoneNumber from "./inputPhoneNumber";
import useErrorMessage from "~/hooks/useErrorMessage";

function PhoneNumber(props) {
  const { setStep, setPhoneNumber, phoneNumber } = props;
  const navigate = useNavigate();
  const [, dispatch] = useSoftUIController();

  // function handleError(messageError) {
  //   setAlertMessage(dispatch, {
  //     message: messageError,
  //     type: "error",
  //     openAlert: true,
  //   });
  // }
  const { setErrorMessage } = useErrorMessage();

  function handleNextStep() {
    try {
      isRequired(phoneNumber, "Số Điện Thoại");
      verifyPhoneNumber(phoneNumber);
    } catch (e) {
      setErrorMessage(e);
      return false;
    }
    setStep((current) => current + 1);
    return true;
  }

  useEnterKeyEvent([phoneNumber], handleNextStep);
  return (
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
        Khôi phục mật khẩu
      </SuiTypography>
      <SuiBox display="flex" mb="26px" justifyContent="center">
        <SuiTypography
          sx={{
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "400",
            color: "var(--gray-80)",
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
            color: "rgba(9, 101, 186, 1)",
            textTransform: "none",
          }}
        >
          Đăng nhập
        </SuiTypography>
      </SuiBox>
      <SuiBox pt={0} pb={3} px={3}>
        <SuiBox mb={2}>
          <SuiTypography
            sx={{
              fontSize: "14px",
              color: "var(--gray-100)",
              fontWeight: "600",
              textTransform: "none",
            }}
            mb={0.7}
          >
            Số Điện Thoại
          </SuiTypography>
          <InputPhoneNumber
            sx={{ height: "53px", backgroundColor: "var(--blue-gray-line) !important" }}
            type="tel"
            border="none"
            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
            placeholder="Nhập số điện thoại"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
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
            onClick={handleNextStep}
          >
            <SuiTypography whiteSpace="nowrap" variant="body2" color="white" fontSize="14px">
              Tiếp tục
            </SuiTypography>
          </SuiButton>
        </SuiBox>
      </SuiBox>
    </SuiBox>
  );
}

PhoneNumber.defaultProps = {
  setStep: () => {},
  setPhoneNumber: () => {},
  phoneNumber: "",
};

PhoneNumber.propTypes = {
  setStep: PropType.func,
  setPhoneNumber: PropType.func,
  phoneNumber: PropType.string,
};

export default PhoneNumber;
