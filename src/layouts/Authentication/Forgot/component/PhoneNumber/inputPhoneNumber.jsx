import { InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Fieldset } from "~/components/StyledComponents";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

// function apceptNumber(event) {
//   const interceptKeys = (evt) => {
//     evt = evt || window.event; // IE support
//     const c = evt.keyCode;
//     const ctrlDown = evt.ctrlKey || evt.metaKey; // Mac support
//     if (ctrlDown && evt.altKey) return true;
//     // Check for ctrl+c, v and x
//     // eslint-disable-next-line no-else-return
//     else if (ctrlDown && c === 67) return false;
//     else if (ctrlDown && c === 86) return false;
//     else if (ctrlDown && c === 88) return false;
//     else if (event.code === "KeyE") return false;
//     else if (event.code === "NumpadSubtract") return false;
//     else if (event.code === "NumpadAdd") return false;
//     else if (event.code === "Minus") return false;
//     else if (event.code === "Equal") return false;
//     else if (event.code === "NumpadDecimal") return false;
//     else if (event.code === "Period") return false;
//     else if (event.code === "Comma") return false;
//     return true;
//   };
//   if (
//     event.code === "ArrowLeft" ||
//     event.code === "ArrowRight" ||
//     event.code === "ArrowUp" ||
//     event.code === "ArrowDown" ||
//     event.code === "Delete" ||
//     event.code === "Backspace" ||
//     interceptKeys(event.code) ||
//     (event.code >= 48 && event.code <= 57) ||
//     (event.code >= 96 && event.code <= 105)
//   ) {
//     // eslint-disable-next-line no-useless-return
//     return;
//     // eslint-disable-next-line no-else-return
//   } else if (event.key.search(/\d/) === -1) {
//     event.preventDefault();
//   }
// }

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
function InputPhoneNumber({
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
    <Fieldset sx={{ backgroundColor: disabled ? "#F5F5F5" : "#fff" }} {...rest}>
      <InputBaseCustom
        sx={{ paddingBottom: label ? "8px" : 0 }}
        border="none"
        disabled={disabled}
        id={inputId}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        required={required}
        // type="number"
        // onKeyDown={(event) => {
        //   apceptNumber(event);
        // }}
      />
      {endAdornment}
    </Fieldset>
  );
}
export default InputPhoneNumber;

InputPhoneNumber.defaultProps = {
  type: "text",
  required: false,
  endAdornment: "",
  value: "",
  onChange: () => {},
  disabled: false,
  placeholder: "",
  label: "",
};

InputPhoneNumber.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  endAdornment: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};
