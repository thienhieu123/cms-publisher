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
// import Card from "@mui/material/Card";
// import { Grid } from "@mui/material";
// import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import SuiButton from "~/components/SuiButton";

import InputPassword from "~/components/InputPassword";
// import { v4 as uuidv4 } from "uuid";
import PropType from "prop-types";
// import { useNavigate } from "react-router-dom";
import { setAlertMessage } from "~/context/common/action";
import { useSoftUIController } from "~/context";
import { isMaxLength, verifyPassword } from "~/utils/verify";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
// import ValidateLine from "./validate";

function ResetPassword({ phoneNumber, onReset, handleError }) {
  // const navigate = useNavigate();
  const [, dispatch] = useSoftUIController();
  const [password, setPassword] = useState({
    password: "",
    showPassword: false,
  });

  const [confirmPassword, setConfirmPassword] = useState({
    password: "",
    showPassword: false,
  });

  const handleValidatePassword = (value) => {
    if (!value) {
      handleError("Vui lòng nhập mật khẩu");
      return false;
    }
    try {
      verifyPassword(value);
      isMaxLength(value, "Mật khẩu", 24);
    } catch (e) {
      setAlertMessage(dispatch, {
        message: e,
        type: "error",
        openAlert: true,
      });
    }
    return true;
  };

  const typeAndCheckPassword = (Npassword) => {
    // checkPassword(Npassword.password);
    setPassword(Npassword);
  };

  // function resetVerify() {
  //   rules[0].status = false;
  //   rules[1].status = false;
  //   rules[2].status = false;
  //   rules[3].status = false;
  // }

  // check two password same or not
  const checkConfirmPassword = () => {
    const validatePassword = handleValidatePassword(password.password);
    if (confirmPassword.password === password.password && validatePassword) {
      onReset(password.password);
    } else if (validatePassword) {
      handleError("Mật khẩu không khớp. Vui lòng nhập lại");
    }

    return false;
  };

  useEnterKeyEvent([confirmPassword, password], checkConfirmPassword);
  return (
    // <Card
    //   sx={{
    //     boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    //   }}
    // >
    <SuiBox textAlign="center">
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
      {/* <SuiBox display="flex" mb="26px" justifyContent="center">
        <SuiTypography
          sx={{
            cursor: "pointer",
            fontSize: "14px",
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
            fontSize: "14px",
            fontWeight: "400",
            color: "rgba(9, 101, 186, 1)",
            textTransform: "none",
          }}
        >
          Đăng nhập
        </SuiTypography>
      </SuiBox> */}
      <SuiBox
        display="none"
        justifyContent="center"
        // px="17%"
        pt={0}
        mb={3}
        // mr={0}
        // textAlign="center"
      >
        <>
          <SuiTypography
            sx={{
              fontSize: "18px",
              width: "100%",
              color: "var(--gray-80)",
              fontWeight: "500",
              textAlign: "right",
              textTransform: "none",
            }}
            fontWeight="medium"
          >
            Số Điện Thoại: &nbsp;
          </SuiTypography>
          <SuiTypography
            sx={{
              fontSize: "18px",
              width: "100%",
              color: "var(--gray-80)",
              fontWeight: "700",
              textAlign: "left",
            }}
          >
            {`${phoneNumber.substr(0, 3)}*****${phoneNumber.substr(8, 2)}`}
          </SuiTypography>
        </>
      </SuiBox>
      <SuiBox pt={0} pb={3} px={3}>
        <SuiBox component="form" role="form">
          <SuiBox mb={2}>
            <SuiTypography
              sx={{
                fontSize: "14px",
                color: "var(--gray-100)",
                fontWeight: "600",
                textAlign: "left",
                textTransform: "none",
              }}
              mb={0.7}
            >
              Mật khẩu mới
            </SuiTypography>
            <InputPassword
              placeholder="Nhập mật khẩu mới"
              value={password}
              // error={!samePassword}
              onChange={typeAndCheckPassword}
            />
          </SuiBox>
          {/* <SuiBox mb={2}>
            <Grid container>
              <Grid item xs={6} sm={6} xl={6}>
                <ValidateLine key={uuidv4()} text={rules[0].label} correct={rules[0].status} />
              </Grid>
              <Grid item xs={6} sm={6} xl={6}>
                <ValidateLine key={uuidv4()} text={rules[2].label} correct={rules[2].status} />
              </Grid>
              <Grid item xs={6} sm={6} xl={6}>
                <ValidateLine key={uuidv4()} text={rules[1].label} correct={rules[1].status} />
              </Grid>
              <Grid item xs={6} sm={6} xl={6}>
                <ValidateLine key={uuidv4()} text={rules[3].label} correct={rules[3].status} />
              </Grid>
            </Grid>
          </SuiBox> */}
          <SuiBox mb={2}>
            <SuiTypography
              sx={{
                fontSize: "14px",
                color: "var(--gray-100)",
                fontWeight: "600",
                textAlign: "left",
                textTransform: "none",
              }}
              mb={0.7}
            >
              Xác nhận mật khẩu
            </SuiTypography>
            <InputPassword
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              // error={!samePassword}
              helperText="Mật khẩu không trùng khớp"
              onChange={setConfirmPassword}
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
              onClick={checkConfirmPassword}
            >
              <SuiTypography whiteSpace="nowrap" variant="body2" color="white" fontSize="14px">
                Hoàn Tất
              </SuiTypography>
            </SuiButton>
          </SuiBox>
        </SuiBox>
      </SuiBox>
    </SuiBox>
    // </Card>
  );
}

export default ResetPassword;

ResetPassword.defaultProps = {
  phoneNumber: "",
  onReset: () => {},
  handleError: () => {},
};

ResetPassword.propTypes = {
  phoneNumber: PropType.string,
  onReset: PropType.func,
  handleError: PropType.func,
};
