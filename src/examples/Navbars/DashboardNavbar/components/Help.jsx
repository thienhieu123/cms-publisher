/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
// import PropTypes from "prop-types";
import { Card } from "@mui/material";
import SuiButton from "~/components/SuiButton";
import SuiTypography from "~/components/SuiTypography";
import PdfIcon from "~/assets/images/icons/pdf.svg";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { handleDownload } from "~/utils/utils";

const ListItem = [
  {
    title: "Tài liệu HDSD vai trò Phê duyệt dữ liệu",
    linkDownload:
      "https://kinhteso.gpmn.net:9201/api/v1/file-storage/serve-default?fileName=instructions%2Fdata_approvement.pdf",
    name: "data_approvement.pdf",
  },
  {
    title: "Tài liệu HDSD vai trò Xem dữ liệu",
    linkDownload:
      "https://kinhteso.gpmn.net:9201/api/v1/file-storage/serve-default?fileName=instructions%2Fdata_view.pdf",
    name: "data_view.pdf",
  },
  {
    title: "Tài liệu HDSD vai trò Cập nhật dữ liệu",
    linkDownload:
      "https://kinhteso.gpmn.net:9201/api/v1/file-storage/serve-default?fileName=instructions%2Fdata_update.pdf",
    name: "data_update.pdf",
  },
  {
    title: "Tài liệu HDSD vai trò Admin",
    linkDownload:
      "https://kinhteso.gpmn.net:9201/api/v1/file-storage/serve-default?fileName=instructions%2Fsystem_management.pdf",
    name: "system_management.pdf",
  },
];

function ItemDowloads(props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF0EE",
        padding: "4px 8px",
        borderRadius: "4px",
        minWidth: "370px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={PdfIcon} alt="icon" style={{ marginRight: "8px" }} />
        <p style={{ fontSize: "14px", fontWeight: "400" }}>{props.title}</p>
      </div>

      <div
        style={{ cursor: "pointer" }}
        onClick={() => handleDownload(props.linkDownload, props.name)}
      >
        <SaveAltIcon sx={{ marginLeft: "auto", color: "#C21500", fontWeight: "light" }} />
      </div>
    </div>
  );
}

function Help({ close }) {
  const onCancel = () => {
    close();
  };
  return (
    <Card
      sx={{
        // maxWidth: "417px",
        borderRadius: "8px",
        background: "transparent !important",
        display: "flex",
        alignItems: "center",
        padding: "14px 16px 21px 16px",
        rowGap: "20px",
      }}
    >
      <SuiTypography
        variant="h5"
        fontSize="20px"
        color="black"
        sx={{ fontWeight: "600", color: "#54595E", textTransform: "none" }}
      >
        Trợ giúp
      </SuiTypography>
      <div style={{ display: "flex", flexDirection: "column", rowGap: "20px" }}>
        {ListItem.map((item, index) => (
          <ItemDowloads
            title={item.title}
            linkDownload={item.linkDownload}
            name={item.name}
            key={index}
          />
        ))}
      </div>
      <SuiButton
        color="var(--red-200)"
        circular
        onClick={onCancel}
        sx={{
          border: "1px solid var(--red-200)",
          borderRadius: "5px",
          padding: "9px 14px",
          width: "fit-content",
        }}
      >
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
// Help.propTypes = {
//   close: PropTypes.func.isRequired,
// };
export default Help;
