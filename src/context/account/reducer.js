import { ACCOUNT } from "./type";

export function reducer(state, action) {
  switch (action.type) {
    case ACCOUNT.ACCOUNT_INFO: {
      return { ...state, accountInfo: action.value };
    }
    case ACCOUNT.ACCOUNT_TOKEN: {
      return { ...state, token: action.value };
    }
    default: {
      return state;
    }
  }
}
