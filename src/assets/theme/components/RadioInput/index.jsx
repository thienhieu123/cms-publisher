/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import "./style.css";

function RadioInput({ onChange, checked, label, value, disabled, typeDisabled }) {
  const radioId = uuidv4();

  return (
    <div className="radio-select">
      <input
        id={radioId}
        type="radio"
        name="radio"
        value={value || ""} // active value
        checked={checked}
        onChange={onChange}
        disabled={disabled} // disabled value
        className={typeDisabled ? "disable" : null} // color disabled
      />
      <label className="select-label" htmlFor={radioId}>
        {label}
      </label>
    </div>
  );
}
export default RadioInput;

RadioInput.defaultProps = {
  onChange: () => {},
  checked: false,
  label: null,
  value: null,
  disabled: false,
  typeDisabled: false,
};
RadioInput.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  typeDisabled: PropTypes.bool,
};
