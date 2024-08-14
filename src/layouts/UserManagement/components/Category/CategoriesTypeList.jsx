import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FileIcon from "~/assets/images/icons/file-icon.svg";
import { getListCategory } from "~/api/common";
import GroupCategory from "./Types/GroupCategory";
import Category from "./Types/Category";
import Measurement from "./Types/Measurement";
import Position from "./Types/Position";
import { handleResponse } from "~/utils/utils";
import useErrorMessage from "~/hooks/useErrorMessage";
import { CATEGORY_TYPE } from "~/constants/config";
import Department from "./Types/Department";
import DataSource from "./Types/DataSource";
import Formula from "./Types/Formula";
import { useLocation, useSearchParams } from "react-router-dom";

export default function CategoriesTypeList() {
  const [listCategory, setListCategory] = useState([]);
  const [chosenCategory, setChosenCategory] = useState(null);
  const { setErrorMessage } = useErrorMessage();

  useEffect(() => {
    getListCategory().then((res) => {
      const [status, dataResponse] = handleResponse(res);
      if (status) {
        setListCategory(res.message.data.data);
        // setChosenCategory(res.message.data.data[0]?.code || null);
      } else setErrorMessage(dataResponse);
    });
    return () => {
      setListCategory([]);
      setChosenCategory(null);
    };
  }, []);

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const category = new URLSearchParams(location.search).get("category");
    setChosenCategory(category ? category : CATEGORY_TYPE.STATS_INDEX_GROUP);
  }, [location.search]);

  return (
    <Grid container>
      <Card sx={{ width: "100%", marginTop: "0px" }}>
        <Grid container item xs={12} spacing={2} padding={2}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                border: "1px solid #eeecf8",
              }}
            >
              <Typography
                sx={{
                  color: "#16151C",
                  fontWeight: 600,
                  fontSize: "20px",
                  margin: "10px 0px 0px 10px",
                }}
              >
                Danh sách loại danh mục
              </Typography>
              <Divider
                sx={{
                  background: "#d4d4d4",
                }}
              />
              {listCategory.map((item, index) => {
                return (
                  <Grid
                    key={index}
                    onClick={() => {
                      searchParams.set("category", item.code);
                      setSearchParams(searchParams);
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "50px",
                      marginBottom: "10px",
                      background: chosenCategory === item.code ? "#FFF0EE" : "unset",
                      ":hover": {
                        background: "#FFF0EE",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <img src={FileIcon} alt="" />
                    <Typography
                      sx={{
                        fontSize: "16px",
                        marginLeft: "10px",
                        paddingTop: "5px",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Grid>
                );
              })}
            </Box>
          </Grid>
          <Grid container item xs={12} md={8}>
            {chosenCategory === CATEGORY_TYPE.STATS_INDEX_GROUP && <GroupCategory />}
            {chosenCategory === CATEGORY_TYPE.STATS_INDEX && <Category />}
            {chosenCategory === CATEGORY_TYPE.DEPARMENT && <Department />}
            {chosenCategory === CATEGORY_TYPE.DATA_RESOURCE && <DataSource />}
            {chosenCategory === CATEGORY_TYPE.FORMULA && <Formula />}
            {chosenCategory === CATEGORY_TYPE.MEASUREMENT_UNIT && <Measurement />}
            {chosenCategory === CATEGORY_TYPE.POSITION && <Position />}
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
