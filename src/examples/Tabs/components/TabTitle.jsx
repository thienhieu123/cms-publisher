import { Grid, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import PropTypes from "prop-types";

export default function TabTitle(props) {
  const { label, currentTab, id } = props;

  return (
    <Grid
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <CheckIcon style={{ visibility: `${currentTab !== id ? "hidden" : "visible"}` }} />
      <Typography>{label}</Typography>
    </Grid>
  );
}

TabTitle.propTypes = {
  label: PropTypes.string,
  currentTab: PropTypes.number,
  id: PropTypes.number,
};
TabTitle.defaultProps = {
  label: "",
  currentTab: 0,
  id: 0,
};
