import { THEME } from "./type";

export const setMiniSidenav = (dispatch, value) => dispatch({ type: THEME.MINI_SIDENAV, value });
export const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: THEME.TRANSPARENT_NAVBAR, value });
export const setSidenavColor = (dispatch, value) => dispatch({ type: THEME.SIDENAV_COLOR, value });
export const setTransparentSidenav = (dispatch, value) =>
  dispatch({ type: THEME.TRANSPARENT_SIDENAV, value });
export const setFixedNavbar = (dispatch, value) => dispatch({ type: THEME.FIXED_NAVBAR, value });
export const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: THEME.OPEN_CONFIGURATOR, value });
export const setDirection = (dispatch, value) => dispatch({ type: THEME.DIRECTION, value });
export const setLayout = (dispatch, value) => dispatch({ type: THEME.LAYOUT, value });
