import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import ButtonControl from "~/components/ButtonControl";
import ButtonFilter from "~/components/ButtonFilter";
import SearchInput from "~/components/SearchInput";
import SelectBox from "~/components/SelectBox";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import WhitePlusIcon from "~/assets/images/icons/white-plus.svg";
import SuiTypography from "~/components/SuiTypography";
import {
  DeleteIconButton,
  EditIconButton,
  LocknUnLockIconButton,
  ViewDetailIconButton,
} from "~/components/Button";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import { renderStatusTag } from "~/utils/utils";
import Table from "~/examples/Tables/Table";
import PopupRoot from "~/components/Popup/PopupRoot";
import Input from "~/components/Input";

const columns = [
  {
    name: "STT",
    sortable: true,
    align: "center",
  },
  {
    name: "Tên danh mục",
    sortable: true,
    align: "center",
  },
  {
    name: "Mã danh mục",
    sortable: true,
    align: "center",
  },
  {
    name: "Loại danh mục",
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
  page: 0,
  size: 20,
  total: 0,
  searchText: "",
  status: "",
};

const CategoryDetailInitialValues = {
  categoryCode: "",
  categoryName: "",
  categoryType: "",
  status: "",
};

function CategoryDetail({ initialProps, isEdit = true }) {
  const [queryFilter, setQueryFilter] = useState(CategoryDetailInitialValues);

  useEffect(() => {
    if (initialProps) setQueryFilter(initialProps);
  }, [initialProps]);
  return (
    <Grid container xs={12} p={2} spacing={2}>
      <Grid item xs={12}>
        <Input label="Mã danh mục" required value={queryFilter.categoryCode} />
      </Grid>
      <Grid item xs={12}>
        <Input label="Tên danh mục" required value={queryFilter.categoryName} />
      </Grid>
      <Grid item xs={12}>
        <SelectBox label="Loại danh mục" width="100%" value={queryFilter.categoryType} />
      </Grid>
      <Grid item xs={12}>
        <SelectBox label="Trạng thái" width="100%" value={queryFilter.status} />
      </Grid>
      {isEdit && (
        <Grid item xs={12}>
          <ButtonControl justifyContent="center" />
        </Grid>
      )}
    </Grid>
  );
}

export function CategoriesList() {
  const [queryFilter, setQueryFilter] = useState(initialValues);
  const [isOpenFilter, setIsOpenFilter] = useState(true);
  const [isRemoveCategory, setIsRemoveCategory] = useState(false);
  const [isLockCategory, setIsLockCategory] = useState(false);
  const [isUnlockCategory, setIsUnlockCategory] = useState(false);
  const [isAddCategory, setIsAddCategory] = useState(false);
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [isViewCategory, setIsViewCategory] = useState(false);

  const handleLockUser = (status) => {
    status === "BI_KHOA" ? setIsUnlockCategory(true) : setIsLockCategory(true);
  };

  const renderGroupBtn = (status, id) => {
    return (
      <Grid container ishiddentooltip="true">
        <SuiTypography component="span" sx={{ display: "flex", width: "200" }}>
          <ViewDetailIconButton onClick={() => setIsViewCategory(true)} />
          <EditIconButton onClick={() => setIsEditCategory(true)} />
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

  const addCategoryPopup = () => {
    return (
      <PopupRoot
        title="Thêm mới danh mục"
        open={isAddCategory}
        setOpen={setIsAddCategory}
        closeIcon
      >
        <CategoryDetail />
      </PopupRoot>
    );
  };

  const editCategoryPopup = () => {
    return (
      <PopupRoot
        title="Cập nhật danh mục"
        open={isEditCategory}
        setOpen={setIsEditCategory}
        closeIcon
      >
        <CategoryDetail />
      </PopupRoot>
    );
  };

  const viewCategoryPopup = () => {
    return (
      <PopupRoot
        title="Thông tin danh mục"
        open={isViewCategory}
        setOpen={setIsViewCategory}
        closeIcon
      >
        <CategoryDetail isEdit={false} />
      </PopupRoot>
    );
  };

  const data = [
    {
      STT: "1",
      "Tên danh mục": "Quận 1",
      "Mã danh mục": "Q1",
      "Loại danh mục": "Quận/huyện",
      "Trạng thái": renderStatusTag("HOAT_DONG"),
      "Hành động": renderGroupBtn("HOAT_DONG", 1),
    },
    {
      STT: "2",
      "Tên danh mục": "Quận 2",
      "Mã danh mục": "Q2",
      "Loại danh mục": "Quận/huyện",
      "Trạng thái": renderStatusTag("BI_KHOA"),
      "Hành động": renderGroupBtn("BI_KHOA", 2),
    },
    {
      STT: "3",
      "Tên danh mục": "Quận 3",
      "Mã danh mục": "Q3",
      "Loại danh mục": "Quận/huyện",
      "Trạng thái": renderStatusTag("MOI_TAO"),
      "Hành động": renderGroupBtn("MOI_TAO", 3),
    },
  ];
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {lockCategoryPopup()}
      {unlockCategoryPopup()}
      {removeCategoryPopup()}
      {addCategoryPopup()}
      {editCategoryPopup()}
      {viewCategoryPopup()}
      <Grid container spacing={2}>
        <Grid container item xs={12} sm={12} lg={12} spacing={1}>
          <Grid item xs={12} sm={8} lg={5}>
            <SearchInput
              isOpenFilter={isOpenFilter}
              setIsOpenFilter={setIsOpenFilter}
              placeholder="Nhập mã, tên vai trò"
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={7} display="flex" justifyContent="end" alignItems="center">
            <ButtonControl
              hiddenCancel
              submitText="Thêm mới"
              handleSubmit={() => setIsAddCategory(true)}
              imageSubmit={WhitePlusIcon}
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
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
