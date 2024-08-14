// import { Fieldset, Legend } from "~/components/StyledComponents";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import RsuiteDatePicker from "rsuite/DatePicker";
import "./styles.css";
// import "rsuite/DatePicker/styles/index.css";

export default function DatePicker(props) {
  const {
    placeholder,
    format,
    label,
    onChange,
    disabled,
    required,
    value,
    onChangeCalendarDate,
    ...rest
  } = props;
  const Fieldset = styled("fieldset")({
    display: "flex",
    textAlign: "left",
    gap: "12px",
    padding: "0px 12px",
    borderRadius: "8px",
    border: "1px solid var(--blue-gray-outline)",
    color: "var(--gray-80)",
    background: "var(--white)",
    fontWeight: 400,
    "&:focus-within": {
      borderColor: "var(--red-200)",
      // "& legend": {
      //   color: "var(--red-200)",
      // },
    },
    height: "52px !important",
  });
  const Legend = styled("legend")({
    lineHeight: "16px",
    fontSize: "12px",
    padding: "0 4px",
  });
  return (
    <Fieldset
      sx={{ background: disabled ? "#F5F5F5" : "#fff" }}
      {...rest}
      className={placeholder ? "" : "hiddenPlaceHolder"}
    >
      <Legend>
        {label}
        {required ? <span style={{ color: "#FF3C3C" }}>*</span> : null}
      </Legend>
      <RsuiteDatePicker
        oneTap
        style={{ width: "100%", zIndex: "0", paddingTop: "0px" }}
        placeholder={placeholder}
        format={format}
        onChange={onChange}
        // onChangeCalendarDate={onChangeCalendarDate}
        placement="auto"
        disabled={disabled}
        value={value && new Date(value)}
      />
    </Fieldset>
  );
}

DatePicker.defaultProps = {
  placeholder: "Chọn ngày sinh",
  label: "Label",
  onChange: () => {},
  disabled: false,
  required: false,
  value: new Date(),
  format: "dd/MM/yyyy",
  onChangeCalendarDate: () => {},
};

DatePicker.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  format: PropTypes.oneOf(["dd/MM/yyyy", "MM/yyyy"]),
  onChangeCalendarDate: PropTypes.func,
};
