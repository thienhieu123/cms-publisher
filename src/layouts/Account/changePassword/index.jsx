import { Card, Grid } from "@mui/material";
import SuiButton from "~/components/SuiButton";
import SuiTypography from "~/components/SuiTypography";
import Input from "~/examples/Input";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAlertMessage } from "~/context/common/action";
import { useSoftUIController } from "~/context";
import { validatePassword } from "~/utils/utils";
import { updatePassword } from "~/api/common";
import { getLocalUserInfo } from "~/utils/storage";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [, dispatch] = useSoftUIController();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRePassword, setNewRePassword] = useState("");

  function handleUpdate() {
    if (newRePassword !== newPassword) {
      setAlertMessage(dispatch, {
        message: "Nhập lại mật khẩu mới không trùng khớp",
        type: "error",
        openAlert: true,
      });

      return;
    }

    if (newRePassword === oldPassword) {
      setAlertMessage(dispatch, {
        message: "Mật khẩu mới phải khác mật khẩu cũ",
        type: "error",
        openAlert: true,
      });

      return;
    }
    const validate = validatePassword(newPassword);

    if (validate.status === false) {
      setAlertMessage(dispatch, {
        message: "Mật khẩu không hợp lệ! Vui lòng đặt lại",
        type: "error",
        openAlert: true,
      });
    } else {
      //call api
      const localUserInfo = getLocalUserInfo();
      updatePassword(localUserInfo.phoneNumber, oldPassword, newPassword, newRePassword).then(
        (result) => {
          if (result.message.data.status === 200) {
            setAlertMessage(dispatch, {
              message: "Lưu dữ liệu thành công",
              type: "success",
              openAlert: true,
            });
          } else {
            setAlertMessage(dispatch, {
              message: "Mật khẩu hiện tại không đúng.Vui lòng nhập lại",
              type: "error",
              openAlert: true,
            });
          }
        }
      );
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card
        sx={{
          padding: "20px",
        }}
      >
        <Grid item xs={12} sm={4} lg={4} xl={4} mb={5}>
          <SuiTypography>Thông tin đăng nhập</SuiTypography>
        </Grid>
        <Grid item xs={12} sm={4} lg={4} xl={4} mb={3}>
          <Input
            sx={{ fontSize: "1rem", height: "73px" }}
            title="Mật khẩu cũ"
            required
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4} lg={4} xl={4} mb={3}>
          <Input
            sx={{ fontSize: "1rem", height: "73px" }}
            title="Mật khẩu mới"
            required
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4} lg={4} xl={4} mb={3}>
          <Input
            sx={{ fontSize: "1rem", height: "73px" }}
            title="Nhập lại mật khẩu mới"
            required
            type="password"
            value={newRePassword}
            onChange={(e) => setNewRePassword(e.target.value)}
          />
        </Grid>

        {/* {error && (
          <Grid item xs={12} sm={4} lg={4} xl={4}>
            <SuiTypography sx={{ color: "rgb(255, 0, 0)", fontSize: "14px" }}>
              {error}
            </SuiTypography>
          </Grid>
        )} */}

        <Grid container>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <Grid container spacing={3} display="flex" p={2}>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                <SuiButton
                  color="info"
                  circular
                  sx={{ width: "100%", padding: "0px" }}
                  onClick={handleUpdate}
                  disabled={!(oldPassword && newPassword && newRePassword)}
                >
                  <SuiTypography
                    whiteSpace="nowrap"
                    fontWeight="regular"
                    color="white"
                    fontSize="1rem"
                  >
                    Lưu
                  </SuiTypography>
                </SuiButton>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                <SuiButton
                  color="white"
                  circular
                  sx={{ width: "100%", padding: "0px" }}
                  onClick={() => navigate(-1)}
                >
                  <SuiTypography
                    whiteSpace="nowrap"
                    fontWeight="regular"
                    color="black"
                    fontSize="1rem"
                  >
                    Hủy
                  </SuiTypography>
                </SuiButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </DashboardLayout>
  );
}
