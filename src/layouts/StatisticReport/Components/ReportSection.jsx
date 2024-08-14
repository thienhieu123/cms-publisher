import { Grid, Tooltip, Typography } from "@mui/material";
import SuiBox from "~/components/SuiBox";
import WordIcon from "~/assets/images/icons/Word.svg";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";

export default function ReportSection({ title = "", thumbnailImgUrl = "", createdDate, id }) {
  const navigate = useNavigate();
  return (
    <Grid
      container
      className="hover-child"
      sx={{
        background: "#fff",
        borderRadius: "3%",
        boxShadow: "0px 4px 4px 0px #00000040",
        padding: "10px",
        cursor: "pointer",
        height: "200px",
      }}
      onClick={() => {
        navigate(`/statistic-report/detail/${id}`);
      }}
      p={1}
    >
      <Grid item xs={12} lg={12} display="flex" justifyContent="center" sx={{ height: "150px" }}>
        <SuiBox
          component="img"
          alt="imageReport"
          src={thumbnailImgUrl || WordIcon}
          sx={{ objectFit: "cover", backgroundRepeat: "no-repeat" }}
        />
      </Grid>
      <Grid item xs={12} lg={12} display="flex" justifyContent="space-between" mt={1}>
        <Tooltip title={title}>
          <Typography fontSize="15px" fontWeight={700} color="#2d3442" className="tooltip-content">
            {title}
          </Typography>
        </Tooltip>
        <Typography
          fontSize="15px"
          color="#2d3442"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          Ngày tạo: {moment(createdDate).format("DD/MM/YYYY")}
        </Typography>
      </Grid>
    </Grid>
  );
}
