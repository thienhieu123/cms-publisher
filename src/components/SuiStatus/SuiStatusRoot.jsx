import React from "react";
import PropTypes from "prop-types";
import "./index.css";

function StatusRoot(props) {
  const { text, id, label, colorDot, radioLabel, ...rest } = props;
  return (
    <div className={`${label}`}>
      <label htmlFor={id} className={`${radioLabel}`} {...rest}>
        <span className={`${colorDot}`} />
        {text}
      </label>
    </div>
  );
}

export default StatusRoot;

StatusRoot.defaultProps = {
  text: "",
  id: 1,
  label: "",
  colorDot: "",
  radioLabel: "",
};

StatusRoot.propTypes = {
  text: PropTypes.string,
  id: PropTypes.number,
  label: PropTypes.string,
  colorDot: PropTypes.string,
  radioLabel: PropTypes.string,
};
