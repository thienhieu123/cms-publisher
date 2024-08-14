import { Grid, Typography } from "@mui/material";
import Input from "~/components/Input";
import MyDropzone from "~/components/MyDropZone";
import RedSaveIcon from "~/assets/images/icons/red-save-icon.svg";
import RedReturnIcon from "~/assets/images/icons/red-return.svg";
import WhiteCancel from "~/assets/images/icons/white-cancel.svg";
import ButtonControl from "~/components/ButtonControl";
import SuiButton from "~/components/SuiButton";
import SelectBox from "~/components/SelectBox";
import { handleDownload, handleResponse, renderStatusTag } from "~/utils/utils";
import { useEffect, useState } from "react";
import TextArea from "~/components/TextArea";
import DatePicker from "~/components/DatePicker";
import { requestTypeTable, resultRequestOptions } from "~/constants/config";
import { approveRequest, createUpdateRequestFromFile, getUpdateRequestDetail } from "~/api/common";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import useErrorMessage from "~/hooks/useErrorMessage";
import { isRequired } from "~/utils/verify";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";

const initialValues = {
  name: "",
  createdAt: new Date(),
  type: "THROUGH_FILE",
  dataFile: [],
  attachmentFiles: [],
  approverName: "",
  approverUnit: "",
  comment: "",
  action: "",
};

export default function RequestFromFolderPopup({
  status,
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
            type: dataResponse.type,
            name: dataResponse.name,
            createdAt: dataResponse.createdAt,
            dataFile: dataResponse.dataFile ? [dataResponse.dataFile] : null,
            attachmentFiles: dataResponse.attachmentFiles,
            approverName: dataResponse?.latestProcess?.actor?.fullname,
            approverUnit: dataResponse?.latestProcess?.actor?.position?.unit?.name,
            comment: dataResponse?.latestProcess?.comments,
          });
        } else setErrorMessage(dataResponse);
      });
    }
  }, [status]);

  //   trạng thái chờ xử lý
  const handleSubmitCancelButton = () => {
    if (feature === "approve") {
      // role phê duyệt yêu cầu
      approveRequest({ requestId, action: queryFilter.action, comments: queryFilter.comment }).then(
        (response) => {
          const [status, dataResponse] = handleResponse(response);
          if (status) {
            setSuccessMessage("Gửi kết quả thành công");
            handleSubmit();
          } else setErrorMessage(dataResponse);
        }
      );
    } else {
      // role cập nhật yêu cầu
      approveRequest({ requestId, action: "CANCEL" }).then((response) => {
        const [status, dataResponse] = handleResponse(response);
        if (status) {
          setSuccessMessage("Hủy yêu cầu thành công");
          handleSubmit();
        } else setErrorMessage(dataResponse);
      });
    }
  };

  //   trạng thái chờ xử lý
  const renderCancelRequestButton = () => {
    return (
      isPending && (
        <Grid width="fit-content">
          <ButtonControl
            hiddenCancel
            submitText={feature === "approve" ? "Gửi kết quả" : "Hủy yêu cầu"}
            imageSubmit={feature !== "approve" && WhiteCancel}
            handleSubmit={handleSubmitCancelButton}
          />
        </Grid>
      )
    );
  };

  //   trạng thái chờ xử lý
  const renderEditCommentRequest = () => {
    return (
      isPending &&
      feature === "approve" && (
        <>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <SelectBox
              label="Kết quả"
              options={resultRequestOptions}
              value={queryFilter.action}
              onChange={(e) => handleChange("action", e.value)}
              placeholder="Tất cả"
              required={false}
              width="100%"
            />
          </Grid>
          <Grid item xs={12}>
            <TextArea
              label="Nội dung kết quả"
              value={queryFilter.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
            />
          </Grid>
        </>
      )
    );
  };

  const renderCommentRequest = () => {
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
      isRequired(
        queryFilter.dataFile,
        "Tệp thêm mới số liệu",
        "Vui lòng thêm tệp thêm mới số liệu"
      );
      isRequired(queryFilter.attachmentFiles, "Tệp đính kèm", "Vui lòng thêm tệp đính kèm");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const handleSentRequest = (isDraft = false) => {
    const { name, createdAt, type, dataFile, attachmentFiles } = queryFilter;
    handleValidate();
    createUpdateRequestFromFile({
      name,
      createdAt,
      type,
      dataFile: dataFile[0],
      attachmentFiles,
      isDraft,
    }).then((result) => {
      const [status, dataResponse] = handleResponse(result);
      if (status) {
        setSuccessMessage("Thêm mới thành công");
        handleSubmit();
      } else setErrorMessage(dataResponse);
    });
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
          width="100%"
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6} display="flex" alignItems="center">
        {renderStatusTag(status)}
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="flex-start" mt={2}>
        <Typography fontWeight={700} fontSize={16}>
          Tệp thêm mới số liệu
        </Typography>
      </Grid>
      <Grid item xs={12} mt={2}>
        <MyDropzone
          isHaveSampleFile
          isEdit={!isDisabled}
          files={queryFilter.dataFile}
          setFiles={(e) => {
            handleChange("dataFile", e);
          }}
          multiple={false}
          handleClickSampleFile={() =>
            handleDownload(
              "https://kinhteso.gpmn.net:9201/api/v1/file-storage/serve-default?fileName=templates%2Fimport_stats_values.xlsx",
              "import_stats_values.xlsx"
            )
          }
        />
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="flex-start" mt={2}>
        <Typography fontWeight={700} fontSize={16}>
          Tệp đính kèm
        </Typography>
      </Grid>
      <Grid item xs={12} mt={2}>
        <MyDropzone
          isEdit={!isDisabled}
          files={queryFilter.attachmentFiles}
          setFiles={(e) => {
            handleChange("attachmentFiles", e);
          }}
        />
      </Grid>
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
          {renderCommentRequest()}
          {renderEditCommentRequest()}
        </>
      )}
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
                submitText="Gửi phê duyệt"
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
