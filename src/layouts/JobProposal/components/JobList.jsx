import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonFilter from "~/components/ButtonFilter";
import DateRangePicker from "~/components/DateRangePicker";
import ProgressBar from "~/components/ProgressBar";
import SearchInput from "~/components/SearchInput";
import SelectBox from "~/components/SelectBox";
import SuiTypography from "~/components/SuiTypography";
import Table from "~/examples/Tables/Table";
import { getStartDateDefault } from "~/utils/utils";

const initialValues = {
  searchText: "",
  createdStartDate: getStartDateDefault(),
  createdEndDate: new Date(),
  typeJob: "",
  groupId: "",
  statsIndexId: "",
  proposer: "",
  page: 0,
  size: 20,
};

const columns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên công việc",
    sortable: true,
    align: "center",
  },
  {
    name: "Loại công việc",
    sortable: true,
    align: "center",
  },
  {
    name: "Người đề xuất",
    sortable: true,
    align: "center",
  },
  {
    name: "Ngày tạo",
    sortable: true,
    align: "center",
  },
  {
    name: "Tiến độ",
    sortable: true,
    align: "center",
  },
  {
    name: "Trạng thái",
    align: "center",
    sortable: true,
  },
  {
    name: "",
  },
];
export default function JobList() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [dataTable, setDataTable] = useState([]);

  const fetchData = () => {
    const table = [
      {
        STT: 1,
        "Tên công việc": "Tên công việc",
        "Loại công việc": "Loại công việc",
        "Người đề xuất": "Người đề xuất",
        "Ngày tạo": "Ngày tạo",
        "Tiến độ": <ProgressBar percentage={90} fontSize={13} />,
      },
    ];
    setDataTable(table);
  };

  useEffect(() => {
    fetchData();
    return () => {
      setDataTable([]);
    };
  }, [queryFilter.page, queryFilter.size]);

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  const handleClearFilter = () => {
    setQueryFilter(initialValues);
  };

  console.log(dataTable);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={8} lg={5} display="flex" alignItems="center" gap={2}>
        <SearchInput
          isOpenFilter={isOpenFilter}
          setIsOpenFilter={setIsOpenFilter}
          placeholder="Nhập tên công việc"
          onChange={(e) => handleChange("searchText", e.target.value)}
          searchText={queryFilter.searchText}
          submit={fetchData}
        />
      </Grid>

      {isOpenFilter && (
        <Grid container item xs={12} spacing={1} columnSpacing={4}>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <SelectBox
              label="Loại công việc"
              placeholder="Tất cả"
              value={queryFilter.typeJob}
              onChange={(e) => handleChange("typeJob", e.value)}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <SelectBox
              label="Loại chỉ tiêu"
              placeholder="Tất cả"
              dataSource="/stats-index-groups/list"
              mapping={{ value: "id", label: "name" }}
              value={queryFilter.groupId}
              onChange={(e) => handleChange("groupId", e.value)}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <SelectBox
              label="Chỉ tiêu"
              placeholder="Tất cả"
              dataSource={`/stats-indices${
                queryFilter.groupId ? "?groupId=" + queryFilter.groupId : ""
              }`}
              mapping={{ value: "code", label: "name" }}
              dependency={[queryFilter.groupId]}
              value={queryFilter.statsIndexId}
              onChange={(e) => handleChange("statsIndexId", e.value)}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <SelectBox
              label="Người đề xuất"
              placeholder="Tất cả"
              value={queryFilter.proposer}
              onChange={(e) => handleChange("proposer", e.value)}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <DateRangePicker
              value={[queryFilter.createdStartDate, queryFilter.createdEndDate]}
              setDateRange={(e) => {
                setQueryFilter({ ...queryFilter, createdStartDate: e[0], createdEndDate: e[1] });
              }}
              placeholder="Từ ngày - Đến ngày"
              label="Ngày tạo"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4}>
            <ButtonFilter onClear={handleClearFilter} onSearch={fetchData} />
          </Grid>
        </Grid>
      )}

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
          totalElements={0}
        />
      </Grid>
    </Grid>
  );
}
