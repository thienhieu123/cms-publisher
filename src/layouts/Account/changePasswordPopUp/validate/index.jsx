import SuiTypography from "~/components/SuiTypography";
import PropType from "prop-types";
import IconCheck from "~/assets/images/IconCheck.svg";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SuiBox from "~/components/SuiBox";

function ValidateLine({ correct, text }) {
  return (
    <SuiTypography component="div" sx={{ textAlign: "left" }}>
      {correct ? (
        <SuiTypography
          fontWeight="normal"
          color="var(--blue-blue-80)"
          sx={{
            fontSize: "11px",
            fontStyle: "italic",
            textTransform: "none",
            lineHeight: "21px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <SuiBox component="img" src={IconCheck} alt="IconCheck" marginRight="8px" />
          {text}
        </SuiTypography>
      ) : (
        <SuiTypography
          fontWeight="normal"
          color="var(--gray-100)"
          sx={{
            fontSize: "11px",
            fontStyle: "italic",
            textTransform: "none",
            lineHeight: "21px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FiberManualRecordIcon sx={{ marginRight: "8px", width: "13px", padding: "2px" }} />
          {text}
        </SuiTypography>
      )}
    </SuiTypography>
  );
}

export default ValidateLine;
// propTypes
ValidateLine.propTypes = {
  correct: PropType.bool.isRequired,
  text: PropType.string.isRequired,
};
