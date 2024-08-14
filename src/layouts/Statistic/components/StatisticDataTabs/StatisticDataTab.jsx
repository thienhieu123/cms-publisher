import { Grid } from "@mui/material";
import Table from "~/examples/Tables/Table";
import { useEffect, useState } from "react";
import ButtonFilter from "~/components/ButtonFilter";
import DateRangePicker from "~/components/DateRangePicker";
import SelectBox from "~/components/SelectBox";
import { useNavigate } from "react-router-dom";
import SuiBox from "~/components/SuiBox";
import ExcelButton from "~/components/ExcelButton";
import PdfButton from "~/components/PdfButton";
import WordButton from "~/components/WordButton";
import { getStatisticDataList } from "~/api/common";
import useErrorMessage from "~/hooks/useErrorMessage";
import SearchInput from "~/components/SearchInput";
import { formatDate, getStartDateDefault, handleResponse } from "~/utils/utils";
import { ViewDetailIconButton } from "~/components/Button";
import useEnterKeyEvent from "~/hooks/useEnterKeyEvent";
import { useSoftUIController } from "~/context";
import { setLoading } from "~/context/common/action";
import PermissionWrapped from "~/components/PermissionWrapped";

const columns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã chỉ tiêu",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên chỉ tiêu",
    sortable: true,
    align: "center",
  },
  {
    name: "Ngày bắt đầu",
    sortable: true,
    align: "center",
  },
  {
    name: "Ngày kết thúc",
    sortable: true,
    align: "center",
  },
  {
    name: "Giá trị",
    sortable: true,
    align: "center",
  },
  {
    name: "Đơn vị",
    align: "center",
    sortable: true,
  },

  {
    name: "",
  },
];

const initialValues = {
  page: 0,
  size: 20,
  sort: "createdDate,DESC",
  searchText: "",
  groupId: "",
  mearsurementUnitId: "",
  startDate: getStartDateDefault(),
  endDate: new Date(),
  rangeValue: "",
};
function StatisticDataTab() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [dataTable, setDataTable] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const { setErrorMessage } = useErrorMessage();
  const navigate = useNavigate();
  const [, dispatch] = useSoftUIController();

  const fetchData = () => {
    setLoading(dispatch, true);
    const { page, size, searchText, groupId, mearsurementUnitId } = queryFilter;
    getStatisticDataList({
      page: page + 1,
      size: size,
      searchText: searchText,
      groupId: groupId,
      mearsurementUnitId: mearsurementUnitId,
    })
      .then((response) => {
        const [status, dataResponse] = handleResponse(response);
        if (status) {
          const table = dataResponse?.map((item, idx) => ({
            STT: page * size + idx + 1,
            "Mã chỉ tiêu": item?.code,
            "Tên chỉ tiêu": item?.name,
            "Ngày bắt đầu": formatDate(item?.startDate),
            "Ngày kết thúc": formatDate(item?.endDate),
            "Giá trị": item?.totalValue,
            "Đơn vị": item?.deafaultMeasurementUnit?.name,
            "": (
              <Grid container ishiddentooltip="true">
                <PermissionWrapped
                  listCodeComponent={[
                    "STATISTICAL_VALUE",
                    "STATISTIC_DATA_TAB",
                    "STATISTICAL_VALUE_DETAIL",
                  ]}
                >
                  <ViewDetailIconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/statistic-data/detail/${item?.id}`);
                    }}
                  />
                </PermissionWrapped>
              </Grid>
            ),
          }));
          setTotalElements(response?.message?.data?.data?.rowCount);
          setDataTable(table);
        } else {
          setErrorMessage(dataResponse);
          setDataTable([]);
          setTotalElements(0);
        }
      })
      .finally(() => {
        setLoading(dispatch, false);
      });
  };

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  const handleClearFilter = () => {
    setQueryFilter(initialValues);
  };

  useEffect(() => {
    fetchData();
    return () => {
      setDataTable([]);
      setTotalElements(0);
    };
  }, [queryFilter.page, queryFilter.size]);

  useEnterKeyEvent([], fetchData);

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} spacing={1}>
        <Grid item xs={12} sm={8} lg={5}>
          <SearchInput
            isOpenFilter={isOpenFilter}
            setIsOpenFilter={setIsOpenFilter}
            placeholder="Nhập mã, tên chỉ tiêu"
            onChange={(e) => handleChange("searchText", e.target.value)}
            searchText={queryFilter.searchText}
            submit={fetchData}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={7} display="flex" justifyContent="end" alignItems="center">
          <SuiBox
            display="flex"
            gap="20px"
            sx={{
              height: "40px",
            }}
          >
            <PermissionWrapped
              listCodeComponent={[
                "STATISTICAL_VALUE",
                "STATISTIC_DATA_TAB",
                "STATISTIC_DATA_TAB_EXCEL_EXPORT",
              ]}
            >
              <ExcelButton />
            </PermissionWrapped>
            <PermissionWrapped
              listCodeComponent={[
                "STATISTICAL_VALUE",
                "STATISTIC_DATA_TAB",
                "STATISTIC_DATA_TAB_PDF_EXPORT",
              ]}
            >
              <PdfButton />
            </PermissionWrapped>
            <PermissionWrapped
              listCodeComponent={[
                "STATISTICAL_VALUE",
                "STATISTIC_DATA_TAB",
                "STATISTIC_DATA_TAB_WORD_EXPORT",
              ]}
            >
              <WordButton />
            </PermissionWrapped>
          </SuiBox>
        </Grid>
        {isOpenFilter && (
          <Grid container item xs={12} columnSpacing={4} spacing={1} pb={2} mt={1}>
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
              <DateRangePicker
                value={[queryFilter.startDate, queryFilter.endDate]}
                setDateRange={(e) => {
                  setQueryFilter({ ...queryFilter, startDate: e[0], endDate: e[1] });
                }}
                placeholder="Từ ngày - Đến ngày"
                label="Giai đoạn"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <SelectBox
                label="Đơn vị"
                dataSource="/measurement-units/list"
                mapping={{ value: "id", label: "name" }}
                placeholder="Tất cả"
                value={queryFilter.mearsurementUnitId}
                onChange={(e) => handleChange("mearsurementUnitId", e.value)}
                required={false}
                width="100%"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <ButtonFilter onClear={handleClearFilter} onSearch={fetchData} />
            </Grid>
          </Grid>
        )}
      </Grid>
      <PermissionWrapped
        listCodeComponent={["STATISTICAL_VALUE", "STATISTIC_DATA_TAB", "STATISTIC_DATA_TAB_TABLE"]}
      >
        <Grid item xs={12}>
          <Table
            size="13px"
            columns={columns}
            borderRadius="1rem 1rem 0 0"
            rows={dataTable}
            rowsCount={queryFilter.size}
            curPage={queryFilter.page}
            setRowsCount={(rowCount) =>
              setQueryFilter({
                ...queryFilter,
                size: rowCount,
                page: 0,
              })
            }
            setCurPage={(nextPage) =>
              setQueryFilter({
                ...queryFilter,
                page: nextPage,
              })
            }
            totalElements={totalElements}
          />
        </Grid>
      </PermissionWrapped>
    </Grid>
  );
}

export default StatisticDataTab;
