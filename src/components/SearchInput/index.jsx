import { Grid } from "@mui/material";
import FilterIcon from "~/assets/images/icons/Filter.svg";
import IconSearch from "~/assets/images/IconSearch.svg";
import FilterClosed from "~/assets/images/icons/FilterClosed.svg";
import PropTypes from "prop-types";
import SuiBox from "../SuiBox";
import Input from "~/components/Input";
import SuiButton from "../SuiButton";

export default function SearchInput({
  isOpenFilter,
  setIsOpenFilter,
  searchText,
  onChange,
  submit,
  placeholder,
}) {
  return (
    <Grid item xs={12} sm={12} lg={12} display="flex" alignItems="center" gap={2}>
      <SuiBox
        component="img"
        src={isOpenFilter ? FilterIcon : FilterClosed}
        alt="Filter"
        width="23px"
        height="20px"
        onClick={() => setIsOpenFilter(!isOpenFilter)}
        sx={{ cursor: "pointer" }}
      />
      <Input placeholder={placeholder} value={searchText} onChange={onChange} />
      <SuiButton
        sx={{
          maxHeight: "40px",
          maxWidth: "47px",
          background: "var(--red-200)",
          "&:hover": { background: "var(--red-200)" },
        }}
        onClick={submit}
      >
        <SuiBox component="img" src={IconSearch} alt="IconSearch" width="20px" height="20px" />
      </SuiButton>
    </Grid>
  );
}

SearchInput.defaultProps = {
  isOpenFilter: true,
  searchText: "",
  placeholder: "",
  setIsOpenFilter: () => {},
  onChange: () => {},
  submit: () => {},
};

SearchInput.propTypes = {
  isOpenFilter: PropTypes.bool,
  searchText: PropTypes.string,
  placeholder: PropTypes.string,
  setIsOpenFilter: PropTypes.func,
  onChange: PropTypes.func,
  submit: PropTypes.func,
};
