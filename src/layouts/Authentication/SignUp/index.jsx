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

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
// import Checkbox from "@mui/material/Checkbox";
import * as React from "react";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
// import SuiInput from "~/components/SuiInput";
import SuiButton from "~/components/SuiButton";
import TextField from "@mui/material/TextField";
// Authentication layout components
import BasicLayout from "~/layouts/Authentication/Components/BasicLayout";
import InputPassword from "~/components/InputPassword";
// import Socials from "~/layouts/authentication/components/Socials";
// import Separator from "~/layouts/authentication/components/Separator";

// Images
import curved6 from "~/assets/images/curved-images/curved14.jpg";

function SignUp() {
  const [password, setPassword] = useState({
    password: "",
    showPassword: false,
  });
  // const [values, setValues] = React.useState({
  //   password: "",
  //   showPassword: false,
  // });

  // const handleChange = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value });
  // };

  // const handleClickShowPassword = () => {
  //   setValues({
  //     ...values,
  //     showPassword: !values.showPassword,
  //   });
  // };

  // const handleMouseDownPassword = (event) => {
  //   event.preventDefault();
  // };
  return (
    <BasicLayout
      title="Welcome!"
      description="Use these awesome forms to login or create new account in your project for free."
      image={curved6}
    >
      <Card
        sx={{
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <SuiBox p={3} textAlign="center">
          <SuiTypography
            sx={{
              fontSize: "1rem",
            }}
            variant="h5"
            fontWeight="medium"
          >
            Vui lòng nhập thông tin đăng nhập
          </SuiTypography>
        </SuiBox>
        <SuiBox pt={0} pb={3} px={3}>
          <SuiBox component="form" role="form">
            <SuiBox mb={2}>
              <TextField
                sx={{
                  width: "100%",
                  "& .MuiFilledInput-root": {
                    height: "3.75rem !important",
                    backgroundColor: "white !important",
                  },
                  "& .MuiFilledInput-input": {
                    marginTop: "1.25rem !important",
                    width: "100% !important",
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
                label="Số Điện Thoại"
                variant="filled"
              />
            </SuiBox>
            <SuiBox mb={2}>
              <InputPassword label="Password" value={password} onChange={setPassword} />
            </SuiBox>
            <SuiBox display="flex" alignItems="center">
              <SuiTypography
                component={Link}
                to="/authentication/forgot-password"
                variant="button"
                fontWeight="regular"
                sx={{ cursor: "pointer", userSelect: "none", color: "#4acaf5" }}
              >
                Quên mật khẩu?
              </SuiTypography>
            </SuiBox>
            <SuiBox mt={4} mb={1}>
              <SuiButton
                sx={{
                  width: "100%",
                  borderRadius: "4rem !important",
                  color: "white",
                  fontSize: "1rem",
                }}
                color="linear-gradient(#40c5f4, #009de3)"
              >
                Đăng Nhập
              </SuiButton>
            </SuiBox>
            {/* <SuiBox mt={3} textAlign="center">
              <SuiTypography variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <SuiTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Sign in
                </SuiTypography>
              </SuiTypography>
            </SuiBox> */}
          </SuiBox>
        </SuiBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
