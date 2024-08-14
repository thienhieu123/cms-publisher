import { COMMON } from "./type";

export const setAlertMessage = (dispatch, value) => dispatch({ type: COMMON.ALERT_MESSAGE, value });
export const setLoading = (dispatch, value) => dispatch({ type: COMMON.LOADING, value });

export const setUserManagementCurrentTab = (dispatch, value) =>
  dispatch({ type: COMMON.USER_MANAGEMENT_CURRENT_TAB, value });
export const setUserPermissionCurrentTab = (dispatch, value) =>
  dispatch({ type: COMMON.USER_PERMISSION_CURRENT_TAB, value });
export const setStatisticReportCurrentTab = (dispatch, value) =>
  dispatch({ type: COMMON.STATISTIC_REPORT_CURRENT_TAB, value });
export const setReportDetailCurrentTab = (dispatch, value) =>
  dispatch({ type: COMMON.REPORT_DETAIL_CURRENT_TAB, value });
export const setStatisticCurrentTab = (dispatch, value) =>
  dispatch({ type: COMMON.STATISTIC_CURRENT_TAB, value });
export const setJobProposalCurrentTab = (dispatch, value) =>
  dispatch({ type: COMMON.JOB_PROPOSAL_CURRENT_TAB, value });
export const setDataSrcCurrentTab = (dispatch, value) =>
  dispatch({ type: COMMON.DATA_SRC_CURRENT_TAB, value });
export const setIsStickyBtn = (dispatch, value) => dispatch({ type: COMMON.IS_STICKY_BTN, value });

export const clearCommon = (dispatch) => {
  setAlertMessage(dispatch, { type: "error", message: "", openAlert: false });
  setLoading(dispatch, false);
  setReportDetailCurrentTab(dispatch, 0);
  setUserManagementCurrentTab(dispatch, 0);
  setUserPermissionCurrentTab(dispatch, 0);
  setStatisticReportCurrentTab(dispatch, 0);
  setJobProposalCurrentTab(dispatch, 0);
  setDataSrcCurrentTab(dispatch, 0);
};
