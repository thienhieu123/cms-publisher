import { BottomNavigation, BottomNavigationAction, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import DateRangePicker from "~/components/DateRangePicker";
import SelectBox from "~/components/SelectBox";
import ButtonFilter from "~/components/ButtonFilter";
import ReportSection from "./ReportSection";
import useErrorMessage from "~/hooks/useErrorMessage";
import { getStatisticReportList } from "~/api/common";
import LazyLoad from "react-lazyload";
import SearchInput from "~/components/SearchInput";
import { getStartDateDefault, handleResponse } from "~/utils/utils";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { useSoftUIController } from "~/context";
import { setLoading } from "~/context/common/action";
import PermissionWrapped from "~/components/PermissionWrapped";

const initialValues = {
  searchText: "",
  fromDate: getStartDateDefault(),
  toDate: new Date(),
  statsIndexId: "",
  groupId: "",
  page: 0,
  size: 20,
};
export default function StatisticReportList() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [optionFilter, setOptionFilter] = useState(0);
  const [data, setData] = useState([]);
  const { setErrorMessage } = useErrorMessage();
  const [, dispatch] = useSoftUIController();

  const sortValue = useMemo(() => {
    switch (optionFilter) {
      case 1:
        return "createdAt:asc";
      case 2:
        return "createdAt:desc";
      case 3:
        return "name:asc";
      case 4:
        return "name:desc";
      default:
        return "";
    }
  }, [optionFilter]);

  const fetchData = () => {
    setLoading(dispatch, true);
    const { page, size, searchText, statsIndexId, fromDate, toDate, groupId } = queryFilter;
    getStatisticReportList({
      searchText,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      statsIndexId,
      groupId,
      page: page + 1,
      size,
      isList: true,
      sort: sortValue,
    })
      .then((result) => {
        const [status, dataResponse] = handleResponse(result);
        if (status) {
          setData(dataResponse);
        } else {
          setErrorMessage(dataResponse);
          setData([]);
        }
      })
      .finally(() => setLoading(dispatch, false));
  };

  useEffect(() => {
    fetchData();
    return () => {
      setData([]);
    };
  }, [queryFilter.page, queryFilter.size, sortValue]);

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  const handleClearFilter = () => {
    setQueryFilter(initialValues);
  };

  const Loading = () => (
    <div className="post loading">
      <h5>Loading...</h5>
    </div>
  );

  useEnterKeyEvent([], fetchData);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={8} lg={5} display="flex" alignItems="center" gap={2}>
        <SearchInput
          isOpenFilter={isOpenFilter}
          setIsOpenFilter={setIsOpenFilter}
          placeholder="Nhập tên báo cáo"
          onChange={(e) => handleChange("searchText", e.target.value)}
          searchText={queryFilter.searchText}
          submit={fetchData}
        />
      </Grid>

      {isOpenFilter && (
        <Grid container item xs={12} spacing={1} columnSpacing={4}>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <SelectBox
              label="Nhóm chỉ tiêu"
              dataSource="/stats-index-groups/list"
              mapping={{ value: "id", label: "name" }}
              placeholder="Tất cả"
              value={queryFilter.groupId}
              onChange={(e) => handleChange("groupId", e.value)}
              required={false}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <SelectBox
              label="Chỉ tiêu"
              dataSource={`/stats-indices${
                queryFilter.groupId ? "?groupId=" + queryFilter.groupId : ""
              }`}
              mapping={{ value: "id", label: "name" }}
              dependency={[queryFilter.groupId]}
              placeholder="Tất cả"
              value={queryFilter.statsIndexId}
              onChange={(e) => handleChange("statsIndexId", e.value)}
              required={false}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <DateRangePicker
              value={[queryFilter.fromDate, queryFilter.toDate]}
              setDateRange={(e) => {
                setQueryFilter({ ...queryFilter, fromDate: e[0], toDate: e[1] });
              }}
              placeholder="Từ ngày - Đến ngày"
              label="Ngày tạo"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4} display="flex" justifyContent="left">
            <ButtonFilter onClear={handleClearFilter} onSearch={fetchData} />
          </Grid>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        sm={10}
        md={8}
        lg={6}
        xl={4}
        sx={{
          paddingTop: isOpenFilter && "0 !important",
        }}
      >
        <BottomNavigation
          showLabels
          value={optionFilter}
          onChange={(event, newValue) => {
            setOptionFilter(newValue);
          }}
          sx={{
            display: "flex",
            justifyContent: "start",
            background: "transparent",
            "& .MuiBottomNavigationAction-root": {
              alignItems: "flex-start",
              minWidth: "auto",
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "14px",
              fontWeight: 700,
            },
          }}
        >
          <BottomNavigationAction label="Nổi bật" />
          <BottomNavigationAction label="Mới nhất" />
          <BottomNavigationAction label="Cũ nhất" />
          <BottomNavigationAction label="A-Z" />
          <BottomNavigationAction label="Z-A" />
        </BottomNavigation>
      </Grid>
      <PermissionWrapped
        listCodeComponent={[
          "STATISTICAL_REPORT",
          "STATISTICAL_REPORT_TAB",
          "STATISTICAL_REPORT_DETAIL",
        ]}
      >
        <Grid container item xs={12} display="flex" spacing={2} mt={2} pt="0 !important">
          {data?.map((item, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <LazyLoad
                key={index}
                offset={[-40, 0]}
                height={200}
                once={true}
                placeholder={<Loading />}
              >
                <ReportSection
                  key={index}
                  id={item?.id}
                  title={item?.name}
                  createdDate={item?.createdAt}
                  thumbnailImgUrl={item?.thumbnailImgUrl}
                />
              </LazyLoad>
            </Grid>
          ))}
        </Grid>
      </PermissionWrapped>
    </Grid>
  );
}
