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

import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { login } from "~/api/common";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconSuccess from "~/assets/images/ResetPasswordSuccess.svg";
import curved6 from "~/assets/images/curved-images/curved14.jpg";
import InputPassword from "~/components/InputPassword";
import SuiBox from "~/components/SuiBox";
import SuiButton from "~/components/SuiButton";
import SuiTypography from "~/components/SuiTypography";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { isMaxLength, isMinLength, isRequired } from "~/utils/verify";
import { clearLocalStorage } from "~/utils/storage";
import BasicLayout from "../Components/BasicLayout";
import TitleKTS from "../Components/TitleKTS";
import OTP from "./OTP";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import ButtonControl from "~/components/ButtonControl";

const step = {
  phoneNumberInput: 0,
  otpInput: 1,
};

function SignIn() {
  const [phone, setPhone] = useState(JSON.parse(localStorage.getItem("phoneNumber")));
  localStorage.removeItem("phoneNumber");
  const [currentStep, setCurrentStep] = useState(step.phoneNumberInput);
  const [password, setPassword] = useState({
    password: "",
    showPassword: false,
  });
  const location = useLocation();
  const [open, setOpen] = useState(location.state?.ShowModal || false);
  const handleClose = () => {
    setOpen(false);
  };

  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();

  const verifyLogin = (username, pass) => {
    try {
      isRequired(username, "Số Điện Thoại");
      isMaxLength(username, "Số Điện Thoại", 10);
      isMinLength(username, "Số Điện Thoại", 10);
      isRequired(pass, "Mật khẩu");
      isMinLength(pass, "Mật khẩu", 8);
    } catch (e) {
      setErrorMessage(e);
      return false;
    }
    return true;
  };

  function handleLogin() {
    const result = verifyLogin(phone, password.password);
    if (result) {
      login(phone, password.password).then(
        (res) => {
          if (res.message.status === 200) {
            setCurrentStep(1);
            setSuccessMessage(res.message.data.data.otp);
          } else {
            setErrorMessage(res.message.data.message);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  function handleLoginSSO() {
    return null;
  }

  const [isBackButtonClicked, setBackbuttonPress] = useState(false);

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    if (isBackButtonClicked) {
      setBackbuttonPress(false);
    } else {
      window.history.pushState(null, null, window.location.pathname);
      setBackbuttonPress(true);
    }
  };

  useEnterKeyEvent([phone, password], handleLogin, currentStep === 0);

  useEffect(() => {
    clearLocalStorage();
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  return currentStep === 0 ? (
    <BasicLayout
      title="Welcome!"
      description="Use these awesome forms to login or create new account in your project for free."
      image={curved6}
    >
      <TitleKTS />
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingLeft: "30px",
              paddingRight: "30px",
            }}
          >
            <img
              src={IconSuccess}
              alt="Success"
              style={{ width: "fit-content", height: "fit-content" }}
            />
            <p>Khôi phục mật khẩu thành công!</p>
            <p>Vui lòng đăng nhập lại với mật khẩu mới</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <SuiButton
            size="small"
            color="var(--red-200)"
            circular
            sx={{
              background: "var(--red-200)",
              borderRadius: "5px",
              padding: "8px 24px",
            }}
            onClick={handleClose}
          >
            <SuiTypography whiteSpace="nowrap" variant="body2" color="white" fontSize="14px">
              Xác nhận
            </SuiTypography>
          </SuiButton>
        </DialogActions>
      </Dialog>
      <Grid item xs={10} sx={{ margin: "auto" }}>
        <SuiTypography
          textAlign="center"
          sx={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "28px",
            "@media only screen and (max-height: 650px)": {
              fontSize: "20px",
            },
          }}
          variant="h3"
        >
          Đăng Nhập
        </SuiTypography>
        <SuiBox>
          <SuiBox component="form" role="form">
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
              <TextField
                value={phone || ""}
                onChange={(e) => setPhone(e.target.value)}
                sx={{
                  width: "100%",
                  "& .MuiFilledInput-root": {
                    height: "44px !important",
                    backgroundColor: "var(--blue-gray-line) !important",
                    border: "none",
                  },
                  "& .MuiFilledInput-input": {
                    height: "28px",
                    width: "100% !important",
                    "::placeholder": {
                      fontStyle: "italic",
                    },
                  },
                  "& .MuiFilledInput-root:before,& .MuiFilledInput-root:after": {
                    border: "none",
                    content: "none",
                  },
                  "& label.Mui-focused": {
                    color: "#4acaf5",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#aeaeae",
                  },
                  "& .Mui-focused": {
                    borderColor: "#4acaf5 !important",
                  },
                }}
                // label="Số Điện Thoại"
                variant="filled"
                placeholder="Nhập số điện thoại"
              />
            </SuiBox>
            <SuiBox mb={2}>
              <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
                <SuiTypography
                  sx={{
                    fontSize: "14px",
                    color: "var(--gray-100)",
                    fontWeight: "600",
                    textTransform: "none",
                  }}
                  mb={0.7}
                >
                  Mật khẩu
                </SuiTypography>
                {/* <SuiTypography
                  component={Link}
                  to="/authentication/forgot-password"
                  variant="button"
                  sx={{
                    cursor: "pointer",
                    userSelect: "none",
                    color: "var(--blue-blue-100)",
                    fontSize: "14px",
                    textTransform: "none",
                    fontWeight: "400",
                  }}
                >
                  Quên mật khẩu?
                </SuiTypography> */}
              </Grid>
              <InputPassword placeholder="Nhập mật khẩu" value={password} onChange={setPassword} />
            </SuiBox>
            {/* <SuiBox display="flex" alignItems="center"></SuiBox> */}
            <Grid
              sx={{ display: "flex", flexDirection: "column", marginTop: "15px", rowGap: "15px" }}
            >
              <SuiBox textAlign="center">
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
                  onClick={handleLogin}
                >
                  <SuiTypography
                    whiteSpace="nowrap"
                    variant="body2"
                    color="white"
                    fontSize="14px"
                    sx={{
                      fontWeight: "700",
                    }}
                  >
                    Đăng nhập
                  </SuiTypography>
                </SuiButton>
              </SuiBox>
              <SuiBox textAlign="center">
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
                  onClick={handleLoginSSO}
                >
                  <SuiTypography
                    whiteSpace="nowrap"
                    variant="body2"
                    color="white"
                    fontSize="14px"
                    sx={{
                      fontWeight: "700",
                    }}
                  >
                    Đăng nhập SSO
                  </SuiTypography>
                </SuiButton>
              </SuiBox>
            </Grid>
          </SuiBox>
        </SuiBox>
      </Grid>
    </BasicLayout>
  ) : (
    <OTP phoneNumber={phone} password={password.password} setStep={setCurrentStep} />
  );
}

export default SignIn;
