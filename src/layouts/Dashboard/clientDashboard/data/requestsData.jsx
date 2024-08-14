import { IconButton, Tooltip } from "@mui/material";
import SuiBox from "~/components/SuiBox";
import EyeIcon from "~/assets/images/icons/blue-eye.svg";

const requestsData = new Array(5)
  .fill(0)
  .map((item, index) => ({
    "Mã yêu cầu": "#".concat(index + 1),
    "Địa điểm": "285 Lạc Long Quân, P.12, Quận 10",
    Ngày: "22/2/2022",
    "Loại yêu cầu": ["Thuê Mới", "Sửa Chữa", "Di Chuyển"][Math.floor(Math.random() * 3)],
    "Xử lý": "chi tiết",
  }))
  .map((item) => {
    const res = {
      ...item,
    };
    res["Xử lý"] = (
      <Tooltip title="Xem chi tiết" ishiddentooltip="true">
        <IconButton aria-label="toggle password visibility">
          <SuiBox component="img" src={EyeIcon} alt="View Icon" />
        </IconButton>
      </Tooltip>
    );
    return res;
  });

export default requestsData;
