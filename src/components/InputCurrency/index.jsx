import { InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Fieldset, Legend } from "~/components/StyledComponents";
import PropTypes from "prop-types";
import { formatNumber, getFormatCurrency } from "~/utils/utils";
import { v4 as uuidv4 } from "uuid";

function formatCurrency(input) {
  // get input value
  let inputVal = input.target.value;

  // don't validate empty input
  if (inputVal === "") {
    return;
  }

  // check for decimal
  if (inputVal.indexOf(",") >= 0) {
    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    const decimalPos = inputVal.indexOf(",");

    // split number by decimal point
    let leftSide = inputVal.substring(0, decimalPos);
    let rightSide = inputVal.substring(decimalPos);

    // add commas to left side of number
    leftSide = formatNumber(leftSide);

    // validate right side
    rightSide = formatNumber(rightSide);

    // Limit decimal to only 2 digits
    rightSide = rightSide.substring(0, 2);

    // join number by .
    inputVal = `${leftSide},${rightSide}`;
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    inputVal = formatNumber(inputVal);
  }

  // send updated string to input
  input.target.value = inputVal;
}

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
function InputCurrency({
  onChange,
  value,
  type,
  disabled,
  required,
  placeholder,
  endAdornment,
  label,
  isUnit,
  ...rest
}) {
  const inputId = uuidv4();
  return (
    <Fieldset {...rest} sx={{ backgroundColor: disabled ? "#F5F5F5" : "#fff", width: "100%" }}>
      {label && (
        <Legend>
          {label}
          {required ? <span style={{ color: "#FF3C3C" }}>*</span> : null}
        </Legend>
      )}
      <InputBaseCustom
        sx={{ paddingBottom: label ? "8px" : 0, background: disabled ? "#F5F5F5" : "#fff" }}
        disabled={disabled}
        id={inputId}
        placeholder={placeholder}
        onChange={onChange}
        value={getFormatCurrency(value, isUnit)}
        required={required}
        type={type}
        onKeyUp={(event) => {
          formatCurrency(event);
        }}
      />
      {endAdornment}
    </Fieldset>
  );
}
export default InputCurrency;

InputCurrency.defaultProps = {
  type: "text",
  required: false,
  endAdornment: "",
  value: "",
  onChange: () => {},
  disabled: false,
  isUnit: false,
  placeholder: "",
  label: "",
};

InputCurrency.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  endAdornment: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  isUnit: PropTypes.bool,
  label: PropTypes.string,
};
