import SelectBox from "../SelectBox";

export default function SelectDistrictBox({ value, onChange, placeholder = "Tất cả", ...rest }) {
  return (
    <SelectBox
      {...rest}
      label="Quận/huyện"
      //   options={districtOptions}
      dataSource="/area/districts?parentCode=T008"
      mapping={{ value: "areaCode", label: "name" }}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      required={false}
      width="100%"
    />
  );
}
