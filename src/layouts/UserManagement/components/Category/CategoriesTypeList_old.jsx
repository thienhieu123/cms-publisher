import { Grid } from "@mui/material";
import ButtonFilter from "~/components/ButtonFilter";
import SearchInput from "~/components/SearchInput";
import SelectBox from "~/components/SelectBox";
import { useState } from "react";
import Table from "~/examples/Tables/Table";
import SuiTypography from "~/components/SuiTypography";
import { renderStatusTag } from "~/utils/utils";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import { DeleteIconButton, LocknUnLockIconButton, ViewDetailIconButton } from "~/components/Button";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên loại danh mục",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã loại danh mục",
    sortable: true,
    align: "center",
  },
  { name: "Trạng thái", sortable: true, align: "center" },
  {
    name: "Hành động",
    align: "center",
  },
];

const initialValues = {
  number: 0,
  size: 20,
  searchText: "",
  status: "",
};

export function CategoriesTypeList() {
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [isRemoveCategory, setIsRemoveCategory] = useState(false);
  const [isLockCategory, setIsLockCategory] = useState(false);
  const [isUnlockCategory, setIsUnlockCategory] = useState(false);
  const navigate = useNavigate();

  const handleLockUser = (status) => {
    status === "BI_KHOA" ? setIsUnlockCategory(true) : setIsLockCategory(true);
  };

  const renderGroupBtn = (status, id) => {
    return (
      <Grid container ishiddentooltip="true">
        <SuiTypography component="span" sx={{ display: "flex", width: "200" }}>
          <ViewDetailIconButton onClick={() => navigate("/user-management/categories-list")} />
          <LocknUnLockIconButton status={status} handleClick={handleLockUser} />
          <DeleteIconButton onClick={() => setIsRemoveCategory(true)} />
        </SuiTypography>
      </Grid>
    );
  };

  const unlockCategoryPopup = () => {
    return (
      <ConfirmPopup
        open={isUnlockCategory}
        setOpen={setIsUnlockCategory}
        questionText="Bạn có đồng ý mở khóa danh mục này ?"
        NotiText="Danh mục sẽ được mở khóa trên hệ thống"
      />
    );
  };

  const lockCategoryPopup = () => {
    return (
      <ConfirmPopup
        open={isLockCategory}
        setOpen={setIsLockCategory}
        questionText="Bạn có đồng ý khóa danh mục này ?"
        NotiText="Danh mục sẽ bị khóa khỏi hệ thống"
      />
    );
  };
  const removeCategoryPopup = () => {
    return (
      <ConfirmPopup
        open={isRemoveCategory}
        setOpen={setIsRemoveCategory}
        questionText="Bạn có đồng ý xóa danh mục này ?"
        NotiText="Danh mục sẽ bị xóa khỏi hệ thống"
      />
    );
  };

  const data = [
    {
      STT: "1",
      "Tên loại danh mục": "Quản trị hệ thống",
      "Mã loại danh mục": "Người được phân quyền quản trị",
      "Trạng thái": renderStatusTag("HOAT_DONG"),
      "Hành động": renderGroupBtn("HOAT_DONG", 1),
    },
    {
      STT: "2",
      "Tên loại danh mục": "Cập nhật dữ liệu",
      "Mã loại danh mục": "Người được phân quyền cập nhật dữ liệu",
      "Trạng thái": renderStatusTag("BI_KHOA"),
      "Hành động": renderGroupBtn("BI_KHOA", 2),
    },
    {
      STT: "3",
      "Tên loại danh mục": "kiểm soát dữ liệu",
      "Mã loại danh mục": "Người được phân quyền kiểm soát dữ liệu",
      "Trạng thái": renderStatusTag("MOI_TAO"),
      "Hành động": renderGroupBtn("MOI_TAO", 3),
    },
  ];
  return (
    <Grid container spacing={2}>
      {lockCategoryPopup()}
      {unlockCategoryPopup()}
      {removeCategoryPopup()}
      <Grid container item xs={12} sm={12} lg={12} spacing={1}>
        <Grid item xs={12} sm={8} lg={5}>
          <SearchInput
            isOpenFilter={isOpenFilter}
            setIsOpenFilter={setIsOpenFilter}
            placeholder="Nhập mã, tên vai trò"
          />
        </Grid>
        {isOpenFilter && (
          <Grid container item xs={12} lg={12} columnSpacing={4} spacing={1} pb={2} mt={1}>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <SelectBox
                label="Trạng thái"
                options={[]}
                placeholder="Tất cả"
                required={false}
                width="100%"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <ButtonFilter />
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Table
          size="13px"
          tablePadding
          columns={columns}
          rows={data}
          borderRadius="1rem 1rem 0 0"
          rowsCount={queryFilter.size}
          curPage={queryFilter.number}
          setRowsCount={(rowCount) =>
            setQueryFilter({
              ...queryFilter,
              size: rowCount,
              number: 0,
            })
          }
          setCurPage={(nextPage) =>
            setQueryFilter({
              ...queryFilter,
              number: nextPage,
            })
          }
          totalElements={0}
        />
      </Grid>
    </Grid>
  );
}
