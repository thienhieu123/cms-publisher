import SuiTypography from "~/components/SuiTypography";
import PropType from "prop-types";
import CheckIcon from "@mui/icons-material/Check";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function ValidateLine({ correct, text }) {
  return (
    <SuiTypography component="div" sx={{ textAlign: "left" }}>
      {correct ? (
        <SuiTypography
          fontWeight="400"
          color="var(--blue-blue-80)"
          lineHeight="21px"
          sx={{
            fontSize: "11px",
            textTransform: "none",
          }}
        >
          <CheckIcon sx={{ marginRight: "0.3rem" }} />
          {text}
        </SuiTypography>
      ) : (
        <SuiTypography
          fontWeight="400"
          color="black"
          lineHeight="21px"
          sx={{
            fontSize: "11px",
            textTransform: "none",
          }}
        >
          <FiberManualRecordIcon sx={{ marginRight: "0.3rem", height: "0.7em", width: "0.7em" }} />
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
