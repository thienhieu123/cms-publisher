/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import "./index.css";
import zIndex from "@mui/material/styles/zIndex";

function PopupRoot(props) {
  const {
    children,
    open,
    setOpen,
    title,
    closeIcon,
    classNames,
    callbackFn,
    disableBackDropClick,
  } = props;
  const handleClose = (event, reason) => {
    if (disableBackDropClick && reason === "backdropClick") return;
    setOpen(false);
    if (callbackFn) callbackFn();
  };

  const styleCloseIcon = {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    cursor: "pointer",
    padding: "5px",
    zIndex: "2",
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={`popup ${classNames}`}>
        <div style={styleCloseIcon}>
          {closeIcon && <CloseIcon className="close" onClick={handleClose} />}
        </div>
        <div className="content">
          <div className="text-header">{title}</div>
          {children}
        </div>
      </div>
    </Modal>
  );
}

PopupRoot.defaultProps = {
  classNames: "",
  callbackFn: () => {},
  title: "",
  closeIcon: false,
};

PopupRoot.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  callbackFn: PropTypes.func,
  closeIcon: PropTypes.bool,
  classNames: PropTypes.string,
};

export default PopupRoot;
