import React from "react";
import "./index.css";
import PropTypes from "prop-types";

function RadioButton(props) {
  const { name, id, value, onChange, checked, text, disabled } = props;
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {disabled ? (
        <label htmlFor={id} className="radio-label">
          <input
            className="radio-input1"
            type="radio"
            name={name}
            id={id}
            value={value}
            checked={checked}
          />
          <span className="custom-radio1" />
          {text}
        </label>
      ) : (
        <label htmlFor={id} className="radio-label">
          <input
            className="radio-input"
            type="radio"
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            checked={checked}
          />
          <span className="custom-radio" />
          {text}
        </label>
      )}
    </>
  );
}

export default RadioButton;

RadioButton.defaultProps = {
  name: "",
  id: "",
  value: "",
  onChange: () => {},
  checked: false,
  text: "",
  disabled: false,
};

RadioButton.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  text: PropTypes.string,
  disabled: PropTypes.bool,
};
