import { useMemo, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import Table from "~/examples/Tables/Table";
import WhiteNotePlusIcon from "~/assets/images/icons/white-note-plus.svg";
import PopupRoot from "~/components/Popup/PopupRoot";
import { Grid, Typography } from "@mui/material";
import SelectBox from "~/components/SelectBox";
import Input from "~/components/Input";
import RedReturnIcon from "~/assets/images/icons/red-return.svg";
import WhiteSaveIcon from "~/assets/images/icons/white-save-icon.svg";
import { formatDate, getStartDateDefault } from "~/utils/utils";
import { DeleteIconButton, EditIconButton } from "~/components/Button";
import DateRangePicker from "~/components/DateRangePicker";
import { v4 as uuidv4 } from "uuid";
import { isRequired } from "~/utils/verify";
import useErrorMessage from "~/hooks/useErrorMessage";

const columns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Quận/huyện",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên dữ liệu",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên ngành",
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
    sortable: true,
    align: "center",
  },
  {
    name: "",
  },
];

const initialValues = {
  page: 0,
  size: 20,
};

function DataInfoDetail({ data, handleSubmit = () => {}, handleCancel = () => {} }) {
  const [queryFilter, setQueryFilter] = useState(
    data || {
      districtId: "",
      name: "",
      industryName: "",
      periodStartDate: getStartDateDefault(),
      periodEndDate: new Date(),
      unit: "",
      value: "",
      id: uuidv4(),
    }
  );
  const { setErrorMessage } = useErrorMessage();

  const handleValidate = () => {
    try {
      isRequired(queryFilter?.value, "Giá trị");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const submit = () => {
    handleValidate();
    handleSubmit(queryFilter);
  };
  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  return (
    <Grid
      container
      p={2}
      mt={2}
      minWidth="450px"
      columnSpacing={2}
      rowSpacing={1}
      maxHeight="80vh"
      sx={{
        overflow: "auto",
        " ::-webkit-scrollbar": {
          WebkitAppearance: "none",
          width: "7px",
        },
        "::-webkit-scrollbar-thumb": {
          borderRadius: "4px",
          backgroundColor: "rgba(0, 0, 0, .5)",
          boxShadow: "0 0 1px rgba(255, 255, 255, .5)",
        },
      }}
    >
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Quận/huyện"
          placeholder="Chọn quận/huyện"
          dataSource="/area/districts?parentCode=T008"
          mapping={{ value: "areaCode", label: "name" }}
          value={queryFilter?.districtId}
          onChange={(e) => handleChange("districtId", e.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Tên dữ liệu"
          placeholder="Chọn tên dữ liệu"
          value={queryFilter?.name}
          onChange={(e) => handleChange("name", e.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Tên ngành"
          placeholder="Chọn tên ngành"
          value={queryFilter?.industryName}
          onChange={(e) => handleChange("industryName", e.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <Input
          label="Giá trị"
          value={queryFilter?.value}
          onChange={(e) => handleChange("value", e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <DateRangePicker
          value={[new Date(queryFilter.periodStartDate), new Date(queryFilter.periodEndDate)]}
          setDateRange={(e) => {
            setQueryFilter({ ...queryFilter, periodStartDate: e[0], periodEndDate: e[1] });
          }}
          placeholder="Từ ngày - Đến ngày"
          label="Giai đoạn"
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <Input label="Đơn vị" value={queryFilter?.unit} disabled />
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="center" mt={1}>
        <ButtonControl
          cancelText="Quay lại"
          imageCancel={RedReturnIcon}
          submitText="Lưu"
          handleCancel={handleCancel}
          imageSubmit={WhiteSaveIcon}
          handleSubmit={submit}
          justifyContent="center"
        />
      </Grid>
    </Grid>
  );
}

export default function TableInfo({ requestList, setRequestList }) {
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [dataInfoPopup, setDataInfoPopup] = useState(false);
  const [requestSelected, setRequestSelected] = useState(null);
  const [totalElements, setTotalElements] = useState(0);

  const renderDataInfoPopup = () => {
    return (
      <PopupRoot title="Thông tin số liệu" open={dataInfoPopup} setOpen={setDataInfoPopup}>
        <DataInfoDetail
          handleCancel={() => setDataInfoPopup(false)}
          handleSubmit={handleAddRequest}
          data={requestSelected}
        />
      </PopupRoot>
    );
  };

  const handleAddRequest = (request) => {
    const isOldRequest = requestList?.find((row) => row?.id === request?.id);
    if (isOldRequest) {
      const newTempTable = requestList?.map((item) =>
        item?.id === request?.id ? { ...item, ...request } : item
      );
      setRequestList(newTempTable);
    } else setRequestList([...requestList, request]);

    setRequestSelected(null);
    setDataInfoPopup(false);
    setTotalElements((prev) => prev + 1);
  };

  const renderGroupBtn = (id) => {
    return (
      <Grid container ishiddentooltip="true">
        <EditIconButton onClick={() => handleEditRow(id)} />
        <DeleteIconButton onClick={() => handleDeleteRow(id)} />
      </Grid>
    );
  };

  const table = useMemo(() => {
    const arrData = requestList?.slice(
      queryFilter?.size * queryFilter?.page,
      queryFilter?.size * (queryFilter?.page + 1)
    );
    return arrData?.map((item, idx) => ({
      ...item,
      STT: queryFilter?.size * queryFilter?.page + idx + 1,
      "Quận/huyện": item?.districtId,
      "Tên dữ liệu": item?.name,
      "Tên ngành": item?.industryName,
      "Ngày bắt đầu": formatDate(item?.periodStartDate),
      "Ngày kết thúc": formatDate(item?.periodEndDate),
      "Giá trị": item?.value,
      "Đơn vị": item?.unit,
      "": renderGroupBtn(item?.id),
    }));
  }, [requestList, queryFilter.size, queryFilter.page]);

  const handleDeleteRow = (id) => {
    const newTable = requestList?.filter((row) => row.id !== id);
    setRequestList(newTable);
    setTotalElements((prev) => prev - 1);
  };

  const handleEditRow = (id) => {
    const request = requestList?.find((row) => row.id === id);
    setRequestSelected(request);
    setDataInfoPopup(true);
  };

  return (
    <>
      {renderDataInfoPopup()}
      <Grid container p={2} mt={2} className="card-content">
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Grid item xs={6}>
            <Typography fontWeight={700} fontSize={16}>
              Thông tin số liệu
            </Typography>
          </Grid>
          <Grid item width="auto">
            <ButtonControl
              hiddenCancel
              submitText="Thêm mới"
              imageSubmit={WhiteNotePlusIcon}
              handleSubmit={() => setDataInfoPopup(true)}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} mt={1}>
          <Table
            tablePadding
            size="13px"
            borderRadius="1rem 1rem 0 0"
            boxShadow="none"
            columns={columns}
            rows={table || []}
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
      </Grid>
    </>
  );
}
