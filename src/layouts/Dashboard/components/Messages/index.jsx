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

// @mui material components
import Card from "@mui/material/Card";
// import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiInput from "~/components/SuiInput";
import SuiTypography from "~/components/SuiTypography";
import SeeMore from "~/examples/SeeMore";
// Billing page components
import Message from "~/layouts/dashboard/components/Message";

function Messages({ messagesLs }) {
  const SeenMessages = messagesLs.filter((item) => item.seen);
  const UnseenMessages = messagesLs.filter((item) => !item.seen);
  return (
    <Card id="delete-account">
      <SuiBox pt={2} px={2}>
        <SuiInput
          placeholder="Mã số, Tên khách hàng"
          icon={{ component: "search", direction: "left" }}
          width="100%"
        />
      </SuiBox>
      <SuiBox
        variant="gradient"
        bgColor="white"
        borderRadius="md"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="column"
        pb={0}
        pt={2}
        pl={2}
        pr={2}
      >
        <SuiBox width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <SuiTypography
            variant="body2"
            fontWeight="bold"
            color="black"
            fontSize="20px"
            width="max-content"
          >
            Tin nhắn mới
          </SuiTypography>
          <SeeMore text="Xem thêm" />
        </SuiBox>
      </SuiBox>
      <SuiBox pt={0} pb={2} pl={2} pr={2}>
        <SuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {messagesLs.length > 0
            ? UnseenMessages.map((item, index) => (
                <Message key={index} avatar={item.avatar} name={item.name} message={item.message} />
              ))
            : ""}
        </SuiBox>
      </SuiBox>
      <SuiBox
        variant="gradient"
        bgColor="white"
        borderRadius="md"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="column"
        pb={0}
        pt={2}
        pl={2}
        pr={2}
      >
        <SuiBox width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <SuiTypography
            variant="body2"
            fontWeight="bold"
            color="black"
            fontSize="20px"
            width="max-content"
          >
            Đã xem
          </SuiTypography>
          <SeeMore text="Xem thêm" />
        </SuiBox>
      </SuiBox>
      <SuiBox pt={0} pb={2} pl={2} pr={2}>
        <SuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {messagesLs.length > 0
            ? SeenMessages.map((item, index) => (
                <Message key={index} avatar={item.avatar} name={item.name} message={item.message} />
              ))
            : ""}
        </SuiBox>
      </SuiBox>
    </Card>
  );
}

Messages.propTypes = {
  messagesLs: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};
export default Messages;
