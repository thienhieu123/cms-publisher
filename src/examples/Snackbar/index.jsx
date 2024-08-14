import * as React from "react";
import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Slide from "@mui/material/Slide";

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

function DirectionSnackbar({ title, message, action, color, open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={5000}
        TransitionComponent={TransitionLeft}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={color} sx={{ width: "100%" }}>
          <AlertTitle>{title}</AlertTitle>
          {message} - <strong>{action}</strong>
        </Alert>
      </Snackbar>
    </div>
  );
}

DirectionSnackbar.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default DirectionSnackbar;
