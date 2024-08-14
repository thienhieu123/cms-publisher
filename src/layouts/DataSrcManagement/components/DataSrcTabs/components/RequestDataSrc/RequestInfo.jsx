import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import DatePicker from "~/components/DatePicker";
import Input from "~/components/Input";
import SelectBox from "~/components/SelectBox";
import { requestTypeTable } from "~/constants/config";

export default function RequestInfo({ isEdit = false, data, setData }) {
  return (
    <Grid container p={2} mt={2} className="card-content">
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="flex-start"
        sx={{ paddingLeft: "0px !important" }}
      >
        <Typography fontWeight={700} fontSize={16}>
          Thông tin yêu cầu
        </Typography>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <Input label="Mã yêu cầu" disabled value={data?.requestCode} />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <Input
            label="Tên yêu cầu"
            value={data?.requestName}
            onChange={(e) => setData({ ...data, requestName: e.target.value })}
            required
            disabled={!isEdit}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <DatePicker label="Ngày tạo" value={data?.createdDate} disabled />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} xl={4}>
          <SelectBox
            label="Loại yêu cầu"
            placeholder="Chọn loại yêu cầu"
            options={requestTypeTable}
            value={data?.type}
            isDisabled
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
