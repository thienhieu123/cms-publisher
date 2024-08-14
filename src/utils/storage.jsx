/**
 * @return get access token in local storage
 */
export function getAccessToken() {
  const token = window.localStorage.getItem("accessToken");
  return token;
}

/**
 * @return stored access token in local storage
 */
export function setAccessToken(value) {
  window.localStorage.setItem("accessToken", value);
  window.dispatchEvent(new Event("storage"));
}

/**
 * @return get refresh token in local storage
 */
export function getRefreshToken() {
  const token = window.localStorage.getItem("refreshToken");
  return token;
}

/**
 * @return stored refresh token in local storage
 */
export function setRefreshToken(value) {
  window.localStorage.setItem("refreshToken", value);
  window.dispatchEvent(new Event("storage"));
}

/**
 * @return get user data in local storage
 */
export function getLocalUserInfo() {
  const info = window.localStorage.getItem("userInfo");
  return JSON.parse(info);
}

/**
 * @return stored user data in local storage
 */
export function setLocalUserInfo(value) {
  window.localStorage.setItem("userInfo", JSON.stringify(value));
  window.dispatchEvent(new Event("storage"));
}

/**
 * @return get role permission list in local storage
 */
export function getLocalRolePermission() {
  const info = window.localStorage.getItem("rolePermission");
  return JSON.parse(info);
}

/**
 * @return stored role permission list in local storage
 */
export function setLocalRolePermission(value) {
  window.localStorage.setItem("rolePermission", JSON.stringify(value));
  window.dispatchEvent(new Event("rolePermission"));
}

/**
 * @return get route list in local storage
 */
export function getLocalPrivateRoute() {
  const info = window.localStorage.getItem("privateRoute");
  return info;
}

/**
 * @return stored route list in local storage
 */
export function setLocalPrivateRoute(value) {
  window.localStorage.setItem("privateRoute", value);
  window.dispatchEvent(new Event("privateRoute"));
}

/**
 * @return stored token in local storage
 */
export function clearLocalStorage(triggerEvent) {
  window.localStorage.clear();
  if (triggerEvent) window.dispatchEvent(new Event("storage"));
}

export function setLocalEmpPermission(list) {
  window.localStorage.setItem("empPermissionList", JSON.stringify(list));
  window.dispatchEvent(new Event("storage"));
}

export function getLocalEmpPermission() {
  const empPermissionList = window.localStorage.getItem("empPermissionList");
  return JSON.parse(empPermissionList);
}
