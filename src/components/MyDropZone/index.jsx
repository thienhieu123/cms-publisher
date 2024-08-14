import React, { useCallback, useEffect, useState } from "react";
// import { useDropzone } from "react-dropzone";
import Dropzone from "react-dropzone";
import SuiBox from "~/components/SuiBox";
import { Grid, Tooltip, Typography } from "@mui/material";
import RedUploadIcon from "~/assets/images/icons/red-upload.svg";
import RedDeleteIcon from "~/assets/images/icons/red-trash-bin.svg";
import GreenDeleteIcon from "~/assets/images/icons/green-trash-bin.svg";
import BlackDeleteIcon from "~/assets/images/icons/black-trash-bin.svg";
import BlueDeleteIcon from "~/assets/images/icons/blue-trash-bin.svg";
import RedDownloadIcon from "~/assets/images/icons/red-download.svg";
import GreenDownloadIcon from "~/assets/images/icons/green-download.svg";
import BlueDownloadIcon from "~/assets/images/icons/blue-download.svg";
import BlackDownloadIcon from "~/assets/images/icons/black-download.svg";
import BlackImageIcon from "~/assets/images/icons/black-image.svg";
import WordIcon from "~/assets/images/icons/Word.svg";
import PdfIcon from "~/assets/images/icons/pdf.svg";
import ExcelIcon from "~/assets/images/icons/Excel.svg";
import useErrorMessage from "~/hooks/useErrorMessage";
import { deleteFileStorage, downloadFileStorage } from "~/api/common";
import { handleResponse } from "~/utils/utils";
import useSuccessMessage from "~/hooks/useSuccessMessage";
import { ConfirmPopup } from "../Popup/ConfirmPopup";

const baseStyle = {
  width: "100%",
  minHeight: "200px",
  padding: "15px 15px",
  border: "1px dashed red",
  borderRadius: "20px",
  transition: "border .3s ease-in-out",
  cursor: "pointer",
  alignContent: "center",
};

export default function MyDropzone({
  isEdit = true,
  isHaveSampleFile = false,
  labelSampleFile = "Tải file mẫu import số liệu chỉ tiêu",
  files = [],
  setFiles = () => {},
  multiple = true,
  handleClickSampleFile = () => {},
}) {
  const { setErrorMessage } = useErrorMessage();
  const { setSuccessMessage } = useSuccessMessage();
  const [deletedFile, setDeletedFile] = useState(null);
  const [deletedIdx, setDeletedIdx] = useState(null);
  const [isDeletePopup, setIsDeletePopup] = useState(false);

  const onDrop = (acceptedFiles) => {
    const newFiles = files ? files.concat(acceptedFiles) : acceptedFiles;
    setFiles(newFiles);
  };

  const confirmDeletePopup = () => {
    return (
      <ConfirmPopup
        open={isDeletePopup}
        setOpen={setIsDeletePopup}
        questionText={`Bạn có đồng ý xóa file này ?`}
        NotiText={`File ${deletedFile?.name} sẽ bị xóa khỏi hệ thống`}
        handleSubmit={handleRemove}
      />
    );
  };

  const handleRemove = () => {
    if (deletedFile?.id) {
      deleteFileStorage(deletedFile?.id).then((response) => {
        const [status, dataResponse] = handleResponse(response);
        if (status) {
          setSuccessMessage("Đã xóa thành công");
          setIsDeletePopup(false);
          setDeletedFile(null);
          const newFiles = files.filter((file, index) => deletedIdx !== index);
          setFiles(newFiles);
        } else setErrorMessage(dataResponse);
      });
    }
  };

  const handleRemoveFile = (file, idx) => {
    // if (file?.id) {
    //   setDeletedFile(file);
    //   setDeletedIdx(idx);
    //   setIsDeletePopup(true);
    // } else {
    const newFiles = files.filter((file, index) => idx !== index);
    setFiles(newFiles);
    // }
  };

  const handleDownloadFile = (file) => {
    if (file?.id) {
      downloadFileStorage(file?.id).then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob?.message?.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file?.name);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
    }
  };

  const handleCheckSizeFile = (size, maxSize) => {
    // maxSize in MB
    const fileSize = (size / 1048576).toFixed(2);
    if (fileSize > maxSize || !size) return false;
    return true;
  };

  const handleTypeFile = (file) => {
    let bgColor = "";
    let preIcon = "";
    let postIcon = "";
    if (file) {
      const { type, extension } = file;
      switch (true) {
        // excel
        case type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          extension === "xlsx":
          bgColor = "#E6FFE7";
          preIcon = ExcelIcon;
          postIcon = isEdit ? GreenDeleteIcon : GreenDownloadIcon;
          break;
        // word
        case type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          type === "application/msword" ||
          extension === "docx":
          bgColor = "#ECF8FF";
          preIcon = WordIcon;
          postIcon = isEdit ? BlueDeleteIcon : BlueDownloadIcon;
          break;
        // pdf
        case type === "application/pdf" || extension === "pdf":
          bgColor = "#FFF0EE";
          preIcon = PdfIcon;
          postIcon = isEdit ? RedDeleteIcon : RedDownloadIcon;

          break;
        //   case type?.includes("image"):
        //     bgColor = "#F3F6F9";
        //     preIcon = BlackImageIcon;
        //     postIcon = isEdit ? BlackDeleteIcon : BlackDownloadIcon;
        default:
          bgColor = "#F3F6F9";
          preIcon = BlackImageIcon;
          postIcon = isEdit ? BlackDeleteIcon : BlackDownloadIcon;
      }
    }
    return [bgColor, preIcon, postIcon];
  };

  const boxFile = (file, idx) => {
    if (file) {
      const { name, size } = file;
      if (!handleCheckSizeFile(size, 30)) {
        setErrorMessage(`File ${name} vượt quá 30Mb`);
        handleRemoveFile(file, idx);
      }
      const [bgColor, preIcon, postIcon] = handleTypeFile(file);

      return (
        <SuiBox
          sx={{
            cursor: "pointer",
            color: "#f86778",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "10px",
            backgroundColor: `${bgColor}`,
          }}
          px={3}
          py={1}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "5px",
              width: "-webkit-fill-available",
            }}
          >
            <img src={preIcon} alt="Icon" style={{ marginRight: "10px" }} />
            <Tooltip title={name}>
              <Typography
                fontSize={14}
                color="#44494D"
                sx={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                {name}
              </Typography>
            </Tooltip>
          </div>
          <SuiBox
            onClick={(e) => {
              e.stopPropagation();
              isEdit ? handleRemoveFile(file, idx) : handleDownloadFile(file);
            }}
            component="img"
            src={postIcon}
          />
        </SuiBox>
      );
    }
  };

  const renderFiles = () => {
    return files?.length ? (
      <Grid
        container
        columnSpacing={2}
        mt={2}
        sx={{
          maxHeight: "300px",
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
        {files?.map((file, idx) => {
          return (
            <Grid item xs={12} sm={6} lg={4} xl={4} mt={1} key={idx}>
              {boxFile(file, idx)}
            </Grid>
          );
        })}
      </Grid>
    ) : (
      ""
    );
  };

  if (!isEdit) return renderFiles();
  return (
    <Dropzone
      // accept={accept}
      multiple={multiple}
      onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
    >
      {({ getRootProps, getInputProps }) => (
        <section>
          {confirmDeletePopup()}
          <div {...getRootProps()}>
            <input
              style={{ display: "none" }}
              type="file"
              id="avt"
              {...getInputProps({ multiple })}
            />
            <Grid sx={baseStyle}>
              <Grid item xs={12} display="flex" gap={2} justifyContent="center" fontSize={16}>
                <Typography color="var(--gray-80)" fontSize={16} fontWeight={600}>
                  Kéo và thả tập tin kết quả
                </Typography>
                <Typography color="#B5B5C3" fontSize={16} fontWeight={600}>
                  Hoặc
                </Typography>
                <SuiBox component="img" src={RedUploadIcon} />
                <Typography
                  color="var(--red-200)"
                  fontSize={16}
                  fontWeight={600}
                  sx={{ textDecoration: "underline" }}
                >
                  Tải tập tin từ thiết bị
                </Typography>
              </Grid>
              {renderFiles()}
              {isHaveSampleFile && (
                <Grid item xs={12} mt={1} display="flex" justifyContent="center">
                  <Typography
                    sx={{
                      cursor: "pointer",
                      color: "var(--red-200)",
                      fontSize: "13px",
                      textDecoration: "underline",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickSampleFile();
                    }}
                  >
                    {labelSampleFile}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} mt={1} display="flex" justifyContent="center">
                <Typography color="#B5B5C3" fontSize={13}>
                  *Mỗi tập tin không quá 30MB
                </Typography>
              </Grid>
            </Grid>
          </div>
        </section>
      )}
    </Dropzone>
  );
}
