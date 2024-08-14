import SuiBox from "~/components/SuiBox";
import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import "./style/style.css";
import SuiTypography from "~/components/SuiTypography";

// eslint-disable-next-line react/prop-types
const TextArea = forwardRef(({ title, rows, cols, value, onChange, ...rest }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <SuiBox ref={ref} className="InputBox" {...rest}>
      <SuiTypography sx={{ height: "max-content", fontSize: "100%", color: "unset" }}>
        {title}
      </SuiTypography>

      <textarea
        rows={rows}
        cols={cols}
        style={{
          color: isFocused ? "black" : "unset",
          backgroundColor: isFocused ? "white" : "unset",
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        value={value}
        onChange={onChange}
      />
    </SuiBox>
  );
});
TextArea.defaultProps = {
  title: "",
  rows: 5,
  cols: 50,
};

// Typechecking props for the SuiInput
TextArea.propTypes = {
  title: PropTypes.string,
  rows: PropTypes.number,
  cols: PropTypes.number,
};
export default TextArea;
