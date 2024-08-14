/* eslint-disable react/prop-types */
import { DeleteOutline } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
// eslint-disable-next-line import/no-named-default
import { default as MuiAvatar } from "@mui/material/Avatar";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { isImage } from "~/utils/verify";
import DefaultProfileImage from "~/assets/images/icons/businessman.png";
import { setAlertMessage } from "~/context/common/action";
import { useSoftUIController } from "~/context";

const ImageWrapper = styled("fieldset")({
  borderRadius: "5%",
  backgroundColor: "transparent",
  // width: "fitContent",
  // border: "6px solid #e5eaee",
  paddingBottom: "20px",
  position: "relative",
  width: "100%",
  gap: "0px",
});
const CustomAvatar = styled(MuiAvatar)({
  width: "100%",
  height: "325px",
  borderRadius: "5%",
  objectFit: "cover",
  fontSize: 128,
  backgroundColor: "#f5f5f5",
  "& .MuiAvatar-fallback": {
    background: `url(${DefaultProfileImage}) center no-repeat`,
    path: {
      display: "none",
    },
  },
});

const UploadBtn = styled("label")({
  fontWeight: 400,
  fontSize: "14px",
  color: "#C21500",
  cursor: "pointer",
  textDecoration: "underline",
});

const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];

function Avatar({ text, onChange, image, setImage, setOpen }) {
  const [, dispatch] = useSoftUIController();

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

  const handleUpload = async (e) => {
    if (e.target.files[0]) {
      const fileSize = e.target.files[0].size / 1024 / 1024;
      if (fileSize > 5) {
        setAlertMessage(dispatch, {
          message: `Kích thước hình ảnh lớn hơn 5MB`,
          type: "error",
          openAlert: true,
        });
      } else {
        const file = e.target.files[0];
        const base64Image = await convertBase64(e.target.files[0]);
        const validateImg = isImage(base64Image, "Ảnh đại diện", () => {
          setAlertMessage(dispatch, {
            message: `Ảnh chưa đúng định dạng`,
            type: "error",
            openAlert: true,
          });
        });
        if (validateImg) {
          //   setImage(URL.createObjectURL(file));
          setImage(base64Image);
          onChange(file);
        }
      }
    }
  };
  const avatarId = uuidv4();
  return (
    <Grid container flexDirection="column" alignItems="center">
      <ImageWrapper>
        <CustomAvatar src={image} />
        {image ? (
          <IconButton
            onClick={() => {
              // onChange(null);
              // setImage(null);
              setOpen(true);
            }}
            aria-label="delete"
            size="small"
            className="delete-btn"
            sx={{
              borderRadius: "50%",
              position: "absolute",
              top: 20,
              right: 20,
              cursor: "pointer",
              svg: { fill: "red" },
              backgroundColor: "#FFFFFF",
              "&:hover": {
                backgroundColor: "red",
                "> svg": {
                  fill: "white",
                },
              },
            }}
          >
            <DeleteOutline />
          </IconButton>
        ) : null}
      </ImageWrapper>
      {text ? (
        <UploadBtn htmlFor={avatarId}>
          <input
            style={{ display: "none" }}
            type="file"
            value=""
            id={avatarId}
            accept={validImageTypes}
            onChange={handleUpload}
          />
          {text}
        </UploadBtn>
      ) : null}
    </Grid>
  );
}
export default Avatar;

Avatar.defaultProps = {
  text: "",
  onChange: () => {},
};

Avatar.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
};
