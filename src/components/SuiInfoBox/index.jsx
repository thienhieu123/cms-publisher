import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import PropTypes from "prop-types";

function SuiInfoBox(props) {
  const { data, title, width, height, fontSize, dataColor } = props;
  return (
    <SuiBox
      sx={{
        width,
        height,
        backgroundColor: "#f9f9f9",
        boxSizeing: "border-box",
        borderRadius: "8px",
        "&:active": {
          backgroundColor: "#f5f5f5",
        },
        "&:": {
          backgroundColor: "#f5f5f5",
        },
      }}
      p={2}
    >
      {/* {title} */}
      <SuiTypography fontSize={fontSize} variant="h6" color="black">
        {title}
      </SuiTypography>
      <SuiTypography color={dataColor} fontSize={fontSize} variant="h6">
        {data}
      </SuiTypography>
    </SuiBox>
  );
}

export default SuiInfoBox;

SuiInfoBox.propTypes = {
  data: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  fontSize: PropTypes.string,
  dataColor: PropTypes.string,
};

SuiInfoBox.defaultProps = {
  data: "",
  title: "",
  width: "auto",
  height: "auto",
  fontSize: "small",
  dataColor: "black",
};
