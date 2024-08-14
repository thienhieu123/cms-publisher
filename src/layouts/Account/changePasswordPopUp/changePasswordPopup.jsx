/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SuiTypography from "~/components/SuiTypography";
import SuiBox from "~/components/SuiBox";
import Input from "~/components/Input";
import { setAlertMessage } from "~/context/common/action";
import { useSoftUIController } from "~/context/index";
import { verifyPassword, isMaxLength } from "~/utils/verify";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import IconShowPassword from "~/assets/images/icons/Eye.svg";
import IconHidePassword from "~/assets/images/icons/Invisible-Eye.svg";
import ButtonControl from "~/components/ButtonControl";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import { resetPassword } from "~/api/common";
import { getLocalUserInfo, setLocalUserInfo } from "~/utils/storage";

function ChangePasswordPopUp({ close, ButtonCancel, FirstLogin }) {
  const [, dispatch] = useSoftUIController();

  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();

  const typeAndCheckPassword = (newPass) => {
    // checkPassword(newPass.target.value);
    setNewPassword(newPass.target.value);
  };

  const onCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    close();
  };
  const validatePassword = (value) => {
    try {
      verifyPassword(value);
      isMaxLength(value, "Mật khẩu mới", 24);
    } catch (e) {
      setErrorMessage(e);
      return false;
    }
    return true;
  };

  const handleUpdate = () => {
    if (confirmPassword !== newPassword) {
      setErrorMessage("Mật khẩu không khớp, vui lòng nhập lại");
      return;
    }

    if (confirmPassword === oldPassword) {
      setErrorMessage("Mật khẩu mới phải khác mật khẩu cũ");
      return;
    }
    const validate = validatePassword(newPassword);
    if (validate) {
      resetPassword(oldPassword, newPassword).then((res) => {
        console.log(res);
        if (res.success && res.message.status === 200) {
          setSuccessMessage("Đổi mật khẩu lần đầu tiên thành công");
          let data = getLocalUserInfo();
          data.passwordResetRequired = false;
          setLocalUserInfo(data);
          close();
        }
      });
    }
  };

  return (
    <Card sx={{ maxWidth: "417px", borderRadius: "8px", background: "transparent !important" }}>
      <Grid container py={2} px={2}>
        <Grid item xs={12} xl={12} sx={{ display: "flex", justifyContent: "center" }}>
          <SuiTypography
            variant="h5"
            fontSize="20px"
            color="black"
            sx={{ fontWeight: "600", color: "#54595E", textTransform: "none" }}
          >
            Đổi mật khẩu
          </SuiTypography>
        </Grid>
        {FirstLogin && (
          <Grid item xs={12} xl={12} sx={{ display: "flex", justifyContent: "center" }}>
            <SuiTypography
              variant="p"
              fontSize="14px"
              color="#2D3442"
              sx={{ fontWeight: "400", color: "#2D3442", textTransform: "none" }}
            >
              Trong lần đăng nhập đầu tiên, vui lòng thay đổi mật khẩu
            </SuiTypography>
          </Grid>
        )}
        <Grid item xs={12} xl={12}>
          <SuiBox component="form" role="form">
            <SuiBox mb={2}>
              <Input
                placeholder="Nhập mật khẩu hiện tại"
                label="Mật khẩu hiện tại"
                required
                type={showPasswordOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPasswordOld((prev) => !prev);
                      }}
                      style={{ marginTop: "26px" }}
                      // onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      <SuiBox
                        component="img"
                        src={showPasswordOld ? IconShowPassword : IconHidePassword}
                        alt="Show Password"
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </SuiBox>
            <SuiBox mb={2}>
              <Input
                placeholder="Nhập mật khẩu mới"
                label="Mật Khẩu Mới"
                required
                type={showPasswordNew ? "text" : "password"}
                value={newPassword}
                onChange={typeAndCheckPassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPasswordNew((prev) => !prev);
                      }}
                      style={{ marginTop: "26px" }}
                      edge="end"
                    >
                      <SuiBox
                        component="img"
                        src={showPasswordNew ? IconShowPassword : IconHidePassword}
                        alt="Show Password"
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </SuiBox>
            <SuiBox mb={2}>
              <Input
                placeholder="Nhập lại mật khẩu mới"
                label="Xác Nhận Mật Khẩu mới"
                required
                type={showPasswordConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPasswordConfirm((prev) => !prev);
                      }}
                      style={{ marginTop: "26px" }}
                      // onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      <SuiBox
                        component="img"
                        src={showPasswordConfirm ? IconShowPassword : IconHidePassword}
                        alt="Show Password"
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </SuiBox>
          </SuiBox>
        </Grid>

        <ButtonControl
          justifyContent="center"
          handleCancel={onCancel}
          hiddenCancel={!ButtonCancel}
          handleSubmit={handleUpdate}
          disabledSubmit={!(oldPassword && newPassword && confirmPassword)}
        />
      </Grid>
    </Card>
  );
}

ChangePasswordPopUp.propTypes = {
  close: PropTypes.func.isRequired,
};

export default ChangePasswordPopUp;
