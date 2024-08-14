import { ACCOUNT } from "./type";

export const setAccountInfo = (dispatch, value) => dispatch({ type: ACCOUNT.ACCOUNT_INFO, value });
export const setAccountToken = (dispatch, value) =>
  dispatch({ type: ACCOUNT.ACCOUNT_TOKEN, value });

export const clearAccount = (dispatch) => {
  setAccountInfo(dispatch, {});
  setAccountToken(dispatch, "");
};
