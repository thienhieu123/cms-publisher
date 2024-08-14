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

// @mui material components
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useSoftUIController } from "~/context";
import { setAlertMessage } from "~/context/common/action";
// Soft UI Dashboard React components
// import { resetPassword } from "api/common";
import curved6 from "~/assets/images/curved-images/curved14.jpg";
import PopupRoot from "~/components/Popup/PopupRoot";
import ButtonControl from "~/components/ButtonControl";
import { Grid, Typography } from "@mui/material";
import SuccessIcon from "~/assets/images/icons/successIcon.svg";
import SuiBox from "~/components/SuiBox";
import PhoneNumber from "./component/PhoneNumber";
import OTP from "./component/OTP";
import ResetPassword from "./component/resetPassword";
import TitleKTS from "../Components/TitleKTS";
import BasicLayout from "../Components/BasicLayout";

const step = {
  phoneInput: 0,
  otpInput: 1,
  newPasswordInput: 2,
};
function Forgot() {
  const [, dispatch] = useSoftUIController();
  const [currentStep, setCurrentStep] = useState(step.phoneInput);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  function handleError(messageError) {
    setAlertMessage(dispatch, {
      message: messageError,
      type: "error",
      openAlert: true,
    });
  }

  function handleResetPassword() {
    // resetPassword(phoneNumber, password, password).then((result) => {
    //   if (result.message.status === 200) {
    // navigate("/authentication/sign-in", { state: { ShowModal: true } });
    // }
    setOpenConfirmPopup(true);
  }

  const popupConfirm = (
    <PopupRoot open={openConfirmPopup} setOpen={setOpenConfirmPopup}>
      <Grid container sx={{ display: "flex", justifyContent: "center" }} my={1}>
        <Grid item pb={2}>
          <SuiBox component="img" src={SuccessIcon} alt="Success Icon" />
          <Typography pb={0.5} sx={{ fontSize: "17px", fontWeight: "600" }}>
            Khôi phục mật khẩu thành công!
          </Typography>
          <Typography
            pb={0.5}
            sx={{ fontSize: "12px", fontWeight: "400", color: "var(--gray-80)" }}
          >
            Vui lòng đăng nhập lại với mật khẩu mới
          </Typography>
        </Grid>
        <ButtonControl
          submitText="Xác nhận"
          hiddenCancel
          handleSubmit={() => setOpenConfirmPopup(false)}
          justifyContent="center"
          isHideImageSubmit
        />
      </Grid>
    </PopupRoot>
  );

  return (
    <BasicLayout
      title="Welcome!"
      description="Use these awesome forms to login or create new account in your project for free."
      image={curved6}
    >
      <TitleKTS />
      {currentStep === step.phoneInput && (
        <PhoneNumber
          setStep={setCurrentStep}
          setPhoneNumber={setPhoneNumber}
          phoneNumber={phoneNumber}
        />
      )}
      {/* popup */}
      {popupConfirm}
      {/*  */}
      {currentStep === step.otpInput && (
        <OTP setStep={setCurrentStep} phoneNumber={phoneNumber} handleError={handleError} />
      )}

      {currentStep === step.newPasswordInput && (
        <ResetPassword
          onReset={handleResetPassword}
          handleError={handleError}
          phoneNumber={phoneNumber}
        />
      )}
    </BasicLayout>
  );
}

export default Forgot;
