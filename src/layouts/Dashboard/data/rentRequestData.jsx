import { IconButton, Tooltip } from "@mui/material";
import SuiBox from "~/components/SuiBox";
import EyeIcon from "~/assets/images/icons/blue-eye.svg";

const RentRequest = new Array(5)
  .fill(0)
  .map((item, index) => ({
    "Mã yêu cầu": "#".concat(index + 1),
    "Khách hàng": "Công ty xxx",
    "Số Điện Thoại": "0xxxxxxxxxx",
    "Danh sách thiết bị": "Danh sách thiết bị ".concat(index + 1),
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

export default RentRequest;
