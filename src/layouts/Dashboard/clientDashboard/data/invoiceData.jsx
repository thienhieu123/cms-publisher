import { IconButton, Tooltip } from "@mui/material";
import SuiBox from "~/components/SuiBox";
import EyeIcon from "~/assets/images/icons/blue-eye.svg";

const invoiceData = new Array(6)
  .fill(0)
  .map((item, index) => ({
    "Mã hóa đơn": "#".concat(index + 1),
    "Kỳ hóa đơn": "Tháng 1/2022 (01/01 - 31/01)",
    "Số tiền cần thanh toán": "3.200.000",
    "số hợp đồng": "#".concat(index + 1),
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

export default invoiceData;
