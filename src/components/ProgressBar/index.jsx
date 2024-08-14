import { Grid } from "@mui/material";

export default function ProgressBar({
  percentage,
  color,
  fontSize,
  widthBar = "180px",
  heightBar = "10px",
}) {
  return (
    <Grid container width="100%" display="flex" alignItems="center" p="2px">
      <Grid item xs={9}>
        <div
          style={{
            height: heightBar,
            borderRadius: "1.5rem",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#d9d9d9",
            width: widthBar,
          }}
        >
          <div
            style={{
              height: heightBar,
              borderRadius: "1.5rem",
              width: `${percentage}%`,
              backgroundColor: color ? color : "#F10035",
            }}
          ></div>
        </div>
      </Grid>
      <Grid item xs={3} width="fit-content" pl={2} fontSize={fontSize}>
        {percentage}%
      </Grid>
    </Grid>
  );
}
