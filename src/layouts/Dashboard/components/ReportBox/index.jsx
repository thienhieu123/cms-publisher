/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import { Card } from "@mui/material";
import SuiBadge from "~/components/SuiBadge";
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import PopupRoot from "~/components/Popup/PopupRoot";

import ReportBoxItems from "./components/ReportBoxItems";
import WarningDetail from "./components/Warning";

function ReportBox({ title, newMessage, data, count, seeMore }) {
  const [openWarning, setOpenWarning] = useState(false);
  return (
    <Card sx={{ height: "100%", marginBottom: "0px" }}>
      <SuiBox display="flex" flexDirection="column" height="max-content">
        <SuiBox display="flex" justifyContent="flex-start" alignItems="center" p="15px" pb={0}>
          <SuiTypography variant="h5" color="black" fontSize="17px" sx={{ fontWeight: "600" }}>
            {title}
          </SuiTypography>
          {newMessage !== 0 && (
            <SuiBadge
              badgeContent={newMessage}
              sx={{
                "& .MuiBadge-badge": {
                  background: "var(--red-light)",
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "3px 5px",
                },
              }}
            />
          )}
        </SuiBox>
        <ReportBoxItems data={data} count={count} seeMore={seeMore} setOpen={setOpenWarning} />
        <PopupRoot open={openWarning} setOpen={setOpenWarning} onClose={true}>
          <WarningDetail close={() => setOpenWarning(false)} onPopUp={openWarning} />
        </PopupRoot>
      </SuiBox>
    </Card>
  );
}
ReportBox.defaultProps = {
  newMessage: 0,
  seeMore: true,
};
ReportBox.propTypes = {
  title: PropTypes.string.isRequired,
  newMessage: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  seeMore: PropTypes.bool,
};

export default ReportBox;
