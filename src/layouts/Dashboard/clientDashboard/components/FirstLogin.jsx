import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
// import DoneIcon from "@mui/icons-material/Done";
import Action from "~/assets/images/Action.svg";
// import TextField from "@mui/material/TextField";
import InputPasswordChange from "~/components/InputPasswordChange";
import SuiButton from "~/components/SuiButton";
// import Input from "~/components/Input";
// import ValidateLine from "./validate";

function FirstLogin() {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    // setOpen(false);
  };
  const [oldPassword, setOldPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [password, setPassword] = useState({
    password: "",
    showPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    password: "",
    showPassword: false,
  });
  // const [values, setValues] = [value, onChange];
  // const handleChange = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value });
  // };

  // const handleClickShowPassword = () => {
  //   setValues({
  //     ...values,
  //     showPassword: !values.showPassword,
  //   });
  // };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingLeft: "0px",
            paddingRight: "0px",
          }}
        >
          <p style={{ fontSize: "20px", fontWeight: "600", color: "#44494D" }}>Đổi mật khẩu</p>
          <p style={{ fontSize: "16px", color: "#2D3442" }}>
            Trong lần đăng nhập đầu tiên, vui lòng thay đổi mật khẩu
          </p>
          <InputPasswordChange
            sx={{ height: "53px", width: "99.9%", marginTop: "8px", marginBottom: "8px" }}
            label="Mật khẩu hiện tại"
            placeholder="Nhập mật khẩu hiện tại"
            required
            value={oldPassword}
            onChange={setOldPassword}
          />
          <InputPasswordChange
            sx={{ height: "53px", width: "99.9%", marginBottom: "8px" }}
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            required
            value={password}
            onChange={setPassword}
          />
          <InputPasswordChange
            sx={{ height: "53px", width: "99.9%" }}
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập mật lại mật khẩu mới"
            required
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <SuiButton
          size="small"
          color="var(--red-200)"
          circular
          sx={{
            background: "var(--red-200)",
            borderRadius: "5px",
            padding: "8px 24px",
          }}
          onClick={handleClose}
        >
          {/* <SuiTypography whiteSpace="nowrap" variant="body2" color="white" fontSize="14px"> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontSize: "14px",
            }}
          >
            <img src={Action} alt="Tick" style={{ marginRight: "8px" }} />
            Lưu
          </div>
          {/* </SuiTypography> */}
        </SuiButton>
      </DialogActions>
    </Dialog>
  );
}

export default FirstLogin;
