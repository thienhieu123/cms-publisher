import { THEME } from "./type";

export function reducer(state, action) {
  switch (action.type) {
    case THEME.MINI_SIDENAV: {
      return { ...state, miniSidenav: action.value };
    }
    case THEME.TRANSPARENT_SIDENAV: {
      return { ...state, transparentSidenav: action.value };
    }
    case THEME.SIDENAV_COLOR: {
      return { ...state, sidenavColor: action.value };
    }
    case THEME.TRANSPARENT_NAVBAR: {
      return { ...state, transparentNavbar: action.value };
    }
    case THEME.FIXED_NAVBAR: {
      return { ...state, fixedNavbar: action.value };
    }
    case THEME.OPEN_CONFIGURATOR: {
      return { ...state, openConfigurator: action.value };
    }
    case THEME.DIRECTION: {
      return { ...state, direction: action.value };
    }
    case THEME.LAYOUT: {
      return { ...state, layout: action.value };
    }
    default: {
      return state;
    }
  }
}
