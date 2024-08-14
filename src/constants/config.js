export const genders = [
  {
    value: "MALE",
    label: "Nam",
  },
  {
    value: "FEMALE",
    label: "Nữ",
  },
];

export const userRoles = [
  {
    value: "USER",
    label: "Người xem",
  },
  {
    value: "ADMIN",
    label: "Quản trị viên",
  },
  {
    value: "LEADER",
    label: "Lãnh đạo",
  },
  {
    value: "OPERATOR",
    label: "Người vận hành",
  },
  {
    value: "DATA_COLLECTOR",
    label: "Người cập nhật dữ liệu",
  },
];

export const tableStatus = [
  {
    value: "ACTIVATED",
    label: "Hoạt động",
    color: "green",
  },
  {
    value: "INACTIVATED",
    label: "Bị khóa",
    color: "red",
  },
  {
    value: "MOI_TAO",
    label: "Mới tạo",
    color: "blue",
  },
  {
    value: "CHO_XU_LY",
    label: "Chờ xử lý",
    color: "yellow",
  },
  {
    value: "PENDING",
    label: "Chờ xử lý",
    color: "yellow",
  },
  {
    value: "DA_DUYET",
    label: "Đã duyệt",
    color: "green",
  },
  {
    value: "APPROVED",
    label: "Đã duyệt",
    color: "green",
  },
  {
    value: "TU_CHOI",
    label: "Từ chối",
    color: "red",
  },
  {
    value: "REJECTED",
    label: "Từ chối",
    color: "red",
  },
  {
    value: "DA_HUY",
    label: "Đã hủy",
    color: "gray",
  },
  {
    value: "CANCELED",
    label: "Đã hủy",
    color: "gray",
  },
  {
    value: "BAN_NHAP",
    label: "Bản nháp",
    color: "blue",
  },
  {
    value: "DRAFT",
    label: "Bản nháp",
    color: "blue",
  },
  {
    value: "HOAT_DONG",
    label: "Hoạt động",
    color: "green",
  },
  {
    value: "BI_KHOA",
    label: "Bị khóa",
    color: "red",
  },
  {
    value: "CREATED",
    label: "Mới tạo",
    color: "blue",
  },
  {
    value: "",
    label: "",
    color: "transparent",
  },
];

export const requestTypeTable = [
  { value: "", label: "Tất cả" },
  { value: "MANUAL", label: "Thêm mới trực tiếp" },
  { value: "THROUGH_FILE", label: "Thêm mới từ tệp" },
];

export const requestStatusTable = [
  // { value: "", label: "Tất cả" },
  { value: "DRAFT", label: "Bản nháp" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "CANCELED", label: "Đã hủy" },
];

export const resultRequestOptions = [
  { value: "APPROVE", label: "Phê duyệt" },
  { value: "REJECT", label: "Từ chối" },
];

export const categoryStatusTable = [
  { value: "", label: "Tất cả" },
  {
    value: "ACTIVATED",
    label: "Hoạt động",
  },
  {
    value: "INACTIVATED",
    label: "Bị khóa",
  },
];

export const categoryStatusTable2 = [
  {
    value: "ACTIVATED",
    label: "Hoạt động",
  },
  {
    value: "INACTIVATED",
    label: "Bị khóa",
  },
];

////status cho trang Quản trị
export const managementUserStatus = [
  { value: "", label: "Tất cả" },
  {
    value: "ACTIVATED",
    label: "Hoạt động",
    color: "green",
  },
  {
    value: "INACTIVATED",
    label: "Bị khóa",
    color: "red",
  },
];

export const managementRoleStatus = [
  { value: "", label: "Tất cả" },
  {
    value: "ACTIVATED",
    label: "Hoạt động",
    color: "green",
  },
  {
    value: "INACTIVATED",
    label: "Bị khóa",
    color: "red",
  },
];

export const managementCategoryStatus = [
  { value: "", label: "Tất cả" },
  {
    value: "ACTIVATED",
    label: "Hoạt động",
    color: "green",
  },
  {
    value: "INACTIVATED",
    label: "Bị khóa",
    color: "red",
  },
];

export const managementUnitStatus = [
  { value: "", label: "Tất cả" },
  {
    value: "ACTIVATED",
    label: "Hoạt động",
    color: "green",
  },
  {
    value: "INACTIVATED",
    label: "Bị khóa",
    color: "red",
  },
];

export const permissionStatus = [
  {
    value: "ACTIVATED",
    label: "Hoạt động",
    color: "green",
  },
  {
    value: "DISABLED",
    label: "Bị khóa",
    color: "gray",
  },
  {
    value: "INACTIVATED",
    label: "Ẩn",
    color: "red",
  },
];

export const MODULES = {
  home: {
    name: "HOME",
  },
  statistic_data: {
    statistic_data: "STATISTIC DATA",
    update_data: "UPDATE DATA",
    approve_data: "APPROVE DATA",
  },
};

export const PERMISSION_TYPE = {
  MODULE: "MODULE",
  TAB: "TAB",
  COMPONENT: "FUNCTION_COMPONENT",
};

export const CATEGORY_TYPE = {
  STATS_INDEX_GROUP: "STATS_INDEX_GROUP",
  STATS_INDEX: "STATS_INDEX",
  MEASUREMENT_UNIT: "MEASUREMENT_UNIT",
  POSITION: "POSITION",
  DEPARMENT: "DEPARMENT",
  DATA_RESOURCE: "DATA_RESOURCE",
  FORMULA: "FORMULA",
};
