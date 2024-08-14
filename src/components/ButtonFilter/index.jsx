import SuiButton from "~/components/SuiButton";
import SuiTypography from "~/components/SuiTypography";
import PropTypes from "prop-types";

export default function ButtonFilter({ onClear, onSearch }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "9px" }}>
      <SuiButton
        size="small"
        color="white"
        circular
        sx={{
          border: "1px solid var(--red-200)",
          borderRadius: "5px",
          padding: "8px 24px",
          background: "initial",
          marginRight: "15px",
        }}
        onClick={onClear}
      >
        <SuiTypography
          whiteSpace="nowrap"
          variant="body2"
          color="var(--red-200)"
          fontSize="14px"
          sx={{
            textTransform: "none",
            fontWeight: "700",
          }}
        >
          Xóa bộ lọc
        </SuiTypography>
      </SuiButton>
      <SuiButton
        size="small"
        color="var(--red-200)"
        circular
        sx={{
          background: "var(--red-200)",
          borderRadius: "5px",
          padding: "9px 24px",
        }}
        onClick={onSearch}
      >
        <SuiTypography
          whiteSpace="nowrap"
          variant="body2"
          color="white"
          fontSize="14px"
          sx={{
            textTransform: "none",
            fontWeight: "700",
          }}
        >
          Áp dụng
        </SuiTypography>
      </SuiButton>
    </div>
  );
}

ButtonFilter.defaultProps = {
  onClear: () => {},
  onSearch: () => {},
};

ButtonFilter.propTypes = {
  onClear: PropTypes.func,
  onSearch: PropTypes.func,
};
