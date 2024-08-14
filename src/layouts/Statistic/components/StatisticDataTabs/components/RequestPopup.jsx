import { Grid, Typography } from "@mui/material";
import ButtonControl from "~/components/ButtonControl";
import DateRangePicker from "~/components/DateRangePicker";
import Input from "~/components/Input";
import MyDropzone from "~/components/MyDropZone";
import SelectBox from "~/components/SelectBox";
import SuiButton from "~/components/SuiButton";
import RedSaveIcon from "~/assets/images/icons/red-save-icon.svg";
import { getStartDateDefault, handleResponse, renderStatusTag } from "~/utils/utils";
import { useEffect, useState } from "react";
import WhiteCancel from "~/assets/images/icons/white-cancel.svg";
import RedReturnIcon from "~/assets/images/icons/red-return.svg";
import TextArea from "~/components/TextArea";
import DatePicker from "~/components/DatePicker";
import {
  approveRequest,
  createUpdateRequest,
  getUpdateRequestDetail,
  updateRequest,
} from "~/api/common";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import { requestTypeTable, resultRequestOptions } from "~/constants/config";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import { isRequired } from "~/utils/verify";

const initialValues = {
  name: "",
  groupId: "",
  statsIndexId: "",
  districtAreaCode: "",
  periodStartDate: getStartDateDefault(),
  periodEndDate: new Date(),
  createdAt: new Date(),
  newValue: "",
  oldValue: "0",
  unit: "VNĐ",
  dataFile: null,
  isDraft: false,
  approverName: "",
  approverUnit: "",
  comment: "",
  action: "",
  type: "MANUAL",
};
export default function RequestPopup({
  status = "",
  requestId,
  data,
  handleCancel = () => {},
  handleSave = () => {},
  handleSubmit = () => {},
  feature = "update",
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [queryFilter, setQueryFilter] = useState(data || initialValues);
  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();
  const [isSaveRequest, setIsSaveRequest] = useState(false);
  const [isSendRequest, setIsSendRequest] = useState(false);

  const isApproved = status === "APPROVED";
  const isPending = status === "PENDING";
  const isRejected = status === "REJECTED";
  const isDraft = status === "DRAFT";

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  const handleEditForm = (status) => {
    if (!status || isDraft) setIsDisabled(false);
    else setIsDisabled(true);
  };
  useEffect(() => {
    handleEditForm(status);
    if (requestId) {
      getUpdateRequestDetail(requestId).then((result) => {
        const [status, dataResponse] = handleResponse(result);
        if (status) {
          setQueryFilter({
            ...queryFilter,
            type: dataResponse?.type,
            name: dataResponse?.name,
            groupId: dataResponse?.statsIndex?.group?.id,
            statsIndexId: dataResponse?.statsIndex?.id,
            unit: dataResponse?.statsIndex?.deafaultMeasurementUnit?.name,
            districtAreaCode: dataResponse?.district?.areaCode,
            periodStartDate: dataResponse?.periodStartDate,
            periodEndDate: dataResponse?.periodEndDate,
            newValue: dataResponse?.newValue,
            oldValue: dataResponse?.oldValue,
            dataFile: dataResponse?.dataFile ? [dataResponse?.dataFile] : null,
            createdAt: dataResponse?.createdAt,
            approverName: dataResponse?.latestProcess?.actor?.fullname,
            approverUnit: dataResponse?.latestProcess?.actor?.position?.unit?.name,
            comment: dataResponse?.latestProcess?.comments,
          });
        } else setErrorMessage(dataResponse);
      });
    }
  }, [status, requestId]);

  const handleValidateApprove = () => {
    try {
      isRequired(queryFilter?.action, "Kết quả", "Vui lòng chọn kết quả");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const handleSubmitCancelButton = () => {
    if (feature === "approve") {
      handleValidateApprove();
      approveRequest({
        requestId,
        action: queryFilter?.action,
        comments: queryFilter?.comment,
      }).then((response) => {
        const [status, dataResponse] = handleResponse(response);
        if (status) {
          setSuccessMessage("Gửi kết quả thành công");
          handleSubmit();
        } else setErrorMessage(dataResponse);
      });
    } else {
      approveRequest({ requestId, action: "CANCEL" }).then((response) => {
        const [status, dataResponse] = handleResponse(response);
        if (status) {
          setSuccessMessage("Hủy yêu cầu thành công");
          handleSubmit();
        } else setErrorMessage(dataResponse);
      });
    }
  };

  const renderCancelRequestButton = () => {
    return (
      isPending && (
        <Grid width="fit-content">
          <ButtonControl
            hiddenCancel
            submitText={feature === "approve" ? "Gửi kết quả" : "Hủy yêu cầu"}
            imageSubmit={feature !== "approve" ? WhiteCancel : ""}
            handleSubmit={handleSubmitCancelButton}
          />
        </Grid>
      )
    );
  };

  const renderEditCommentRequest = () => {
    return (
      isPending &&
      feature === "approve" && (
        <>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <SelectBox
              label="Kết quả"
              options={resultRequestOptions}
              onChange={(e) => handleChange("action", e.value)}
              value={queryFilter.action}
              placeholder="Tất cả"
              required
              width="100%"
            />
          </Grid>
          <Grid item xs={12}>
            <TextArea
              value={queryFilter.comment}
              label="Nội dung kết quả"
              onChange={(e) => handleChange("comment", e.target.value)}
            />
          </Grid>
        </>
      )
    );
  };
  const renderResultRequest = () => {
    return (
      (isApproved || isRejected) && (
        <Grid item xs={12}>
          <TextArea label="Nội dung kết quả" value={queryFilter.comment} disabled />
        </Grid>
      )
    );
  };

  const handleValidate = () => {
    try {
      isRequired(queryFilter.newValue, "Giá trị");
      isRequired(queryFilter.dataFile, "Tệp đính kèm", "Vui lòng thêm tệp đính kèm");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const handleSentRequest = (isDraft = false) => {
    const {
      type,
      name,
      statsIndexId,
      districtAreaCode,
      periodStartDate,
      periodEndDate,
      newValue,
      oldValue,
      dataFile,
    } = queryFilter;
    const file = dataFile?.length ? dataFile[0] : null;
    const newFile = file?.id ? file : null;
    if (status === "DRAFT") {
      updateRequest({
        requestId,
        type,
        name,
        statsIndexId,
        districtAreaCode,
        periodStartDate,
        periodEndDate,
        newValue,
        oldValue,
        isDraft,
        sendRequest: true,
        newDataFile: newFile,
      }).then((result) => {
        const [status, dataResponse] = handleResponse(result);
        if (status) {
          setSuccessMessage("Cập nhật thành công");
          handleSubmit();
        } else setErrorMessage(dataResponse);
      });
    } else {
      createUpdateRequest({
        type,
        name,
        statsIndexId,
        districtAreaCode,
        periodStartDate,
        periodEndDate,
        newValue,
        oldValue,
        dataFile: file,
        isDraft,
      }).then((result) => {
        const [status, dataResponse] = handleResponse(result);
        if (status) {
          setSuccessMessage("Thêm mới thành công");
          handleSubmit();
        } else setErrorMessage(dataResponse);
      });
    }
  };

  const isSaveRequestPopup = () => {
    return (
      <ConfirmPopup
        open={isSaveRequest}
        setOpen={setIsSaveRequest}
        questionText="Bạn có đồng ý lưu yêu cầu này?"
        NotiText="Yêu cầu sẽ được lưu thành bản nháp"
        handleSubmit={() => handleSentRequest(true)}
      />
    );
  };

  const isSendRequestPopup = () => {
    return (
      <ConfirmPopup
        open={isSendRequest}
        setOpen={setIsSendRequest}
        questionText="Bạn có đồng ý gửi phê duyệt báo cáo này?"
        NotiText="Báo cáo gửi đi sẽ không thể chỉnh sửa"
        handleSubmit={() => handleSentRequest(false)}
      />
    );
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
      {isSaveRequestPopup()}
      {isSendRequestPopup()}
      <Grid item xs={12} display="flex" justifyContent="flex-start">
        <Typography fontWeight={700} fontSize={16}>
          Thông tin số liệu
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <Input
          label="Tên yêu cầu"
          value={queryFilter.name}
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={isDisabled}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <DatePicker
          placeholder="Chọn ngày"
          label="Ngày tạo"
          value={queryFilter.createdAt}
          disabled
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Loại yêu cầu"
          value={queryFilter.type}
          options={requestTypeTable}
          isDisabled
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Nhóm chỉ tiêu"
          dataSource="/stats-index-groups/list"
          mapping={{ value: "id", label: "name" }}
          placeholder="Chọn nhóm chỉ tiêu"
          value={queryFilter.groupId}
          onChange={(e) =>
            setQueryFilter({
              ...queryFilter,
              groupId: e.value,
              statsIndexId: "",
            })
          }
          isDisabled={isDisabled}
          isHaveAllOptions={false}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Chỉ tiêu"
          dataSource={`/stats-indices${
            queryFilter.groupId ? "?groupId=" + queryFilter.groupId : ""
          }`}
          mapping={{ value: "id", label: "name" }}
          dependency={[queryFilter.groupId]}
          placeholder="Chọn chỉ tiêu"
          value={queryFilter.statsIndexId}
          onChange={(e) => {
            setQueryFilter({
              ...queryFilter,
              statsIndexId: e.value,
              unit: e?.deafaultMeasurementUnit?.name,
            });
          }}
          isDisabled={isDisabled}
          isHaveAllOptions={false}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Quận/huyện"
          dataSource="/area/districts?parentCode=T008"
          mapping={{ value: "areaCode", label: "name" }}
          placeholder="Chọn quận/huyện"
          value={queryFilter.districtAreaCode}
          onChange={(e) => handleChange("districtAreaCode", e.value)}
          isDisabled={isDisabled}
          isHaveAllOptions={false}
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
          disabled={isDisabled}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <Input
          label="Giá trị"
          value={queryFilter.newValue}
          onChange={(e) => handleChange("newValue", e.target.value)}
          required
          disabled={isDisabled}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <Input label="Giá trị cũ" value={queryFilter.oldValue} disabled />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <Input label="Đơn vị" value={queryFilter.unit} disabled />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6} display="flex" alignItems="center">
        {renderStatusTag(status)}
      </Grid>
      {/* File */}
      <Grid item xs={12} display="flex" justifyContent="flex-start" mt={2}>
        <Typography fontWeight={700} fontSize={16}>
          Tệp đính kèm
        </Typography>
      </Grid>
      <Grid item xs={12} mt={2}>
        <MyDropzone
          isEdit={!isDisabled}
          files={queryFilter.dataFile}
          setFiles={(e) => {
            handleChange("dataFile", e);
          }}
          multiple={false}
        />
      </Grid>
      {/*  */}
      {isDisabled && (
        <>
          <Grid item xs={12} display="flex" justifyContent="flex-start" mt={2}>
            <Typography fontWeight={700} fontSize={16}>
              Người phê duyệt
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <Input label="Họ và tên" value={queryFilter?.approverName} disabled />
          </Grid>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <SelectBox
              label="Cơ quan chuyên trách"
              placeholder="Tất cả"
              value={queryFilter?.approverUnit}
              required={false}
              isDisabled
              width="100%"
            />
          </Grid>
          {renderResultRequest()}
          {renderEditCommentRequest()}
        </>
      )}

      {/* group button */}
      <Grid item xs={12} display="flex" justifyContent="center" gap={2} mt={1}>
        <Grid width="fit-content">
          <ButtonControl
            hiddenSubmit
            cancelText="Quay lại"
            imageCancel={RedReturnIcon}
            handleCancel={handleCancel}
          />
        </Grid>
        {!isDisabled && (
          <>
            <Grid width="fit-content">
              <SuiButton
                sx={{ color: "red", background: "#F8ADAD", ":hover": { background: "#F8ADAD" } }}
                onClick={() => {
                  handleValidate();
                  setIsSaveRequest(true);
                }}
              >
                <img src={RedSaveIcon} alt="Lưu" style={{ marginRight: "8px" }} />
                Lưu
              </SuiButton>
            </Grid>
            <Grid width="fit-content">
              <ButtonControl
                hiddenCancel
                submitText={feature === "approve" ? "Gửi kết quả" : "Gửi phê duyệt"}
                handleSubmit={() => {
                  handleValidate();
                  setIsSendRequest(true);
                }}
              />
            </Grid>
          </>
        )}
        {renderCancelRequestButton()}
      </Grid>
    </Grid>
  );
}
