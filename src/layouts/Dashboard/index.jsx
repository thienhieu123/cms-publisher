/* eslint-disable no-unused-vars */
/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import { Card, IconButton, Tooltip, Box, Typography } from "@mui/material";
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import SuiBadge from "~/components/SuiBadge";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import Search from "~/examples/Search";
import Table from "~/examples/Tables/Table";
import EyeIcon from "~/assets/images/icons/blue-eye.svg";
import exclamationMarkIcon from "~/assets/images/icons/daikin-admin/dasboard/ExclamationMark.svg";
import invoiceIcon from "~/assets/images/icons/daikin-admin/dasboard/InvoiceColor.svg";
import peopleSkinIcon from "~/assets/images/icons/daikin-admin/dasboard/PeopleColorGreen.svg";
import rentRequestIcon from "~/assets/images/icons/daikin-admin/dasboard/RentRequestColorOrange.svg";
import StatsBox from "~/examples/StatsBox";
import {
  getAlertMovementAndProblem,
  getDashboardChart,
  getListDeviceDetailMaintenance,
  getListRentRequest,
  getReportClient,
} from "~/api/admin";
import { useSoftUIController } from "~/context";
import { setLoading, setAlertMessage } from "~/context/common/action";
import moment from "moment";
import MixedChart from "~/examples/Charts/MixedChart";
import GoogleMapReact from "google-map-react";
import ReportBox from "./components/ReportBox";
import IncidentReportData from "./data/incidentReportData";

const rentRequestColumn = [
  {
    name: "Mã yêu cầu",
    align: "center",
    sortable: true,
  },
  {
    name: "Khách hàng",
    sortable: true,
  },
  {
    name: "Số Điện Thoại",
    align: "center",
  },
  {
    name: "Danh sách thiết bị",
  },
  {
    name: "Xử lý",
    align: "center",
  },
];

const matbColumn = [
  {
    name: "Mã thiết bị",
    align: "center",
    sortable: true,
  },
  {
    name: "Dự kiến bảo trì",
    sortable: true,
  },
  {
    name: "Nội dung",
    align: "center",
  },
  {
    name: "Xử lý",
    align: "center",
  },
];

const defaultProps = {
  center: {
    lat: 10.762622,
    lng: 106.660172,
  },
  zoom: 13,
};

// eslint-disable-next-line react/prop-types
function AnyReactComponent({ text }) {
  return (
    <Box>
      <Typography>{text}</Typography>
    </Box>
  );
}

const alertType = {
  movement: "CANH_BAO_DI_CHUYEN",
  problem: "CANH_BAO_SU_CO",
};

function Dashboard() {
  const navigate = useNavigate();
  const [, dispatch] = useSoftUIController();
  const [totalRentRequests, setTotalRentRequests] = useState(0);
  const [totalDeviceMaintains, setTotalDeviceMaintains] = useState(0);
  const [rentRequestQueryFilter, setRentRequestQueryFilter] = useState({
    number: 0,
    size: 20,
    sort: "rentRequestId,ASC",
    keyword: null,
  });
  const [formData, setFormData] = useState({
    totalBillOutDate: null,
    totalClientInMonth: null,
    totalIncidentInMonth: null,
    totalRentRequestDevice: null,
  });
  const [rentRequestDataFetching, setRentRequestDataFetching] = useState([]);
  const [rentRequestsTableData, setRentRequestTableData] = useState([]);
  const [maintenanceQueryFilter, setMaintenanceQueryFilter] = useState({
    number: 0,
    size: 20,
    keyword: "",
    startDate: "",
    endDate: "",
  });

  const [maintainDataFetching, setMaintainDataFetching] = useState([]);
  const [dataset, setDataset] = useState([]);

  const [movementData, setMovementData] = useState([]);
  const [movementFilter, setMovementFilter] = useState({
    number: 0,
    size: 10,
    sort: "createdDate,DESC",
  });
  const [problemData, setProblemData] = useState([]);
  const [problemFilter, setProblemFilter] = useState({
    number: 0,
    size: 10,
    sort: "createdDate,DESC",
  });
  const [customerLngLat, setCustomerLngLat] = useState([]);

  useEffect(() => {
    getReportClient().then((res) => {
      if (res.message.status === 200) {
        const { data } = res.message;
        setFormData(data);
      } else {
        setAlertMessage(dispatch, {
          message: res.message.data.message,
          type: "error",
          openAlert: true,
        });
      }
    });

    getDashboardChart().then((res) => {
      if (res.message.status === 200) {
        const { newClient, newRequest } = res.message.data;
        const dataNewClient = newClient
          ? Object.values(newClient).map((value) => {
              if (value) return value;
              return 0;
            })
          : [];
        const dataNewRequest = newRequest
          ? Object.values(newRequest).map((value) => {
              if (value) return value;
              return 0;
            })
          : [];
        setDataset([
          {
            chartType: "gradient-line",
            label: "Số lượng khách mới",
            color: "info",
            data: dataNewClient,
          },
          {
            chartType: "thin-bar",
            label: "Số lượng yêu cầu mới",
            color: "dark",
            data: dataNewRequest,
          },
        ]);
      } else {
        setAlertMessage(dispatch, {
          message: res.message.data.message,
          type: "error",
          openAlert: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    getAlertMovementAndProblem(
      alertType.movement,
      movementFilter.number,
      movementFilter.size,
      movementFilter.sort
    ).then((res) => {
      if (res.message.status === 200) {
        setMovementData(res.message?.data?.data.content);
      } else {
        setAlertMessage(dispatch, {
          message: res.message.data.message,
          type: "error",
          openAlert: true,
        });
      }
    });
  }, [movementFilter]);

  useEffect(() => {
    getAlertMovementAndProblem(
      alertType.problem,
      problemFilter.number,
      problemFilter.size,
      problemFilter.sort
    ).then((res) => {
      if (res.message.status === 200) {
        setProblemData(res.message.data);
      } else {
        setAlertMessage(dispatch, {
          message: res.message?.data.message,
          type: "error",
          openAlert: true,
        });
      }
    });
  }, [problemFilter]);

  useEffect(() => {
    const { number, size, sort, keyword } = rentRequestQueryFilter;
    setLoading(dispatch, true);
    getListRentRequest(number, size, sort, keyword)
      .then((res) => {
        if (res.message.status === 200) {
          const { data } = res.message.data;
          setRentRequestDataFetching(data?.content || []);
          setTotalRentRequests(data?.totalElements || 0);
          setLoading(dispatch, false);
        } else {
          setAlertMessage(dispatch, {
            message: res.message.data.message,
            type: "error",
            openAlert: true,
          });
        }
      })
      .finally(() => setLoading(dispatch, false));
  }, [rentRequestQueryFilter]);

  useEffect(() => {
    getListDeviceDetailMaintenance(maintenanceQueryFilter).then((res) => {
      if (res.message.status === 200) {
        const { data } = res.message.data;
        setMaintainDataFetching(data.content);
        setTotalDeviceMaintains(data.totalElements);
      } else {
        setAlertMessage(dispatch, {
          message: res.message.data.message,
          type: "error",
          openAlert: true,
        });
      }
    });
  }, [maintenanceQueryFilter]);

  const maintainTableData = useMemo(
    () =>
      maintainDataFetching?.map((device) => ({
        id: device.deviceDetailId,
        "Mã thiết bị": device.deviceDetailCode,
        "Dự kiến bảo trì": moment(device.expectedDate).format("DD/MM/YYYY"),
        "Nội dung": device.maintenancePeriod,
        "Xử lý": (
          <Link
            to={`/operator/warehouses/manage-device/${device.deviceDetailCode}?deviceDetailId=${device.deviceDetailId}`}
            onClick={(e) => e.stopPropagation()}
            ishiddentooltip="true"
          >
            <Tooltip title="Xem chi tiết" ishiddentooltip="true">
              <IconButton aria-label="toggle password visibility">
                <SuiBox component="img" src={EyeIcon} alt="View Icon" />
              </IconButton>
            </Tooltip>
          </Link>
        ),
      })),
    [maintainDataFetching]
  );

  useEffect(() => {
    const table = rentRequestDataFetching.map((data) => ({
      rentRequestId: data.rentRequestId,
      "Mã yêu cầu": data.rentCode,
      "Khách hàng": `${data.clientCode} - ${data.contactName}`,
      "Số Điện Thoại": data.cellPhone,
      "Danh sách thiết bị": (
        <SuiBox
          tooltip={`${data.itemDetails[0]?.quantity} x ${data.itemDetails[0]?.deviceName}`}
          ishiddentooltip="true"
          sx={{
            maxWidth: "275px",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <Tooltip
            title={data.itemDetails.map((item) => (
              <SuiTypography
                fontWeight="regular"
                fontSize="0.8rem"
                variant="text"
                display="flex"
                align="left"
              >
                {`${item.quantity} x ${item.deviceName}`}
              </SuiTypography>
            ))}
            placement="top-start"
          >
            <SuiTypography fontWeight="regular" fontSize="0.8rem" variant="text">
              {`${data.itemDetails[0]?.quantity} x ${data.itemDetails[0]?.deviceName}`}
            </SuiTypography>
          </Tooltip>
        </SuiBox>
      ),
      "Xử lý": (
        <Link
          to={`/operator/request/rent-request/${data.rentCode}?rentRequestId=${data.rentRequestId}`}
          onClick={(e) => e.stopPropagation()}
          ishiddentooltip="true"
        >
          <Tooltip title="Xem chi tiết">
            <IconButton aria-label="toggle password visibility">
              <SuiBox component="img" src={EyeIcon} alt="View Icon" />
            </IconButton>
          </Tooltip>
        </Link>
      ),
    }));
    setRentRequestTableData(table);
  }, [rentRequestDataFetching]);

  const RentRequestHandleSearch = (filterOption) => {
    setRentRequestQueryFilter({
      ...rentRequestQueryFilter,
      number: 1,
      keyword: filterOption.searchValue,
    });
  };

  const handleFilterMaintainTable = (filterOption) => {
    setMaintenanceQueryFilter({
      ...maintenanceQueryFilter,
      startDate: filterOption.dateData[0].from,
      endDate: filterOption.dateData[0].to,
      keyword: filterOption.searchValue,
    });
  };

  const renderChart = useMemo(
    () => (
      <MixedChart
        noteChart={[
          { color: "dark", text: "Số lượng yêu cầu mới" },
          { color: "info", text: "Số lượng khách mới" },
        ]}
        chart={{
          labels: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ],
          datasets: dataset,
        }}
      />
    ),
    [dataset]
  );

  const date = new Date();
  const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SuiBox>
        <SuiBox mb={1.5}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} lg={6} xl={2.3}>
              <StatsBox
                value={formData.totalRentRequestDevice}
                title="Yêu Cầu Thuê Mới"
                color="var(--gray-50)"
                boxIcon={rentRequestIcon}
                boxIconBgColor="#FFF2EA"
                valueFontSize="24px"
                onClick={() => navigate("/operator/request/rent-request")}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6} xl={2.3}>
              <StatsBox
                value={formData.totalBillOutDate}
                title="Hóa Đơn Quá Hạn Thanh Toán"
                color="var(--gray-50)"
                boxIcon={invoiceIcon}
                boxIconBgColor="#D2D3F8"
                valueFontSize="24px"
                onClick={() =>
                  navigate("/operator/service/bill-service", { state: { status: "QUA_HAN" } })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6} xl={2.4}>
              <StatsBox
                value={formData.totalClientInMonth}
                title="Khách Hàng Mới Trong Tháng"
                color="var(--gray-50)"
                boxIcon={peopleSkinIcon}
                boxIconBgColor="#0ACF8333"
                valueFontSize="24px"
                onClick={() =>
                  navigate("/operator/customer", {
                    state: { startDateSearch: firstDate, endDateSearch: lastDate },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6} xl={2.4}>
              <StatsBox
                value={formData.totalIncidentInMonth}
                title="Báo Cáo Sự Cố Trong Tháng"
                color="var(--gray-50)"
                boxIcon={exclamationMarkIcon}
                boxIconBgColor="var(--red-50)"
                valueFontSize="24px"
                onClick={() =>
                  navigate("/operator/warehouses/manage-device?tab=4", {
                    state: { startDate: firstDate, endDate: lastDate },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6} xl={2.4}>
              <StatsBox
                value={totalDeviceMaintains}
                title="Danh sách thiết bị cần bảo trì"
                color="var(--gray-50)"
                boxIcon={exclamationMarkIcon}
                boxIconBgColor="#dfdf13"
                valueFontSize="24px"
                onClick={() =>
                  navigate("/operator/warehouses/manage-device?tab=3", {
                    state: { startDate: firstDate, endDate: lastDate },
                  })
                }
              />
            </Grid>
          </Grid>
        </SuiBox>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={7}>
            <Card sx={{ marginBottom: "13px", padding: "15px" }}>
              <SuiBox>
                <SuiTypography
                  variant="h5"
                  fontSize="17px"
                  color="#000"
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  sx={{ fontWeight: "600", letterSpacing: "0.05rem", marginBottom: "0px" }}
                >
                  Yêu Cầu Thuê Mới
                  {totalRentRequests > 0 && (
                    <SuiBadge
                      sx={{
                        "& .MuiBadge-badge": {
                          background: "var(--blue-blue-100)",
                          padding: "3px 5px",
                        },
                      }}
                      badgeContent={
                        <SuiTypography
                          variant="text"
                          fontWeight="regular"
                          fontSize="14px"
                          sx={{ fontWeight: "600" }}
                        >
                          {totalRentRequests > 99 ? `${totalRentRequests} +` : totalRentRequests}
                        </SuiTypography>
                      }
                    />
                  )}
                </SuiTypography>
              </SuiBox>
              <Search
                placeholder="Nhập mã yêu cầu, tên khách hàng, số điện thoại"
                hasDate={false}
                handleSearch={RentRequestHandleSearch}
                maxLength="200"
                alert={() => {
                  setAlertMessage(dispatch, {
                    message: "Mã yêu cầu, tên khách hàng, số điện thoại quá 50 ký tự",
                    type: "error",
                    openAlert: true,
                  });
                }}
              />
              <Table
                title="Yêu Cầu Thuê Mới"
                columns={rentRequestColumn}
                link="/operator/request/rent-request"
                linkIndex="Mã yêu cầu"
                linkExpand={["rentRequestId"]}
                rows={rentRequestsTableData}
                rowsCount={rentRequestQueryFilter.size}
                curPage={rentRequestQueryFilter.number}
                setCurPage={(nextPage) => {
                  setRentRequestQueryFilter({
                    ...rentRequestQueryFilter,
                    number: nextPage,
                  });
                }}
                setRowsCount={(pSize) => {
                  setRentRequestQueryFilter({
                    ...rentRequestQueryFilter,
                    size: pSize,
                    number: 0,
                  });
                }}
                borderRadius="0rem"
                size="13px"
                totalElements={totalRentRequests}
              />
            </Card>

            <Card sx={{ marginBottom: "0px", padding: "15px" }}>
              <SuiTypography
                variant="h5"
                fontSize="17px"
                color="#000"
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                sx={{ fontWeight: "600", letterSpacing: "0.05rem" }}
              >
                Danh Sách Cần Bảo Trì
                {totalDeviceMaintains > 0 && (
                  <SuiBadge
                    sx={{
                      "& .MuiBadge-badge": {
                        background: "var(--blue-blue-100)",
                        padding: "3px 5px",
                      },
                    }}
                    badgeContent={
                      <SuiTypography variant="text" fontSize="14px" sx={{ fontWeight: "600" }}>
                        {totalDeviceMaintains > 99
                          ? `${totalDeviceMaintains}+`
                          : totalDeviceMaintains}
                      </SuiTypography>
                    }
                  />
                )}
              </SuiTypography>
              <Search
                placeholder="Nhập mã thết bị"
                dateRangeLabel={["Ngày Bảo Trì"]}
                handleSearch={handleFilterMaintainTable}
                maxLength="200"
                alert={() => {
                  setAlertMessage(dispatch, {
                    message: "Mã thết bị quá 200 ký tự",
                    type: "error",
                    openAlert: true,
                  });
                }}
                isCloseFilter
              />
              <Table
                columns={matbColumn}
                rows={maintainTableData}
                rowsCount={maintenanceQueryFilter.size}
                setRowsCount={(pSize) => {
                  setMaintenanceQueryFilter({
                    ...maintenanceQueryFilter,
                    size: pSize,
                    number: 0,
                  });
                }}
                curPage={maintenanceQueryFilter.number}
                setCurPage={(nextPage) => {
                  setMaintenanceQueryFilter({
                    ...maintenanceQueryFilter,
                    number: nextPage,
                  });
                }}
                totalElements={totalDeviceMaintains}
                borderRadius="0rem"
              />
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={5}>
            <Grid container>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={12}>
                <Card>
                  {renderChart}
                  <div style={{ justifyContent: "center", display: "flex" }}>
                    <SuiBox my={1} style={{ borderTop: "2px solid #E1EBE4", width: "70%" }}>
                      <Typography
                        style={{
                          color: "var(--blue-blue-100)",
                          textAlign: "center",
                          cursor: "pointer",
                          fontSize: "14px",
                          marginTop: "10px",
                        }}
                        onClick={() => navigate("/operator/customer?tab=0")}
                      >
                        Xem thêm danh sách Khách hàng {`>>`}
                      </Typography>
                    </SuiBox>
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={12} pt={1.5}>
                <Card sx={{ overflow: "hidden !important" }}>
                  <div
                    style={{
                      height: "40vh",
                      width: "100%",
                      paddingBottom: "10px",
                    }}
                  >
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: process.env.REACT_APP_API_KEY_MAP }}
                      defaultCenter={defaultProps.center}
                      defaultZoom={defaultProps.zoom}
                    >
                      {customerLngLat.map((item, index) => (
                        <AnyReactComponent
                          lat={item.lng}
                          lng={item.lat}
                          text={item.name}
                          key={index}
                        />
                      ))}
                    </GoogleMapReact>
                  </div>
                  <div style={{ justifyContent: "center", display: "flex" }}>
                    <SuiBox my={1} style={{ borderTop: "2px solid #E1EBE4", width: "70%" }}>
                      <Typography
                        style={{
                          color: "var(--blue-blue-100)",
                          textAlign: "center",
                          cursor: "pointer",
                          fontSize: "14px",
                          marginTop: "10px",
                        }}
                        onClick={() => navigate("/operator/customer?tab=1")}
                      >
                        Xem thêm Bản đồ khách hàng {`>>`}{" "}
                      </Typography>
                    </SuiBox>
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={12} pt={1.5}>
                <SuiBox height="max-content">
                  <ReportBox title="Báo Cáo Sự Cố" data={IncidentReportData} newMessage={245} />
                </SuiBox>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SuiBox>
    </DashboardLayout>
  );
}

export default Dashboard;
