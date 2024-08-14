import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getDashboardIncreaseList } from "~/api/common";
import SuiBox from "~/components/SuiBox";
import useErrorMessage from "~/hooks/useErrorMessage";
import { handleResponse } from "~/utils/utils";

export default function TopEconomicDashboard({}) {
  const [time, setTime] = useState("YEAR");
  const [data, setData] = useState([]);
  const setErrorMessage = useErrorMessage();

  const fetchData = async () => {
    try {
      const response = await getDashboardIncreaseList({ indexCode: time });
      const [status, dataResponse] = handleResponse(response);
      if (status) {
        setData(dataResponse);
      }
    } catch (err) {
      setErrorMessage(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [time]);
  const [top1, top2, top3] = data;
  return (
    <>
      <Grid item xs={12} display="flex" justifyContent="space-between">
        <Grid item xs={10}>
          <Typography fontSize={24} fontWeight={600} color="#2D3442">
            Top quận/huyện về giá trị tăng thêm kinh tế số
          </Typography>
        </Grid>
        <Grid item>
          <Select value={time} onChange={(event) => setTime(event.target.value)}>
            <MenuItem value="MONTH">Tháng này</MenuItem>
            <MenuItem value="QUARTER">Qúy này</MenuItem>
            <MenuItem value="YEAR">Năm này</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={12} xl={12} display="flex" justifyContent="center" mt={1}>
        <SuiBox sx={{ border: "1px solid #F10035", width: "100%" }} />
      </Grid>
      <Grid item xs={12} display="flex" mt={2}>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center" mt={8}>
          <SuiBox
            component="img"
            src={`http://10.60.158.63${top2?.img}`}
            sx={{
              height: "150px",
              width: "150px",
              borderRadius: "50%",
              border: "2px solid #F10035",
              objectFit: "cover",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
            }}
            alt="top2Img"
          />
          <Typography fontSize={18} fontWeight={600} color="#2D3442">
            {top2?.district}
          </Typography>
          <Typography fontSize={18} fontWeight={600} color="#006C07">
            {top2?.increase_percent}%
          </Typography>
        </Grid>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
          <SuiBox
            component="img"
            src={`http://10.60.158.63${top1?.img}`}
            sx={{
              height: "200px",
              width: "200px",
              borderRadius: "50%",
              border: "2px solid #F10035",
              objectFit: "cover",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
            }}
            alt="top1Img"
          />
          <Typography fontSize={18} fontWeight={600} color="#2D3442">
            {top1?.district}
          </Typography>
          <Typography fontSize={18} fontWeight={600} color="#006C07">
            {top1?.increase_percent}%
          </Typography>
        </Grid>
        <Grid item xs={4} display="flex" flexDirection="column" alignItems="center" mt={15}>
          <SuiBox
            component="img"
            src={`http://10.60.158.63${top3?.img}`}
            sx={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
              border: "2px solid #F10035",
              objectFit: "cover",
              backgroundRepeat: "no-repeat",
              cursor: "pointer",
            }}
            alt="top3Img"
          />
          <Typography fontSize={18} fontWeight={600} color="#2D3442">
            {top3?.district}
          </Typography>
          <Typography fontSize={18} fontWeight={600} color="#006C07">
            {top3?.increase_percent}%
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
