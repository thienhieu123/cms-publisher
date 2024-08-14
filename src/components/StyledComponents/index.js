import { styled } from "@mui/material/styles";

export const Fieldset = styled("fieldset")({
  display: "flex",
  textAlign: "left",
  gap: "12px",
  padding: "0px 12px",
  borderRadius: "8px",
  border: "",
  color: "#B5B5C3",
  "&:focus-within": {
    borderColor: "",
    "& legend": {
      color: "#35d1f5",
    },
  },
});

export const Legend = styled("legend")({
  fontSize: "12px",
  padding: "0 4px",
});
