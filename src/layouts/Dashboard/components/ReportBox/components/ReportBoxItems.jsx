/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
// import PropTypes from "prop-types";

// @mui material components
// import Card from "@mui/material/Card";
// import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import { useState } from "react";
// import SuiTypography from "~/components/SuiTypography";
import { Pagination, PaginationItem } from "@mui/material";
import ReportBoxItem from "./ReportBoxItem";

function ReportBoxItems({ data, seeMore, count, setOpen }) {
  const [page, setPage] = useState(1);

  function handleChange(event, value) {
    setPage(value);
  }
  return (
    <SuiBox>
      <SuiBox
        component="ul"
        display="flex"
        flexDirection="column"
        px={2}
        m={0}
        sx={{
          maxHeight: "150px",
          overflow: "auto",
        }}
      >
        {/* {data.length > 0 && data[0].messages
          ? data.map((item) => (
              <ReportBoxItem
                key={uuidv4()}
                id={item.deviceDetailId}
                date={item.createdDate}
                messages={item.messages}
                danger={item.danger}
                reportId={item.reportId}
                expieredDate={item.expieredDate}
                noGutter
              />
            ))
          : ""}
        {data.length > 0 && !data[0].messages
          ? data.map((item) => (
              <ReportBoxItem key={uuidv4()} id={item.id} date={item.date} noGutter />
            ))
          : ""} */}
        {data.map((item, index) => (
          <ReportBoxItem
            key={index}
            // id={item.id}
            messages={item.messages}
            danger={item.danger}
            // reportId={item.Code}
            code={item.Code}
            noGutter
            setOpen={setOpen}
          />
        ))}
      </SuiBox>
      {seeMore && (
        <>
          <Divider sx={{ background: "#555" }} />
          <SuiBox
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            paddingBottom="15px"
          >
            {/* <SuiTypography
              sx={{
                fontStyle: "italic",
                fontSize: "14px",
                color: "var(--blue-blue-100)",
                cursor: "pointer",
                textTransform: "none",
                // "&:hover": {
                //   transform: `translate(3px, 0px)`,
                //   transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
                // },
              }}
            > */}
            <Pagination
              siblingCount={1}
              sx={{
                ".MuiPaginationItem-root": { color: "#2D3442", fontStyle: "normal" },
                ".css-1csdaui-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "transparent !important",
                  border: "1px solid red",
                },
              }}
              count={count}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  components={{
                    next: () => <p style={{ color: "red" }}>&gt;</p>,
                    previous: () => <p style={{ color: "red" }}>&lt;</p>,
                  }}
                />
              )}
              shape="rounded"
              page={page}
              onChange={handleChange}
            />
            {/* </SuiTypography> */}
          </SuiBox>
        </>
      )}
    </SuiBox>
  );
}
ReportBoxItems.defaultProps = {
  data: [],
  seeMore: true,
};

ReportBoxItems.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  seeMore: PropTypes.bool,
  //  ["any", "array", "object"]
};
export default ReportBoxItems;
