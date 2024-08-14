/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import BinhChanhImg from "~/assets/images/BinhChanh.jpg";
import BinhTanImg from "~/assets/images/BinhTan.jpg";
import ThuDucImg from "~/assets/images/ThuDuc.jpg";
import Quan1Img from "~/assets/images/quan1.jpg";
import Quan3Img from "~/assets/images/quan3.jpg";
import Quan4Img from "~/assets/images/quan4.jpg";
import Quan5Img from "~/assets/images/quan5.jpg";
import Quan7Img from "~/assets/images/quan7.jpg";
import Quan10Img from "~/assets/images/quan10.jpg";
import PopupRoot from "~/components/Popup/PopupRoot";
import ChangePasswordPopUp from "~/layouts/Account/changePasswordPopUp/changePasswordPopup";
import { setLoading } from "~/context/common/action";
import { useSoftUIController } from "~/context";
import { getLocalUserInfo } from "~/utils/storage";
import { BarChartDataSample } from "~/utils/variable";
import TopEconomicDashboard from "./TopEconomicDashboard";
import RankEconomicList from "./RankEconomicList";
import ChartDashboard from "./ChartDashboard";
import PermissionWrapped from "~/components/PermissionWrapped";

function HomePage() {
  const [isOpenChangePassword, setOpenChangePassword] = useState(false);
  const [, dispatch] = useSoftUIController();
  const [BarChartData, setBarChartData] = useState(BarChartDataSample);
  const sampleData = [
    {
      stt: 1,
      title: "Quận 1",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "17.86",
      img: Quan1Img,
    },
    {
      stt: 2,
      title: "Quận 3",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "17.76",
      img: Quan3Img,
    },
    {
      stt: 3,
      title: "Quận 4",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "16.56",
      img: Quan4Img,
    },
    {
      stt: 4,
      title: "Quận 5",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "16.84",
      img: Quan5Img,
    },
    {
      stt: 5,
      title: "Quận 6",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "15.77",
      img: BinhTanImg,
    },
    {
      stt: 6,
      title: "Quận 7",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "15.45",
      img: Quan7Img,
    },
    {
      stt: 7,
      title: "Quận 8",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "14.96",
      img: Quan1Img,
    },
    {
      stt: 8,
      title: "Quận 10",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "14.95",
      img: Quan10Img,
    },
    {
      stt: 9,
      title: "Quận 11",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "14.23",
      img: BinhTanImg,
    },
    {
      stt: 10,
      title: "Quận 12",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "15.43",
      img: Quan7Img,
    },
    {
      stt: 11,
      title: "Quận Bình Thạnh",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "14",
      img: Quan3Img,
    },
    {
      stt: 12,
      title: "Quận Gò Vấp",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "13.86",
      img: Quan1Img,
    },
    {
      stt: 13,
      title: "Quận Phú Nhuận",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "13.67",
      img: Quan10Img,
    },
    {
      stt: 14,
      title: "Quận Tân Bình",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "13.22",
      img: Quan3Img,
    },
    {
      stt: 15,
      title: "Quận Tân Phú",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "13.84",
      img: Quan1Img,
    },
    {
      stt: 16,
      title: "Quận Bình Tân",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "13.42",
      img: Quan3Img,
    },
    {
      stt: 17,
      title: "Thành phố Thủ Đức",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "13.21",
      img: ThuDucImg,
    },
    {
      stt: 18,
      title: "Huyện Nhà Bè",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "12.95",
      img: Quan7Img,
    },
    {
      stt: 19,
      title: "Huyện Hóc Môn",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "12.69",
      img: Quan4Img,
    },
    {
      stt: 20,
      title: "Huyện Bình Chánh",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "12.56",
      img: BinhChanhImg,
    },
    {
      stt: 21,
      title: "Huyện Củ Chi ",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "11.78",
      img: Quan7Img,
    },
    {
      stt: 22,
      title: "Huyện Cần Giờ ",
      description: "Thành phố Hồ Chí Minh - Việt Nam",
      percent: "11.13",
      img: Quan4Img,
    },
  ];

  useEffect(() => {
    setLoading(dispatch, false);
    const data = getLocalUserInfo();
    if (data?.passwordResetRequired) setOpenChangePassword(true);

    const dataChart = {
      chart: {
        ...BarChartData.chart,
        labels: sampleData.map((data) => data.title),
        datasets: [{ data: sampleData.map((data) => data.percent), color: "#F8ADAD" }],
      },
    };
    setBarChartData(dataChart);
  }, []);

  const changePasswordPopUp = () => {
    return (
      <PopupRoot
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "transparent",
        }}
        open={isOpenChangePassword}
        setOpen={setOpenChangePassword}
        onClose={true}
        disableBackDropClick={true}
      >
        <ChangePasswordPopUp
          close={() => setOpenChangePassword(false)}
          onPopUp={isOpenChangePassword}
          ButtonCancel={false}
          FirstLogin={true}
        />
      </PopupRoot>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {changePasswordPopUp()}
      <Grid container item display="flex" justifyContent="space-between">
        <PermissionWrapped listCodeComponent={["HOME_PAGE", "HOME_PAGE", "HOME_PAGE_TOP_ECONOMIC"]}>
          <Grid item xs={7.9} p={2} className="card-content">
            <TopEconomicDashboard />
          </Grid>
        </PermissionWrapped>

        <PermissionWrapped
          listCodeComponent={["HOME_PAGE", "HOME_PAGE", "HOME_PAGE_ECONOMIC_LIST"]}
        >
          <Grid item xs={4} p={2} className="card-content">
            <RankEconomicList />
          </Grid>
        </PermissionWrapped>

        <PermissionWrapped
          listCodeComponent={["HOME_PAGE", "HOME_PAGE", "HOME_PAGE_CHART_ECONOMIC"]}
        >
          <Grid item xs={12} p={2} mt={2} className="card-content">
            <ChartDashboard BarChartData={BarChartData} />
          </Grid>
        </PermissionWrapped>
      </Grid>
    </DashboardLayout>
  );
}

export default HomePage;
