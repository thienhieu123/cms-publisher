import { Grid } from "@mui/material";
import SuiButton from "~/components/SuiButton";
import SuiTypography from "~/components/SuiTypography";
import PropType from "prop-types";
// import { getLocalUserInfo } from "utils/storage";
// import { roles } from "constants/config";
import Cancel from "~/assets/images/icons/CancelRed.svg";
import Action from "~/assets/images/Action.svg";

function ButtonControl({
  handleSubmit,
  handleCancel,
  justifyContent,
  submitText,
  hiddenSubmit,
  hiddenCancel,
  cancelText,
  imageCancel,
  imageSubmit,
  isHideImageCancel,
  isHideImageSubmit,
  disabledSubmit,
  isHidden,
}) {
  //   const userInfo = getLocalUserInfo();
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={0} pb="5px">
        <Grid container gap={4} display="flex" justifyContent={justifyContent}>
          {!isHidden && (
            <>
              {!hiddenCancel && (
                <SuiButton
                  color="transparent"
                  sx={{
                    border: "1px solid var(--red-200)",
                    fontWeight: 700,
                  }}
                  onClick={handleCancel}
                >
                  {!isHideImageCancel && (
                    <img src={imageCancel || Cancel} alt="Tick" style={{ marginRight: "8px" }} />
                  )}
                  <SuiTypography
                    whiteSpace="nowrap"
                    fontWeight="regular"
                    color="var(--red-200)"
                    fontSize="14px"
                    sx={{
                      fontWeight: 700,
                      fontSize: "14px",
                      textTransform: "none",
                    }}
                  >
                    {cancelText}
                  </SuiTypography>
                </SuiButton>
              )}
              {!hiddenSubmit && (
                <SuiButton
                  color="var(--red-200)"
                  onClick={handleSubmit}
                  disabled={disabledSubmit}
                  sx={{
                    "&:disabled": {
                      background: "var(--gray-80)",
                    },
                  }}
                >
                  {!isHideImageSubmit && (
                    <img src={imageSubmit || Action} alt="Tick" style={{ marginRight: "8px" }} />
                  )}
                  <SuiTypography
                    whiteSpace="nowrap"
                    color="white"
                    sx={{
                      fontWeight: 700,
                      fontSize: "14px",
                      textTransform: "none",
                    }}
                  >
                    {submitText}
                  </SuiTypography>
                </SuiButton>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
ButtonControl.defaultProps = {
  handleSubmit: () => {},
  handleCancel: () => {},
  justifyContent: "flex-end",
  submitText: "Lưu",
  cancelText: "Hủy",
  isHidden: false,
  hiddenSubmit: false,
  hiddenCancel: false,
  imageCancel: "",
  imageSubmit: "",
  isHideImageCancel: false,
  isHideImageSubmit: false,
  disabledSubmit: false,
};
ButtonControl.propTypes = {
  handleSubmit: PropType.func,
  handleCancel: PropType.func,
  justifyContent: PropType.string,
  submitText: PropType.string,
  cancelText: PropType.string,
  isHidden: PropType.bool,
  hiddenSubmit: PropType.bool,
  hiddenCancel: PropType.bool,
  imageCancel: PropType.string,
  imageSubmit: PropType.string,
  isHideImageCancel: PropType.bool,
  isHideImageSubmit: PropType.bool,
  disabledSubmit: PropType.bool,
};
export default ButtonControl;
