import ExcelIcon from "~/assets/images/icons/Excel.svg";
import SuiButton from "~/components/SuiButton";

function ExcelButton(props) {
  const { onClick } = props;
  return (
    <SuiButton
      size="small"
      color="white"
      circular
      sx={{
        border: "1px solid #00960A",
        borderRadius: "5px",
        padding: "8px 24px",
        background: "initial",
      }}
      onClick={onClick}
    >
      <img src={ExcelIcon} alt="ExcelIcon" style={{ marginRight: "10px" }} />
      <p style={{ fontSize: "14px", fontWeight: "700", color: "#00960A" }}>Excel</p>
    </SuiButton>
  );
}

export default ExcelButton;
