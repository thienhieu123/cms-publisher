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
/* eslint-disable */
import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import UserInfo from "~/assets/images/icons/UserInfo.svg";
import HelpIcon from "~/assets/images/icons/help-circle.svg";
import SignOut from "~/assets/images/icons/SignOut.svg";
import ChangeRole from "~/assets/images/icons/rotate-icon.svg";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";
import SuiTypography from "~/components/SuiTypography";
import SuiAvatar from "~/components/SuiAvatar";
// Soft UI Dashboard React examples
import Breadcrumbs from "~/examples/Breadcrumbs";
import NotificationItem from "~/examples/Items/NotificationItem";
import boxShadows from "~/assets/theme/base/boxShadows";
import PopupRoot from "~/components/Popup/PopupRoot";
import Help from "./components/Help";
import Button from "@mui/material/Button";
// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
  greetings,
} from "~/examples/Navbars/DashboardNavbar/styles";

// Soft UI Dashboard React context
import { useSoftUIController } from "~/context";
import { setTransparentNavbar, setMiniSidenav } from "~/context/theme/action";

// Images
import team2 from "~/assets/images/team-2.jpg";
import defaultUser from "~/assets/images/circle-user-solid.svg";
import logoSpotify from "~/assets/images/small-logos/logo-spotify.svg";
import { Box, MenuItem, MenuList, Typography } from "@mui/material";
import { privateRoutes, publicRoutes, privateRoutes as routes } from "~/routes";
import { clearLocalStorage, getAccessToken, getLocalUserInfo } from "~/utils/storage";
import { clearAccount, setAccountInfo } from "~/context/account/action";
import SupportIcon from "~/assets/images/support-icon.svg";
import { setAlertMessage, setIsStickyBtn } from "~/context/common/action";

const { xxl } = boxShadows;

function utf8Decode(utftext) {
  let string = "";
  let i = 0;
  let c = 0;
  let c2 = 0;
  let c3 = 0;

  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i += 1;
    } else if (c > 191 && c < 224) {
      c2 = utftext.charCodeAt(i + 1);
      // eslint-disable-next-line no-bitwise
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = utftext.charCodeAt(i + 1);
      c3 = utftext.charCodeAt(i + 2);
      // eslint-disable-next-line no-bitwise
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return string;
}

const optionsRole = [
  "Quản trị hệ thống",
  "Cập nhật dữ liệu",
  "Điều hành dữ liệu",
  "Kiểm soát dữ liệu",
  "Ban lãnh đạo",
];

function DashboardNavbar({ absolute, light, isMini }) {
  const navigate = useNavigate();
  const isSignIn = true;
  const [navbarType, setNavbarType] = useState();
  const [avatar, setAvatar] = useState(null);
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar } = controller.theme;
  const { isStickyBtn } = controller.common;
  const [openMenu, setOpenMenu] = useState(false);
  const [openUserOptions, setOpenUserOptions] = useState(false);
  const [openChangeRole, setOpenChangeRole] = useState(false);
  const [isOpenHelp, setOpenHelp] = useState(false);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const route = useLocation().pathname.split("/").slice(1);
  // console.log("current route:", route);
  const title = [];
  const path = [];

  const totalRoutes = [...privateRoutes, ...publicRoutes];

  let objectParent = null;
  route.map((pathname, index) => {
    if (index === 0) {
      //1. những route này sẽ thuộc object type là single / parent / thuộc public routes
      //2. case này sẽ so sánh với attribute key
      totalRoutes.map((item) => {
        if (item.key === pathname) {
          title.push(item.title);
          path.push(item.route);
          objectParent = item;
        }
      });
    } else if (index === 1) {
      //1. những route này sẽ là con của parent ở case index = 0
      //2. case này sẽ so sánh với attribute key
      objectParent.children.map((child) => {
        if (child.key === pathname) {
          title.push(child.title);
          path.push(child.route);
        }
      });
    } else {
      //những route này sẽ là id của 1 đối tượng
    }
  });
  // for (let i = 0; i < route.length; i++) {
  //   let hasKey = false;
  //   let isCollapse = false;
  //   let matched = false;
  //   routes.forEach((item) => {
  //     if (route[i] === item.key) {
  //       if (item.type === "single") {
  //         //menu page
  //         title.push(item.title);
  //         path.push(item.route);
  //         // path.push(item.route.slice(1));
  //         hasKey = true;
  //         isCollapse = true;
  //       } else if (item.type === "title") {
  //         item?.collapse.map((miniItem) => {
  //           if (miniItem.key === route[i + 1]) {
  //             title.push(miniItem.name);
  //             path.push(miniItem.route);
  //             hasKey = true;
  //             isCollapse = true;
  //             i++;
  //           }
  //           return title;
  //         });
  //       } else {
  //         if (item.name) {
  //           //add page
  //           title.push(item.name);
  //           path.push(item.route);
  //           hasKey = true;
  //           isCollapse = true;
  //           matched = true;
  //         }
  //       }
  //     } else {
  //       //detail and special edit page
  //       if (
  //         item.type === "detail" &&
  //         item.key === `${route[i - 1]}-${item.type}` &&
  //         i > 0 &&
  //         route[i] !== "edit" &&
  //         !matched
  //       ) {
  //         hasKey = true;
  //         isCollapse = true;
  //         // title.push(`${item.name} ${route[i]}`);
  //         title.push(`${item.name}`);
  //         path.push(item.route);
  //       } else if (
  //         item.type === "edit" &&
  //         item.key === `${route[i - 2]}-${item.type}` &&
  //         i > 1 &&
  //         !matched
  //       ) {
  //         hasKey = true;
  //         isCollapse = true;
  //         // title.push(`${item.name} ${route[i]}`);
  //         title.push(`${item.name}`);
  //         path.push(item.route);
  //       } else if (item.type === "edit" && i === 1) {
  //         hasKey = true;
  //         isCollapse = true;
  //       }
  //     }
  //   });

  //   if ((!hasKey || !isCollapse) && path.length > 0) {
  //     title.push(utf8Decode(unescape(route[i])));
  //     path.push(path[path.length - 1]?.concat(`/${route[i]}`));
  //   }
  // }

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setIsStickyBtn(dispatch, window.scrollY > 64);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      clearLocalStorage();
      clearAccount(dispatch);
      navigate("/authentication/sign-in", { replace: true });
    }
  }, []);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const handleOpenUserOptions = (event) => setOpenUserOptions(event.currentTarget);
  const handleCloseUserOptions = () => setOpenUserOptions(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        image={<img src={team2} alt="person" />}
        title={["New message", "from Laur"]}
        date="13 minutes ago"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        image={<img src={logoSpotify} alt="person" />}
        title={["New album", "by Travis Scott"]}
        date="1 day"
        onClick={handleCloseMenu}
      />
      <NotificationItem
        color="secondary"
        image={
          <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
            payment
          </Icon>
        }
        title={["", "Payment successfully completed"]}
        date="2 days"
        onClick={handleCloseMenu}
      />
    </Menu>
  );

  const renderUserOptions = () => (
    <Menu
      anchorEl={openUserOptions}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openUserOptions)}
      onClose={handleCloseUserOptions}
      sx={{ mt: 1, ml: -3 }}
    >
      <NotificationItem
        image={
          // <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
          //   personal
          // </Icon>
          <img src={UserInfo} alt="User Info" />
        }
        title={["", "Quản lý tài khoản"]}
        onClick={() => {
          navigate("/account-info");
        }}
        // color="info"
      />
      {/* <NotificationItem
        image={<img src={ChangeRole} alt="User Info" />}
        title={["", "Đổi vai trò"]}
        onClick={() => {
          setOpenChangeRole(true);
          handleCloseUserOptions();
        }}
      /> */}
      <NotificationItem
        image={
          // <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
          //   personal_outline
          // </Icon>
          <img src={HelpIcon} alt="User Info" />
        }
        title={["", "Trợ giúp"]}
        onClick={() => {
          setOpenHelp(true);
        }}
        // color="info"
      />
      <NotificationItem
        image={
          // <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
          //   logout
          // </Icon>
          <img src={SignOut} alt="User Info" />
        }
        title={["", "Đăng xuất"]}
        onClick={() => {
          clearLocalStorage();
          clearAccount(dispatch);
          navigate("/authentication/sign-in", { replace: true });
        }}
        // color="error"
      />
    </Menu>
  );

  const handleChangeRoleClick = (event, index) => {
    setSelectedRoleIndex(index);
  };

  const renderChangeRole = () => {
    return (
      <PopupRoot
        open={openChangeRole}
        setOpen={setOpenChangeRole}
        title="Đổi vai trò"
        onClose={true}
      >
        <MenuList sx={{ padding: 2 }}>
          {optionsRole.map((option, index) => (
            <MenuItem
              key={option}
              //   disabled={index === 0}
              selected={index === selectedRoleIndex}
              onClick={(event) => handleChangeRoleClick(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </PopupRoot>
    );
  };

  // const { userId } = getLocalUserInfo();
  const [nameAccount, setNameAccount] = useState("");
  const [roleUser, setUserRole] = useState("Thành viên");

  useEffect(() => {
    const info = getLocalUserInfo();
    setAvatar(info?.profile?.avatarUrl);
    setNameAccount(info?.profile?.fullname);
    // setUserRole(userRoles.find((role) => role.value === info.roles[0])?.label);
  }, []);

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={{
        // background: "transparent",
        background: "white",
        position: "relative",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.03)",
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    >
      {renderChangeRole()}
      <PopupRoot
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "transparent",
        }}
        open={isOpenHelp}
        setOpen={setOpenHelp}
        onClose={true}
      >
        <Help close={() => setOpenHelp(false)} />
      </PopupRoot>
      <Toolbar
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          "@media (max-width: 500px)": {
            flexDirection: "column-reverse",
          },
        }}
      >
        <SuiBox
          color="red"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => {
            return {
              ...navbarRow(theme, { isMini }),
              "@media (max-width: 500px)": {
                justifyContent: "center",
                marginTop: "10px",
              },
            };
          }}
        >
          <Breadcrumbs title={title} route={path} light={light} />
        </SuiBox>
        {isMini ? null : (
          <SuiBox
            sx={(theme) => {
              return {
                ...navbarRow(theme, { isMini }),
                justifyContent: "flex-end",
                "@media (max-width: 500px)": {
                  justifyContent: "center",
                },
              };
            }}
          >
            <SuiBox color={light ? "white" : "inherit"} display="flex" alignItems="center">
              <Box
                component="div"
                sx={{ display: "flex", alignItems: "center" }}
                mr={{ xs: 1, sm: 1, md: 2, lg: 6, xl: 10 }}
              >
                <img
                  src={SupportIcon}
                  alt="Hỗ trợ 0289765432"
                  style={{ marginRight: "16px", paddingBottom: "3px", fontSize: "16px" }}
                />
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontStyle: "italic",
                    color: "var(--black)",
                  }}
                  display={{ xs: "none", sm: "none", md: "block", lg: "block", xl: "block" }}
                >
                  Hỗ trợ 0289765432
                </Typography>
              </Box>
              {/* {isSignIn && (
                <>
                  <IconButton
                    // size="large"
                    // color="inherit"
                    sx={navbarIconButton}
                    // aria-controls="notification-menu"
                    // aria-haspopup="true"
                    // variant="contained"
                    onClick={handleOpenMenu}
                  >
                    <NotificationsNoneIcon sx={{ fontSize: "40px" }} />
                  </IconButton>
                  {renderMenu()}
                </>
              )} */}
              {isSignIn ? (
                <SuiBox>
                  <SuiBox
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    onClick={handleOpenUserOptions}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "10%",
                      padding: "0.5rem",
                    }}
                  >
                    <SuiBox display="flex" alignItems="center">
                      <div style={{ marginRight: "4px" }}>
                        <SuiBox
                          mr={1}
                          sx={{
                            greetings,
                            maxWidth: "210px",
                            overflowWrap: "breakWord",
                            height: "19px",
                          }}
                        >
                          <SuiTypography
                            variant="p"
                            color="#2D3442"
                            fontSize="12px"
                            fontWeight="normal"
                          >
                            {roleUser}
                          </SuiTypography>
                        </SuiBox>
                        <SuiBox
                          mr={1}
                          sx={{
                            greetings,
                            maxWidth: "210px",
                            overflowWrap: "breakWord",
                          }}
                        >
                          <SuiTypography
                            variant="p"
                            color="#2D3442"
                            fontSize="14px"
                            fontWeight="bold"
                          >
                            {nameAccount}
                          </SuiTypography>
                        </SuiBox>
                      </div>
                      <SuiAvatar
                        variant="circular"
                        // src={checkUrlImage(avatar)}
                        src={avatar}
                        alt="avatar"
                        shadow="md"
                        size="lg"
                        sx={{
                          marginRight: "10px",
                          borderRadius: "6px !important",
                          width: "2rem",
                          height: "2rem",
                        }}
                      />
                    </SuiBox>
                    <Icon>keyboard_arrow_down</Icon>
                  </SuiBox>
                  {renderUserOptions()}
                </SuiBox>
              ) : (
                <Link to="/authentication/sign-in">
                  <IconButton sx={navbarIconButton} size="small">
                    <Icon
                      sx={({ palette: { dark, white } }) => ({
                        color: light ? white.main : dark.main,
                      })}
                    >
                      account_circle
                    </Icon>
                    <SuiTypography
                      variant="button"
                      fontWeight="medium"
                      color={light ? "white" : "dark"}
                    >
                      Sign in
                    </SuiTypography>
                  </IconButton>
                </Link>
              )}

              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </SuiBox>
          </SuiBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
