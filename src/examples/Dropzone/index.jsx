/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import ClearIcon from "@mui/icons-material/Clear";
import Grid from "@mui/material/Grid";
import SuiBox from "~/components/SuiBox";
import Camera from "~/assets/images/camera.svg";
import { setAlertMessage } from "~/context/common/action";
import { useSoftUIController } from "~/context";
import { checkUrlImage } from "~/utils/utils";

function DropzoneComponent({ accept, multiple, setData, setImageBase64, files, setFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const [eject, setEject] = useState(false);
  const [, dispatch] = useSoftUIController();
  const baseStyle = {
    width: "100%",
    height: "100px",
    padding: "15px 15px",
    borderColor: isDragging ? "#00e676" : eject ? "#ff1744" : "#eeeeee",
    backgroundColor: "var(--gray-30)",
    color: "#bdbdbd",
    transition: "border .3s ease-in-out",
    cursor: "pointer",
  };

  const handleRemoveFile = (id) => {
    setFiles(files.filter((file) => file.id !== id));
    setData(files.filter((file) => file.id !== id));
  };

  const validateAcceptedFiles = (data) => {
    if (data.length > 8) {
      setAlertMessage(dispatch, {
        message: "Hình ảnh vượt quá 5MB hoặc số lượng hình ảnh lớn hơn 8",
        type: "error",
        openAlert: true,
      });
      return false;
    }
    const test = data.every((file) => {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 5) {
        setAlertMessage(dispatch, {
          message: "Hình ảnh vượt quá 5MB hoặc số lượng hình ảnh lớn hơn 8",
          type: "error",
          openAlert: true,
        });
        return false;
      }
      return true;
    });
    return test;
  };

  function convertBase64(file) {
    return new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        res(fileReader.result);
      };
      fileReader.onerror = (error) => {
        rej(error);
      };
    });
  }

  const handleConvertListBase64 = async (list) => {
    Promise.all(
      list.map(async (file) => {
        const base64Res = await convertBase64(file);
        return { image: base64Res, id: uuidv4() };
      })
    ).then((value) => {
      setData(files.concat(value));
      setFiles(files.concat(value));
    });
  };

  function onDrop(acceptedFiles) {
    const verify = validateAcceptedFiles(acceptedFiles);
    if (verify) {
      //   setFiles(
      const newImage = acceptedFiles.map((file) =>
        Object.assign(file, {
          image: URL.createObjectURL(file),
          id: uuidv4(),
        })
      );
      handleConvertListBase64(newImage);
      // .concat(files);
      //   );
    }
  }

  useEffect(() => {
    if (files.length > 0) {
      convertBase64(files[0]).then((res) => {
        setImageBase64(res);
      });
    } else {
      setImageBase64("");
    }
  }, [files]);

  if (multiple) {
    return (
      <Grid container spacing={2}>
        {files.map((file) => (
          <Grid key={uuidv4()} item lg={5} xs={6} xl={4}>
            <SuiBox
              key={file.name}
              style={{
                border: "1px dashed #ccc",
                minWidth: "100%",
                height: "100px",
                backgroundImage: `url(${checkUrlImage(file.image)})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                cursor: "pointer",
                display: "flex",
                justifyContent: "end",
                alignItems: "flex-start",
              }}
            >
              <ClearIcon
                // color="error"
                onClick={() => handleRemoveFile(file.id)}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
            </SuiBox>
          </Grid>
        ))}
        <Grid item lg={5} xl={4}>
          <Dropzone
            onDragOver={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDropRejected={() => setEject(true)}
            onDropAccepted={() => setEject(false)}
            accept={accept}
            multiple={multiple}
            onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="avt"
                    {...getInputProps({ multiple })}
                  />
                  {/* <CameraAltIcon style={baseStyle} /> */}
                  <SuiBox component="img" sx={baseStyle} src={Camera} alt="Camera" />
                </div>
              </section>
            )}
          </Dropzone>
        </Grid>
      </Grid>
    );
  }
  if (files.length > 0) {
    return (
      <Grid key={uuidv4()} container spacing={2}>
        {files.map((file) => (
          <Grid key={uuidv4()} item lg={5} xl={4}>
            <SuiBox
              key={file.name}
              style={{
                border: "1px dashed #ccc",
                width: "100%",
                height: "100px",
                backgroundImage: `url(${checkUrlImage(file.image)})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              <ClearIcon
                color="error"
                onClick={() => handleRemoveFile(file.id)}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
            </SuiBox>
          </Grid>
        ))}
      </Grid>
    );
  }
  return (
    <Grid container spacing={2}>
      <Grid item lg={5} xl={4}>
        <Dropzone
          onDragOver={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDropRejected={() => setEject(true)}
          onDropAccepted={() => setEject(false)}
          // accept={accept}
          multiple={multiple}
          onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="avt"
                  {...getInputProps({ multiple })}
                />
                <SuiBox component="img" sx={baseStyle} src={Camera} alt="Send sms icon" />

                {/* <CameraAltIcon style={baseStyle} /> */}
              </div>
            </section>
          )}
        </Dropzone>
      </Grid>
    </Grid>
  );
}

DropzoneComponent.defaultProps = {
  accept: {
    "image/*": [".png", ".jpeg", ".jpg"],
  },
  multiple: false,
  setData: () => {},
  setImageBase64: () => {},
  setFiles: () => {},
  files: [],
};
DropzoneComponent.propTypes = {
  accept: PropTypes.shape({
    "image/*": PropTypes.arrayOf(PropTypes.string),
  }),
  multiple: PropTypes.bool,
  setData: PropTypes.func,
  setImageBase64: PropTypes.func,
  setFiles: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  files: PropTypes.array,
};

export default DropzoneComponent;
