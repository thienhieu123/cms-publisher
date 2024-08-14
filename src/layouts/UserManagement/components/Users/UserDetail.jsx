import { Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import WhiteSaveIcon from "~/assets/images/icons/white-save-icon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { createUser, getUserDetail, updateUser } from "~/api/common";
import UserInfo from "./UserInfo";
import useErrorMessage from "~/hooks/useErrorMessage";
import { isRequired, verifyEmail, verifyPhoneNumber } from "~/utils/verify";
import useSuccessMessage from "~/hooks/useSuccessMessage";

export default function UserDetail({ update }) {
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userID = location.pathname.split("/")[3];
  const { setErrorMessage } = useErrorMessage();
  const { setSuccessMessage } = useSuccessMessage();

  const [userInfo, setUserInfo] = useState({
    fullname: "",
    dateOfBirth: null,
    gender: "MALE",
    phoneNumber: "",
    email: "",
    address: "",
    nation: null,
    province: null,
    district: null,
    commune: null,
    department: "",
    position: "",
    roles: [],
  });

  const verifyInfo = () => {
    try {
      isRequired(userInfo.fullname, "Họ và tên");
      isRequired(userInfo.phoneNumber, "Số điện thoại");
      isRequired(userInfo.department, "Cơ quan chuyên trách");
      isRequired(userInfo.position, "Chức vụ");
      isRequired(userInfo.roles, "Vai trò");
      verifyPhoneNumber(userInfo.phoneNumber);
      verifyEmail(userInfo.email);
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  useEffect(() => {
    if (update) {
      //mode update
      getUserDetail(userID).then((res) => {
        if (res.success && res.message.status === 200) {
          res.message.data.data.profile.province = res.message.data.data.profile.province?.areaCode;
          res.message.data.data.profile.district = res.message.data.data.profile.district?.areaCode;
          res.message.data.data.profile.commune = res.message.data.data.profile.commune?.areaCode;
          console.log("img:", res.message.data.data.profile.avatarUrl);
          setAvatar(res.message.data.data.profile.avatarUrl);
          const roles = res.message.data.data.roles.map((item) => {
            return {
              value: item.id,
              label: item.roleName,
            };
          });
          const department = res.message.data.data.profile?.position?.unit?.id;
          const postion = res.message.data.data.profile.position?.id;
          setUserInfo({
            ...res.message.data.data.profile,
            roles: roles,
            department: department,
            position: postion,
          });
        }
      });
    }
  }, []);

  const handleSubmit = () => {
    const {
      fullname,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
      address,
      nation,
      province,
      district,
      commune,
      department,
      position,
      roles,
      avatar,
    } = userInfo;
    const roleIds = roles.map((item) => item.value);
    // console.log(roles, roleIds);
    verifyInfo();
    if (update) {
      //mode update user
      updateUser(
        userID,
        fullname,
        phoneNumber,
        gender,
        dateOfBirth,
        email,
        department,
        position,
        roleIds,
        nation,
        province,
        district,
        commune,
        address,
        avatar
      ).then((res) => {
        if (res.success && res.message.status === 200) {
          setSuccessMessage("Cập nhật người dùng thành công");
          navigate(-1);
        }
      });
    } else {
      //mode create user
      createUser(
        fullname,
        phoneNumber,
        gender,
        dateOfBirth,
        email,
        department,
        position,
        roleIds,
        nation,
        province,
        district,
        commune,
        address,
        avatar
      ).then((res) => {
        if (res.success && res.message.status === 200) {
          setSuccessMessage("Tạo mới người dùng thành công");
          navigate(-1);
        }
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ButtonControl
        imageSubmit={WhiteSaveIcon}
        handleCancel={() => navigate(-1)}
        handleSubmit={handleSubmit}
      />
      <Card>
        <SuiBox sx={{ padding: "25px" }}>
          <SuiTypography variant="h3" fontSize="17px" color="black" sx={{ fontWeight: "600" }}>
            Thông Tin Cá Nhân
          </SuiTypography>
        </SuiBox>
        <UserInfo
          data={userInfo}
          setData={setUserInfo}
          avatar={avatar}
          setAvatar={setAvatar}
          isUpdate={update}
          userID={userID}
        />
      </Card>
    </DashboardLayout>
  );
}
