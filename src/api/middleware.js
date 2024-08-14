/* eslint-disable */
import axios from "axios";
import { getAccessToken, clearLocalStorage, getRefreshToken } from "~/utils/storage";
import { refreshToken } from "./common";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/" + import.meta.env.VITE_API_VERSION,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    return true;
  },
});

API.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      if (response.data.title === "Unauthorized") {
        refreshToken();
        // clearLocalStorage(true);
      }
    }
    return response;
  },
  (error) => {
    console.warn("Error status: ", error.response.status);
  }
);

API.interceptors.request.use((request) => {
  let token = null;
  if (request.url === "/auth/refresh") token = getRefreshToken();
  else token = getAccessToken();

  if (token) request.headers.Authorization = "Bearer " + token;
  return request;
});

/**
 *
 * @param {boolean} success
 * @param {object} message
 * @property {boolean} success
 * @property {object} message
 */
export function standardResponse(success, message) {
  return {
    success,
    message,
  };
}

export const API_PROVINCE = axios.create({
  baseURL: import.meta.env.VITE_API_PROVINCE,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    return true;
  },
});
