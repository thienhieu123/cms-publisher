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
import { changePasswordFirstTime } from "~/api/common";
import { Grid } from "@mui/material";
import { useSoftUIController } from "~/context";
import { setAlertMessage } from "~/context/common/action";
import { isMaxLength, isRequired } from "~/utils/verify";
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import SuiButton from "~/components/SuiButton";
import BasicLayout from "~/layouts/Authentication/Components/BasicLayout";
import InputPassword from "~/components/InputPassword";
import PropType from "prop-types";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import ValidateLine from "./validate";

const rules = [
  {
    label: "Có ít nhất 8 ký tự",
    status: false,
  },
  {
    label: "Có cả IN HOA và thường",
    status: false,
  },
  {
    label: "Có ít nhất một số",
    status: false,
  },
  {
    label: "Và một ký tự đặc biệt: !@#$%^&*",
    status: false,
  },
];

function ResetPassword({ type, onReset, setStep, phoneNumber }) {
  const [, dispatch] = useSoftUIController();
  const [oldPassword, setOldPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [password, setPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    password: "",
    showPassword: false,
  });

  function verifyInput(value, label, length) {
    return (
      isRequired(value, label, (title) => {
        setAlertMessage(dispatch, {
          message: `Vui lòng nhập ${title}`,
          type: "error",
          openAlert: true,
        });
      }) &&
      isMaxLength(value, label, length, (title) => {
        setAlertMessage(dispatch, {
          message: `${title} dài quá ${length} ký tự`,
          type: "error",
          openAlert: true,
        });
      })
    );
  }

  const handleValidatePassword = () => {
    const validate =
      verifyInput(oldPassword.password, "Mật khẩu hiện tại", 30) &&
      verifyInput(password.password, "Mật khẩu mới", 30);
    if (validate) {
      rules.every((item) => {
        if (!item.status) {
          setAlertMessage(dispatch, {
            message: `Mật khẩu không hợp lệ! Vui lòng đặt lại`,
            type: "error",
            openAlert: true,
          });
          return false;
        }
        return true;
      });
    }
    return validate;
  };

  const checkPassword = (text) => {
    if (text.length >= 8) {
      rules[0].status = true;
    } else {
      rules[0].status = false;
    }

    const upper = /[A-Z]/.test(text);
    const lower = /[a-z]/.test(text);
    if (upper && lower) {
      rules[1].status = true;
    } else {
      rules[1].status = false;
    }

    if (text.match(/[0-9]/)) {
      rules[2].status = true;
    } else {
      rules[2].status = false;
    }

    if (text.match(/[!@#$%^&*()]/)) {
      rules[3].status = true;
    } else {
      rules[3].status = false;
    }
  };

  const typeAndCheckPassword = (Npassword) => {
    checkPassword(Npassword.password);
    setPassword(Npassword);
  };

  // check two password same or not
  const checkConfirmPassword = () => {
    if (confirmPassword.password === password.password) {
      onReset(password.password);
      return true;
    }
    setAlertMessage(dispatch, {
      message: `Mật khẩu không khớp. Vui lòng nhập lại`,
      type: "error",
      openAlert: true,
    });
    return false;
  };
  function resetVerify() {
    rules[0].status = false;
    rules[1].status = false;
    rules[2].status = false;
    rules[3].status = false;
  }

  function handleSubmit() {
    const resultConfirm = checkConfirmPassword();
    const validatePassword = handleValidatePassword();
    if (resultConfirm && validatePassword) {
      changePasswordFirstTime(
        phoneNumber,
        oldPassword.password,
        password.password,
        confirmPassword.password
      ).then(
        (res) => {
          if (res.message.data.status === 200) {
            resetVerify();
            localStorage.setItem("phoneNumber", JSON.stringify(phoneNumber));
            setStep(0);
          } else {
            if (res.message.data.fieldErrors) {
              setAlertMessage(dispatch, {
                message: res.message.data.fieldErrors[0]?.message,
                type: "error",
                openAlert: true,
              });
            } else {
              setAlertMessage(dispatch, {
                message: res.message.data.message,
                type: "error",
                openAlert: true,
              });
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  useEnterKeyEvent([confirmPassword, password, oldPassword], handleSubmit);
  return (
    <BasicLayout
      title="Welcome!"
      description="Use these awesome forms to login or create new account in your project for free."
    >
      <SuiBox p={3} textAlign="center">
        <SuiTypography
          sx={{
            position: "relative",
            fontSize: "28px",
            fontWeight: "700",
            textTransform: "none",
          }}
          textAlign="center"
        >
          {type === "change" || type === "first" ? "Vui lòng đổi mật khẩu" : "Khôi Phục Mật Khẩu"}
        </SuiTypography>
      </SuiBox>
      <SuiBox
        display="flex"
        justifyContent="center"
        // px="17%"
        pt={0}
        mb={3}
        // mr={0}
        textAlign="center"
      >
        {type === "reset" && (
          <>
            <SuiTypography
              sx={{
                fontSize: "1rem",
              }}
              variant="h5"
              fontWeight="medium"
            >
              Số Điện Thoại: &nbsp;
            </SuiTypography>
            <SuiTypography
              sx={{
                fontSize: "1rem",
              }}
              variant="h5"
              fontWeight="light"
            >
              +84 987 654 321
            </SuiTypography>
          </>
        )}
        {type === "first" && (
          <SuiTypography
            sx={{
              fontSize: "18px",
              fontWeight: "400",
              color: "var(--gray-80)",
              textTransform: "none",
            }}
          >
            Trong lần đầu đăng nhập, vui lòng thay đổi mật khẩu
          </SuiTypography>
        )}
      </SuiBox>
      <SuiBox pt={0} pb={3} px={3}>
        <SuiBox component="form" role="form">
          {(type === "first" || type === "change") && (
            <SuiBox mb={3}>
              <SuiTypography
                sx={{
                  fontSize: "14px",
                  color: "var(--gray-100)",
                  fontWeight: "600",
                  textTransform: "none",
                }}
                mb={0.7}
              >
                Mật khẩu hiện tại
              </SuiTypography>
              <InputPassword
                placeholder="Nhập mật khẩu hiện tại"
                value={oldPassword}
                onChange={setOldPassword}
              />
            </SuiBox>
          )}
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
              Mật khẩu mới
            </SuiTypography>
            <InputPassword
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={typeAndCheckPassword}
            />
          </SuiBox>
          <SuiBox mb={2}>
            <Grid container>
              <Grid item xs={6} sm={6} xl={6}>
                <ValidateLine key={1} text={rules[0].label} correct={rules[0].status} />
              </Grid>
              <Grid item xs={6} sm={6} xl={6}>
                <ValidateLine key={2} text={rules[2].label} correct={rules[2].status} />
              </Grid>
              <Grid item xs={6} sm={6} xl={6}>
                <ValidateLine key={3} text={rules[1].label} correct={rules[1].status} />
              </Grid>
              <Grid item xs={6} sm={6} xl={6}>
                <ValidateLine key={4} text={rules[3].label} correct={rules[3].status} />
              </Grid>
            </Grid>
          </SuiBox>

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
              Xác nhận mật khẩu
            </SuiTypography>
            <InputPassword
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              helperText="Mật khẩu không trùng khớp"
              onChange={setConfirmPassword}
            />
          </SuiBox>
          <SuiBox mt={4} mb={1} textAlign="center">
            <SuiButton
              size="small"
              color="info"
              circular
              sx={{
                background: "var(--blue-blue-100)",
                borderRadius: "5px",
                padding: "8px 24px",
              }}
              onClick={handleSubmit}
            >
              <SuiTypography whiteSpace="nowrap" variant="body2" color="white" fontSize="14px">
                Hoàn Tất
              </SuiTypography>
            </SuiButton>
          </SuiBox>
        </SuiBox>
      </SuiBox>
    </BasicLayout>
  );
}

export default ResetPassword;

ResetPassword.defaultProps = {
  type: "reset",
  onReset: () => {},
  setStep: () => {},
  phoneNumber: null,
};

ResetPassword.propTypes = {
  type: PropType.string,
  onReset: PropType.func,
  setStep: PropType.func,
  phoneNumber: PropType.string,
};
