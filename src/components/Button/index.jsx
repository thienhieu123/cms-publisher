import LockIcon from "~/assets/images/icons/red-lock.svg";
import UnLockIcon from "~/assets/images/icons/black-unlock.svg";
import DeleteIcon from "~/assets/images/icons/red-trash-bin.svg";
import EyeIcon from "~/assets/images/icons/blue-eye.svg";
// import BlackEditIcon from "~/assets/images/icons/black-edit.svg";
import EditIcon from "~/assets/images/icons/edit-icon.svg";
import SettingIcon from "~/assets/images/icons/setting.svg";

import { IconButton, Tooltip } from "@mui/material";
import SuiBox from "../SuiBox";

export function LocknUnLockIconButton({ status, handleClick, hidden = false }) {
  return (
    <IconButton sx={{ display: hidden ? "none" : "" }}>
      <Tooltip title={status === "INACTIVATED" ? "Mở khóa" : "Khóa"} placement="top">
        <SuiBox
          component="img"
          src={status === "INACTIVATED" ? LockIcon : UnLockIcon}
          onClick={() => {
            handleClick(status);
          }}
          alt="Khóa"
        />
      </Tooltip>
    </IconButton>
  );
}

export function DeleteIconButton({ onClick, hidden = false }) {
  return (
    <IconButton sx={{ display: hidden ? "none" : "" }}>
      <Tooltip title="Xóa" placement="top">
        <SuiBox component="img" src={DeleteIcon} alt="DeleteIcon" onClick={onClick} />
      </Tooltip>
    </IconButton>
  );
}

export function ViewDetailIconButton({ onClick, hidden = false }) {
  return (
    <IconButton sx={{ display: hidden ? "none" : "" }}>
      <Tooltip title="Xem chi tiết" placement="top">
        <SuiBox component="img" src={EyeIcon} alt="EyeIcon" onClick={onClick} />
      </Tooltip>
    </IconButton>
  );
}

export function EditIconButton({ onClick, hidden = false }) {
  return (
    <IconButton sx={{ display: hidden ? "none" : "" }}>
      <Tooltip title="Chỉnh sửa" placement="top">
        <SuiBox component="img" src={EditIcon} alt="EyeIcon" onClick={onClick} />
      </Tooltip>
    </IconButton>
  );
}

export function SettingIconButton({ onClick, hidden = false }) {
  return (
    <IconButton sx={{ display: hidden ? "none" : "" }}>
      <Tooltip title="Chỉnh sửa" placement="top">
        <SuiBox component="img" src={SettingIcon} alt="EyeIcon" onClick={onClick} />
      </Tooltip>
    </IconButton>
  );
}
