import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getDashboardIncreaseList } from "~/api/common";
import SuiBox from "~/components/SuiBox";
import useErrorMessage from "~/hooks/useErrorMessage";
import { handleResponse } from "~/utils/utils";

export default function RankEconomicList({}) {
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

  return (
    <>
      <Grid item xs={12} display="flex" justifyContent="space-between">
        <Grid item xs={9}>
          <Typography fontSize={24} fontWeight={600} color="#2D3442">
            Giá trị tăng thêm kinh tế số
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
      <Grid item xs={12} mt="8px">
        <Typography fontSize={14} fontWeight={600} color="#F10035">
          Xếp hạng tỉ trọng giá trị tăng thêm kinh tế số theo các quận huyện
        </Typography>
      </Grid>
      <SuiBox mt={1} sx={{ maxHeight: "250px", overflow: "auto" }}>
        {data.map((item, idx) => (
          <Grid
            item
            xs={12}
            display="flex"
            alignItems="center"
            p={1}
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: `#FFF0EE`,
                borderRadius: "10px",
              },
            }}
            key={idx}
          >
            <Grid item xs={1}>
              <Typography fontSize={18} fontWeight={600}>
                {idx + 1}
              </Typography>
            </Grid>
            <Grid item xs={9} display="flex" alignItems="center">
              <SuiBox
                component="img"
                src={`http://10.60.158.63${item?.img}`}
                sx={{
                  height: "50px",
                  width: "50px",
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
                alt="image"
                mr={1}
              />
              <Grid>
                <Typography fontSize={18} fontWeight={600}>
                  {item.district}
                </Typography>
                <Typography fontSize={13} fontWeight={400}>
                  {item.province}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Typography fontSize={18} fontWeight={600} color="#006C07">
                {item.increase_percent}%
              </Typography>
            </Grid>
          </Grid>
        ))}
      </SuiBox>
    </>
  );
}
