/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiBadge from "~/components/SuiBadge";
import SuiTypography from "~/components/SuiTypography";

// Custom styles for the SidenavCollapse
import {
  collapseItem,
  collapseIconBox,
  collapseText,
} from "~/examples/Sidenav/styles/sidenavCollapse";

// Soft UI Dashboard React context
import { useSoftUIController } from "~/context";

function SidenavCollapse({
  color,
  icon,
  name,
  data,
  children,
  active,
  noCollapse,
  open,
  close,
  ...rest
}) {
  const [controller] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller.theme;
  return (
    <>
      <ListItem component="li">
        <SuiBox
          margin="0px !important"
          {...rest}
          sx={(theme) => collapseItem(theme, { active, transparentSidenav })}
        >
          <ListItemIcon
            sx={(theme) => collapseIconBox(theme, { active, transparentSidenav, color })}
          >
            <div className="sidenav-icon">
              <img src={icon} alt="icon" style={{ filter: `${active ? "brightness(100)" : ""}` }} />
            </div>
          </ListItemIcon>
          <ListItemText
            // primary={name}
            sx={(theme) => collapseText(theme, { miniSidenav, transparentSidenav, active })}
          />
          {data !== 0 && data !== undefined && (
            <SuiBadge
              sx={{ position: "absolute", right: "0px" }}
              color="info"
              size="sm"
              badgeContent={
                <SuiTypography variant="text" fontSize="12px" fontWeight="regular" color="white">
                  {data > 99 ? "99+" : data}
                </SuiTypography>
              }
            />
          )}
        </SuiBox>
      </ListItem>
      {children && (
        <Collapse in={open} unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  color: "info",
  active: false,
  noCollapse: false,
  children: false,
  open: false,
  data: 0,
  close: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  data: PropTypes.number,
  children: PropTypes.node,
  active: PropTypes.bool,
  noCollapse: PropTypes.bool,
  open: PropTypes.bool,
  close: PropTypes.bool,
};

export default SidenavCollapse;
