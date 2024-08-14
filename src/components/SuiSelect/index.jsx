/* eslint-disable */
import { useState, useRef } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";

function SuiSelect({
  title,
  options,
  placeholder,
  onChange,
  bgColor,
  fontSize,
  width,
  height,
  endAdornment,
  special,
  required,
  onPopupOpen,
  value,
}) {
  const ref = useRef(null);
  const [textColor, setTextColor] = useState("#000");
  const [background, setBackground] = useState(bgColor);
  const [border, setBorder] = useState("2px solid transparent");
  const [boxShadow, setBoxShadow] = useState("none");
  const boxStyle = {
    position: "relative",
    cursor: "pointer",
    backgroundColor: background,
    borderRadius: "0.5rem",
    border,
    boxShadow,
    width,
    height,
  };
  return (
    <SuiBox
      sx={boxStyle}
      onClick={() => ref.current.focus()}
      onFocus={() => {
        setBackground("#fff");
        setBorder("2px solid #35d1f5");
        setBoxShadow("0px 0px 5px rgba(0, 0, 0, 0.1)");
        setTextColor("#35d1f5");
      }}
      onBlur={() => {
        setBackground(bgColor);
        setBorder("2px solid transparent");
        setBoxShadow("none");
        setTextColor("#000");
      }}
    >
      <div style={{ color: textColor, padding: title ? "5px 5px 0 10px" : "0", fontSize }}>
        {title}
        {title && required && <sup style={{ color: "#ff0000" }}>*</sup>}
        <SuiTypography
          color="black"
          sx={{ position: "absolute", right: "2.5rem", bottom: "0.45rem", fontSize }}
        >
          {endAdornment}
        </SuiTypography>
      </div>

      <Select
        ref={ref}
        styles={{
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#e9ecef" : provided,
            color: state.data.color ?? "#000",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            fontSize,
          }),
          control: (provided, state) => ({
            ...provided,
            cursor: state.isDisabled ? "not-allowed" : "pointer",
            // eslint-disable-next-line no-nested-ternary
            backgroundColor: title ? "transparent" : state.isFocused ? "white" : `${background}`,
            border: "0px solid transparent",
            boxShadow: title ? "none" : provided,
            whiteSpace: "nowrap",
            borderRadius: "0.5rem",
            fontSize,
            marginTop: special ? "-8px" : "0px",

            "&:hover": title
              ? {
                  border: "0px solid transparent",
                }
              : "",
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            position: title ? "absolute" : provided,
            right: title ? "0px" : provided,
            top: title ? "-12px" : provided,
            color: state.isFocused ? "black" : provided,
          }),
          indicatorSeparator: () => ({
            display: "none",
          }),
          singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = "opacity 300ms";
            const color = state.data.color ?? "#000";
            return { ...provided, opacity, transition, color };
          },
          menuPortal: (provided) => ({ ...provided, zIndex: onPopupOpen ? 9999 : 10 }),
          menu: (provided) => ({ ...provided, zIndex: onPopupOpen ? 9999 : 10 }),
        }}
        // placeholder={placeholder}
        defaultValue={placeholder}
        onChange={(e) => onChange(e)}
        options={options}
        isSearchable={false}
        menuPortalTarget={document.querySelector("body")}
        openMenuOnFocus
        // menuIsOpen={this.state.open}
        closeMenuOnSelect
        blurInputOnSelect={false}
        value={value ? value : placeholder}
      />
    </SuiBox>
  );
}
SuiSelect.defaultProps = {
  value: "",
  title: "",
  options: [
    {
      value: "",
      label: "",
    },
  ],
  bgColor: "#f5f5f5",
  width: "max-content",
  height: "max-content",
  fontSize: "1rem",
  endAdornment: "",
  special: false,
  required: true,
  onPopupOpen: false,
  onChange: () => {},
  placeholder: {
    value: "",
    label: "",
  },
};
SuiSelect.propTypes = {
  value: PropTypes.string,
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  placeholder: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  onChange: PropTypes.func,
  bgColor: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  fontSize: PropTypes.string,
  endAdornment: PropTypes.string,
  special: PropTypes.bool,
  required: PropTypes.bool,
  onPopupOpen: PropTypes.bool,
};
export default SuiSelect;
