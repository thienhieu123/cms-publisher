import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "~/layouts/Account/index.css";
import Input from "~/components/Input";
import { Grid, Card, Typography } from "@mui/material";
import SuiTypography from "~/components/SuiTypography";
import { useState, useEffect } from "react";
import Confirm from "~/assets/images/icons/yellow-confirm.svg";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import { genders, userRoles } from "~/constants/config";
import SelectBox from "~/components/SelectBox";
import Avatar from "~/components/Avatar";
import SuiBox from "~/components/SuiBox";
import ButtonControl from "~/components/ButtonControl";
import { checkUrlImage, convertDateFormat, handleResponse } from "~/utils/utils";
import DatePicker from "~/components/DatePicker";
import useAdminDivision from "~/hooks/useAdminDivision";
import PopupRoot from "~/components/Popup/PopupRoot";
import SaveIcon from "~/assets/images/icons/white-save-icon.svg";
import ChangePasswordPopUp from "./changePasswordPopUp/changePasswordPopup";
// import { accountDetail } from "~/api/common";
import { getLocalUserInfo, setLocalUserInfo } from "~/utils/storage";
import { updateAccountInfo, uploadFile } from "~/api/common";
import { isMaxLength, isRequired, verifyEmail, verifyPhoneNumber } from "~/utils/verify";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";

export function AccountDetail({
  data,
  setData,
  avatar,
  setAvatar,
  setOpenChangePassword,
  hideChangePassword,
}) {
  const userInfo = getLocalUserInfo();
  const { listCountry, listProvince, listDistrict, listWard } = useAdminDivision(
    data.province,
    data.district,
    data.commune,
    (e) =>
      setData({
        ...data,
        nation: e,
      }),
    (e) =>
      setData({
        ...data,
        district: e,
      }),
    (e) =>
      setData({
        ...data,
        commune: e,
      })
  );

  useEffect(() => {
    setData({
      ...data,
      nation: "Việt Nam",
    });
  }, []);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  //   console.log("userInfo", userInfo);
  console.log("data", data);

  return (
    <Grid container px="25px" py="15px" pt={0} sx={{ justifyContent: "space-between" }}>
      <Grid
        container
        item
        xs={12}
        sm={12}
        lg={3.7}
        xl={3.7}
        display="flex"
        mt={1}
        sx={{ width: "fit-content" }}
      >
        <Avatar
          text={avatar ? "Thay đổi Ảnh Đại Diện" : "Tải Ảnh Đại Diện"}
          value={avatar}
          // image={checkUrlImage(avatar)}
          image={avatar}
          setImage={setAvatar}
          onChange={(file) => {
            if (file) {
              uploadFile({
                file,
                categoryCode: "USER_AVATAR",
                attachedWithObjId: userInfo?.id,
                attachedWithObjType: "USER",
              }).then((res) => {
                if (res.success && res.message.status === 200) {
                  setData({ ...data, avatarUrl: res.message.data.data });
                }
              });
            } else setData({ ...data, avatarUrl: null });
          }}
          setOpen={setOpen}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={3.7} xl={3.7}>
        <Grid container spacing="20px">
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <Input
              label="Họ và tên"
              placeholder="Họ và tên"
              required
              value={data.fullname}
              onChange={(e) => setData({ ...data, fullname: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <Input
              label="Số Điện Thoại"
              placeholder="Số Điện Thoại"
              required
              value={data.phoneNumber}
              onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <SelectBox
              label="Giới Tính"
              placeholder="Chọn"
              value={data.gender}
              required={false}
              mapField="value"
              options={genders}
              width="100%"
              fontSize="13px"
              onChange={(e) => setData({ ...data, gender: e.value })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <DatePicker
              label="Ngày Sinh"
              fontSize="medium"
              type="date"
              width="100%"
              value={data.dateOfBirth}
              onChange={(e) => setData({ ...data, dateOfBirth: convertDateFormat(e) })}
              onChangeCalendarDate={(e) => setData({ ...data, dateOfBirth: convertDateFormat(e) })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <Input
              required={false}
              label="Email"
              placeholder="Email"
              value={data.email || ""}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <Input label="Cơ quan chuyên trách" disabled value={data.unit} />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <Input label="Chức vụ" disabled value={data.position} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12} lg={3.7} xl={3.7}>
        <Grid container spacing="20px">
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <SelectBox
              label="Vai trò"
              placeholder="Chọn"
              width="100%"
              value={data.roles}
              required={false}
              isDisabled
              mapField="value"
              //   options={userRoles}
              dataSource={`/roles/list?status=ACTIVATED`}
              mapping={{ value: "id", label: "roleName" }}
              isMulti
              onChange={(e) => {
                setData({
                  ...data,
                  roles: e,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <SelectBox
              title="Quốc Gia"
              label="Quốc Gia"
              placeholder="Chọn"
              required={false}
              options={listCountry}
              width="100%"
              value={data.nation}
              onChange={(e) =>
                setData({
                  ...data,
                  nation: e.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <SelectBox
              title="Tỉnh/ Thành phố"
              label="Tỉnh/ Thành phố"
              placeholder="Chọn"
              options={listProvince}
              mapField={"areaCode"}
              width="100%"
              required={false}
              value={data.province}
              onChange={(e) => {
                setData({
                  ...data,
                  province: e.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <SelectBox
              title="Quận/Huyện"
              label="Quận/Huyện"
              placeholder="Chọn"
              options={listDistrict}
              mapField={"areaCode"}
              width="100%"
              required={false}
              value={data.district}
              onChange={(e) =>
                setData({
                  ...data,
                  district: e.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <SelectBox
              title="Phường/Xã"
              label="Phường/Xã"
              placeholder="Chọn"
              options={listWard}
              mapField={"areaCode"}
              width="100%"
              value={data.commune}
              onChange={(e) =>
                setData({
                  ...data,
                  commune: e.value,
                })
              }
              required={false}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <Input
              label="Địa Chỉ"
              placeholder="Nhập số nhà, tên đường"
              title="Địa Chỉ"
              value={data.address}
              onChange={(e) =>
                setData({
                  ...data,
                  address: e.target.value,
                })
              }
            />
          </Grid>
          {!hideChangePassword && (
            <Grid
              item
              xs={12}
              sm={12}
              lg={12}
              xl={12}
              sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
            >
              <SuiTypography
                onClick={() => setOpenChangePassword(true)}
                whiteSpace="nowrap"
                variant="body2"
                color="#C21500"
                fontSize="large"
                sx={{
                  cursor: "pointer",
                  border: "3px solid #C21500",
                  borderRadius: "5px",
                  fontWeight: "700",
                }}
                py={1}
                px={2}
              >
                Đổi mật khẩu
              </SuiTypography>
            </Grid>
          )}
          {/************ Popup *************/}
          <PopupRoot open={open} setOpen={setOpen}>
            <Grid
              container
              // spacing={4}
              p={2}
              // px={4}
              // pb={1}
              display={"flex"}
              flexDirection={"column"}
              // alignItems={"center"}
              // justifyContent={"center"}
            >
              <img src={Confirm} alt="Confirm" />
              <Typography fontSize="19px" fontWeight="600">
                Xác nhận?
              </Typography>
              <Typography color="var(--gray-80)" fontSize="14px" fontWeight="400" mb={"20px"}>
                Bạn có muốn xoá ảnh đại diện
              </Typography>
              <ButtonControl
                cancelText="Hủy"
                handleCancel={handleClose}
                submitText="Đồng ý"
                handleSubmit={() => {
                  handleClose();
                  setAvatar("");
                }}
              />
            </Grid>
          </PopupRoot>
        </Grid>
      </Grid>
    </Grid>
  );
}

AccountDetail.defaultProps = {
  data: {},
  setData: () => {},
  setOpenChangePassword: () => {},
  avatar: "",
  setAvatar: () => {},
  hideChangePassword: false,
};

AccountDetail.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object]),
  setData: PropTypes.func,
  setOpenChangePassword: PropTypes.func,
  avatar: PropTypes.string,
  setAvatar: PropTypes.func,
  hideChangePassword: PropTypes.bool,
};

function Account() {
  const [isOpenChangePassword, setOpenChangePassword] = useState(false);
  // const location = useLocation().pathname.split("/");
  // location.pop();
  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();
  const [avatar, setAvatar] = useState("");
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

  useEffect(() => {
    const data = getLocalUserInfo();
    const roles = data?.roles.map((item) => item.id);
    setAccountInfo({ ...data?.profile, roles: roles });
    setAvatar(data?.profile?.avatarUrl);
  }, []);

  function verifyData() {
    try {
      isRequired(accountInfo.fullname, "Họ và tên");
      isRequired(accountInfo.phoneNumber, "Số Điện Thoại");
      // isRequired(accountInfo.roles, "Vai trò");
      isMaxLength(accountInfo.fullname, "Họ và tên", 250);
      verifyPhoneNumber(accountInfo.phoneNumber);
      verifyEmail(accountInfo.email);
    } catch (e) {
      setErrorMessage(e);
    }
  }
  function handleUpdate() {
    verifyData();
    updateAccountInfo(accountInfo).then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setSuccessMessage("Cập nhật thông tin thành công");
        setLocalUserInfo(res.message.data.data);
      }
    });
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <PopupRoot
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "transparent",
        }}
        open={isOpenChangePassword}
        setOpen={setOpenChangePassword}
        onClose={true}
      >
        <ChangePasswordPopUp
          close={() => setOpenChangePassword(false)}
          onPopUp={isOpenChangePassword}
          ButtonCancel={true}
        />
      </PopupRoot>
      <div className={true ? "sticky-btn no-tabs-sticky visual-bg" : ""}>
        <ButtonControl
          isHideImageCancel
          hiddenCancel
          imageSubmit={SaveIcon}
          handleSubmit={handleUpdate}
        />
      </div>

      <Card>
        <SuiBox sx={{ padding: "25px" }}>
          <SuiTypography variant="h3" fontSize="17px" color="black" sx={{ fontWeight: "600" }}>
            Thông Tin Cá Nhân
          </SuiTypography>
        </SuiBox>
        <AccountDetail
          data={accountInfo}
          setData={setAccountInfo}
          setOpenChangePassword={setOpenChangePassword}
          avatar={avatar}
          setAvatar={setAvatar}
        />
      </Card>
    </DashboardLayout>
  );
}
export default Account;
