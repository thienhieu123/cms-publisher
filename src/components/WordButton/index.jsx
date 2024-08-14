import WordIcon from "~/assets/images/icons/Word.svg";
import SuiButton from "~/components/SuiButton";

function WordButton() {
  return (
    <SuiButton
      size="small"
      color="white"
      circular
      sx={{
        border: "1px solid #0965BA",
        borderRadius: "5px",
        padding: "8px 24px",
        background: "initial",
      }}
    >
      <img src={WordIcon} alt="ExcelIcon" style={{ marginRight: "10px" }} />
      <p style={{ fontSize: "14px", fontWeight: "700", color: "#0965BA" }}>Word</p>
    </SuiButton>
  );
}

export default WordButton;
