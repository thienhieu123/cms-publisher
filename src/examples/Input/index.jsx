import SuiBox from "~/components/SuiBox";
import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import "./style/style.css";
import { v4 as uuidv4 } from "uuid";

const Input = forwardRef(
  (
    { title, type, required, disabled, pattern, color, endAdornment, value, onChange, ...rest },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = uuidv4();
    return (
      <label htmlFor={inputId} style={{ cursor: disabled ? "default" : "text" }}>
        <SuiBox
          ref={ref}
          className="InputBox"
          {...rest}
          display="flex"
          flexDirection="column"
          justifyContent={title === "" ? "center" : "space-around"}
        >
          <SuiBox
            sx={{ fontSize: "100%" }}
            color={color}
            height="30px"
            alignItems="center"
            display={title === "" ? "none" : "flex"}
          >
            <div
              style={{
                height: "20px",
                color: isFocused ? "#00bcd4" : "#000",
                fontSize: "1rem",
              }}
            >
              {title}
              {title && required && <sup style={{ color: "#ff0000" }}>*</sup>}
            </div>
          </SuiBox>

          <SuiBox display="flex" height="30px" alignItems="center">
            <input
              id={inputId}
              style={{
                color: "black",
                whiteSpace: "nowrap",
                height: "20px",
                fontSize: "1.2rem",
              }}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              onChange={onChange}
              defaultValue={value}
              type={type}
              pattern={pattern}
              disabled={disabled}
            />
            <SuiBox
              sx={{ height: "max-content", fontSize: "90%", color: "black !important" }}
              ml={0.5}
            >
              {endAdornment}
            </SuiBox>
          </SuiBox>
        </SuiBox>
      </label>
    );
  }
);

Input.defaultProps = {
  title: "",
  type: "text",
  required: true,
  pattern: "",
  color: "black",
  endAdornment: "",
  value: "",
  onChange: () => {},
  disabled: false,
};

// Typechecking props for the SuiInput
Input.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  pattern: PropTypes.string,
  color: PropTypes.string,
  endAdornment: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};
export default Input;
