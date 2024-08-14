import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { DateRangePicker as RsuiteDateRangePicker } from "rsuite";

import "./dateRangePicker.css";

export default function DateRangePicker(props) {
  const { placeholder, label, required, disabled, setDateRange, autoPlacement, value, ...rest } =
    props;

  const predefinedRanges = [
    {
      label: "Hôm nay",
      value: [new Date(), new Date()],
      placement: "left",
    },
  ];

  const handleOk = (values) => {
    if (values) {
      setDateRange(values);
    }
  };
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
      sx={{ background: disabled ? "#F5F5F5" : "#fff", zIndex: "100" }}
      {...rest}
      className={placeholder ? "" : "hiddenPlaceHolder"}
    >
      <Legend>
        {label}
        {required ? <span style={{ color: "#FF3C3C" }}>*</span> : null}
      </Legend>
      <RsuiteDateRangePicker
        format="dd/MM/yyyy"
        ranges={predefinedRanges}
        placeholder={placeholder}
        style={{
          width: "100%",
          zIndex: "0",
        }}
        onClean={() => {
          setDateRange([]);
        }}
        onChange={(v) => setDateRange(v)}
        onOk={handleOk}
        value={value[0] ? [new Date(value[0]), new Date(value[1])] : null}
        placement="bottomEnd"
        preventOverflow
        disabled={disabled}
      />
    </Fieldset>
  );
}

DateRangePicker.defaultProps = {
  placeholder: "Chọn khoảng thời gian",
  value: [],
  setFromDate: () => {},
  setToDate: () => {},
  disabled: false,
  setDateRange: () => {},
  label: "Label",
  required: false,
  autoPlacement: "",
};

DateRangePicker.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  setFromDate: PropTypes.func,
  disabled: PropTypes.bool,
  setToDate: PropTypes.func,
  setDateRange: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
  autoPlacement: PropTypes.string,
};
