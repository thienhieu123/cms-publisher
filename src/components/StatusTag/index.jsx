/* eslint-disable dot-notation */
import PropTypes from "prop-types";

function StatusTag({ text, color }) {
  const statusTagStyles = {
    purple: {
      color: "#8950FC",
      background: "#EEE5FF",
    },
    blue: {
      color: "#00B6DE",
      background: "#ECF8FF",
    },
    yellow: {
      color: "#FFC000",
      background: "#FFFCF0",
    },
    green: {
      color: "#357B4C",
      background: "#E7FBED",
    },
    red: {
      color: "#FF3C3C",
      background: "#FFF5F8",
    },
    gray: {
      color: "#3F4254",
      background: "#E1E3E9",
    },
    darkBlue: {
      color: "#0C22EA",
      background: "#DADDFB",
    },
  };
  return (
    <div
      style={{
        color: statusTagStyles[color]?.color,
        background: statusTagStyles[color]?.background,
        padding: "3px 6px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        borderRadius: "6px",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "18px",
        textTransform: "none",
        width: "fit-content",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          gap: "10px",
          background: statusTagStyles[color]?.color,
        }}
      />
      <p style={{ padding: 0 }}>{text}</p>
    </div>
  );
}

export default StatusTag;

StatusTag.defaultProps = { color: "green" };

StatusTag.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    "purple",
    "blue",
    "yellow",
    "green",
    "red",
    "black",
    "darkBlue",
    "gray",
    "transparent",
  ]),
};
