import PropType from "prop-types";
import SuiBox from "~/components/SuiBox";
import FilledInput from "@mui/material/FilledInput";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
// import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
// import { useState } from "react";
import IconShowPassword from "~/assets/images/icons/Eye.svg";
import IconHidePassword from "~/assets/images/icons/Invisible-Eye.svg";

function InputPassword({ value, onChange, error, helperText, placeholder }) {
  const [values, setValues] = [value, onChange];
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  // const handleMouseDownPassword = (event) => {
  //   event.preventDefault();
  // };
  return (
    <FormControl
      sx={{
        width: "100%",
        "& label.Mui-focused": {
          color: "#4acaf5",
        },
        "& .Mui-focused": {
          borderColor: "#4acaf5 !important",
          // color: "#4acaf5",
        },
        "& .MuiFilledInput-root:before": {
          content: "none",
        },
        "& .MuiFilledInput-root:after": {
          content: "none",
        },
        "& .MuiInputLabel-root": {
          color: "#aeaeae",
        },
      }}
      variant="filled"
    >
      {/* <InputLabel htmlFor="filled-adornment-password">{`${label}`}</InputLabel> */}
      <FilledInput
        id="filled-adornment-password"
        placeholder={placeholder}
        type={values.showPassword ? "text" : "password"}
        error
        value={values.password}
        onChange={handleChange("password")}
        sx={{
          width: "100%",
          backgroundColor: "var(--blue-gray-line) !important",
          borderColor: error ? "#d32f2f !important" : "#aeaeae !important",
          border: "none",
          "& .MuiFilledInput-root": {
            width: "100% !important",
            height: "44px !important",
          },
          "& .MuiFilledInput-input": {
            height: "28px",
            width: "100% !important",
            "::placeholder": {
              fontStyle: "italic",
            },
            //Disable eye icon Microsoft Edge
            "::-ms-reveal": {
              display: "none",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#aeaeae",
          },
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              // onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {values.showPassword ? (
                <SuiBox component="img" src={IconShowPassword} alt="Show Password" />
              ) : (
                <SuiBox component="img" src={IconHidePassword} alt="Hide Password" />
              )}
            </IconButton>
          </InputAdornment>
        }
      />
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
}
export default InputPassword;
//  proptype
InputPassword.defaultProps = {
  error: false,
  helperText: "",
  placeholder: "",
};

InputPassword.propTypes = {
  // label: PropType.string.isRequired,
  value: PropType.shape({
    password: PropType.string.isRequired,
    showPassword: PropType.bool.isRequired,
  }).isRequired,
  onChange: PropType.func.isRequired,
  error: PropType.bool,
  helperText: PropType.string,
  placeholder: PropType.string,
};
