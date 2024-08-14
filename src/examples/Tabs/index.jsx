import SuiBox from "~/components/SuiBox";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
// import { v4 as uuidv4 } from "uuid";
// import CheckIcon from "@mui/icons-material/Check";
// import { useState } from "react";
import PropTypes from "prop-types";
import SuiBadge from "~/components/SuiBadge";
import SuiTypography from "~/components/SuiTypography";
import { useSoftUIController } from "~/context";
import { useSearchParams } from "react-router-dom";
import TabTitle from "./components/TabTitle";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && (
        // <SuiBox sx={{ background: "var(--blue-gray-line)" }}>
        <SuiBox>
          <Typography component="div" sx={{ position: "relative", display: "block" }}>
            {children}
          </Typography>
        </SuiBox>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function SuiTabs({ tabs, handleChangeTab, currentTab, stickyTab }) {
  // console.log("cur tab", currentTab);
  // const [value, setValue] = useState(0);
  const [, dispatch] = useSoftUIController();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event, newValue) => {
    console.log(event, newValue);
    searchParams.set("tab", newValue);
    setSearchParams(searchParams);
    handleChangeTab(dispatch, newValue);
  };

  const stickyCss = {
    position: "sticky",
    zIndex: 1000,
    // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.03)",
    background: "var(--blue-gray-line)",
    width: "100%",
    right: 0,
    left: 0,
    top: "0px",
    padding: "5px 0px 15px 0px",
  };

  const defaultCss = {
    marginBottom: "6px",
    padding: "5px 0px",
    // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.03)",
    // background: "var(--blue-gray-line)",
  };
  return (
    <SuiBox sx={{ width: "100%" }}>
      <SuiBox sx={stickyTab ? stickyCss : defaultCss}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          sx={{
            ".MuiTabs-flexContainer": {
              display: "flex",
              flexDirection: "row",
              fontSize: "20px",
            },
            [`& .${tabsClasses.scrollButtons}`]: {
              "&.Mui-disabled": { opacity: 0.3 },
              border: "2px solid #F8ADAD",
              backgroundColor: "#FFF0EE",
              boxShadow: "0px 2px 4px 0px #8A92A64D",
              borderRadius: "999px",
              height: "35px !important",
              width: "35px !important",
              margin: "auto",
            },
            ".Mui-selected": { color: "var(--red-200) !important", fontWeight: "700" },
          }}
        >
          {tabs.map(({ label, data, id, hide, code }, index) => (
            <Tab
              sx={{
                padding: "0px 14px",
                fontSize: "20px",
                fontWeight: 600,
                maxWidth: "inherit",
                display: hide ? "none" : "block",
              }}
              label={
                <TabTitle label={label} currentTab={tabs[currentTab]?.code} id={code} />
                // <p>
                //   <CheckIcon style={{ display: `${currentTab !== id ? "none" : ""}` }} /> {label}
                // </p>
              }
              icon={
                data ? (
                  <SuiBadge
                    color="info"
                    size="sm"
                    sx={{
                      "& .MuiBadge-badge": {
                        background: "var(--blue-blue-100)",
                      },
                    }}
                    badgeContent={
                      <SuiTypography
                        variant="text"
                        fontSize="small"
                        fontWeight="regular"
                        // color="white"
                      >
                        {data > 99 ? "99+" : data}
                      </SuiTypography>
                    }
                  />
                ) : null
              }
              iconPosition="end"
              //   iconPosition={data &&"end"}
              key={index}
            />
          ))}
        </Tabs>
      </SuiBox>
      {tabs.map(({ Component, hide }, i) => (
        <TabPanel value={currentTab} index={i} key={i} sx={{ display: hide ? "none" : "block" }}>
          {Component}
        </TabPanel>
      ))}
    </SuiBox>
  );
}

SuiTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleChangeTab: PropTypes.func,
  currentTab: PropTypes.number,
  stickyTab: PropTypes.bool,
};
SuiTabs.defaultProps = {
  handleChangeTab: () => {},
  currentTab: 0,
  stickyTab: false,
};
