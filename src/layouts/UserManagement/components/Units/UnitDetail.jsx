import { Card, Grid } from "@mui/material";
import { useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import { AccountDetail } from "~/layouts/Account";
import WhiteSaveIcon from "~/assets/images/icons/white-save-icon.svg";
import { useNavigate } from "react-router-dom";
import PopupRoot from "~/components/Popup/PopupRoot";
import InputPassWordV2 from "~/components/InputPassWordV2";

export default function UserDetail({ update }) {
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    fullname: "",
    avatarUrl: "",
    dateOfBirth: null,
    gender: 1,
    phoneNumber: "",
    email: "",
    address: "",
    nation: null,
    province: null,
    district: null,
    commune: null,
    position: "",
    roles: [],
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassWordPopup = () => {
    return (
      <PopupRoot
        title="Reset mật khẩu"
        open={isOpenChangePassword}
        setOpen={setIsOpenChangePassword}
      >
        <Grid container p={2} spacing={2} maxWidth="417px">
          <Grid item xs={12} lg={12}>
            <InputPassWordV2
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              password={password}
              setPassword={setPassword}
              required
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <InputPassWordV2
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              password={confirmPassword}
              setPassword={setConfirmPassword}
              required
            />
          </Grid>
        </Grid>
      </PopupRoot>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {changePassWordPopup()}
      <ButtonControl imageSubmit={WhiteSaveIcon} handleCancel={() => navigate(-1)} />
      <Card>
        <SuiBox sx={{ padding: "25px" }}>
          <SuiTypography variant="h3" fontSize="17px" color="black" sx={{ fontWeight: "600" }}>
            Thông Tin Cá Nhân
          </SuiTypography>
        </SuiBox>
        <AccountDetail
          data={accountInfo}
          setData={setAccountInfo}
          avatar={avatar}
          setAvatar={setAvatar}
          hideChangePassword={!update}
          setOpenChangePassword={setIsOpenChangePassword}
        />
      </Card>
    </DashboardLayout>
  );
}
