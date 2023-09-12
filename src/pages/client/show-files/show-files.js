import React, { useState, useEffect, Fragment } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Tooltip,
  Button,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PageTitle from "../../../hooks/page-title";
import API from "../../../axios";
import { icon_csv, Word_, Excel_ } from "../../../assets";
import { CustomModal } from "../../../components";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { FileUploader } from "react-drag-drop-files";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { openPopUp } from "../../../store/reducer";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const fileTypes = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "csv", "svg"];

export default function AdDropFiles() {
  PageTitle("Project");
  const [categories, setCategories] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [page] = useState(1);
  const { id } = useParams();
  const [catID, setCatID] = useState(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.storeReducer);
  useEffect(() => {
    getCategories();
  }, [page]);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      let { data } = await API("get", `categories?active=1&user_id=${user.id}`);
      setCategories(data.categories);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };


  return (
    <Container maxWidth="false" sx={{ pt: 3, pb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <table>
            <tbody>
              <tr>
                <td>Name : </td>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <td>Email : </td>
                <td>{user?.email}</td>
              </tr>
            </tbody>
          </table>
        </Grid>
        <Grid item xs={12}>
          <Box mb={3}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">{t("DROP_FILES.Files")}</Typography>
            </Stack>
          </Box>
        </Grid>

          {isLoading ? (
              <Grid item xs={12}>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress size={22} />
            </Box>
        </Grid>

          ) : (
            !!categories &&
            categories?.map((v, i) => {
              return (
                <Grid item lg={4} sm={6} xs={12}>
                  <Box
                    key={i}
                    sx={[
                      cardStyle,
                      {
                        backgroundImage:v.bg_url ? `url(${v.bg_url})`: 'url("https://media.istockphoto.com/id/184601291/photo/xxxl-dark-concrete.jpg?b=1&s=170667a&w=0&k=20&c=KRRXq0P41imqerPjYF4EgX7QOdbybyprM8ofKYoIzT4=")',
                      },
                    ]}
                  >
                    <Box sx={cardInner}>
                      <Box>
                        <img
                          src={v.image_url}
                          width="30px"
                          style={{ marginRight: "5px" }}
                          alt="icon.png"
                        />
                        <br />
                        <Typography variant="small">{v.name}</Typography>
                        <br />
                        <br />
                        <Button
                          variant="contained"
                          mt={1}
                          onClick={() => navigate("/category/files", {
                            state: {
                              id: user.id,
                              category_id: v.id
                            },
                          })}
                        >
                          {t("more")}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })
          )}
      </Grid>
    </Container>
  );
}



const cardStyle = {
  position: "relative",
  py: 4,
  px: 1,
  mb: 2,
  width: "100%",
  minHeight: "250px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

const cardInner = {
  backgroundColor: "#ffffffb0",
  p: 1,
  width: "90%",
  minHeight: "150px",
  display: "flex",
  alignItems: "center",
};

const flexWrapper = {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "flex-start",
  columnGap: "15px",
  flexWrap: "wrap",
};
