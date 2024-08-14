import SuiBox from "~/components/SuiBox";

function BackButton() {
  return (
    <SuiBox
      sx={{
        width: "6rem",
        height: "100%",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Về trước
    </SuiBox>
  );
}

export default BackButton;
