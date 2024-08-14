import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Grid, InputBase, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  approveReportRequest,
  cancelReportRequest,
  createReport,
  getStatisticReportDetail,
  rejectReportRequest,
  updateReport,
  uploadFilePublic,
} from "~/api/common";
import ButtonControl from "~/components/ButtonControl";
import MyDropzone from "~/components/MyDropZone";
import SuiBox from "~/components/SuiBox";
import RedSaveIcon from "~/assets/images/icons/red-save-icon.svg";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import useErrorMessage from "~/hooks/useErrorMessage";
import { handleResponse, renderStatusTag } from "~/utils/utils";
import RedReturnIcon from "~/assets/images/icons/red-return.svg";
import WhiteCancelIcon from "~/assets/images/icons/white-cancel.svg";
import SuiButton from "~/components/SuiButton";
import { ConfirmPopup } from "~/components/Popup/ConfirmPopup";
import PopupRoot from "~/components/Popup/PopupRoot";
import DatePicker from "~/components/DatePicker";
import Input from "~/components/Input";
import SelectBox from "~/components/SelectBox";
import TextArea from "~/components/TextArea";
import { getLocalUserInfo } from "~/utils/storage";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import moment from "moment";
import { isRequired } from "~/utils/verify";

const uploadAdapter = (loader) => {
  const userInfo = getLocalUserInfo();
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        loader.file.then((file) => {
          uploadFilePublic(file, userInfo.username)
            .then((res) => {
              resolve({
                default:
                  import.meta.env.VITE_API_URL +
                  "/api/" +
                  import.meta.env.VITE_API_VERSION +
                  "/" +
                  res.message.data.data?.url,
              });
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    },
  };
};

function uploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}

const ApproveContent = ({ data, handleCancel, handleSubmit }) => {
  const userInfo = getLocalUserInfo();

  const initValues = {
    name: "",
    unit: "",
    createdAt: null,
    approveName: "",
    approveUnit: "",
    comments: "",
  };
  const [queryFilter, setQueryFilter] = useState(data || initValues);

  const handleChange = (name, value) => {
    setQueryFilter({ ...queryFilter, [name]: value });
  };

  return (
    <Grid container p={2} columnSpacing={2} rowSpacing={1}>
      <Grid item xs={12} display="flex" justifyContent="flex-start">
        <Typography fontWeight={700} fontSize={16}>
          Người tạo
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <Input label="Họ và tên" value={queryFilter?.createdBy?.fullname} disabled />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Cơ quan chuyên trách"
          placeholder="Tất cả"
          value={queryFilter?.unit}
          isDisabled
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <DatePicker label="Ngày tạo" value={queryFilter?.createdAt} disabled />
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="flex-start">
        <Typography fontWeight={700} fontSize={16}>
          Người phê duyệt
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <Input label="Họ và tên" value={userInfo?.profile?.fullname} disabled />
      </Grid>
      <Grid item xs={12} sm={6} lg={6} xl={6}>
        <SelectBox
          label="Cơ quan chuyên trách"
          placeholder="Tất cả"
          value={userInfo?.profile?.position?.unit?.name}
          isDisabled
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={12} xl={12}>
        <TextArea
          label="Nhận xét"
          width="100%"
          value={queryFilter.comments}
          onChange={(e) => handleChange("comments", e.target.value)}
        />
      </Grid>
      <Grid xs={12} mt={2}>
        <ButtonControl
          justifyContent="center"
          cancelText="Quay lại"
          submitText="Gửi kết quả"
          imageCancel={RedReturnIcon}
          handleCancel={handleCancel}
          handleSubmit={() => handleSubmit(queryFilter.comments)}
        />
      </Grid>
    </Grid>
  );
};

// statusFeature: [view, edit, approve, add]
export default function StatisticReportDetail({ statusFeature = "add" }) {
  const isEdit = statusFeature === "edit" || statusFeature === "add";
  const params = useParams();
  const reportId = params?.id;

  const userInfo = getLocalUserInfo();
  const [dataReport, setDataReport] = useState({
    name: "",
    attachmentFiles: [],
    createdAt: new Date(),
    createdBy: "",
    statsIndexId: "",
    groupId: "",
    approverName: "",
    approverUnit: "",
  });

  const [htmlPage, setHtmlPage] = useState("<p>Nội dung báo cáo</p>");

  const [isSendRequest, setIsSendRequest] = useState(false);
  const [isSaveRequest, setIsSaveRequest] = useState(false);
  const [isApprovePopup, setIsApprovePopup] = useState(false);
  const [isRejectPopup, setIsRejectPopup] = useState(false);
  const [isCancelPopup, setIsCancelPopup] = useState(false);
  const { setSuccessMessage } = useSuccessMessage();
  const { setErrorMessage } = useErrorMessage();
  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setDataReport({ ...dataReport, [name]: value });
  };

  useEffect(() => {
    if (reportId) {
      getStatisticReportDetail(reportId).then((res) => {
        const [status, dataResponse] = handleResponse(res);
        if (status) {
          setDataReport({
            ...dataResponse,
            groupId: dataResponse?.statsIndex?.group?.id,
            statsIndexId: dataResponse?.statsIndex?.id,
            approverName: dataResponse?.lastProcess?.actor?.fullname,
            approverUnit: dataResponse?.lastProcess?.actor?.position?.unit?.name,
          });
          setHtmlPage(dataResponse?.htmlPage);
        } else setErrorMessage(dataResponse);
      });
    }
  }, []);

  const handleValidate = () => {
    try {
      isRequired(dataReport.statsIndexId, "Chỉ tiêu");
      isRequired(dataReport.name, "Tiêu đề báo cáo");
    } catch (e) {
      setErrorMessage(e);
      throw e;
    }
  };

  const handleSendRequest = (isDraft = false) => {
    const { name, attachmentFiles, statsIndexId } = dataReport;
    if (statusFeature === "add") {
      createReport({ name, htmlPage, attachmentFiles, isDraft, statsIndexId }).then((response) => {
        const [status, dataResponse] = handleResponse(response);
        if (status) {
          isDraft ? setSuccessMessage("Lưu thành công") : setSuccessMessage("Thêm mới thành công");
          setIsSendRequest(false);
          setIsSaveRequest(false);
          navigate("/statistic-report?tab=1");
        } else {
          setErrorMessage(dataResponse);
        }
      });
    } else if (statusFeature === "edit") {
      const { attachmentFiles } = dataReport;
      const newAttachmentFiles = attachmentFiles?.filter((item) => !item?.id);
      const oldAttachmentFiles = attachmentFiles?.filter((item) => item?.id);
      updateReport({
        id: reportId,
        name,
        htmlPage,
        isDraft,
        statsIndexId,
        sendRequest: true,
        attachmentFiles: oldAttachmentFiles,
        newAttachmentFiles: newAttachmentFiles,
      }).then((response) => {
        const [status, dataResponse] = handleResponse(response);
        if (status) {
          if (isDraft) {
            setSuccessMessage("Cập nhật thành công");
            navigate("/statistic-report?tab=1");
          } else {
            setSuccessMessage("Gửi yêu cầu thành công");
            navigate("/statistic-report?tab=1");
          }
        } else {
          setErrorMessage(dataResponse);
        }
      });
    }
  };

  const handleApproveRequest = (comments) => {
    approveReportRequest({ comments, reportId }).then((response) => {
      const [status, dataResponse] = handleResponse(response);
      if (status) {
        setSuccessMessage("Phê duyệt thành công");
        setIsApprovePopup(false);
        navigate("/statistic-report?tab=0");
      } else setErrorMessage(dataResponse);
    });
  };

  const handleRejectRequest = (comments) => {
    rejectReportRequest({ comments, reportId }).then((response) => {
      const [status, dataResponse] = handleResponse(response);
      if (status) {
        setSuccessMessage("Từ chối thành công");
        setIsRejectPopup(false);
        navigate("/statistic-report?tab=0");
      } else setErrorMessage(dataResponse);
    });
  };

  const handleCancelRequest = () => {
    cancelReportRequest(reportId).then((response) => {
      const [status, dataResponse] = handleResponse(response);
      if (status) {
        setSuccessMessage("Hủy thành công");
        setIsCancelPopup(false);
        navigate("/statistic-report?tab=1");
      } else setErrorMessage(dataResponse);
    });
  };

  const isSendRequestPopup = () => {
    return (
      <ConfirmPopup
        open={isSendRequest}
        setOpen={setIsSendRequest}
        questionText="Bạn có đồng ý gửi phê duyệt báo cáo này?"
        NotiText="Báo cáo gửi đi sẽ không thể chỉnh sửa"
        handleSubmit={() => handleSendRequest(false)}
      />
    );
  };

  const isSaveRequestPopup = () => {
    return (
      <ConfirmPopup
        open={isSaveRequest}
        setOpen={setIsSaveRequest}
        questionText="Bạn có đồng ý lưu báo cáo này?"
        NotiText="Báo cáo sẽ được lưu thành bản nháp"
        handleSubmit={() => handleSendRequest(true)}
      />
    );
  };

  const isApproveReportPopup = () => {
    return (
      <PopupRoot title="Phê duyệt báo cáo" open={isApprovePopup} setOpen={setIsApprovePopup}>
        <ApproveContent
          data={dataReport}
          handleCancel={() => setIsApprovePopup(false)}
          handleSubmit={handleApproveRequest}
        />
      </PopupRoot>
    );
  };

  const isRejectReportPopup = () => {
    return (
      <PopupRoot title="Từ chối báo cáo" open={isRejectPopup} setOpen={setIsRejectPopup}>
        <ApproveContent
          data={dataReport}
          handleCancel={() => setIsRejectPopup(false)}
          handleSubmit={handleRejectRequest}
        />
      </PopupRoot>
    );
  };

  const isCancelReportPopup = () => {
    return (
      <ConfirmPopup
        questionText="Bạn có đồng ý hủy báo cáo này?"
        NotiText="Báo cáo hủy sẽ không thể thay đổi"
        open={isCancelPopup}
        setOpen={setIsCancelPopup}
        handleSubmit={handleCancelRequest}
      />
    );
  };

  const renderApproveGroupBtn = () => {
    return (
      statusFeature === "approve" &&
      dataReport?.status === "PENDING" &&
      !dataReport?.isDraft && (
        <>
          <Grid width="fit-content">
            <ButtonControl
              hiddenCancel
              submitText="Phê duyệt"
              handleSubmit={() => setIsApprovePopup(true)}
            />
          </Grid>
          <Grid width="fit-content">
            <ButtonControl
              hiddenCancel
              submitText="Từ chối"
              imageSubmit={WhiteCancelIcon}
              handleSubmit={() => setIsRejectPopup(true)}
            />
          </Grid>
        </>
      )
    );
  };

  const renderCancelGroupBtn = () => {
    return (
      statusFeature === "view" &&
      !dataReport?.isDraft &&
      dataReport?.status === "PENDING" && (
        <Grid width="fit-content">
          <ButtonControl
            hiddenCancel
            submitText="Hủy yêu cầu"
            handleSubmit={() => setIsCancelPopup(true)}
            imageSubmit={WhiteCancelIcon}
          />
        </Grid>
      )
    );
  };

  const InfoReport = () => {
    const isDisplay =
      statusFeature === "add" ||
      statusFeature === "edit" ||
      dataReport?.status === "PENDING" ||
      dataReport?.status === "CANCELED";
    return (
      isDisplay && (
        <Grid container p={2} mt={2} className="card-content">
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="flex-start"
            sx={{ paddingLeft: "0px !important" }}
          >
            <Typography fontWeight={700} fontSize={16}>
              Thông tin báo cáo
            </Typography>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <SelectBox
                label="Nhóm chỉ tiêu"
                dataSource="/stats-index-groups/list"
                mapping={{ value: "id", label: "name" }}
                placeholder="Chọn nhóm chỉ tiêu"
                value={dataReport.groupId}
                onChange={(e) => handleChange("groupId", e.value)}
                isDisabled={!isEdit}
                isHaveAllOptions={false}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4}>
              <SelectBox
                label="Chỉ tiêu"
                dataSource={`/stats-indices${
                  dataReport.groupId ? "?groupId=" + dataReport.groupId : ""
                }`}
                mapping={{ value: "id", label: "name" }}
                dependency={[dataReport.groupId]}
                placeholder="Chọn chỉ tiêu"
                value={dataReport.statsIndexId}
                onChange={(e) => handleChange("statsIndexId", e.value)}
                isDisabled={!isEdit}
                isHaveAllOptions={false}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4} xl={4} display="flex" alignItems="center">
              {dataReport?.status &&
                renderStatusTag(dataReport?.isDraft ? "DRAFT" : dataReport?.status)}
            </Grid>
            {dataReport?.status === "PENDING" && !dataReport?.isDraft && (
              <>
                <Grid item xs={12} sm={6} lg={4} xl={4}>
                  <Input label="Người phê duyệt" value={dataReport?.approverName} disabled />
                </Grid>
                <Grid item xs={12} sm={6} lg={4} xl={4}>
                  <SelectBox
                    label="Cơ quan phê duyệt"
                    placeholder="Tất cả"
                    value={dataReport?.approverUnit}
                    isDisabled
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      )
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <>
        {isSendRequestPopup()}
        {isSaveRequestPopup()}
        {isApproveReportPopup()}
        {isRejectReportPopup()}
        {isCancelReportPopup()}
        {InfoReport()}
        <Grid container p={2} mt={2} className="card-content">
          <Grid item xs={12} lg={12} display="flex">
            <Grid item xs={12} sm={9} lg={9}>
              {isEdit ? (
                <InputBase
                  placeholder="Nhập tiêu đề báo cáo"
                  color="#2D3442"
                  value={dataReport?.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  sx={{
                    border: "none",
                    ".MuiInputBase-input": {
                      fontSize: "24px",
                      fontWeight: "700",
                      height: "auto",
                    },
                  }}
                />
              ) : (
                <Tooltip title={dataReport?.name}>
                  <Typography
                    sx={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                    color="#2D3442"
                    fontSize="24px"
                    fontWeight="700"
                  >
                    {dataReport?.name}
                  </Typography>
                </Tooltip>
              )}
            </Grid>
            <Grid item xs={6} sm={3} lg={3} mt={2} display="flex" justifyContent="end">
              <Typography fontSize={14} fontWeight={700} color="#2D3442" mr={0.5}>
                {dataReport?.createdBy?.fullname || userInfo?.profile?.fullname}
              </Typography>
              <Typography fontSize={14}>
                - {moment(dataReport?.createdAt).format("DD/MM/YYYY")}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={12} xl={12} display="flex" justifyContent="center" mt={1}>
            <SuiBox sx={{ border: "1px solid #F10035", width: "90%" }} />
          </Grid>

          <Grid
            item
            xs={12}
            lg={12}
            xl={12}
            mt={3}
            sx={{
              ".ck-editor__top": { display: isEdit ? "contents" : "none" },
              ".ck-content": {
                p: { fontSize: "16px" },
                h4: { fontSize: "18px" },
                h3: { fontSize: "24px" },
                h2: { fontSize: "32px" },
              },
            }}
          >
            <CKEditor
              editor={ClassicEditor}
              config={{
                extraPlugins: [uploadPlugin],
              }}
              data={htmlPage}
              onChange={(event, editor) => {
                setHtmlPage(editor.getData());
              }}
              disabled={!isEdit}
            />
          </Grid>
          <Grid item xs={12} lg={12} xl={12} display="flex" justifyContent="center" mt={2}>
            <SuiBox sx={{ border: "1px solid #F10035", width: "90%" }} />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-start" mt={2}>
            <Typography fontWeight={700} fontSize={16}>
              Tệp tin đính kèm
            </Typography>
          </Grid>
          <Grid item xs={12} mt={2}>
            <MyDropzone
              isEdit={isEdit}
              files={dataReport?.attachmentFiles}
              setFiles={(e) => handleChange("attachmentFiles", e)}
            />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="center" gap={2} mt={2}>
            <Grid width="fit-content">
              <ButtonControl
                hiddenSubmit
                cancelText="Quay lại"
                imageCancel={RedReturnIcon}
                handleCancel={() => navigate(-1)}
              />
            </Grid>
            {isEdit && (
              <>
                <Grid width="fit-content">
                  <SuiButton
                    sx={{
                      color: "red",
                      background: "#F8ADAD",
                      ":hover": { background: "#F8ADAD" },
                    }}
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
            {renderApproveGroupBtn()}
            {renderCancelGroupBtn()}
          </Grid>
        </Grid>
      </>
    </DashboardLayout>
  );
}
