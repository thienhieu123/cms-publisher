// react-router-dom components
import { useNavigate } from "react-router-dom";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { getRolePermissionByUserId, login, verifyOTPLogin } from "~/api/common";
// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import SuiButton from "~/components/SuiButton";
// Authentication layout components
import { useSoftUIController } from "~/context";
// import { setLocalEmpPermission, setAccessToken, setLocalUserInfo } from "~/utils/storage";
import {
  setAccessToken,
  setLocalRolePermission,
  setLocalUserInfo,
  setRefreshToken,
} from "~/utils/storage";
import { setAccountInfo } from "~/context/account/action";
import BasicLayout from "~/layouts/Authentication/Components/BasicLayout";
import OtpInput from "react-otp-input";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import "./Otp.css";
import { isRequired, isMinLength } from "~/utils/verify";
import TitleKTS from "~/layouts/Authentication/Components/TitleKTS";
// Images
import curved6 from "~/assets/images/curved-images/curved14.jpg";
import useErrorMessage from "~/hooks/useErrorMessage";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import { setLoading } from "~/context/common/action";

function OTPForm(props) {
  const { phoneNumber, setStep, password, setCurrentStep } = props;
  const [, dispatch] = useSoftUIController();
  const navigate = useNavigate();
  const [otp, setOTP] = useState("");
  const [NotReceiveOTP, setNotReceiveOTP] = useState(true);

  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();

  const verifyOTP = (value) => {
    try {
      isRequired(value, "Mã OTP");
      isMinLength(value, "Mã OTP", 6);
      return true;
    } catch (e) {
      setErrorMessage(e);
      return false;
    }
  };
  const getOtpAgain = () => {
    login(phoneNumber, password).then((res) => {
      if (res.message?.status === 200) {
        // setSuccessMessage(`Đã gửi lại mã OTP`);
        setSuccessMessage(res.message.data.data.otp);
        setOTP("");
      } else {
        setErrorMessage(res.message.data.message);
      }
    });
  };

  const handleRoute = () => {
    setTimeout(() => {
      navigate("/home", { replace: true });
      setLoading(dispatch, false);
    }, 100);
  };

  useEffect(() => {
    window.addEventListener("privateRoute", handleRoute);
    return () => {
      window.removeEventListener("privateRoute", handleRoute);
    };
  }, []);

  const handleSubmit = () => {
    try {
      const result = verifyOTP(otp);
      if (result) {
        verifyOTPLogin(phoneNumber, otp).then(
          (res) => {
            setLoading(dispatch, true);
            if (res.message.status === 200) {
              setSuccessMessage(`Đăng nhập thành công`);
              setAccessToken(res.message.data.accessToken);
              setRefreshToken(res.message.data.refreshToken);
              setLocalUserInfo(res.message.data.data);
              setAccountInfo(dispatch, res.message.data.data);
              getRolePermissionByUserId(res.message.data.data.id, 0, 1000).then((res) => {
                if (res.success && res.message.status === 200) {
                  setLocalRolePermission(res.message.data.data.modules);
                }
              });
              // navigate("/home", { replace: true }); //Hoang co data dung se xoa cho nay
            } else {
              setErrorMessage(res.message.data?.message);
              setLoading(dispatch, false);
            }
          },
          (error) => {
            setErrorMessage(error);
            console.log(error);
          }
        );
      }
    } catch (e) {
      setLoading(dispatch, false);
    }
  };

  useEnterKeyEvent([otp], handleSubmit);
  return (
    <BasicLayout
      title="Welcome!"
      description="Use these awesome forms to login or create new account in your project for free."
      image={curved6}
    >
      <TitleKTS />
      <SuiTypography
        sx={{
          position: "relative",
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "7px",
        }}
        textAlign="center"
      >
        Xác Thực Đăng Nhập
      </SuiTypography>
      <SuiBox display="flex" mb="26px" justifyContent="center">
        <SuiTypography
          sx={{
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "400",
            color: "var(--gray-80)",
            textTransform: "none",
          }}
          textAlign="center"
          onClick={() => setStep(0)}
        >
          Trở về
        </SuiTypography>
        <SuiTypography
          textAlign="center"
          onClick={() => setStep(0)}
          sx={{
            cursor: "pointer",
            marginLeft: "6px",
            fontSize: "18px",
            fontWeight: "400",
            color: "var(--blue-blue-100)",
            textTransform: "none",
          }}
        >
          Đăng nhập
        </SuiTypography>
      </SuiBox>
      <SuiBox pt={0} mb={3} textAlign="center">
        <SuiTypography
          sx={{
            fontSize: "14px",
            lineHeight: "33px",
            fontWeight: "400",
            color: "var(--gray-80)",
            textTransform: "none",
          }}
          // variant="h5"
          fontWeight="light"
        >
          Vui lòng nhập mã OTP đã được gửi tới số điện thoại
        </SuiTypography>
        <SuiTypography
          sx={{
            fontSize: "14px",
            color: "#7e8299",
            fontWeight: "700",
          }}
        >
          {`${phoneNumber.substr(0, 3)}*****${phoneNumber.substr(8, 2)}`}
        </SuiTypography>
      </SuiBox>
      <SuiBox pt={0} pb={3}>
        <SuiBox p={0} display="flex" justifyContent="center">
          <OtpInput
            onChange={(e) => setOTP(e)}
            value={otp}
            numInputs={6}
            separator={<span> </span>}
            isInputNum
            shouldAutoFocus
            inputStyle="inputStyle"
          />
        </SuiBox>
        <SuiBox p={0} display="flex" justifyContent="center" mt="26px">
          <SuiTypography
            sx={{
              position: "relative",
              fontSize: "14px",
              color: "#888",
              fontWeight: "500",
              textTransform: "none",
            }}
          >
            Không nhận được mã OTP?
          </SuiTypography>

          <SuiTypography
            sx={{
              cursor: "pointer",
              position: "relative",
              fontSize: "14px",
              color: "#0965BA",
              textDecoration: "underline",
              fontWeight: "400",
              textTransform: "none",
            }}
            ml={0.5}
            onClick={() => getOtpAgain()}
          >
            Gửi lại OTP
          </SuiTypography>
        </SuiBox>
        <SuiBox mt={4} mb={1} textAlign="center">
          <SuiButton
            size="small"
            color="var(--red-200)"
            circular
            sx={{
              background: "var(--red-200)",
              borderRadius: "5px",
              padding: "8px 24px",
              width: "100%",
            }}
            onClick={handleSubmit}
          >
            <SuiTypography whiteSpace="nowrap" variant="body2" color="white" fontSize="14px">
              Xác nhận
            </SuiTypography>
          </SuiButton>
        </SuiBox>
      </SuiBox>
    </BasicLayout>
  );
}
OTPForm.defaultProps = {
  phoneNumber: null,
  setStep: () => {},
  // setCurrentStep: () => {},
};

OTPForm.propTypes = {
  phoneNumber: PropTypes.string,
  setStep: PropTypes.func,
  // setCurrentStep: PropTypes.func,
};
export default OTPForm;
