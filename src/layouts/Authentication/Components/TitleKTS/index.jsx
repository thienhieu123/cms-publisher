import { Typography } from "@mui/material";

const styleTitle = {
  fontSize: "32px",
  textAlign: "center",
  fontWeight: "700",
  color: "var(--red-200)",
  whiteSpace: "nowrap",
  "@media only screen and (max-height: 850px)": {
    fontSize: "24px",
  },
};
function TitleKTS() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      <Typography sx={styleTitle}>Nền tảng đo lường kinh tế số</Typography>
      <Typography sx={styleTitle}>thành phố Hồ Chí Minh</Typography>
    </div>
  );
}

export default TitleKTS;
