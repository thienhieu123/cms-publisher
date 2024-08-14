// verify Number
export const isNumber = (value, label, alert) => {
  if (!Number(value)) {
    alert(label);
    return false;
  }
  return true;
};
// verify phoneNumber
export const isPhoneNumber = (value, label) => {
  if (value.charAt(0) !== "0") {
    throw `${label} phải có 10 chữ số và bắt đầu bằng số 0`;
  }
  return true;
};

// verify Image
export const isImage = (value, label, alert) => {
  if (!value || value === undefined || value.length === 0) {
    return true;
  }
  const string = value.slice(0, value.indexOf(";"));
  if (string === "data:image/jpeg" || string === "data:image/png" || string === "data:image/jpg") {
    return true;
  }
  //   const string2 = value.split(".");
  //   const string2 = value?.substring(value.lastIndexOf(".") + 1);
  const string2 = value?.slice(value.indexOf(".") + 1);
  if (string2 === "jpeg" || string2 === "png" || string2 === "jpg" || string2 === "webp") {
    return true;
  }

  alert(label);
  return false;
};

/******************************************** New Function ******************************************/

// verify Required
export const isRequired = (value, label, message) => {
  if (!value || value.length === 0) {
    // return false;
    throw message || `Vui lòng nhập ${label}`;
  }
  return true;
};
// verify Max Length
export const isMaxLength = (value, label, length) => {
  if ((typeof value !== "string" || value.length > length) && value !== null)
    throw `${label} không dài hơn ${length} ký tự`;
};
// verify Min Length
export const isMinLength = (value, label, length) => {
  if (typeof value !== "string" || (value.length < length && value.length !== 0)) {
    throw `${label} có ít nhất ${length} ký tự`;
  }
  return true;
};
// verify Email
export const isEmail = (value, label, alert) => {
  //eslint-disable-next-line
  const format =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (value && !format.test(value)) {
    alert(label);
    return false;
  }
  return true;
};
export const verifyPhoneNumber = (value) => {
  /**
   * 1. Length = 10
   * 2. Start with 0, example 098...
   */
  if (value && (value.length !== 10 || value.charAt(0) !== "0"))
    throw "Số Điện Thoại phải có 10 chữ số và bắt đầu bằng số 0";
};

export const verifyEmail = (value) => {
  if (value) {
    const format =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value && !format.test(value)) {
      throw "Email chưa đúng định dạng";
    }
  }
};

export const verifyPassword = (value) => {
  const upper = /[A-Z]/.test(value);
  const lower = /[a-z]/.test(value);
  /**
   * 1. Min length 8 characters
   * 2. At least 1 number
   * 3. Both upper and lower character
   * 4. At least 1 special character
   */
  if (value.length < 8 || !value.match(/[0-9]/) || !upper || !lower || !value.match(/[!@#$%^&*()]/))
    throw "Mật khẩu phải có ít nhất 8 ký tự, bao gồm số, chữ cái thường và chữ cái IN HOA, và phải có ít nhất 1 ký tự đặc biệt ~!@#$%^&*";
};
