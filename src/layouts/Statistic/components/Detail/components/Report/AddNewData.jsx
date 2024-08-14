import { Grid } from "@mui/material";
import DateRangePicker from "~/components/DateRangePicker";
import Input from "~/components/Input";
import SelectBox from "~/components/SelectBox";
import ButtonControl from "~/components/ButtonControl";
import { useEffect, useState } from "react";
import MyDropzone from "~/components/MyDropZone";
import { getStartDateDefault } from "~/utils/utils";

const initialValues = {
  district: [],
  fromDate: getStartDateDefault(),
  toDate: new Date(),
  criteria: "",
  groupId: "",
  value: "",
  unitValue: "",
};
export default function AddNewData({ initialValueProps, handleCancel, handleSubmit }) {
  const [queryFilter, setQueryFilter] = useState(initialValues);

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  useEffect(() => {
    if (initialValueProps) setQueryFilter(initialValueProps);
  }, [initialValueProps]);

  return (
    <Grid container item xs={12} columnSpacing={4} rowSpacing={1} pb={2} mt={1}>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Nhóm chỉ tiêu"
          value={queryFilter.groupId}
          dataSource="/stats-index-groups/list"
          mapping={{ value: "id", label: "name" }}
          placeholder="Chọn nhóm chỉ tiêu"
          onChange={(e) => handleChange("groupId", e.value)}
          required={false}
          isHaveAllOptions={false}
          width="100%"
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Chỉ tiêu"
          dataSource={`/stats-indices${
            queryFilter.groupId ? "?groupId=" + queryFilter.groupId : ""
          }`}
          mapping={{ value: "code", label: "name" }}
          dependency={[queryFilter.groupId]}
          placeholder="Chọn chỉ tiêu"
          value={queryFilter.criteria}
          onChange={(e) => handleChange("criteria", e.value)}
          required={false}
          width="100%"
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Quận/huyện"
          dataSource="/area/districts?parentCode=T008"
          mapping={{ value: "areaCode", label: "name" }}
          value={queryFilter.district}
          onChange={(e) => handleChange("district", e.value)}
          placeholder="Tất cả"
          required={false}
          width="100%"
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <DateRangePicker
          value={[queryFilter.fromDate, queryFilter.toDate]}
          setDateRange={(e) => {
            setQueryFilter({ ...queryFilter, fromDate: e[0], toDate: e[1] });
          }}
          placeholder="Từ ngày - Đến ngày"
          label="Giai đoạn"
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <Input
          label="Giá trị"
          required
          value={queryFilter.value}
          onChange={(e) => handleChange("value", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <Input
          label="Đơn vị"
          disabled
          value={queryFilter.unitValue}
          onChange={(e) => handleChange("unitValue", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} mt={1}>
        <MyDropzone />
      </Grid>
      <Grid item xs={12} mt={2}>
        <ButtonControl justifyContent="center" submitText="Xác nhận" handleCancel={handleCancel} />
      </Grid>
    </Grid>
  );
}
