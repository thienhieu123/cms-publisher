import { useEffect, useState } from "react";
import Input from "~/components/Input";
import IconShowPassword from "~/assets/images/icons/Eye.svg";
import IconHidePassword from "~/assets/images/icons/Invisible-Eye.svg";
import { IconButton, InputAdornment } from "@mui/material";
import PropTypes from "prop-types";
import SuiBox from "~/components/SuiBox";

export default function InputPassWordV2({
  placeholder,
  disabled,
  required,
  label,
  password,
  setPassword,
}) {
  const [showPassWord, setShowPassWord] = useState(false);

  return (
    <SuiBox component="form">
      <Input
        placeholder={placeholder}
        label={label}
        required={required}
        type={showPassWord ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={disabled}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                setShowPassWord((prev) => !prev);
              }}
              style={{ marginTop: "26px" }}
              edge="end"
            >
              <SuiBox
                component="img"
                src={showPassWord ? IconShowPassword : IconHidePassword}
                alt="Show Password"
              />
            </IconButton>
          </InputAdornment>
        }
      />
    </SuiBox>
  );
}

InputPassWordV2.defaultProps = {
  required: false,
  password: "",
  setPassword: () => {},
  disabled: false,
  placeholder: "",
  label: "",
};

InputPassWordV2.propTypes = {
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  password: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setPassword: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};
