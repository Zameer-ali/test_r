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
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const fileTypes = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "csv", "svg"];

export default function AdDropFiles() {
  const [categories, setCategories] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [page] = useState(1);
  const { id } = useParams();
  const [catID, setCatID] = useState(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  PageTitle(t("USER.User"));

  useEffect(() => {
    getCategories();
  }, [page]);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      let { data } = await API("get", `admin/categories?active=1&user_id=${id}`);
      setCategories(data.categories);
      setUser(data.user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file, category_id) => {
    setCatID(category_id);

    if (file === null) {
      dispatch(openPopUp({ message: t("select_file"), type: "warning" }));
      return;
    }
    let arr = [];
    for (let i = 0; i < file.length; i++) {
      let singleImage = file[i];
      arr.push(singleImage);
    }
    setUploadLoader(true);
    let fd = new FormData();
    arr.forEach((v, i) => {
      fd.append(`file_name[${i}]`, v);
    });
    fd.append(`user_id`, user?.id);
    fd.append(`category_id`, category_id);
    try {
      let { data } = await API("post", "admin/files", fd);
      setUploadLoader(false);
      dispatch(openPopUp({ message: t("upload_file"), type: "success" }));

      getCategories();
    } catch (error) {
      setCatID(null);
      setUploadLoader(false);
      dispatch(
        openPopUp({
          message: t("error_msg"),
          type: "error",
        })
      );
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
              <Typography variant="h6">{t("DROP_FILES.Categories")}</Typography>
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
                          onClick={() => navigate("/project/category", {
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

function FileTypes({ file, getCategories }) {
  const [openM2, setOpenM2] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const project = () => {
    const link = `https://iinv.tech/drag-demo-backend/file/` + file.id;
    switch (file.extension) {
      case "pdf":
        return (
          <a href={link} target="_blank">
            <img src={file.thumbnail_url} width="160px" height="130px" />
          </a>
        );
      case "png":
      case "jpg":
      case "jpeg":
        return (
          <a href={file.file_url} target="_blank">
            <img src={file.file_url} width="160px" height="130px" />
          </a>
        );
      case "doc":
      case "docx":
        return (
          <a href={file.file_url} target="_blank">
            <img src={Word_} width="160px" height="130px" />
          </a>
        );
      case "csv":
        return (
          <a href={file.file_url} target="_blank">
            <img src={icon_csv} width="160px" height="130px" />
          </a>
        );
      case "xlsx":
        return (
          <a href={file.file_url} target="_blank">
            <img src={Excel_} width="160px" height="130px" />
          </a>
        );
      default:
        return (
          <a href={file.file_url} target="_blank">
            <InsertDriveFileIcon style={{ fontSize: "100px", color: "blue" }} />
          </a>
        );
    }
  };
  const handleDelete = async () => {
    setIsLoader(true);
    try {
      await API("delete", `admin/files/${file.id}`);
      setIsLoader(false);
      dispatch(openPopUp({ message: t("delete_file"), type: "success" }));
      setOpenM2(false);
      getCategories();
    } catch (error) {
      setIsLoader(false);
      dispatch(
        openPopUp({
          message: t("error_msg"),
          type: "error",
        })
      );
    }
  };
  return (
    <>
      <Box className="file">
        {project()}
        <Tooltip title={t("TOOLTIP.Delete_file")} className="btn_dlt">
          <DeleteForeverIcon
            onClick={() => {
              setOpenM2(true);
            }}
            fontSize="medium"
          />
        </Tooltip>
        <Typography>{file.name}</Typography>
      </Box>
      {openM2 ? (
        <CustomModal
          handleClose={() => setOpenM2(false)}
          children={
            <Box py={3}>
              <Typography mb={2} variant="h6" sx={{ textAlign: "center" }}>
                {t("DELETE_MESSAGE.Message")}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2}
              >
                <Button variant="contained" onClick={() => setOpenM2(false)}>
                  {t("COMMON.No")}
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => handleDelete()}
                  disabled={isLoader}
                >
                  {isLoader && <CircularProgress size={16} color="primary" />}
                  {t("COMMON.Yes")}
                </Button>
              </Stack>
            </Box>
          }
        />
      ) : null}
    </>
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
