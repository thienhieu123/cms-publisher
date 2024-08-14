import { InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

function apceptNumber(event) {
  const interceptKeys = (evt) => {
    evt = evt || window.event; // IE support
    const c = evt.keyCode;
    const ctrlDown = evt.ctrlKey || evt.metaKey; // Mac support
    if (ctrlDown && evt.altKey) return true;
    // Check for ctrl+c, v and x
    // eslint-disable-next-line no-else-return
    else if (ctrlDown && c === 67) return false;
    else if (ctrlDown && c === 86) return false;
    else if (ctrlDown && c === 88) return false;
    else if (event.code === "KeyE") return false;
    else if (event.code === "NumpadSubtract") return false;
    else if (event.code === "NumpadAdd") return false;
    else if (event.code === "Minus") return false;
    else if (event.code === "Equal") return false;
    else if (event.code === "NumpadDecimal") return false;
    else if (event.code === "Period") return false;
    else if (event.code === "Comma") return false;
    return true;
  };
  if (
    event.code === "ArrowLeft" ||
    event.code === "ArrowRight" ||
    event.code === "ArrowUp" ||
    event.code === "ArrowDown" ||
    event.code === "Delete" ||
    event.code === "Backspace" ||
    interceptKeys(event.code) ||
    (event.code >= 48 && event.code <= 57) ||
    (event.code >= 96 && event.code <= 105)
  ) {
    // eslint-disable-next-line no-useless-return
    return;
    // eslint-disable-next-line no-else-return
  } else if (event.key.search(/\d/) === -1) {
    event.preventDefault();
  }
}
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

const InputBaseCustom = styled(InputBase)({
  border: "none",
  outline: "none",
  padding: "2px 0",
  "& input": {
    fontSize: "14px",
    width: "100%",
    "&::placeholder": {
      fontStyle: "italic",
    },
    paddingLeft: "10px !important",
    /* Chrome, Safari, Edge, Opera */
    // "",
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    /* Firefox */
    "&[type=number]": {
      MozAppearance: "textfield",
    },
  },
});
function Input({
  onChange,
  value,
  type,
  disabled,
  required,
  placeholder,
  endAdornment,
  label,
  ...rest
}) {
  const inputId = uuidv4();
  return (
    <Fieldset sx={{ backgroundColor: disabled ? "#F5F5F5" : "#fff", width: "100%" }} {...rest}>
      {label && (
        <Legend>
          {label}
          {required ? <span style={{ color: "#FF3C3C" }}> *</span> : null}
        </Legend>
      )}
      <InputBaseCustom
        {...rest}
        sx={{ paddingBottom: label ? "8px" : 0 }}
        disabled={disabled}
        id={inputId}
        // label=
        placeholder={placeholder}
        onChange={onChange}
        value={value || ""}
        required={required}
        type={type}
        onKeyDown={(event) => {
          if (type === "number") {
            apceptNumber(event);
          }
        }}
      />
      {endAdornment}
    </Fieldset>
  );
}
export default Input;

Input.defaultProps = {
  type: "text",
  required: false,
  endAdornment: "",
  value: "",
  onChange: () => {},
  disabled: false,
  placeholder: "",
  label: "",
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  endAdornment: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};
