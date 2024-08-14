// import Snackbar from "~/examples/Snackbar";
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import SuiButton from "~/components/SuiButton";
import { useEffect, useState } from "react";

import PropTypes from "prop-types";
import Input from "~/components/Input";
import SelectBox from "~/components/SelectBox";
import DateRangePicker from "~/components/DateRangePicker";
import Filter from "~/assets/images/icons/Filter.svg";
import FilterClosed from "~/assets/images/icons/FilterClosed.svg";
import IconSearch from "~/assets/images/IconSearch.svg";
import { getListProvince, getListDistrict, getListWard } from "~/api/common";
// import { convertDateFormat, formatDateSearch } from "~/utils/utils";
import { formatDateSearch } from "~/utils/utils";
import DatePicker from "~/components/DatePicker";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";

// const defaultAddressValue = {
//   label: "Tất cả",
//   value: "",
//   item: {},
// };

// ************* Search Filter:
// hasSearch,
// hasDate, (dateRangeLabel[])
// hasAddress,
// options,
// status,
// secondlyOptions
// thirdlyOptions

function Search({
  placeholder,
  dateRangeLabel,
  options,
  optionlabel,
  status,
  statusLabel,
  // rest,
  handleSearch,
  hasDate,
  hasSearch,
  maxLength,
  alert,
  hasAddress,
  secondlyOptions, // additional filter
  secondlyOptionLabel,
  thirdlyOptions, // additional filter
  thirdlyOptionLabel,
  isOptionFilterRevert, // change option, status place
  isAddressRevert, // change address place
  hasDatePicker,
  isCloseFilter,
}) {
  const [formData, setFormData] = useState({
    searchValue: "",
    province: "",
    district: "",
    ward: "",
    filterOption: null,
    statusOption: null,
    secondlyFilterOption: null,
    thirdlyFilterOption: thirdlyOptions.length > 0 ? thirdlyOptions[0] : undefined,
    dateData: dateRangeLabel.map((dateLabel) => ({ label: dateLabel, from: null, to: null })),
    datePickerValue: null,
  });

  const [isOpenFilter, setIsOpenFilter] = useState(true);

  const [listProvince, setListProvince] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [provinceSelected, setProvinceSelected] = useState();
  const [districteSelected, setDistrictSelected] = useState();
  // const [wardSelected, setWardSelected] = useState();

  const [isMobile, setIsMobile] = useState(false);
  const [datePickerPlacement, setDatePickerPlacement] = useState("bottomEnd");
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else setIsMobile(false);

    if (window.innerWidth < 1600) {
      setDatePickerPlacement("bottomStart");
    } else setDatePickerPlacement("bottomEnd");
  }, [isMobile, window.innerWidth]);

  function formatList(list) {
    // return list.map((item) => {
    //   const result = item.name;
    //   // const listRemove = ["Tỉnh ", "Thành phố ", "Thị xã ", "Quận ", "Huyện ", "Phường ", "Xã "];
    //   /*eslint-disable array-callback-return */
    //   // listRemove.map((element) => {
    //   //   result = result.replace(element, "");
    //   // });
    //   /*eslint-disable object-shorthand */
    //   return {
    //     value: result,
    //     label: result,
    //     item: item,
    //   };
    // });
    return list;
  }

  useEffect(() => {
    getListProvince().then((result) => {
      if (result.success) {
        const list = formatList(result.message.data);
        // const provinceList = [defaultAddressValue].concat(list);
        setListProvince(list);
      }
    });
  }, []);

  useEffect(() => {
    if (isCloseFilter) {
      setIsOpenFilter(false);
    }
  }, [isCloseFilter]);

  useEffect(() => {
    if (listProvince.length > 0) {
      const provinceIndex = listProvince.findIndex((item) => item.value === formData.province);
      if (provinceIndex > -1) {
        if (listProvince[provinceIndex].value === "") {
          setFormData({ ...formData, province: "", district: "", ward: "" });
          setProvinceSelected();
          setDistrictSelected();
          // setWardSelected();
          setListDistrict([]);
          setListWard([]);
        } else {
          setProvinceSelected(listProvince[provinceIndex]);
          getListDistrict(listProvince[provinceIndex].item.code).then((result) => {
            if (result.success) {
              const list = formatList(result.message.data.district);
              //   const districtList = [defaultAddressValue].concat(list);
              setListDistrict(list);
              if (provinceSelected) {
                setFormData({ ...formData, district: "", ward: "" });
                setDistrictSelected();
                // setWardSelected();s
              }
            }
          });
        }
      }
    }
  }, [formData.province, listProvince]);

  useEffect(() => {
    if (listDistrict.length > 0) {
      const districtIndex = listDistrict.findIndex((item) => item.value === formData.district);
      if (districtIndex > -1) {
        if (listProvince[districtIndex].value === "") {
          setFormData({ ...formData, ward: "" });
          setDistrictSelected();
          // setWardSelected();
          setListWard([]);
        } else {
          setDistrictSelected(listDistrict[districtIndex]);
          getListWard(listDistrict[districtIndex].item.code).then((result) => {
            if (result.success) {
              const list = formatList(result.message.data.wards);
              //   const wardList = [defaultAddressValue].concat(list);
              setListWard(list);
              if (districteSelected) {
                setFormData({ ...formData, ward: "" });
                // setWardSelected();
              }
            }
          });
        }
      }
    }
  }, [formData.district, listDistrict]);

  useEffect(() => {
    if (listWard.length > 0 && formData.ward) {
      // const wardIndex = listWard.findIndex((item) => item.value === formData.ward);
      // if (wardIndex > -1) setWardSelected(listWard[wardIndex]);
    }
  }, [formData.ward, listWard]);

  const handleFilter = () => {
    if (formData.searchValue.length <= maxLength) {
      const temp = {
        ...formData,
        filterOption: formData.filterOption ? formData.filterOption : options[0],
        statusOption: formData.statusOption ? formData.statusOption : status[0],
        thirdlyFilterOption: formData.thirdlyOptions ? formData.thirdlyOptions : thirdlyOptions[0],
        // secondlyFilterOption: formData.secondlyOptions
        //   ? formData.secondlyOptions
        //   : secondlyOptions[0],
        searchValue: formData.searchValue.trim(),
      };
      handleSearch(temp);
    } else {
      alert(`Mã khách hàng, họ tên hoặc số điện thoại dài quá ${maxLength} ký tự`);
    }
  };

  useEnterKeyEvent([formData], handleFilter);

  const OnDeleteFilter = () => {
    setFormData({
      searchValue: "",
      province: "",
      district: "",
      ward: "",
      filterOption: options.length > 0 ? options[0] : undefined,
      statusOption: status.length > 0 ? status[0] : undefined,
      secondlyFilterOption: secondlyOptions.length > 0 ? secondlyOptions[0] : undefined,
      thirdlyFilterOption: thirdlyOptions.length > 0 ? thirdlyOptions[0] : undefined,
      dateData: dateRangeLabel.map((dateLabel) => ({ label: dateLabel, from: null, to: null })),
      datePickerValue: null,
    });

    setListDistrict([]);
    setListWard([]);
    setProvinceSelected();
    setDistrictSelected();
    // setWardSelected();
  };

  const SearchBar = (
    <SuiBox
      //   paddingRight="16px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={({ breakpoints }) => ({
        [breakpoints.down("md")]: {
          flexDirection: "column",
          alignItems: "flex-start",
        },
      })}
    >
      {hasSearch && (
        <SuiBox
          py={1}
          display="flex"
          alignItems="center"
          gap="6px"
          sx={{
            width: "100%",
          }}
        >
          <Input
            placeholder={placeholder}
            value={formData.searchValue}
            onChange={(e) => setFormData({ ...formData, searchValue: e.target.value })}
            sx={({ breakpoints }) => ({
              height: "44px",
              minWidth: "370px",
              background: "white",
              [breakpoints.down("sm")]: {
                minWidth: "0px",
                width: "100%",
              },
            })}
          />

          <SuiButton
            sx={{
              maxWidth: "47px",
              height: "40px",
              background: "var(--red-200)",
              "&:hover": { background: "var(--red-200)" },
              "&:focus:not(:hover)": { background: "var(--red-200)" },
            }}
            onClick={handleFilter}
          >
            <SuiBox component="img" src={IconSearch} alt="IconSearch" width="20px" height="20px" />
          </SuiButton>
        </SuiBox>
      )}

      {/* {!isMobile && rest} */}
    </SuiBox>
  );

  const AddressSearch = (
    <>
      <SelectBox
        label="Đơn vị"
        options={listProvince}
        placeholder="Tất cả"
        value={provinceSelected?.value}
        required={false}
        onChange={(e) =>
          setFormData({
            ...formData,
            province: e.value,
          })
        }
        sx={({ breakpoints }) => ({
          fontSize: "14px",
          height: "54px",
          minWidth: "370px",
          background: "white",
          [breakpoints.down("sm")]: {
            minWidth: "0px",
            width: "100%",
          },
        })}
      />
      <SelectBox
        label="Mức giá trị"
        placeholder="Tất cả"
        options={listDistrict}
        value={districteSelected?.value}
        required={false}
        onChange={(e) =>
          setFormData({
            ...formData,
            district: e.value,
          })
        }
        sx={({ breakpoints }) => ({
          fontSize: "14px",
          height: "54px",
          minWidth: "370px",
          background: "white",
          [breakpoints.down("sm")]: {
            minWidth: "0px",
            width: "100%",
          },
        })}
      />
    </>
  );

  const OptionFilterSearch = options.length > 0 && (
    <SelectBox
      label={optionlabel}
      width="10.75rem"
      required={false}
      sx={({ breakpoints }) => ({
        fontSize: "14px",
        height: "54px",
        minWidth: "370px",
        background: "white",
        [breakpoints.down("sm")]: {
          minWidth: "0px",
          width: "100%",
        },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      })}
      placeholder={options[0].label}
      options={options}
      value={formData.filterOption ? formData.filterOption.label : null}
      onChange={(e) => setFormData({ ...formData, filterOption: e })}
    />
  );

  const StatusFilterSearch = status.length > 0 && (
    <SelectBox
      sx={({ breakpoints }) => ({
        fontSize: "14px",
        height: "54px",
        minWidth: "370px",
        background: "white",
        [breakpoints.down("sm")]: {
          minWidth: "0px",
          width: "100%",
        },
      })}
      label={statusLabel}
      required={false}
      placeholder={status[0].label}
      options={status}
      value={formData.statusOption ? formData.statusOption.label : null}
      onChange={(e) => setFormData({ ...formData, statusOption: e })}
    />
  );

  const OptionSearchSecondly = secondlyOptions.length > 0 && (
    <SelectBox
      label={secondlyOptionLabel}
      width="10.75rem"
      required={false}
      sx={({ breakpoints }) => ({
        fontSize: "14px",
        height: "54px",
        minWidth: "370px",
        background: "white",
        [breakpoints.down("sm")]: {
          minWidth: "0px",
          width: "100%",
        },
      })}
      placeholder={secondlyOptions[0].label}
      options={secondlyOptions}
      value={formData.secondlyFilterOption ? formData.secondlyFilterOption.label : null}
      onChange={(e) => setFormData({ ...formData, secondlyFilterOption: e })}
    />
  );

  const OptionSearchThirdly = thirdlyOptions.length > 0 && (
    <SelectBox
      label={thirdlyOptionLabel}
      width="10.75rem"
      required={false}
      sx={({ breakpoints }) => ({
        fontSize: "14px",
        height: "54px",
        minWidth: "370px",
        background: "white",
        [breakpoints.down("sm")]: {
          minWidth: "0px",
          width: "100%",
        },
      })}
      placeholder={thirdlyOptions[0].label}
      options={thirdlyOptions}
      value={formData.thirdlyFilterOption ? formData.thirdlyFilterOption.label : null}
      onChange={(e) => setFormData({ ...formData, thirdlyFilterOption: e })}
    />
  );

  const DateSearch = formData.dateData.map((dateItem, index) => (
    <DateRangePicker
      key={index}
      placeholder="Từ ngày - Đến ngày"
      label="Giai đoạn"
      setDateRange={(e) => {
        if (!e) {
          const newData = formData.dateData.map((item) =>
            item.label === dateItem.label
              ? {
                  ...item,
                  from: null,
                  to: null,
                }
              : item
          );
          setFormData({ ...formData, dateData: newData });
        } else {
          const newData = formData.dateData.map((item) =>
            item.label === dateItem.label
              ? {
                  ...item,
                  from: formatDateSearch(e[0]),
                  to: formatDateSearch(e[1]),
                }
              : item
          );
          setFormData({ ...formData, dateData: newData });
        }
      }}
      value={[dateItem.from, dateItem.to]}
      sx={({ breakpoints }) => ({
        zIndex: 0,
        fontSize: "14px",
        height: "54px",
        minWidth: "370px",
        background: "white",
        [breakpoints.down("sm")]: {
          minWidth: "0px",
          width: "100%",
        },
      })}
      autoPlacement={datePickerPlacement}
    />
  ));

  const DatePickerSearch = (
    <DatePicker
      label="Giai đoạn"
      fontSize="medium"
      format="MM/yyyy"
      value={formData.datePickerValue}
      // onChange={(e) => setFormData({ ...formData, datePickerValue: convertDateFormat(e) })}
      // onChangeCalendarDate={(e) =>
      //   setFormData({ ...formData, datePickerValue: convertDateFormat(e) })
      // }
      sx={({ breakpoints }) => ({
        zIndex: 0,
        fontSize: "14px",
        height: "54px",
        minWidth: "370px",
        background: "white",
        [breakpoints.down("sm")]: {
          minWidth: "0px",
          width: "100%",
        },
      })}
    />
  );

  const ActionButton = (
    <SuiBox
      display="flex"
      gap="10px"
      justifyContent="flex-start"
      sx={({ breakpoints }) => ({
        minWidth: "370px",
        height: "40px",
        marginTop: "8px",
        [breakpoints.down("sm")]: {
          minWidth: "0px",
          width: "100%",
        },
      })}
    >
      <SuiButton
        size="small"
        color="white"
        circular
        sx={{
          border: "1px solid var(--red-200)",
          borderRadius: "5px",
          padding: "8px 24px",
          background: "initial",
        }}
        onClick={OnDeleteFilter}
      >
        <SuiTypography
          whiteSpace="nowrap"
          variant="body2"
          color="var(--red-200)"
          fontSize="14px"
          sx={{
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
          padding: "8px 24px",
        }}
        onClick={handleFilter}
      >
        <SuiTypography
          whiteSpace="nowrap"
          variant="body2"
          color="white"
          fontSize="14px"
          sx={{
            fontWeight: "700",
          }}
        >
          Áp Dụng
        </SuiTypography>
      </SuiButton>
    </SuiBox>
  );

  return (
    // <div className={className}>
    <SuiBox display="flex" sx={{ paddingBottom: "10px" }}>
      {/* container */}
      {/* Filter action icon */}
      {(options.length > 0 ||
        status.length > 0 ||
        secondlyOptions.length > 0 ||
        thirdlyOptions.length > 0 ||
        hasDate ||
        hasAddress) && (
        <SuiBox p="8px 10px 8px 0px">
          <SuiBox
            component="img"
            src={isOpenFilter ? Filter : FilterClosed}
            alt="Filter"
            width="23px"
            height="20px"
            onClick={() => setIsOpenFilter(!isOpenFilter)}
            sx={{ cursor: "pointer", marginTop: "12px" }}
          />
        </SuiBox>
      )}

      <SuiBox width="100%" display="flex" flexDirection="column">
        {/* search bar */}
        {SearchBar}

        {/* classified bar */}
        <SuiBox
          mt={hasSearch || hasSearch === undefined ? 1 : -2}
          display="flex"
          sx={({ transitions }) => ({
            maxHeight: isOpenFilter ? "1000px" : "0px",
            opacity: isOpenFilter ? 1 : 0,
            overflow: isOpenFilter ? "unset" : "hidden",
            transition: transitions.create(["opacity", "max-height"], {
              easing: transitions.easing.easeInOut,
              duration: transitions.duration.standard,
            }),
            marginTop: 0,
          })}
        >
          {/* Select options */}
          <SuiBox
            display="flex"
            sx={() => ({
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              columnGap: "5px",
              rowGap: "5px",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            })}
          >
            {hasDatePicker && DatePickerSearch}
            {isAddressRevert && hasAddress && AddressSearch} {/*------ address reverse place*/}
            {/*------------------------------------------------------- option, status ----*/}
            {!isOptionFilterRevert && OptionFilterSearch}
            {!isOptionFilterRevert && StatusFilterSearch}
            {/*------------------------------------------------------- option, status ----*/}
            {hasDate} {/*------------------------------- Date */}
            {hasDate && DateSearch}
            {/*------------------------------------------------------- option, status revert place (VH024b)*/}
            {isOptionFilterRevert && StatusFilterSearch}
            {isOptionFilterRevert && OptionFilterSearch}
            {/*------------------------------------------------------- option, status revert place (VH024b)*/}
            {!isAddressRevert && hasAddress && AddressSearch} {/*----- address */}
            {OptionSearchSecondly} {/*-------------------------------- additional filter search */}
            {OptionSearchThirdly} {/*-------------------------------- additional filter search */}
            {(options.length > 0 ||
              status.length > 0 ||
              secondlyOptions.length > 0 ||
              thirdlyOptions.length > 0 ||
              hasDate ||
              hasAddress) &&
              ActionButton}
            {/*-------------------------------------------------------- button */}
          </SuiBox>
          {/* </SuiBox> */}
        </SuiBox>
        {/* {isMobile && <SuiBox>{rest}</SuiBox>} */}
      </SuiBox>
      {/* <Snackbar
        title="Error"
        message="Ngày bắt đầu phải nhỏ hơn ngày kết thúc"
        action="Vui lòng chọn lại!"
        color="error"
        open={openAlert}
        setOpen={setOpenAlert}
      /> */}
    </SuiBox>
    // </div>
  );
}
Search.defaultProps = {
  options: [],
  optionlabel: "Loại khách hàng",
  status: [],
  statusLabel: "Trạng Thái",
  placeholder: "Tìm kiếm",
  dateRangeLabel: ["Ngày Đăng Ký"],
  // rest: "",
  handleSearch: () => {},
  hasDate: true,
  hasSearch: true,
  maxLength: "250",
  alert: () => {},
  hasAddress: false,
  isOptionFilterRevert: false,
  isAddressRevert: false,
  secondlyOptions: [],
  thirdlyOptions: [],
  secondlyOptionLabel: "Trạng Thái",
  thirdlyOptionLabel: "Trạng Thái",
  hasDatePicker: false,
  isCloseFilter: false,
  // className: "",
};

Search.propTypes = {
  placeholder: PropTypes.string,
  dateRangeLabel: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  optionlabel: PropTypes.string,
  status: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  statusLabel: PropTypes.string,
  // rest: PropTypes.node,
  handleSearch: PropTypes.func,
  hasDate: PropTypes.bool,
  hasSearch: PropTypes.bool,
  maxLength: PropTypes.string,
  alert: PropTypes.func,
  hasAddress: PropTypes.bool,
  isOptionFilterRevert: PropTypes.bool,
  isAddressRevert: PropTypes.bool,
  secondlyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  thirdlyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  secondlyOptionLabel: PropTypes.string,
  thirdlyOptionLabel: PropTypes.string,
  hasDatePicker: PropTypes.bool,
  isCloseFilter: PropTypes.bool,
  // className: PropTypes.string,
};
export default Search;
