/* eslint-disable */
import { Modal, Card, Grid } from "@mui/material";
import loadingGif from "./assets/loading.gif";

export default function Loading(props) {
  const { loading } = props;

  return (
    <>
      <Modal
        open={loading}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <Card
          style={{
            width: "200px",
            height: "150px",
            // maxWidth: "120px",
            borderRadius: 10,
            backgroundColor: "white",
            border: "0px",
            position: "absolute",
            right: "0px",
            top: "0px",
            left: "0px",
            bottom: "0px",
            margin: "auto",
          }}
          p={0}
        >
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "inherit",
            }}
          >
            <img src={loadingGif} alt="loading img" style={{ width: "100px", height: "100px" }} />
          </Grid>
        </Card>
      </Modal>
    </>
  );
}
