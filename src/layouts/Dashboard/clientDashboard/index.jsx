/* eslint-disable */
import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import { Card, IconButton, Tooltip } from "@mui/material";
import PopupRoot from "~/components/Popup/PopupRoot";
import ChangePasswordPopUp from "~/layouts/Account/changePasswordPopUp/changePasswordPopup";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import Table from "~/examples/Tables/Table";
import Search from "~/examples/Search";
import SuiBadge from "~/components/SuiBadge";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import SwiperCore, { Navigation } from "swiper/core";
import peopleSkinIcon from "~/assets/images/icons/daikin-admin/dasboard/PeopleColorGreen.svg";
import invoiceIcon from "~/assets/images/icons/daikin-admin/dasboard/InvoiceColor.svg";
import rentRequestIcon from "~/assets/images/icons/daikin-admin/dasboard/RentRequestColorOrange.svg";
import arrowDeclineIcon from "~/assets/images/icons/daikin-admin/dasboard/ArrowDecline.svg";
import arrowRiseIcon from "~/assets/images/icons/daikin-admin/dasboard/ArrowRise.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import StatsBox from "~/examples/StatsBox";
import ReportBox from "../components/ReportBox";
import NotificationsData from "./data/notificationsData";
// import { getListBillHomePageClient, getListRentHomePageClient } from "~/api/admin";
import { setAlertMessage, setLoading } from "~/context/common/action";
import { useSoftUIController } from "~/context";
import { getLocalUserInfo } from "~/utils/storage";
import EyeIcon from "~/assets/images/icons/blue-eye.svg";
import { formatDateSearch, formatMoney } from "~/utils/utils";
import { Link, useNavigate } from "react-router-dom";

// import FirstLogin from "./components/FirstLogin";

const invoiceColumn = [
  {
    name: "Mã hóa đơn",
    align: "center",
    sortable: true,
  },
  {
    name: "Kỳ hóa đơn",
    align: "center",
    sortable: true,
  },
  {
    name: "Số tiền cần thanh toán",
    align: "center",
  },
  {
    name: "số hợp đồng",
    align: "center",
    sortable: true,
  },
  {
    name: "Xử lý",
    align: "center",
  },
];

const requestColumn = [
  {
    name: "Mã yêu cầu",
    align: "center",
    sortable: true,
  },
  {
    name: "Địa điểm",
    sortable: true,
    align: "center",
  },
  {
    name: "Ngày",
    sortable: true,
    align: "center",
  },
  {
    name: "Loại yêu cầu",
    sortable: true,
    align: "center",
  },
  {
    name: "Xử lý",
    align: "center",
  },
];

const options = [
  {
    value: "THUE_MOI",
    label: "Thuê Mới",
  },
  {
    value: "BAO_TRI",
    label: "Bảo trì",
  },
  {
    value: "TRA_MAY",
    label: "Trả máy",
  },
];

const tableRequestType = {
  THUE_MOI: "Thuê Mới",
  BAO_TRI: "Bảo trì",
  TRA_MAY: "Trả máy",
};

SwiperCore.use([Navigation]);
function ClientDashboard() {
  const [, dispatch] = useSoftUIController();
  const navigate = useNavigate();
  const [totalElements, setTotalElements] = useState(0);
  const [totalElementsRentTable, setTotalElementsRentTable] = useState(0);
  const [billDataFetching, setDataBillFetching] = useState([]);
  const [rentDataFetching, setDataRentFetching] = useState([]);
  const [totalBillOverdue, setTotalBillOverdue] = useState(0);
  const [totalRentNew, setTotalRentNew] = useState(0);
  const [totalSubFreeOverdue, setTotalSubFreeOverdue] = useState(0);
  const { userId } = getLocalUserInfo();
  const newInvoice = totalElements;
  const requests = totalElementsRentTable;
  const [queryFilter, setQueryFilter] = useState({
    number: 0,
    size: 20,
    sort: "DESC",
    all: false,
    keyword: null,
    startDatePeriod: null,
    endDatePeriod: null,
  });

  const [queryFilterRentTable, setQueryFilterRentTable] = useState({
    number: 0,
    size: 20,
    sort: "DESC",
    all: false,
    keyword: null,
    rentTypeSearch: null,
    startDate: null,
    endDate: null,
  });
  const [isOpenChangePassword, setOpenChangePassword] = useState(true);

  const handleConvertMonth = (d) => {
    const date = new Date(d);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const startDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
    const endDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return `Tháng ${month}/${year} (${startDayOfMonth}/${month} - ${endDayOfMonth}/${month})`;
  };

  // useEffect(() => {
  //   const { number, size, sort, keyword, startDatePeriod, endDatePeriod } = queryFilter;
  //   setLoading(dispatch, true);
  //   getListBillHomePageClient(
  //     userId,
  //     number,
  //     size,
  //     sort,
  //     false,
  //     keyword,
  //     startDatePeriod,
  //     endDatePeriod
  //   )
  //     .then((res) => {
  //       if (res.message.status === 200) {
  //         const { data } = res.message.data;
  //         setDataBillFetching(data.listDetail.content);
  //         setTotalElements(data.listDetail.totalElements);
  //         setTotalBillOverdue(data.dashBoard.totalBillOverdue);
  //         setTotalRentNew(data.dashBoard.totalRentNew);
  //         setTotalSubFreeOverdue(data.dashBoard.totalSubFreeOverdue);
  //       } else {
  //         setAlertMessage(dispatch, {
  //           message: res.message.data.message,
  //           type: "error",
  //           openAlert: true,
  //         });
  //       }
  //       setLoading(dispatch, false);
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // }, [queryFilter]);

  // useEffect(() => {
  //   const { number, size, sort, keyword, rentTypeSearch, startDate, endDate } =
  //     queryFilterRentTable;
  //   setLoading(dispatch, true);
  //   getListRentHomePageClient(
  //     userId,
  //     number,
  //     size,
  //     sort,
  //     false,
  //     keyword,
  //     rentTypeSearch,
  //     startDate,
  //     endDate
  //   )
  //     .then((res) => {
  //       if (res.message.status === 200) {
  //         const { data } = res.message.data;
  //         if (data) {
  //           setDataRentFetching(data?.content);
  //           setTotalElementsRentTable(data.totalElements);
  //         }
  //       } else {
  //         setAlertMessage(dispatch, {
  //           message: res.message.data.message,
  //           type: "error",
  //           openAlert: true,
  //         });
  //       }
  //       setLoading(dispatch, false);
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // }, [queryFilterRentTable]);

  const invoiceData = billDataFetching
    .map((item) => ({
      id: item.billId,
      invoiceId: item.id,
      type: item.billType,
      "Mã hóa đơn": `${item.billCode}`,
      "Kỳ hóa đơn": handleConvertMonth(item.billPeriod),
      "Số tiền cần thanh toán": formatMoney(item.totalPayment),
      "số hợp đồng": `#${item.contractCode}`,
      "Xử lý": "chi tiết",
    }))
    .map((item) => {
      const res = {
        ...item,
      };
      res["Xử lý"] = (
        <Link
          state={{ isIndividual: item.type }}
          to={`/client/invoice/${item["Mã hóa đơn"]}?invoiceId=${item.id}`}
          onClick={(e) => e.stopPropagation()}
          ishiddentooltip="true"
        >
          <Tooltip title="Xem chi tiết">
            <IconButton aria-label="toggle password visibility">
              <SuiBox component="img" src={EyeIcon} alt="View Icon" />
            </IconButton>
          </Tooltip>
        </Link>
      );
      return res;
    });

  const renderActionBtn = (status, id) => (
    <Tooltip title="Xem chi tiết" ishiddentooltip="true">
      <IconButton
        aria-label="toggle password visibility"
        onClick={() =>
          status === "THUE_MOI" || status === "BAO_TRI"
            ? navigate(`/client/request/update/${id}`)
            : navigate(`/client/request/${id}`)
        }
      >
        <SuiBox component="img" src={EyeIcon} alt="Edit Icon" />
      </IconButton>
    </Tooltip>
  );

  const requestsData = rentDataFetching.map((item) => ({
    "Mã yêu cầu": `${item.rentCode}`,
    "Địa điểm": (
      <SuiBox sx={{ maxWidth: "275px" }}>
        <SuiTypography variant="text" color="black" fontWeight="regular" fontSize="0.8rem">
          {`${item.street ?? ""} ${item.wardName ?? ""} ${item.districtName ?? ""} ${
            item.provinceName ?? ""
          }`}
        </SuiTypography>
      </SuiBox>
    ),
    Ngày: new Date(item.createdDate).toLocaleDateString("en-gb"),
    "Loại yêu cầu": tableRequestType[item.rentType],
    "Xử lý": renderActionBtn(item.rentType, item.id),
    id: item.id,
  }));

  const InvoiceHandleSearch = (filterOption) => {
    setQueryFilter({
      ...queryFilter,
      number: 0,
      keyword: filterOption.searchValue,
      startDatePeriod: formatDateSearch(filterOption.dateData[0].from),
      endDatePeriod: formatDateSearch(filterOption.dateData[0].to),
    });
  };

  const RequestHandleSearch = (filterOption) => {
    setQueryFilterRentTable({
      ...queryFilterRentTable,
      number: 0,
      keyword: filterOption.searchValue,
      rentTypeSearch: filterOption.filterOption.value,
      startDate: formatDateSearch(filterOption.dateData[0].from),
      endDate: formatDateSearch(filterOption.dateData[0].to),
    });
  };
  SwiperCore.use([Navigation]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <SuiBox>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={12} xl={12}>
                <SuiBox
                  mb={1.5}
                  sx={{ position: "relative", display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <Swiper
                    slidesPerView={3}
                    navigation
                    spaceBetween={30}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                      },
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                      },
                    }}
                  >
                    <SwiperSlide>
                      <StatsBox
                        value={totalRentNew}
                        title="Yêu Cầu Thuê Mới"
                        color="var(--gray-50)"
                        boxIcon={rentRequestIcon}
                        boxIconBgColor="#FFF2EA"
                        valueFontSize="24px"
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <StatsBox
                        value={totalBillOverdue}
                        title="Hóa Đơn Quá Hạn Thanh Toán"
                        icon={<SuiBox component="img" src={arrowRiseIcon} />}
                        color="var(--gray-50)"
                        boxIcon={invoiceIcon}
                        boxIconBgColor="#D2D3F8"
                        valueFontSize="24px"
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <StatsBox
                        value={totalSubFreeOverdue}
                        title="Gói Cước Sắp Hết Hạn"
                        icon={<SuiBox component="img" src={arrowDeclineIcon} />}
                        color="var(--gray-50)"
                        boxIcon={peopleSkinIcon}
                        boxIconBgColor="#0ACF8333"
                        valueFontSize="24px"
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <StatsBox
                        value="4"
                        title="Yêu Cầu Thuê Mới"
                        color="var(--gray-50)"
                        boxIcon={rentRequestIcon}
                        boxIconBgColor="#FFF2EA"
                        valueFontSize="24px"
                      />
                    </SwiperSlide>
                  </Swiper>
                </SuiBox>
                <Card sx={{ marginBottom: "10px", padding: "15px" }}>
                  <SuiBox>
                    <SuiTypography
                      variant="h5"
                      fontSize="17px"
                      color="black"
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{ fontWeight: "600", letterSpacing: "0.05rem", marginBottom: "0px" }}
                    >
                      Hóa Đơn Cần Thanh Toán
                      {newInvoice > 0 && (
                        <SuiBadge
                          // size="sm"
                          sx={{
                            "& .MuiBadge-badge": {
                              padding: "3px 5px",
                              background: "var(--blue-blue-100)",
                            },
                          }}
                          badgeContent={
                            <SuiTypography
                              variant="text"
                              fontWeight="regular"
                              fontSize="14px"
                              sx={{ fontWeight: "600" }}
                            >
                              {newInvoice}+
                            </SuiTypography>
                          }
                        />
                      )}
                    </SuiTypography>
                  </SuiBox>
                  <Search
                    placeholder="Nhập mã hóa đơn, số hợp đồng"
                    dateRangeLabel={["Kỳ Hóa Đơn"]}
                    handleSearch={InvoiceHandleSearch}
                    maxLength="200"
                    isCloseFilter
                  />
                  <Table
                    title="Hóa đơn cần thanh toán"
                    badgeData={245}
                    header="full"
                    headerLabel="Hóa đơn"
                    columns={invoiceColumn}
                    rows={invoiceData}
                    rowsCount={queryFilter.size}
                    curPage={queryFilter.number}
                    setRowsCount={(rowCount) =>
                      setQueryFilter({
                        ...queryFilter,
                        size: rowCount,
                        number: 0,
                      })
                    }
                    setCurPage={(nextPage) =>
                      setQueryFilter({
                        ...queryFilter,
                        number: nextPage,
                      })
                    }
                    totalElements={totalElements}
                    size="13px"
                    borderRadius="1rem"
                  />
                </Card>

                <Card sx={{ marginBottom: "0px", padding: "15px" }}>
                  <SuiTypography
                    variant="h5"
                    fontSize="17px"
                    color="black"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{ fontWeight: "600", letterSpacing: "0.05rem" }}
                  >
                    Yêu Cầu
                    {requests > 0 && (
                      <SuiBadge
                        sx={{
                          "& .MuiBadge-badge": {
                            padding: "3px 5px",
                            background: "var(--blue-blue-100)",
                          },
                        }}
                        badgeContent={
                          <SuiTypography variant="text" fontSize="14px" sx={{ fontWeight: "600" }}>
                            {requests}+
                          </SuiTypography>
                        }
                      />
                    )}
                  </SuiTypography>
                  <Search
                    placeholder="Nhập mã yêu cầu, địa điểm"
                    dateRangeLabel={["Ngày Yêu Cầu"]}
                    options={options}
                    optionlabel="Loại Yêu Cầu"
                    isOptionFilterRevert
                    handleSearch={RequestHandleSearch}
                    maxLength="200"
                    isCloseFilter
                  />
                  <Table
                    title="Danh Sách Cần Bảo Trì"
                    link="/client/request"
                    linkIndex="id"
                    badgeData={27}
                    badgeColor="warning"
                    columns={requestColumn}
                    rows={requestsData}
                    rowsCount={queryFilterRentTable.size}
                    curPage={queryFilterRentTable.number}
                    setRowsCount={(rowCount) =>
                      setQueryFilterRentTable({
                        ...queryFilterRentTable,
                        size: rowCount,
                        number: 0,
                      })
                    }
                    setCurPage={(nextPage) =>
                      setQueryFilterRentTable({
                        ...queryFilterRentTable,
                        number: nextPage,
                      })
                    }
                    totalElements={totalElementsRentTable}
                    size="13px"
                    sx={{ borderRadius: "0px", boxShadow: "none" }}
                    borderRadius="1rem"
                  />
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} xl={12}>
                <SuiBox height="max-content">
                  <ReportBox
                    title="Thông Báo"
                    data={NotificationsData}
                    newMessage={245}
                    seeMore={false}
                  />
                </SuiBox>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SuiBox>
    </DashboardLayout>
  );
}

export default ClientDashboard;
