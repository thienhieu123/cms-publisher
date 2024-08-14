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

/**
  This file is used for controlling the global states of the components,
  you can customize the states for the different components here.
*/

import { createContext, useContext, useReducer, useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import combineReducers from "react-combine-reducers";

import { reducer as themeReducer } from "./theme/reducer";
import { initState as themeState } from "./theme/state";

import { reducer as accountReducer } from "./account/reducer";
import { initState as accountState } from "./account/state";

import { reducer as commonReducer } from "./common/reducer";
import { initState as commonState } from "./common/state";

// The Soft UI Dashboard PRO Material main context
const SoftUI = createContext(null);

// Setting custom name for the context which is visible on react dev tools
SoftUI.displayName = "SoftUIContext";

// Soft UI Dashboard React context provider
function SoftUIControllerProvider({ children }) {
  const [reducerCombined, initialStateCombined] = combineReducers({
    common: [commonReducer, commonState],
    account: [accountReducer, accountState],
    theme: [themeReducer, themeState],
  });

  const [controller, dispatch] = useReducer(reducerCombined, initialStateCombined);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <SoftUI.Provider value={value}>{children}</SoftUI.Provider>;
}

// Soft UI Dashboard React custom hook for using context
function useSoftUIController() {
  const context = useContext(SoftUI);

  if (!context) {
    throw new Error("useSoftUIController should be used inside the SoftUIControllerProvider.");
  }

  return context;
}

// Typechecking props for the SoftUIControllerProvider
SoftUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SoftUIControllerProvider, useSoftUIController };
