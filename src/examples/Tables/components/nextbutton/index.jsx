import SuiBox from "~/components/SuiBox";

function NextButton() {
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
      Tiếp theo
    </SuiBox>
  );
}

export default NextButton;
