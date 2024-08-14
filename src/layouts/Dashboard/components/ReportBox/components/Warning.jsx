/* eslint-disable react/prop-types */
import { Card } from "@mui/material";
import SuiButton from "~/components/SuiButton";
import SuiTypography from "~/components/SuiTypography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// import PdfIcon from "~/assets/images/icons/pdf.svg";
import WarningYellow from "~/assets/images/icons/WarningYellow.svg";
// import Input from "~/components/Input";
import TextArea from "~/components/TextArea";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
// import CloseIcon from "@mui/icons-material/Close";

function WarningDetail({ close }) {
  return (
    <Card
      sx={{
        minWidth: "417px",
        borderRadius: "8px",
        background: "transparent !important",
        display: "flex",
        alignItems: "center",
        padding: "14px 16px 21px 16px",
        rowGap: "14px",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={close}
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <img src={WarningYellow} alt="warning" style={{ marginTop: "10px" }} />
      <SuiTypography
        variant="h5"
        fontSize="20px"
        color="black"
        sx={{ fontWeight: "600", color: "#54595E", textTransform: "none" }}
      >
        Cảnh báo tỷ trọng gia tăng kinh tế số
      </SuiTypography>
      <TextArea
        label="Nội dung"
        placeholder="Nội dung"
        value="Giá trị tăng 0,15
        Xếp hạng tăng 1 bậc so với năm 2022
        Điểm quy mô tăng 0,18, giữ nguyên xếp hạng so với cùng kỳ năm 2022"
        disabled={true}
      />
      <FormControlLabel
        control={<Checkbox defaultChecked />}
        label="Đừng hiển thị cảnh báo nữa"
        sx={{ "& .MuiFormControlLabel-label": { fontWeight: "400", color: "#44494D" } }}
      />
      <SuiButton
        color="var(--red-200)"
        circular
        onClick={close}
        sx={{
          border: "1px solid var(--red-200)",
          borderRadius: "5px",
          padding: "9px 14px",
          width: "fit-content",
        }}
      >
        <CloseIcon style={{ marginRight: "4px" }} />
        <SuiTypography
          whiteSpace="nowrap"
          color="white"
          fontSize="14px"
          sx={{
            fontWeight: "600",
          }}
        >
          Đóng
        </SuiTypography>
      </SuiButton>
    </Card>
  );
}

export default WarningDetail;
