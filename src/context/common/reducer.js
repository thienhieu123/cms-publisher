import { COMMON } from "./type";

export function reducer(state, action) {
  switch (action.type) {
    case COMMON.ALERT_MESSAGE: {
      return { ...state, alertMessage: action.value };
    }
    case COMMON.LOADING: {
      return { ...state, loading: action.value };
    }
    case COMMON.REPORT_DETAIL_CURRENT_TAB: {
      return { ...state, reportDetailCurrentTab: action.value };
    }
    case COMMON.STATISTIC_CURRENT_TAB: {
      return { ...state, statisticCurrentTab: action.value };
    }
    case COMMON.STATISTIC_REPORT_CURRENT_TAB: {
      return { ...state, statisticReportCurrentTab: action.value };
    }
    case COMMON.USER_MANAGEMENT_CURRENT_TAB: {
      return { ...state, userManagementCurrentTab: action.value };
    }
    case COMMON.USER_PERMISSION_CURRENT_TAB: {
      return { ...state, userPermissionCurrentTab: action.value };
    }
    case COMMON.JOB_PROPOSAL_CURRENT_TAB: {
      return { ...state, jobProposalCurrentTab: action.value };
    }
    case COMMON.DATA_SRC_CURRENT_TAB: {
      return { ...state, dataSrcCurrentTab: action.value };
    }
    case COMMON.IS_STICKY_BTN: {
      return { ...state, isStickyBtn: action.value };
    }
    default: {
      return state;
    }
  }
}
