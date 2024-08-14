import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import SuiTypography from "~/components/SuiTypography";
import SuiBox from "~/components/SuiBox";
// import { createTheme } from "@mui/material";

import SeeMore from "~/examples/SeeMore";

const innerBoxStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
};

function StatsBox({
  inner,
  title,
  value,
  color,
  icon,
  subData,
  text,
  boxIcon,
  boxIconBgColor,
  valueFontSize,
  titleColor,
  onClick,
}) {
  const StatsBoxDetail = (
    <SuiBox px={1.5} pb="5px" sx={inner ? innerBoxStyle : { cursor: "pointer" }} onClick={onClick}>
      <Grid justifyContent="space-between" display="flex" mb={0}>
        <Grid sx={{ textOverflow: "ellipsis", overflow: "hidden" }} item>
          <SuiTypography
            title={title}
            variant="text"
            color={titleColor}
            fontSize="13px"
            whiteSpace="nowrap"
            width="100%"
            sx={{ fontWeight: "600" }}
            // overflow="hidden"
            // textOverflow="ellipsis"
            // wordwrap="break-word"
          >
            {title}
          </SuiTypography>
        </Grid>
        <Grid item>
          {subData && (
            <SuiTypography variant="text" color="info" fontWeight="light" fontSize="small">
              {subData}
            </SuiTypography>
          )}
        </Grid>
      </Grid>
      <Grid display="flex" justifyContent="space-between">
        <Grid display="flex" alignItems="center">
          <SuiBox>
            <SuiTypography
              sx={{ display: "flex", alignItems: "center", gap: "0px" }}
              variant="h5"
              color={color}
              fontWeight="bold"
              fontSize={valueFontSize}
            >
              {value}
              {icon}
            </SuiTypography>
          </SuiBox>
        </Grid>
        {text && (
          <Grid>
            <SeeMore text={text} />
          </Grid>
        )}
        {boxIcon && (
          <SuiBox
            component="img"
            src={boxIcon}
            alt="boxIcon"
            width="30px"
            height="30px"
            padding="6px"
            sx={{ background: boxIconBgColor, borderRadius: "50%" }}
          />
        )}
      </Grid>
    </SuiBox>
  );

  return inner ? (
    <>
      <div />
      {StatsBoxDetail}
    </>
  ) : (
    <Card>{StatsBoxDetail}</Card>
  );
}

StatsBox.propTypes = {
  inner: PropTypes.bool,
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  icon: PropTypes.element,
  subData: PropTypes.string,
  text: PropTypes.string,
  boxIcon: PropTypes.string,
  boxIconBgColor: PropTypes.string,
  valueFontSize: PropTypes.string,
  titleColor: PropTypes.string,
  onClick: PropTypes.func,
};

StatsBox.defaultProps = {
  inner: false,
  icon: null,
  subData: null,
  text: "",
  color: "black",
  value: "",
  boxIcon: null,
  boxIconBgColor: null,
  valueFontSize: "1rem,",
  titleColor: "black",
  onClick: () => {},
};

export default StatsBox;
