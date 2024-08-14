/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Select from "react-select";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import "./styles.css";
import { API, standardResponse } from "~/api/middleware";
import { handleResponse } from "~/utils/utils";
import useErrorMessage from "~/hooks/useErrorMessage";

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
const SelectContainer = styled(Select)({
  border: "none",
  outline: "none",
  padding: 0,
  width: "100%",
  fontFamily: "Nunito Sans",
  paddingBottom: "0px !important",
  " > div": {
    borderStyle: "hidden",
    minHeight: "auto",
    " > div": {
      padding: "3px 0",
    },
  },
  " > div:first-of-type": {
    borderColor: "transparent !important",
    boxShadow: "none",
  },
});

function SelectBox({
  onChange,
  value,
  options,
  isDisabled,
  label,
  placeholder,
  width,
  height,
  fontSize,
  required,
  mapField,
  mapping,
  customStatusStyle,
  getOptionLabel,
  getOptionValue,
  isMulti,
  defaultValue,
  dataSource,
  isHaveAllOptions = true,
  dependency = [],
  onBlur,
  ...rest
}) {
  const inputId = uuidv4();
  const [displayValue, setDisplayValue] = useState(value);
  const [dataOptions, setDataOptions] = useState([]);
  const { setErrorMessage } = useErrorMessage();

  const fetchData = async () => {
    const res = await API.get(dataSource).then((response) => {
      return standardResponse(true, response);
    });
    const [status, dataResponse] = handleResponse(res);
    if (status) {
      if (mapping && dataResponse?.length) {
        const arrData = dataResponse?.map((item) => ({
          ...item,
          value: item[mapping?.value],
          label: item[mapping?.label],
        }));
        const newArrData = isHaveAllOptions
          ? [{ value: "", label: "Tất cả" }, ...arrData]
          : arrData;
        setDataOptions(newArrData);
      } else setDataOptions(dataResponse || []);
    } else setErrorMessage(dataResponse);
  };

  useEffect(() => {
    if (dataSource) fetchData();
    return () => {
      setDataOptions([]);
    };
  }, [...dependency, dataSource]);

  useEffect(() => {
    if (options?.length) setDataOptions(options);
  }, [options]);

  useEffect(() => {
    if (value && dataOptions.length > 0 && !isMulti) {
      const findValue = dataOptions.find(
        (item) => item.value == value || item.value == value[mapField]
      );
      setDisplayValue(findValue || "");
    } else if (value && value.length > 0 && dataOptions.length > 0 && isMulti) {
      let values = [];
      value.map((val) => {
        dataOptions.map((option) => {
          if (val.value === option.value || val === option.value) values.push(option);
        });
      });

      setDisplayValue(values);
    } else {
      setDisplayValue("");
    }
  }, [value, dataOptions]);

  return (
    <Fieldset
      className={
        displayValue || isMulti ? "custom-select-box" : "custom-select-box select-box-placeholder"
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
      <SelectContainer
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "yellow" : "red",
          }),
        }}
        defaultValue={defaultValue}
        isMulti={isMulti}
        sx={{
          paddingBottom: label ? "8px" : 0,
          lineHeight: "1.2",
          ...customStatusStyle,
          "&>div": isDisabled
            ? {
                backgroundColor: "unset",
              }
            : null,
          // zIndex: "100",
        }}
        id={inputId}
        options={dataOptions}
        placeholder={isDisabled ? value : placeholder}
        isDisabled={isDisabled}
        onChange={(e) => onChange(e)}
        value={displayValue}
        required={required}
        noOptionsMessage={() => "Không có dữ liệu"}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        closeMenuOnSelect={!isMulti}
        onBlur={onBlur}
      />
    </Fieldset>
  );
}
export default SelectBox;

SelectBox.defaultProps = {
  value: "",
  onChange: () => {},
  isDisabled: false,
  label: "Label",
  options: [],
  placeholder: "Placeholder",
  //   width: "max-content",
  width: "100%",
  height: "auto",
  fontSize: "13px",
  required: false,
  mapField: "",
  mapping: {
    value: "",
    label: "",
  },
  customStatusStyle: null,
  isMulti: false,
  dataSource: "",
  dependency: [],
};

SelectBox.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  fontSize: PropTypes.string,
  required: PropTypes.bool,
  mapField: PropTypes.string,
  customStatusStyle: PropTypes.objectOf(PropTypes.string),
  isMulti: PropTypes.bool,
  dataSource: PropTypes.string,
  mapping: PropTypes.object,
  dependency: PropTypes.array,
};
