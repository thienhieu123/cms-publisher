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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SuiBox from "~/components/SuiBox";

// Soft UI Dashboard React examples
// import DefaultNavbar from "~/examples/Navbars/DefaultNavbar";
import PageLayout from "~/examples/LayoutContainers/PageLayout";

// Authentication layout components
import Footer from "~/layouts/Authentication/Components/Footer";
// import daikinLogo from "~/assets/images/daikin-logo.png";
import KTSLogo from "~/assets/images/logos/KTSLogo.svg";
import BackGroundLogin from "~/assets/images/BackGroundLogin.png";

function BasicLayout({ children }) {
  return (
    <PageLayout>
      <SuiBox
        width="100%"
        minHeight="100vh"
        borderRadius="lg"
        // pt="5%"
        sx={{
          backgroundImage: `url(${BackGroundLogin})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <SuiBox
        mx="auto"
        sx={{
          position: "absolute",
          top: "0",
          width: "100%",
        }}
      >
        <Grid container justifyContent="flex-end" height="100vh">
          <Grid
            item
            xs={7.2}
            // sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              sx={{
                borderRadius: "0",
                height: "100%",
                Width: "56%",
                boxShadow: "0px 4px 40px 0px rgba(239, 240, 241, 0.7)",
              }}
            >
              <Grid container justifyContent="center" sx={{ height: "inherit" }}>
                <Grid item xs={10} sm={10} md={10} lg={6} xl={5.5}>
                  <SuiBox
                    sx={{
                      position: "relative",
                      height: "100%",
                      "@media only screen and (max-height: 650px)": {
                        padding: "20px 0px",
                      },
                    }}
                    py={10}
                  >
                    <SuiBox
                      mb="24px"
                      justifyContent="center"
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      <SuiBox
                        component="img"
                        src={KTSLogo}
                        alt="KTS Logo"
                        sx={{
                          "@media only screen and (max-height: 650px)": {
                            height: "50px",
                          },
                        }}
                      />
                    </SuiBox>
                    {children}
                    <Footer />
                  </SuiBox>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </SuiBox>
      {/* <Footer /> */}
    </PageLayout>
  );
}

// Setting default values for the props of BasicLayout

// Typechecking props for the BasicLayout
BasicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BasicLayout;
