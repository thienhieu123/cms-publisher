import PropTypes from "prop-types";

import SuiButton from "~/components/SuiButton";
import SuiTypography from "~/components/SuiTypography";
import Icon from "@mui/material/Icon";

function SeeMore({ text }) {
  return (
    <SuiButton
      variant="text"
      color="info"
      display="flex"
      justifycontent="space-between"
      sx={{ padding: "0" }}
    >
      <SuiTypography
        variant="text"
        color="info"
        fontWeight="light"
        fontSize="small"
        sx={{
          mt: "auto",
          mr: "auto",
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",

          "& .material-icons-round": {
            fontSize: "1.125rem",
            transform: `translate(2px, -0.5px)`,
            transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
          },

          "&:hover .material-icons-round, &:focus  .material-icons-round": {
            transform: `translate(3px, 0px)`,
          },
        }}
      >
        {text}
        <Icon sx={{ fontWeight: "bold" }}>keyboard_arrow_right</Icon>
      </SuiTypography>
    </SuiButton>
  );
}

SeeMore.propTypes = {
  text: PropTypes.string.isRequired,
};

export default SeeMore;
