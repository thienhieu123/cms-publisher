import StatusTag from "~/components/StatusTag";
import { v4 as uuidv4 } from "uuid";
import { tableStatus } from "~/constants/config";
import moment from "moment";
import { getLocalRolePermission, getLocalUserInfo } from "./storage";

export function validatePassword(text) {
  const rules = [
    {
      label: "Password phải có ít nhất 8 ký tự",
      status: false,
    },
    {
      label: "Password phải có cả IN HOA và thường",
      status: false,
    },
    {
      label: "Password phải có ít nhất một số",
      status: false,
    },
    {
      label: "Password phải có một ký tự đặc biệt: !@#$%^&*()",
      status: false,
    },
  ];

  if (text.length >= 8) {
    rules[0].status = true;
  } else {
    rules[0].status = false;
    return rules[0];
  }

  const upper = /[A-Z]/.test(text);
  const lower = /[a-z]/.test(text);
  if (upper && lower) {
    rules[1].status = true;
  } else {
    rules[1].status = false;
    return rules[1];
  }

  if (text.match(/[0-9]/)) {
    rules[2].status = true;
  } else {
    rules[2].status = false;
    return rules[2];
  }

  if (text.match(/[!@#$%^&*()]/)) {
    rules[3].status = true;
  } else {
    rules[3].status = false;
    return rules[3];
  }

  //pass all condition
  return {
    status: true,
    label: "",
  };
}

export function formatDateSearch(time) {
  if (time) {
    return new Date(new Date(time).getTime() - new Date(time).getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  }

  return null;
}

export function formatCash(str) {
  if (str) {
    return str
      .split("")
      .reverse()
      .reduce((prev, next, index) => (index % 3 ? next : `${next},`) + prev);
  }
  return str;
}

export function isDate(date) {
  return date instanceof Date && !Number.isNaN(date);
}

/**
 * return date format yyyy-mm-dd
 */
export function convertDateFormat(date) {
  if (!isDate(date)) return null;
  const year = date.getFullYear();
  const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

  return `${year}-${month}-${day}`;
}

/**
 * render StatusTag
 */
export function renderStatusTag(status, tableStatusSpecify) {
  let result;
  if (tableStatusSpecify && tableStatusSpecify.length > 0) {
    result = tableStatusSpecify.find((item) => item.value === status);
  } else result = tableStatus.find((item) => item.value === status);

  if (result) {
    return <StatusTag ishiddentooltip="true" text={result.label} color={result.color} />;
  }
  return <StatusTag ishiddentooltip="true" text={status} color="green" />;
}

export function formatMoney(number, nonUnit) {
  const vnd = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  if (number) {
    if (nonUnit) return vnd.format(number).slice(0, -2);
    return vnd.format(number).slice(0, -2).concat("đ");
  }
  if (nonUnit) return "0";
  return "0đ";
}

export function stringMoneyToNumb(value) {
  let newValue = value;
  if (typeof newValue === "number") {
    return newValue;
  }
  if (typeof newValue === "string") {
    newValue = newValue.replace("đ", "");
    while (newValue.indexOf(".") > 0) {
      newValue = newValue.replace(".", "");
    }
  }
  return Number(newValue);
}

export function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function getFormatCurrency(input, isUnit) {
  // get input value
  if (!input) {
    return input;
  }
  let inputValue = input.toString();
  // don't validate empty input
  if (inputValue === "") {
    return inputValue;
  }
  // check for decimal
  if (inputValue.indexOf(",") >= 0) {
    const decimalPos = inputValue.indexOf(",");

    // split number by decimal point
    let leftSide = inputValue.substring(0, decimalPos);
    let rightSide = inputValue.substring(decimalPos);

    // add commas to left side of number
    leftSide = formatNumber(leftSide);

    // validate right side
    rightSide = formatNumber(rightSide);

    // Limit decimal to only 2 digits
    rightSide = rightSide.substring(0, 2);

    // join number by .
    inputValue = isUnit ? `${leftSide},${rightSide}đ` : `${leftSide},${rightSide}`;
    // inputValue = `${leftSide},${rightSide}`;
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    inputValue = formatNumber(inputValue);
    if (isUnit) inputValue += "đ";
  }
  return inputValue;
  // send updated string to input
}

export function decodingBase64(url) {
  const posStart = url.indexOf("/");
  const posEnd = url.indexOf(";");
  const type = url.slice(posStart + 1, posEnd);
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${uuidv4()}.${type}`, { type: `image/${type}` });
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: uuidv4(),
        });
        resolve(file);
      })
      .catch((err) => reject(err));
  });
}

export function isBase64(urlImage) {
  const data = urlImage?.split(",");
  if (data?.length > 0) {
    const knownTypes = {
      "data:image/jpg;base64": 1,
      "data:image/png;base64": 2,
      "data:image/jpeg;base64": 3,
      /*ETC*/
    };
    if (!knownTypes[data[0]]) {
      return false;
    }
    const image = new Image();
    image.src = knownTypes[0] + data;
    // eslint-disable-next-line func-names
    image.onload = function () {
      //This should load the image so that you can actually check
      //height and width.
      if (image.height === 0 || image.width === 0) {
        return false;
      }
      return true;
    };
  } else {
    return false;
  }
  return true;
}

export function checkUrlImage(image) {
  if (image) {
    return isBase64(image) ? image : `${process.env.REACT_APP_IMG_URL}${image}`;
  }
  return null;
}

export function exportExcelFile(data, name, type) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name || "export"}.${type || "xlsx"}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function titleCase(str) {
  const splitStr = str.toLowerCase().split(" ");
  const res = [];
  splitStr.forEach((item) => {
    res.push(item.charAt(0).toUpperCase() + item.substring(1));
  });
  return res.join(" ");
}

const defaultNumbers = " Hai Ba Bốn Năm Sáu Bảy Tám Chín";

const chuHangDonVi = `1 Một${defaultNumbers}`.split(" ");
const chuHangChuc = `Lẻ Mười${defaultNumbers}`.split(" ");
const chuHangTram = `Không Một${defaultNumbers}`.split(" ");

function converBlockTwo(number) {
  let dv = chuHangDonVi[number[1]];
  const chuc = chuHangChuc[number[0]];
  let append = "";

  // Nếu chữ số hàng đơn vị là 5
  if (number[0] > 0 && number[1] === 5) {
    dv = "Lăm";
  }

  // Nếu số hàng chục lớn hơn 1
  if (number[0] > 1) {
    append = " Mươi";

    if (number[1] === 1) {
      dv = " Mốt";
    }
  }

  return `${chuc}${append} ${dv}`;
}

function converBlockThree(number) {
  if (number === "000") return "";
  const a = `${number}`; //Convert biến 'number' thành kiểu string

  //Kiểm tra độ dài của khối
  switch (a.length) {
    case 0:
      return "";
    case 1:
      return chuHangDonVi[a];
    case 2:
      return converBlockTwo(a);
    case 3:
      // eslint-disable-next-line no-case-declarations
      let chucDv = "";
      if (a.slice(1, 3) !== "00") {
        chucDv = converBlockTwo(a.slice(1, 3));
      }
      // eslint-disable-next-line no-case-declarations
      const tram = `${chuHangTram[a[0]]} Trăm`;
      return `${tram} ${chucDv}`;
    default:
      return "";
  }
}

const dvBlock = "1 Nghìn Triệu Tỷ".split(" ");

export function toVietnamese(number) {
  const str = `${parseInt(number, 10)}`;
  let i = 0;
  const arr = [];
  let index = str.length;
  const result = [];
  let rsString = "";

  if (index === 0 || str === "NaN") {
    return "";
  }

  // Chia chuỗi số thành một mảng từng khối có 3 chữ số
  while (index >= 0) {
    arr.push(str.substring(index, Math.max(index - 3, 0)));
    index -= 3;
  }

  // Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
  // eslint-disable-next-line no-plusplus
  for (i = arr.length - 1; i >= 0; i--) {
    if (arr[i] !== "" && arr[i] !== "000") {
      result.push(converBlockThree(arr[i]));

      // Thêm đuôi của mỗi khối
      if (dvBlock[i]) {
        result.push(dvBlock[i]);
      }
    }
  }

  // Join mảng kết quả lại thành chuỗi string
  rsString = result.join(" ");

  // Trả về kết quả kèm xóa những ký tự thừa
  return rsString.replace(/[0-9]/g, "").replace(/ /g, " ").replace(/ $/, "").concat(" Đồng");
}

export function generateColors(numberColors) {
  const colors = [];
  for (let i = 0; i < numberColors; i++) {
    const color =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    colors.push(color);
  }
  return colors;
}

export function handleResponse(response) {
  if (
    (response?.message?.status === 200 || response?.message?.status === 304) &&
    response.success
  ) {
    return [true, response?.message?.data?.data?.rows || response?.message?.data?.data];
  } else {
    return [false, response?.message?.data?.message || response?.message?.statusText];
  }
}

export function checkIsDataCollector() {
  const userInfo = getLocalUserInfo();
  const roleList = userInfo?.roles?.map((role) => role?.roleCode);
  return roleList?.includes("DATA_COLLECTOR");
}

export function checkIsDataControl() {
  const userInfo = getLocalUserInfo();
  const roleList = userInfo?.roles?.map((role) => role?.roleCode);
  return roleList?.includes("DATA_CONTROL");
}

export const formatUnitTree = (arr, parentCode, layer) => {
  let children = [];
  arr?.map((item) => {
    item.value = item.id;
    item.label = item.name;
    item.parentCode = parentCode;
    item.layer = layer ? layer + 1 : 1;
    if (item.children?.length === 0) {
      children.push(item);
      delete item.children;
    } else {
      const child = formatUnitTree(item.children, item.code, item.layer);
      const obj = {
        ...item,
        children: child,
      };
      children.push(obj);
    }
  });
  return children;
};

export const generateGetApiUrl = (baseUrl, params) => {
  const url = new URL(baseUrl, window.location.origin);

  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.append(key, params[key]);
    }
  });

  return url.pathname + url.search;
};

export const getStartDateDefault = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  return startDate;
};

export const handleDownload = (link, fileName) => {
  fetch(link)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    })
    .catch(console.error);
};

export const formatDate = (date) => {
  return date ? moment(date).format("DD/MM/YYYY") : "";
};

export const filterPermissionTabs = (moduleCode, listTabs) => {
  const listModules = getLocalRolePermission();
  const moduleParent = listModules?.find((item) => item.code === moduleCode);

  const result = [];
  if (moduleParent) {
    listTabs.map((tab) => {
      moduleParent.children.map((item) => {
        if (tab.code === item.code && item.canView) result.push(tab);
      });
    });
  }

  return result;
};

export const countCharacterInString = (char, str) => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) count++;
  }
  return count;
};

export const getValueInList = (arr, field) => {
  // console.log("getValueInList");
  return arr?.map((item) => (field ? accessMultiParameter(field, item) : item.value));
};

const accessMultiParameter = (arr, item) => {
  if (arr.length > 1) {
    const [, ...rest] = arr;
    return accessMultiParameter(rest, item[arr[0]]);
  } else {
    return item[arr[0]];
  }
};

export const getListValueAsString = (arr, field) => {
  // console.log("getListValueAsString", arr, field);
  const resArr = arr?.map((item) => accessMultiParameter(field, item));
  // console.log("a: ", resArr);
  return resArr?.join(", ");
};
