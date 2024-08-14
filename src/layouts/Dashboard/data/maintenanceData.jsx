import { IconButton, Tooltip } from "@mui/material";
import SuiBox from "~/components/SuiBox";
import EyeIcon from "~/assets/images/icons/blue-eye.svg";

const dsBaoTri = new Array(5)
  .fill(0)
  .map((item, index) => ({
    "Mã thiết bị": "#".concat(index + 1),
    "Dự kiến bảo trì": "22/2/2022",
    "Nội dung": "Bảo trì định kì 6 tháng/ lần",
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

export default dsBaoTri;
