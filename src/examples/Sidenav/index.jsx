/* eslint-disable no-restricted-globals */
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
import { useEffect, useRef, useState } from "react";
// react-router-dom components
import { useLocation, NavLink, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

import clsx from "clsx";
// @mui material components
import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
// import SuiTypography from "~/components/SuiTypography";
// import SuiButton from "~/components/SuiButton";
import { getAccessToken, getLocalUserInfo } from "~/utils/storage";
// Soft UI Dashboard React examples
import SidenavCollapse from "~/examples/Sidenav/SidenavCollapse";
// Custom styles for the Sidenav
import SidenavRoot from "~/examples/Sidenav/SidenavRoot";

// Soft UI Dashboard React context
import { useSoftUIController } from "~/context";
import { setMiniSidenav } from "~/context/theme/action";
// import { setLoading } from "~/context/common/action";
import KTSLogo from "~/assets/images/logos/KTSLogo.svg";
// import daikinLogo from "~/assets/images/daikin-logo.png";
// import daikinLogoMini from "~/assets/images/logos/daikin.png";
// import { Typography } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { setLoading } from "~/context/common/action";
import style from "./style.module.css";
import "./style.css";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const navigate = useNavigate();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentSidenav } = controller.theme;

  const location = useLocation();
  const { pathname } = location;
  const pathNameArr = pathname.split("/");
  const collapseName = pathNameArr[1];
  const listCol = routes.filter((data) => data.type === "title");
  const [close, setClose] = useState(false);
  const [smallScreen, setSmallScreen] = useState(true);
  const [hideState, setHideState] = useState(
    Object.fromEntries(listCol.map((data) => [data.key, false]))
  );
  // const closeSidenav = () => setMiniSidenav(dispatch, true);
  const navRef = useRef();
  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      if (window.innerWidth < 1200) {
        setSmallScreen(true);
        setClose(false);
      } else setSmallScreen(false);
    }

    function handleBrowserBack() {
      const localToken = getAccessToken();
      if (!localToken) navigate("/authentication/sign-in");
    }
    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    window.addEventListener("popstate", handleBrowserBack);
    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    function handleStorage() {
      // setLoading(dispatch, false);
      const localToken = getAccessToken();
      if (!localToken) {
        navigate("/authentication/sign-in");
        setLoading(dispatch, false);
      }
    }

    window.addEventListener("storage", handleStorage);
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("resize", handleMiniSidenav);
      window.removeEventListener("popstate", handleBrowserBack);
      window.removeEventListener("storage", handleStorage);
    };
  }, [dispatch, location, smallScreen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target) && close) {
        setHideState(Object.fromEntries(listCol.map((data) => [data.key, false])));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navRef, close]);

  // const checkIsAllowed = (roles) => {
  //   const userRoles = getLocalUserInfo()?.roles;
  //   if (!roles || !userRoles) return true;
  //   let isAllowed = false;
  //   userRoles.map((role) => {
  //     const res = roles.some((item) => item === role.roleCode);
  //     if (res) isAllowed = true;
  //   });

  //   return isAllowed;
  // };

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    // eslint-disable-next-line no-unused-vars
    ({ type, icon, data, title, noCollapse, key, route, href, box, roles, collapse, name }) => {
      // let returnValue;
      if (type === "single" || type === "parent") {
        return (
          <div
            key={key}
            className={clsx(style.sideBarElement)}
            style={{
              overflow: "hidden",
              maxHeight: hideState[box] || box === "none" ? "100px" : "0px",
              transition: "max-height 0.2s ease-out",
              marginBottom: "30px",
              width: "70% !important",
            }}
            onClick={() => {
              setHideState({
                [key]: !hideState[key],
              });
            }}
          >
            <NavLink to={route}>
              <SidenavCollapse
                color={color}
                name={name}
                icon={icon}
                data={data}
                active={key === collapseName}
                noCollapse={noCollapse}
                close={close}
              />
            </NavLink>
          </div>
        );
      }
      // return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, miniSidenav }}
      className={`${close ? "close" : ""} ${miniSidenav ? "navContainerClose" : ""}`}
      ref={navRef}
    >
      <Icon
        onClick={() => {
          if (smallScreen) {
            setMiniSidenav(dispatch, true);
            setClose(false);
          } else {
            setClose(!close);
            // setHideState(!hideState);
          }
        }}
        className="icon-open"
        style={{ backgroundColor: "#F8ADAD !important" }}
      >
        {/* keyboard_arrow_left */}
        <KeyboardArrowLeftIcon />
      </Icon>
      <SuiBox pb={8} pt={2} textAlign="center" className={close ? "logo-close" : ""}>
        {/* <SuiBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <SuiTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </SuiTypography>
        </SuiBox> */}
        <SuiBox
          component={NavLink}
          to={"/home"}
          // display="flex"
          // alignItems="center"
          margin="auto"
        >
          {brand && <SuiBox component="img" src={KTSLogo} alt="KTS Logo" width="70%" />}
        </SuiBox>
      </SuiBox>
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

export default Sidenav;
