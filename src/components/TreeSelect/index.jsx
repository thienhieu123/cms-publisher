import { TreePicker } from "rsuite";
import { styled } from "@mui/material/styles";
import "./styles.css";
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
    //   color: "var(--blue-blue-80)",
    // },
  },
  minHeight: "52px !important",
});
const Legend = styled("legend")({
  lineHeight: "16px",
  fontSize: "12px",
  padding: "0 4px",
});

export default function TreeSelect({
  data,
  displayValue,
  isMulti,
  isDisabled,
  required,
  label,
  width,
  height,
  fontSize,
  placeholder,
  onChange,
  value,
  ...rest
}) {
  return (
    <Fieldset
      className={
        displayValue || isMulti ? "custom-tree-picker" : "custom-tree-picker select-box-placeholder"
      }
      sx={{
        backgroundColor: isDisabled ? "#F5F5F5" : "#fff",
        width,
        height,
        fontSize,
      }}
      {...rest}
    >
      <Legend>
        {label}
        {required ? <span style={{ color: "var(--red-light)" }}>*</span> : null}
      </Legend>
      <TreePicker
        placeholder={placeholder}
        defaultExpandAll
        data={data}
        value={value}
        onChange={onChange}
        searchable={false}
        style={{ width: "100%", paddingTop: "4px" }}
      />
    </Fieldset>
  );
}
