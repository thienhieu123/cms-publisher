/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */

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

import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
// import { Routes, Route, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Soft UI Dashboard React examples
import Sidenav from "~/examples/Sidenav";

// Soft UI Dashboard React themes
import theme from "~/assets/theme";
// import themeRTL from "~/assets/theme/theme-rtl";

// // RTL plugins
// import rtlPlugin from "stylis-plugin-rtl";
// import { CacheProvider } from "@emotion/react";
// import createCache from "@emotion/cache";

// Soft UI Dashboard React routes
import { publicRoutes, privateRoutes } from "./routes";
import { Alert, Snackbar } from "@mui/material";
import { setAlertMessage } from "~/context/common/action";
// Soft UI Dashboard React contexts
import { useSoftUIController } from "~/context";

// Images
import brand from "~/assets/images/logo-ct.png";
import "./App.css";
import "./styles/app.scss";
import { setMiniSidenav } from "~/context/theme/action";
import Loading from "~/components/Loading";
import {
  getLocalPrivateRoute,
  getLocalRolePermission,
  getLocalUserInfo,
  setLocalPrivateRoute,
} from "./utils/storage";
import useErrorMessage from "./hooks/useErrorMessage";
import { PERMISSION_TYPE } from "./constants/config";

// import { getUrlImage } from "~/api/common";
// import io from "socket.io-client";

// const socket = io(`${process.env.REACT_APP_API_URL}/websocket/unreadCount`, {
//   debug: true,
// });

theme.components.MuiCard.styleOverrides.root.overflow = "unset";

function Config() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, sidenavColor } = controller.theme;
  const { alertMessage, loading } = controller.common;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const [filterRoutes] = useState(privateRoutes);
  const navigate = useNavigate();
  const [isPermissionReady, setIsPermissionReady] = useState(true);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };
  const { setErrorMessage } = useErrorMessage();

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // const checkRoleAuthorize = (pathname) => {
  //   const route = routes.find((item) => item.route === pathname);
  //   const userRoles = getLocalUserInfo()?.roles;
  //   if (!userRoles || !route?.roles) return;
  //   if (route) {
  //     let isAllowed = false;
  //     userRoles.map((userRole) => {
  //       const res = route.roles.some((item) => item === userRole.roleCode);
  //       if (res) isAllowed = true;
  //     });

  //     if (!isAllowed) {
  //       setErrorMessage("Không có quyền truy cập");
  //       // navigate("/authentication/sign-in");
  //     }
  //   }
  // };

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    // checkRoleAuthorize(pathname);
  }, [pathname]);

  return (
    <>
      <Loading loading={loading} />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={5000}
        open={alertMessage.openAlert}
        onClose={(e, reason) => {
          // if (reason === "clickaway") return;
          setAlertMessage(dispatch, { ...alertMessage, openAlert: false });
        }}
      >
        <Alert severity={alertMessage.type} sx={{ width: "100%" }}>
          {alertMessage.message}
        </Alert>
      </Snackbar>
      <CssBaseline />
      {isPermissionReady && pathname !== "/authentication/sign-in" && (
        <Sidenav
          color={sidenavColor}
          brand={brand}
          brandName="Kinh tế số"
          routes={filterRoutes.filter((item) => {
            //check những module nào có canView = true và item.noneSidebar !== true
            const localPrivateRoute = getLocalRolePermission();
            const filterRoutes = localPrivateRoute?.find(
              (route) => route.code === item.code && route.canView
            );
            if (filterRoutes && item.noneSidebar !== true) return item;
            // return item.noneSidebar !== true;
          })}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      )}
    </>
  );
}

export default function App() {
  // const [filterRoutes, setFilterRoutes] = useState([...publicRoutes]);
  const [permissionRoute, setPermissionRoute] = useState();
  const { pathname } = useLocation();

  const filterRouteComponent = (routes, permissionRoutes) => {
    let resultList = [];
    // console.log("current: ", routes, permissionRoutes);
    permissionRoutes.map((permissionRoute) => {
      routes?.map((privateRoute) => {
        if (
          permissionRoute.type.code === PERMISSION_TYPE.MODULE ||
          permissionRoute.type.code === PERMISSION_TYPE.COMPONENT
        ) {
          if (privateRoute.code === permissionRoute.code && permissionRoute.canView) {
            //module or component
            const tag = (
              <Route
                exact
                path={privateRoute.route}
                element={privateRoute.component}
                key={privateRoute.key}
              />
            );
            resultList.push(tag);

            //has children (module, component can have children)
            if (permissionRoute.children?.length > 0) {
              const resultChild = filterRouteComponent(
                privateRoute.children,
                permissionRoute.children
              );

              resultList.push(...resultChild);
            }
          }
        }
        //tab
        else if (permissionRoute.type.code === PERMISSION_TYPE.TAB) {
          //tab do not have route
          if (permissionRoute.children?.length > 0) {
            //children of tab
            const resultChild = filterRouteComponent(routes, permissionRoute.children);

            resultList.push(...resultChild);
          }
        }
      });
    });

    return resultList;
  };

  const listenStoredRoles = () => {
    const localPrivateRoute = getLocalRolePermission();
    const formatRoutes = filterRouteComponent(privateRoutes, localPrivateRoute);
    setPermissionRoute(formatRoutes);
    setTimeout(() => {
      setLocalPrivateRoute(true);
    }, 100);
    console.log("route", formatRoutes);
  };

  useEffect(() => {
    console.log("v5.6.24 11:30 dev");

    const localPrivateRoute = getLocalPrivateRoute();
    if (localPrivateRoute) {
      //đã login và có route lưu trong local storage
      listenStoredRoles();
    }
  }, []);

  useEffect(() => {
    if (pathname === "/authentication/sign-in") {
      setPermissionRoute();
      window.addEventListener("rolePermission", listenStoredRoles);
      return () => {
        window.removeEventListener("rolePermission", listenStoredRoles);
      };
    }
  }, [pathname]);

  return (
    <div className="wrapper">
      <ThemeProvider theme={theme}>
        <Config />
        <Routes>
          {publicRoutes.map((route) => {
            return <Route exact path={route.route} element={route.component} key={route.key} />;
          })}
          {permissionRoute}
          <Route path="" element={<Navigate to="/authentication/sign-in" />} />
          {/* <Route path="*" element={<Navigate to="/authentication/sign-in" />} /> */}
        </Routes>
      </ThemeProvider>
    </div>
  );
}
