/* eslint-disable */
import { generateGetApiUrl } from "~/utils/utils";
import { API, standardResponse } from "./middleware";

/**
 *
 * @param {number} phoneNumber
 * @param {string} password
 * @returns {standardResponse}
 */
export async function login(phoneNumber, password) {
  const url = "/auth/sign-in";
  const params = {
    username: phoneNumber,
    password: password,
  };
  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {number} phoneNumber
 * @param {number} otp
 * @returns {standardResponse}
 */
export async function verifyOTPLogin(phoneNumber, otp) {
  const url = "/auth/verify-otp";
  const params = {
    username: phoneNumber,
    otp: otp,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} password
 * @param {string} newPassword
 * @returns {standardResponse}
 */
export async function resetPassword(password, newPassword) {
  const url = "/auth/reset-password";
  const params = {
    oldPassword: password,
    newPassword: newPassword,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function refreshToken() {
  const url = "/auth/refresh";

  return API.post(url, {})
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function updateAccountInfo(data) {
  const url = "/users/profile";

  return API.put(url, data)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 *
 * @param {File} file
 * @param {string} username //phone number
 * @returns {standardResponse}
 */
export async function uploadFile({ file, categoryCode, attachedWithObjId, attachedWithObjType }) {
  const url = "/file-storage/upload";
  const param = {
    file,
    categoryCode,
    attachedWithObjId,
    attachedWithObjType,
  };
  return API.post(url, param, { headers: { "Content-Type": "multipart/form-data" } })
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

export async function uploadFilePublic(file, username) {
  const url = "/file-storage/upload-public";
  const param = {
    file: file,
    path: `user/${username}/${Math.random()}`,
  };
  return API.post(url, param, { headers: { "Content-Type": "multipart/form-data" } })
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

export async function uploadMultipleFile(
  files,
  categoryCode,
  attachedWithObjId,
  attachedWithObjType
) {
  const url = `file-storage/upload-multiple`;
  const newFormData = new FormData();
  newFormData.append("categoryCode", categoryCode);
  newFormData.append("attachedWithObjId", attachedWithObjId);
  newFormData.append("attachedWithObjType", attachedWithObjType);
  files.forEach((item) => {
    newFormData.append("files", item);
  });
  return API.post(url, newFormData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function downloadFileStorage(id) {
  const url = `file-storage/${id}/download`;
  return API.get(url, { responseType: "blob" })
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function deleteFileStorage(id) {
  const url = `file-storage/${id}`;
  return API.delete(url)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function getCriteriaOptions() {
  const url = "/statistics/indices";

  return API.get(url)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

/******************** Adminstration Function *********************************/
export async function getListProvince() {
  const url = "/area/provinces";

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
  return true;
}

export async function getListDistrict(provinceId) {
  const url = "/area/districts?parentCode=" + provinceId;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

export async function getListWard(districtId) {
  const url = "/area/communes?parentCode=" + districtId;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

export async function getChartByCriteria({ groups, fromDate, toDate, chartCategory, indexCode }) {
  const url = `/statistics/chart-view`;
  const params = { groups, fromDate, toDate, chartCategory, indexCode };
  const fullUrl = generateGetApiUrl(url, params);
  return API.get(fullUrl)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function getStatisticDataList({
  page,
  size,
  searchText,
  groupId,
  mearsurementUnitId,
}) {
  const params = {
    page,
    size,
    searchText,
    groupId,
    mearsurementUnitId,
  };
  const url = `stats-indices`;
  const fullUrl = generateGetApiUrl(url, params);
  return API.get(fullUrl)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function getStatisticDataReportDetail(id) {
  const url = `stats-indices/${id}/values`;

  return API.get(url)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function getUpdateRequestList({
  page,
  size,
  fromDate,
  toDate,
  status,
  searchText,
  type,
}) {
  const url = `/request`;
  const params = { page, size, fromDate, toDate, status, searchText, type };
  const fullUrl = generateGetApiUrl(url, params);
  return API.get(fullUrl)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function createUpdateRequest({
  type,
  name,
  statsIndexId,
  districtAreaCode,
  periodStartDate,
  periodEndDate,
  newValue,
  oldValue,
  dataFile,
  isDraft,
}) {
  const params = {
    type,
    name,
    statsIndexId,
    districtAreaCode,
    periodStartDate,
    periodEndDate,
    newValue,
    oldValue,
    dataFile,
    isDraft,
  };
  const url = `/request`;
  return API.post(url, params, { headers: { "Content-Type": "multipart/form-data" } })
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function updateRequest({
  requestId,
  type,
  name,
  statsIndexId,
  districtAreaCode,
  periodStartDate,
  periodEndDate,
  newValue,
  oldValue,
  isDraft,
  sendRequest,
  newDataFile,
}) {
  const url = `/request/${requestId}`;
  const params = {
    type,
    name,
    statsIndexId,
    districtAreaCode,
    periodStartDate,
    periodEndDate,
    newValue,
    oldValue,
    isDraft,
    sendRequest,
    newDataFile,
  };

  return API.put(url, params)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function approveRequest({ requestId, action, comments }) {
  const url = `/request/${requestId}/process`;
  const params = {
    action,
    comments,
  };
  return API.put(url, params)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function createUpdateRequestFromFile({
  name,
  createdAt,
  type,
  dataFile,
  attachmentFiles,
  isDraft,
}) {
  const url = `/request`;
  const newFormData = new FormData();
  newFormData.append("name", name);
  newFormData.append("createdAt", createdAt);
  newFormData.append("type", type);
  newFormData.append("dataFile", dataFile);
  newFormData.append("isDraft", isDraft);
  attachmentFiles.forEach((item) => {
    newFormData.append("attachmentFiles", item);
  });

  return API.post(url, newFormData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function getUpdateRequestDetail(requestId) {
  const url = `/request/${requestId}`;
  return API.get(url)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function deleteUpdateRequest(requestId) {
  const url = `/request/${requestId}`;
  return API.delete(url)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

/******************** End Adminstration Function *********************************/
/******************* Module Quản trị - Người dùng *************************/
/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function getListUser(page, size, searchText, unitId, roleId, createdByUserId, status) {
  let url = `/users?page=${page + 1}&size=${size}`;
  if (searchText) url += `&searchText=${searchText}`;
  if (status) url += `&status=${status}`;
  if (unitId) url += `&unitId=${unitId}`;
  if (roleId) url += `&roleId=${roleId}`;
  if (createdByUserId) url += `&createdByUserId=${createdByUserId}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 * @param {string} userID
 * @returns {standardResponse}
 */
export async function getUserDetail(userID) {
  const url = `/users/${userID}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function exportListUser(
  page,
  size,
  searchText,
  unitId,
  roleId,
  createdByUserId,
  status
) {
  let url = `/users/export-excel?page=${page + 1}&size=${size}`;
  if (searchText) url += `&searchText=${searchText}`;
  if (status) url += `&status=${status}`;
  if (unitId) url += `&unitId=${unitId}`;
  if (roleId) url += `&roleId=${roleId}`;
  if (createdByUserId) url += `&createdByUserId=${createdByUserId}`;

  return API.get(url, { responseType: "blob" })
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function createUser(
  fullname,
  phoneNumber,
  gender,
  dateOfBirth,
  email,
  unit,
  position,
  role,
  nation,
  provinceCode,
  districtCode,
  communeCode,
  address,
  avatarUrl
) {
  const url = "/users";
  const newFormData = new FormData();
  //required fields
  newFormData.append("fullname", fullname);
  newFormData.append("phoneNumber", phoneNumber);
  newFormData.append("unit", unit);
  newFormData.append("positionId", position);
  newFormData.append("roleIds", role);
  //optional fields
  if (gender) newFormData.append("gender", gender);
  if (dateOfBirth) newFormData.append("dateOfBirth", dateOfBirth);
  if (email) newFormData.append("email", email);
  if (nation) newFormData.append("nation", nation);
  if (provinceCode) newFormData.append("provinceCode", provinceCode);
  if (districtCode) newFormData.append("districtCode", districtCode);
  if (communeCode) newFormData.append("communeCode", communeCode);
  if (address) newFormData.append("address", address);
  if (avatarUrl) newFormData.append("avatarImg", avatarUrl);

  return API.post(url, newFormData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function updateUser(
  id,
  fullname,
  phoneNumber,
  gender,
  dateOfBirth,
  email,
  unit,
  position,
  role,
  nation,
  provinceCode,
  districtCode,
  communeCode,
  address,
  avatarUrl
) {
  const url = `/users/${id}/profile`;
  const newFormData = new FormData();
  newFormData.append("fullname", fullname);
  newFormData.append("phoneNumber", phoneNumber);
  newFormData.append("gender", gender);
  newFormData.append("dateOfBirth", dateOfBirth);
  newFormData.append("email", email);
  newFormData.append("unit", unit);
  newFormData.append("positionId", position);
  newFormData.append("roleIds", role);
  newFormData.append("nation", nation);
  if (provinceCode) newFormData.append("provinceCode", provinceCode);
  if (districtCode) newFormData.append("districtCode", districtCode);
  if (communeCode) newFormData.append("communeCode", communeCode);
  newFormData.append("address", address);
  newFormData.append("avatarImg", avatarUrl);

  return API.put(url, newFormData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function lockAndUnlockUser(id, status) {
  const url = `/users/${id}/profile`;
  const newFormData = new FormData();
  newFormData.append("status", status);

  return API.put(url, newFormData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 *
 * @param {string} id
 * @returns {standardResponse}
 */
export async function removeUser(id) {
  const url = `/users/${id}`;

  return API.delete(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function getListPosition(unitId) {
  let url = `/positions/list?unitId=${unitId}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function resetPasswordByAdmin(id, newPassword) {
  let url = `/auth/admin/reset-password?userId=${id}`;
  const param = {
    newPassword,
  };

  return API.post(url, param)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/******************* End Module Quản trị - Người dùng *************************/
/******************* Module Quản trị - Vai trò *************************/
/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function getAllListRoles() {
  let url = `/roles/list`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}
/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function getListRoles(page, size, searchText, status) {
  let url = `/roles?page=${page + 1}&size=${size}`;
  if (searchText) url += `&searchText=${searchText}`;
  if (status) url += `&status=${status}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 * @param {string} id
 * @returns {standardResponse}
 */
export async function getRoleDetail(id) {
  const url = `/roles/${id}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} code
 * @param {string} name
 * @param {string} description
 * @returns {standardResponse}
 */
export async function createRole(roleCode, roleName, description) {
  const url = "/roles";
  const params = {
    roleCode,
    roleName,
    description,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @returns {standardResponse}
 */
export async function removeRole(id) {
  const url = `/roles/${id}`;

  return API.delete(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @param {string} code
 * @param {string} name
 * @param {string} description
 * @param {string} status
 * @returns {standardResponse}
 */
export async function updateRole(id, roleCode, roleName, description, status) {
  const url = `/roles/${id}`;
  const params = {
    roleCode,
    roleName,
    status,
    description,
  };

  return API.put(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function getRolePermissionByUserId(userId, page, size, searchText, moduleId) {
  let url = `/users/${userId}/access-control-list`;
  // if (page !== undefined) url += `&page=${page + 1}`;
  // if (size) url += `&size=${size}`;
  // if (searchText) url += `&searchText=${searchText}`;
  // if (moduleId) url += `&moduleId=${moduleId}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function getRolePermissionByRoleId(roleId) {
  let url = `/permissions/${roleId}/tree`;
  // if (page !== undefined) url += `&page=${page + 1}`;
  // if (size) url += `&size=${size}`;
  // if (searchText) url += `&searchText=${searchText}`;
  // if (moduleId) url += `&moduleId=${moduleId}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 *
 * @param {object} data
 * @returns {standardResponse}
 */
export async function updateRolePermission(roleId, permission) {
  let url = `/permissions/${roleId}`;

  return API.put(url, permission)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response);
    });
}

/**
 *
 * @param {string} code
 * @param {string} urlLink
 * @param {string} apiId
 * @param {string} moduleName
 * @param {string} functionName
 * @param {string} description
 * @returns {standardResponse}
 */
export async function createPermission(
  code,
  urlLink,
  apiId,
  moduleName,
  functionName,
  description
) {
  const url = "/...";
  const params = {
    code,
    urlLink,
    apiId,
    moduleName,
    functionName,
    description,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @param {string} code
 * @param {string} urlLink
 * @param {string} apiId
 * @param {string} moduleName
 * @param {string} functionName
 * @param {string} description
 * @returns {standardResponse}
 */
export async function updatePermission(
  id,
  code,
  urlLink,
  apiId,
  moduleName,
  functionName,
  description
) {
  const url = `/.../${id}`;
  const params = {
    code,
    urlLink,
    apiId,
    moduleName,
    functionName,
    description,
  };

  return API.put(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/******************* End Module Quản trị - Vai trò *************************/
/******************* Module Quản trị - Đơn vị *************************/
/**
 *
 * @returns {standardResponse}
 */
export async function getUnitTree(status) {
  let url = "/units/tree";
  if (status) url += `?status=${status}`;
  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} code
 * @param {string} name
 * @param {string} description
 * @param {string} status
 * @param {string} parentCode
 * @returns {standardResponse}
 */
export async function createUnit(code, name, status, parentCode, phoneNumber, email, address) {
  const url = "/units";
  if (!phoneNumber) phoneNumber = undefined;
  if (!parentCode) parentCode = undefined;
  if (!email) email = undefined;
  if (!address) address = undefined;
  const params = {
    code,
    name,
    status,
    parentCode,
    phoneNumber,
    email,
    address,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @returns {standardResponse}
 */
export async function removeUnit(id) {
  const url = `/units/${id}`;

  return API.delete(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @param {string} code
 * @param {string} name
 * @param {string} description
 * @param {string} status
 * @param {string} parentCode
 * @returns {standardResponse}
 */
export async function updateUnit(id, code, name, status, parentCode, phoneNumber, email, address) {
  const url = `/units/${id}`;
  const params = {
    code,
    name,
    status,
    parentCode,
    phoneNumber,
    email,
    address,
  };

  return API.put(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {number} phoneNumber
 * @param {string} password
 * @param {string} rePassword
 * @returns {standardResponse}
 */

/******************* End Module Quản trị - Đơn vị *************************/

/******************* Module Quản trị - Danh mục *************************/
/**
 *
 * @returns {standardResponse}
 */
export async function getListCategory() {
  const url = "/sys-categories/list";

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function getListApi(groupId) {
  const url = `/sys-apis/by-filters?groupId=${groupId}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function addPermissionComponent(
  roleId,
  parentId,
  code,
  name,
  groupId,
  apiIds,
  description,
  canView,
  canEdit
) {
  const url = `/sys-components`;
  const params = {
    roleId,
    parentId,
    code,
    name,
    apiIds,
    groupId,
    description,
    canView,
    canEdit,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function editPermissionComponent(
  roleId,
  id,
  code,
  name,
  groupId,
  apiIds,
  description,
  canView,
  canEdit
) {
  const url = `/sys-components/${id}`;
  const params = {
    roleId,
    code,
    name,
    apiIds,
    groupId,
    description,
    canView,
    canEdit,
  };

  return API.put(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/** Nhóm Chỉ tiêu */
/**
 *
 * @returns {standardResponse}
 */
export async function getAllSubListGroupCategory() {
  let url = `/stats-index-groups/list`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function getSubListGroupCategory(page, size, searchText, status) {
  let url = `/stats-index-groups?page=${page + 1}&size=${size}`;
  if (searchText) url += `&searchText=${searchText}`;
  if (status) url += `&status=${status}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @param {string} code
 * @param {string} name
 * @param {string} status
 * @returns {standardResponse}
 */
export async function updateSubGroupCategory(id, code, name, status) {
  const url = `/stats-index-groups/${id}`;
  const params = {
    code,
    name,
    status,
  };

  return API.put(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} code
 * @param {string} name
 * @param {string} status
 * @returns {standardResponse}
 */
export async function addSubGroupCategory(code, name, status) {
  const url = `/stats-index-groups`;
  const params = {
    code,
    name,
    status,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @returns {standardResponse}
 */
export async function removeSubGroupCategory(id) {
  const url = `/stats-index-groups/${id}`;

  return API.delete(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}
/** End Nhóm Chỉ tiêu */

/** Chỉ tiêu */
/**
 *
 * @returns {standardResponse}
 */
export async function getSubListCategory(page, size, searchText, status, measurementUnitId, group) {
  let url = `/stats-indices?page=${page + 1}&size=${size}`;
  if (searchText) url += `&searchText=${searchText}`;
  if (status) url += `&status=${status}`;
  if (measurementUnitId) url += `&measurementUnitId=${measurementUnitId}`;
  if (group) url += `&groupId=${group}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @param {string} code
 * @param {string} name
 * @param {string} status
 * @param {string} unit
 * @param {string} group
 * @returns {standardResponse}
 */
export async function updateSubCategory(id, code, name, status, measurementUnitId, groupId) {
  const url = `/stats-indices/${id}`;
  const params = {
    code,
    name,
    status,
    measurementUnitId,
    groupId,
  };

  return API.put(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} code
 * @param {string} name
 * @param {string} status
 * @param {string} unitId
 * @param {string} groupId
 * @returns {standardResponse}
 */
export async function addSubCategory(code, name, status, measurementUnitId, groupId) {
  const url = `/stats-indices`;
  const params = {
    code,
    name,
    status,
    measurementUnitId,
    groupId,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @returns {standardResponse}
 */
export async function removeSubCategory(id) {
  const url = `/stats-indices/${id}`;

  return API.delete(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}
/** End Chỉ tiêu */

/** Đơn vị đo */
/**
 *
 * @returns {standardResponse}
 */
export async function getAllSubListMeasurement() {
  let url = `/measurement-units/list`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function getSubListMeasurement({ page, size, searchText, status }) {
  let url = `/measurement-units`;
  const params = { page, size, searchText, status };
  const fullUrl = generateGetApiUrl(url, params);

  return API.get(fullUrl)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @param {string} code
 * @param {string} name
 * @param {string} status
 * @param {string} minValue
 * @param {string} maxValue
 * @param {string} valueType
 * @returns {standardResponse}
 */
export async function updateSubMeasurement(id, code, name, status, minValue, maxValue, valueType) {
  const url = `/measurement-units/${id}`;
  const params = {
    code,
    name,
    status,
    minValue,
    maxValue,
    valueType,
  };

  return API.put(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} code
 * @param {string} name
 * @param {string} status
 * @param {string} limitLower
 * @param {string} limitUpper
 * @param {string} type
 * @returns {standardResponse}
 */
export async function addSubMeasurement(code, name, status, minValue, maxValue, valueType) {
  const url = `/measurement-units`;
  const params = {
    code,
    name,
    status,
    minValue,
    maxValue,
    valueType,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @returns {standardResponse}
 */
export async function removeSubMeasurement(id) {
  const url = `/measurement-units/${id}`;

  return API.delete(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}
/** End Đơn vị đo */

/** Chức vụ */
/**
 *
 * @returns {standardResponse}
 */
export async function getSubListPosition({ page, size, searchText, status, unitId }) {
  let url = `/positions`;
  const params = { page, size, searchText, status, unitId };
  const fullUrl = generateGetApiUrl(url, params);
  return API.get(fullUrl)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @param {string} code
 * @param {string} name
 * @param {string} status
 * @param {string} unit
 * @returns {standardResponse}
 */
export async function updateSubPostion(id, positionCode, positionName, status, unitId) {
  const url = `/positions/${id}`;
  const params = {
    positionCode,
    positionName,
    status,
    unitId,
  };

  return API.put(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} code
 * @param {string} name
 * @param {string} status
 * @param {string} department
 * @returns {standardResponse}
 */
export async function addSubPosition(positionCode, positionName, status, unitId) {
  const url = `/positions`;
  const params = {
    positionCode,
    positionName,
    status,
    unitId,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} id
 * @returns {standardResponse}
 */
export async function removeSubPosition(id) {
  const url = `/positions/${id}`;

  return API.delete(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}
/** End Chức vụ */

/** Ngành */
/**
 *
 * @returns {standardResponse}
 */
export async function getDeparmentList(
  page,
  size,
  searchText,
  statsIndexGroupId,
  statsIndexId,
  status
) {
  console.log("statsIndexGroupId: ", statsIndexGroupId, statsIndexGroupId.length);
  let url = `/sectors?page=${page + 1}&size=${size}`;
  if (searchText) url += `&searchText=${searchText}`;
  if (statsIndexGroupId && statsIndexGroupId.length > 0)
    url += `&statsIndexGroupIds=${statsIndexGroupId}`;
  if (statsIndexId && statsIndexId.length > 0) url += `&statsIndexIds=${statsIndexId}`;
  if (status) url += `&status=${status}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} code
 * @param {string} name
 * @param {string} status
 * @param {string} department
 * @returns {standardResponse}
 */
export async function addDepartment(code, name, statsIndexGroupIds, statsIndexIds, status) {
  const url = `/sectors`;
  const params = {
    code,
    name,
    statsIndexGroupIds,
    statsIndexIds,
    status,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function updateDepartment(id, status, code, name, statsIndexGroupIds, statsIndexIds) {
  let url = `/sectors/${id}`;
  const params = {
    code: code,
    status: status,
    name: name,
    statsIndexGroupIds: statsIndexGroupIds,
    statsIndexIds: statsIndexIds,
  };
  return API.put(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function removeDepartment(id) {
  let url = `/sectors/${id}`;

  return API.delete(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}
/** End ngành */

/** Nguồn dữ liệu */
/**
 *
 * @returns {standardResponse}
 */
export async function getDataSourceList(
  page,
  size,
  searchText,
  statsIndexGroupId,
  statsIndexId,
  sectorId,
  measurementUnitId,
  status
) {
  let url = `/stats-formula-parameters?page=${page + 1}&size=${size}`;
  if (searchText) url += `&searchText=${searchText}`;
  if (statsIndexGroupId) url += `&statsIndexGroupId=${statsIndexGroupId}`;
  if (statsIndexId) url += `&statsIndexId=${statsIndexId}`;
  if (sectorId) url += `&sectorId=${sectorId}`;
  if (measurementUnitId) url += `&measurementUnitId=${measurementUnitId}`;
  if (status) url += `&status=${status}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function updateDataSource(
  id,
  status,
  measurementUnitId,
  sectorId,
  name,
  relatedIndexIds
) {
  let url = `/stats-formula-parameters/${id}`;
  const params = {
    status: status,
    measurementUnitId: measurementUnitId,
    sectorId: sectorId,
    name: name,
    relatedIndexIds: relatedIndexIds,
  };
  return API.put(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @returns {standardResponse}
 */
export async function removeDataSource(id) {
  let url = `/stats-formula-parameters/${id}`;

  return API.delete(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}
/** End nguồn dữ liệu */

/** Công thức */
/** End công thức */
/******************* End Module Quản trị - Danh mục *************************/

export async function changePasswordFirstTime(phoneNumber, oldPassword, password, rePassword) {
  const url = "/services/iamservice/api/changePasswordFirstTime";
  const params = {
    tel: phoneNumber,
    oldPassword: oldPassword,
    password: password,
    confirmPassword: rePassword,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {string} userId
 * @param {object} userInfo
 * @returns {standardResponse}
 */
export async function updateAccount(userId, userInfo) {
  const url = "/services/iamservice/api/update-current-account/" + userId;

  return API.patch(url, userInfo)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {number} phoneNumber
 * @param {number} oldPassword
 * @param {string} password
 * @param {string} rePassword
 * @returns {standardResponse}
 */
export async function updatePassword(phoneNumber, oldPassword, newPassword, reNewPassword) {
  const url = "/services/iamservice/api/change-password/";
  const params = {
    tel: phoneNumber,
    oldPassword: oldPassword,
    password: newPassword,
    confirmPassword: reNewPassword,
  };

  return API.post(url, params)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/******************* Module Báo cáo *************************/
/**
 * @param {number} searchText
 * @param {number} startDate
 * @param {number} endDate
 * @param {number} criteria
 * @param {number} sort
 * @param {number} page
 * @param {number} size
 * @returns {standardResponse}
 */
export async function getStatisticReportList({
  searchText,
  fromDate,
  toDate,
  statsIndexId,
  groupId,
  page,
  size,
  isList = false,
  status,
  sort,
}) {
  // sort,
  //   status = "APPROVED"
  const url = `/report`;
  const params = {
    page,
    size,
    searchText,
    fromDate,
    toDate,
    statsIndexId,
    groupId,
    isList,
    status,
    sort,
  };

  const fullUrl = generateGetApiUrl(url, params);
  return API.get(fullUrl)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

/**
 * @param {number} id
 * @returns {standardResponse}
 */
export async function getStatisticReportDetail(id) {
  const url = `report/${id}`;
  return API.get(url)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

/**
 *
 * @param {number} id
 * @returns {standardResponse}
 */
export async function getReportDetail(id) {
  const url = `/report/${id}`;

  return API.get(url)
    .then((response) => {
      return standardResponse(true, response);
    })
    .catch((error) => {
      return standardResponse(false, error.response?.data);
    });
}

/**
 *
 * @param {number} id
 * @returns {standardResponse}
 */
export async function createReport({ name, htmlPage, attachmentFiles, isDraft, statsIndexId }) {
  const url = `/report`;
  const newFormData = new FormData();
  newFormData.append("name", name);
  newFormData.append("htmlPage", htmlPage);
  newFormData.append("isDraft", isDraft);
  attachmentFiles.forEach((item) => {
    newFormData.append("attachmentFiles", item);
  });
  newFormData.append("statsIndexId", statsIndexId);

  return API.post(url, newFormData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

/**
 *
 * @param {number} id
 * @returns {standardResponse}
 */
export async function updateReport({
  id,
  name,
  htmlPage,
  isDraft,
  statsIndexId,
  sendRequest,
  attachmentFiles,
  newAttachmentFiles,
}) {
  const url = `/report/${id}`;
  const newFormData = new FormData();
  newFormData.append("name", name);
  newFormData.append("htmlPage", htmlPage);
  newFormData.append("isDraft", isDraft);
  newFormData.append("statsIndexId", statsIndexId);
  newFormData.append("sendRequest", sendRequest);
  newFormData.append("attachmentFiles", JSON.stringify(attachmentFiles));
  newAttachmentFiles?.forEach((item) => {
    newFormData.append("newAttachmentFiles", item);
  });

  return API.put(url, newFormData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function deleteReport(reportId) {
  const url = `/report/${reportId}`;
  return API.delete(url)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function getApproveReportList() {
  const url = `report-request/list`;
  return API.get(url)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function approveReportRequest({ comments = "", reportId }) {
  const url = `report-request/${reportId}/approve`;
  const body = { comments };
  return API.put(url, body)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function rejectReportRequest({ comments = "", reportId }) {
  const url = `report-request/${reportId}/reject`;
  const body = { comments };
  return API.put(url, body)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

export async function cancelReportRequest(reportId) {
  const url = `report-request/${reportId}/cancel`;
  return API.put(url)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}

/******************* End Module Báo cáo *************************/

/******************** Dashboard *********************************/

export async function getDashboardIncreaseList({ indexCode }) {
  const url = `dashboard/increase-value-list?indexCode=${indexCode}`;
  return API.get(url)
    .then((response) => standardResponse(true, response))
    .catch((error) => standardResponse(false, error.response?.data));
}
