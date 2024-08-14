import { Grid, Typography } from "@mui/material";
import DashboardLayout from "~/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "~/examples/Navbars/DashboardNavbar";
import RequestInfo from "./RequestInfo";
import TableInfo from "./TableInfo";
import MyDropzone from "~/components/MyDropZone";
import RedReturnIcon from "~/assets/images/icons/red-return.svg";
import ButtonControl from "~/components/ButtonControl";
import WhiteCancel from "~/assets/images/icons/white-cancel.svg";
import RedSaveIcon from "~/assets/images/icons/red-save-icon.svg";
import { useState } from "react";
import SuiButton from "~/components/SuiButton";

const initialValues = {};
export default function RequestDataSrc({ update }) {
  const [statusRequest, setStatusRequest] = useState(null);
  const [requestInfo, setRequestInfo] = useState({
    requestCode: "",
    requestName: "",
    createdDate: new Date(),
    type: "MANUAL",
  });
  const [requestList, setRequestList] = useState([]);
  const isEdit = statusRequest === "DRAFT" || statusRequest === null;
  const renderSaveBtn = () => {
    return (
      <Grid width="fit-content">
        <SuiButton
          sx={{ color: "red", background: "#F8ADAD", ":hover": { background: "#F8ADAD" } }}
          onClick={() => {}}
        >
          <img src={RedSaveIcon} alt="Lưu" style={{ marginRight: "8px" }} />
          Lưu
        </SuiButton>
      </Grid>
    );
  };
  const renderSendRequest = () => {
    return (
      <Grid width="fit-content">
        <ButtonControl hiddenCancel submitText="Gửi phê duyệt" handleSubmit={() => {}} />
      </Grid>
    );
  };

  const renderCancelRequest = () => {
    return (
      <Grid width="fit-content">
        <ButtonControl
          hiddenCancel
          submitText="Hủy yêu cầu"
          imageSubmit={WhiteCancel}
          handleSubmit={() => {}}
        />
      </Grid>
    );
  };

  const renderGroupBtn = () => {
    if (isEdit)
      return (
        <>
          {renderSaveBtn()}
          {renderSendRequest()}
        </>
      );
    if (statusRequest === "PENDING") return renderCancelRequest();
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <RequestInfo isEdit data={requestInfo} setData={setRequestInfo} />
      <TableInfo requestList={requestList} setRequestList={setRequestList} />
      <Grid item xs={12} mt={2} className="card-content" p={2}>
        <MyDropzone
          files={[]}
          setFiles={(e) => {
            console.log("dataFile", e);
          }}
          multiple={false}
        />
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="center" gap={2} mt={1}>
        <Grid width="fit-content">
          <ButtonControl hiddenSubmit cancelText="Quay lại" imageCancel={RedReturnIcon} />
        </Grid>
        {renderGroupBtn()}
      </Grid>
    </DashboardLayout>
  );
}
