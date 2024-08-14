import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import List from "@mui/material/List";
import { forwardRef, useState } from "react";

const showStyle = {
  height: "100%",
};
const hideStyle = {
  height: "0px",
  visibility: "hidden",
};

const ControlSideBar = forwardRef(({ title, props }) => {
  const [showNav, setShowNav] = useState(true);
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setShowNav(!showNav)}
        onKeyDown={() => setShowNav(!showNav)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f8f9fa",
          zIndex: "100",
        }}
      >
        <List>{title}</List>
        {showNav ? (
          <Icon sx={{ fontWeight: "bold", marginRight: "0.5vw", opacity: 0.6, fontSize: "1vw" }}>
            unfold_more_sharp_icon
          </Icon>
        ) : (
          <Icon sx={{ fontWeight: "bold", marginRight: "0.5vw", opacity: 0.6, fontSize: "1vw" }}>
            unfold_less_sharp_icon
          </Icon>
        )}
      </div>
      <List style={showNav ? showStyle : hideStyle}>{props}</List>
    </div>
  );
});

ControlSideBar.propTypes = {
  title: PropTypes.arrayOf(PropTypes.object).isRequired,
  props: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default ControlSideBar;
