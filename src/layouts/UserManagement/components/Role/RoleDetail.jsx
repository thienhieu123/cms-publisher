import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import Input from "~/components/Input";
import TextArea from "~/components/TextArea";

const initialValues = {
  roleCode: "",
  roleName: "",
  description: "",
};
export function RoleDetail({ setOpen, initialProps, isUpdate, handleUpdate, handleCreate }) {
  const [queryFilter, setQueryFilter] = useState(initialValues);

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };
  useEffect(() => {
    if (isUpdate && initialProps) {
      setQueryFilter(initialProps);
    }
  }, [isUpdate, initialProps]);
  return (
    <Grid container p={2} rowSpacing={1}>
      <Grid item xs={12} lg={12}>
        <Input
          label="Mã vai trò"
          value={queryFilter.roleCode}
          onChange={(e) => handleChange("roleCode", e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} lg={12}>
        <Input
          label="Tên vai trò"
          value={queryFilter.roleName}
          onChange={(e) => handleChange("roleName", e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} lg={12} mb={2}>
        <TextArea
          label="Mô tả"
          value={queryFilter.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </Grid>
      <ButtonControl
        submitText="Xác nhận"
        justifyContent="center"
        handleCancel={() => setOpen(false)}
        handleSubmit={() => (isUpdate ? handleUpdate(queryFilter) : handleCreate(queryFilter))}
      />
    </Grid>
  );
}
