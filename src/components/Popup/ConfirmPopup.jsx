import { Grid, Typography } from "@mui/material";
import PopupRoot from "./PopupRoot";
import SuiBox from "../SuiBox";
import ButtonControl from "../ButtonControl";
import Confirm from "~/assets/images/icons/yellow-confirm.svg";

export function ConfirmPopup({ open, setOpen, questionText, NotiText, handleSubmit, icon }) {
  return (
    <PopupRoot open={open} setOpen={setOpen}>
      <Grid container p={3} display="flex" direction="column">
        <Grid item xs={12} lg={12} mb={2}>
          <SuiBox component="img" src={icon ? icon : Confirm} mb={1} />
          <Typography fontSize="18px" fontWeight={700}>
            {questionText}
          </Typography>
          <Typography fontSize="14px" fontWeight={400}>
            {NotiText}
          </Typography>
        </Grid>
        <ButtonControl
          justifyContent="center"
          cancelText="Hủy"
          submitText="Đồng ý"
          handleCancel={() => setOpen(false)}
          handleSubmit={handleSubmit}
        />
      </Grid>
    </PopupRoot>
  );
}
