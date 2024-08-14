// import SuiTypography from "~/components/SuiTypography";
import PropType from "prop-types";
import CheckIcon from "@mui/icons-material/Check";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function ValidateLine({ correct, text }) {
  return (
    <div>
      {correct ? (
        <div
          fontWeight="400"
          style={{
            fontSize: "11px",
            color: "var(--blue-blue-80)",
            variant: "h5",
          }}
        >
          <CheckIcon sx={{ marginRight: "0.3rem" }} />
          {text}
        </div>
      ) : (
        <div
          fontWeight="400"
          color="black"
          style={{
            fontSize: "11px",
          }}
        >
          <FiberManualRecordIcon sx={{ marginRight: "0.3rem" }} />
          {text}
        </div>
      )}
    </div>
  );
}

export default ValidateLine;
// propTypes
ValidateLine.propTypes = {
  correct: PropType.bool.isRequired,
  text: PropType.string.isRequired,
};
