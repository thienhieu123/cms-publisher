import { Box, Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import Input from "~/components/Input";
import PopupRoot from "~/components/Popup/PopupRoot";
import SelectBox from "~/components/SelectBox";
import { categoryStatusTable } from "~/constants/config";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import RedReturnIcon from "~/assets/images/icons/red-return.svg";
import WhiteSaveIcon from "~/assets/images/icons/white-save-icon.svg";
import TextArea from "~/components/TextArea";
import SearchInput from "~/components/SearchInput";
import Table from "~/examples/Tables/Table";
import useErrorMessage from "~/hooks/useErrorMessage";
import { countCharacterInString } from "~/utils/utils";
import MyDropzone from "~/components/MyDropZone";

const initParams = {
  code: "",
  name: "",
  groupId: [],
  indices: [],
  status: "",
};

const initFilter = {
  searchText: "",
  page: 0,
  size: 20,
  total: 0,
};

const dataSrcColumns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã dữ liệu",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên dữ liệu",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên nhóm chỉ tiêu",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên chỉ tiêu",
    sortable: true,
    align: "center",
  },
];

const fakeData = [
  {
    STT: 1,
    value: 1,
    name: "data_1",
    "Mã dữ liệu": "1",
    "Tên dữ liệu": "Dữ liệu 1",
    "Tên nhóm chỉ tiêu": "Group Name",
    "Tên chỉ tiêu": "Indice Name",
  },
  {
    STT: 2,
    value: 2,
    name: "data_2",
    "Mã dữ liệu": "1",
    "Tên dữ liệu": "Dữ liệu 2",
    "Tên nhóm chỉ tiêu": "Group Name",
    "Tên chỉ tiêu": "Indice Name",
  },
  {
    STT: 3,
    value: 3,
    name: "data_3",
    "Mã dữ liệu": "1",
    "Tên dữ liệu": "Dữ liệu 3",
    "Tên nhóm chỉ tiêu": "Group Name",
    "Tên chỉ tiêu": "Indice Name",
  },
  {
    STT: 4,
    value: 4,
    name: "data_4",
    "Mã dữ liệu": "1",
    "Tên dữ liệu": "Dữ liệu 4",
    "Tên nhóm chỉ tiêu": "Group Name",
    "Tên chỉ tiêu": "Indice Name",
  },
];

const CHAR_DATA_SRC = "$";

export default function AddNewFormula() {
  const [params, setParams] = useState(initParams);
  const [formula, setFormula] = useState({
    // strPart: [], //example: [(, + , ), / ]
    fullStr: "", //(x + y) / z,
    formulaStr: "", //example: ($ + $) / $
    params: [], //example: [x,y,z]
  });
  // const [dataSelected, setDataSelected] = useState();
  const [isDataPopup, setIsDataPopup] = useState(false);
  const [queryFilter, setQueryFilter] = useState(initFilter);
  const [listDataSrc, setListDataSrc] = useState(fakeData);
  const [selectedRows, setSelectedRows] = useState([]);
  const { setErrorMessage } = useErrorMessage();
  const [disabledSelected, setDisabledSelected] = useState(true);
  const [formulaFile, setFormulaFile] = useState();

  const fullFormulaString = () => {
    let result = "";
    const arr = formula.formulaStr.split(CHAR_DATA_SRC);
    arr.map((item, index) => {
      if (formula.params[index]?.name) result += item + formula.params[index]?.name;
      else result += item;
    });
    return result;
  };

  useEffect(() => {
    const count = countCharacterInString(CHAR_DATA_SRC, formula.formulaStr);
    if (count < formula.params.length) {
      //remove param until ===
      const newArr = formula.params.pop();
      // console.log(newArr, formula.params);
      setFormula({ ...formula, params: [...formula.params] });
    } else if (count === formula.params.length) {
      const newStr = fullFormulaString();
      setFormula({ ...formula, fullStr: newStr });
    }
  }, [formula.formulaStr]);

  useEffect(() => {
    const count = countCharacterInString(CHAR_DATA_SRC, formula.formulaStr);
    if (count === formula.params.length) {
      const newStr = fullFormulaString();
      setFormula({ ...formula, fullStr: newStr });
    }
  }, [formula.params.length]);

  // const verifyFormula = () => {
  //   try {
  //     formula.map((item) => {
  //       if (!formula.fullStr.includes(item.name)) setErrorMessage("Công thức chưa đúng format!");
  //     });
  //   } catch (e) {
  //     setErrorMessage("Công thức chưa đúng format!");
  //   }
  // };

  const searchDataSrc = () => {};
  const handleSelectData = () => {
    setIsDataPopup(false);
    // console.log(selectedRows[0]);
    let newArr = [...formula.params, selectedRows[0]];
    setFormula({
      ...formula,
      params: newArr,
    });
  };
  const dataPopup = () => {
    return (
      <PopupRoot
        title={"Chọn dữ liệu"}
        open={isDataPopup}
        setOpen={setIsDataPopup}
        disableBackDropClick
      >
        <Card sx={{ padding: "20px" }}>
          <Grid item xs={12} sm={8} lg={8} display="flex" alignItems="center" gap={2}>
            <SearchInput
              placeholder="Nhập mã, tên dữ liệu"
              isOpenFilter={false}
              setIsOpenFilter={() => {}}
              searchText={queryFilter.searchText}
              onChange={(e) => setQueryFilter({ ...queryFilter, searchText: e.target.value })}
              submit={searchDataSrc}
            />
          </Grid>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "10px",
              border: "1px solid #eeecf8",
              marginTop: "10px",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            <Table
              isRowSelectable
              isSingleRowSelected
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              size="13px"
              columns={dataSrcColumns}
              rows={listDataSrc}
              borderRadius="1rem 1rem 0 0"
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
              totalElements={queryFilter.total}
            />
          </Box>

          <ButtonControl
            cancelText="Hủy"
            submitText="Chọn"
            disabledSubmit={selectedRows.length === 0}
            handleCancel={() => setIsDataPopup(false)}
            handleSubmit={handleSelectData}
            justifyContent="center"
          />
        </Card>
      </PopupRoot>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {dataPopup()}
      {/*********** Thông tin công thức ************/}
      <Card sx={{ padding: "20px", marginBottom: "10px" }}>
        <Typography sx={{ marginBottom: "10px" }}>Thông tin công thức</Typography>
        <Grid container columnSpacing={4} spacing={1}>
          <Grid item xs={12} md={4}>
            <Input disabled label="Mã công thức" value={params.code} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input
              label="Tên công thức"
              value={params.name}
              onChange={(e) =>
                setParams({
                  ...params,
                  name: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SelectBox
              label="Nhóm chỉ tiêu"
              dataSource={`/stats-index-groups/list?status=ACTIVATED`}
              mapping={{ value: "id", label: "name" }}
              placeholder="Chọn nhóm chỉ tiêu"
              width="100%"
              value={params.groupId}
              isMulti
              onChange={(e) =>
                setParams({
                  ...params,
                  groupId: e,
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SelectBox
              label="Chỉ tiêu"
              dataSource={`/stats-indices?page=1&size=1000&status=ACTIVATED`} //cần hỏi lại api chỗ này có phụ thuộc vào filter nhóm chỉ tiêu không
              mapping={{ value: "id", label: "name" }}
              isMulti
              value={params.indices}
              onChange={(e) => {
                setParams({ ...params, indices: e.value });
              }}
              placeholder="Tất cả"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SelectBox
              label="Trạng thái"
              options={categoryStatusTable}
              value={params.status}
              onChange={(e) => {
                setParams({ ...params, status: e.value });
              }}
              placeholder="Tất cả"
            />
          </Grid>
        </Grid>
      </Card>
      {/*********** Cấu hình công thức ************/}
      <Card sx={{ padding: "20px", marginBottom: "10px" }}>
        <Typography sx={{ marginBottom: "10px" }}>Cấu hình công thức</Typography>
        <Box>{formula.fullStr}</Box>
        <Box sx={{ marginBottom: "20px" }}>
          <TextArea
            placeholder={"Nhập $ để chọn dữ liệu"}
            value={formula.formulaStr}
            onChange={(e) => {
              // console.log(e.target.value);
              const count = countCharacterInString(CHAR_DATA_SRC, e.target.value);
              if (
                count === formula.params.length ||
                (count === formula.params.length + 1 &&
                  e.target.value[e.target.value.length - 1] === CHAR_DATA_SRC) ||
                e.target.value.length < formula.formulaStr.length
              ) {
                setFormula({ ...formula, formulaStr: e.target.value });
              }
              if (count === formula.params.length + 1) {
                setDisabledSelected(false);
              } else setDisabledSelected(true);
            }}
          />
        </Box>

        <ButtonControl
          hiddenCancel
          isHideImageSubmit
          disabledSubmit={disabledSelected}
          submitText="Chọn dữ liệu"
          handleSubmit={() => setIsDataPopup(true)}
          justifyContent="center"
        />
      </Card>
      {/*********** Tệp đính kèm ************/}
      <Card sx={{ padding: "20px", marginBottom: "10px" }}>
        <Typography sx={{ marginBottom: "10px" }}>Tệp đính kèm</Typography>
        <Grid item xs={12} mt={2}>
          <MyDropzone
            files={formulaFile}
            setFiles={(e) => {
              setFormulaFile(e);
            }}
            multiple={false}
          />
        </Grid>
      </Card>
      <ButtonControl
        cancelText="Quay lại"
        imageCancel={RedReturnIcon}
        submitText="Lưu"
        handleCancel={() => {}}
        imageSubmit={WhiteSaveIcon}
        handleSubmit={() => {}}
        justifyContent="center"
      />
    </DashboardLayout>
  );
}
