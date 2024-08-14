import PdfIcon from "~/assets/images/icons/pdf.svg";
import SuiButton from "~/components/SuiButton";

function PdfButton() {
  return (
    <SuiButton
      size="small"
      color="white"
      circular
      sx={{
        border: "1px solid #F10035",
        borderRadius: "5px",
        padding: "8px 24px",
        background: "initial",
      }}
    >
      <img
        src={PdfIcon}
        alt="ExcelIcon"
        style={{ marginRight: "10px", width: "20px", height: "20px" }}
      />
      <p style={{ fontSize: "14px", fontWeight: "700", color: "#F10035" }}>Pdf</p>
    </SuiButton>
  );
}

export default PdfButton;
