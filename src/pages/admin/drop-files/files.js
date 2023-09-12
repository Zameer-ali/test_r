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
import { useLocation, useParams } from "react-router-dom";
import { openPopUp } from "../../../store/reducer";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
const fileTypes = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "csv", "svg"];

export default function Files() {
  PageTitle("Category");

  const [categories, setCategories] = useState(null);
  console.log("🚀 ~ file: files.js:29 ~ Files ~ categories", categories);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [page] = useState(1);
  const id = useLocation()?.state?.id;
  const category_id = useLocation()?.state?.category_id;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    getCategories();
  }, [page]);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      let { data } = await API(
        "get",
        `admin/getfiles?category_id=${category_id}&user_id=${id}`
      );
      console.log("🚀 ~ file: files.js:46 ~ getCategories ~ data", data);
      setCategories(data.categories);
      setUser(data.user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file) => {
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
              <Typography variant="h6">{t("DROP_FILES.Files")}</Typography>
            </Stack>
          </Box>
          <Box mb={3}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" alignItems="flex-end">
                <img
                  src={!!categories && categories[0]?.image}
                  width="30px"
                  style={{ marginRight: "5px" }}
                  alt="icon.png"
                />
                <Typography variant="h6">
                  {!!categories && categories[0]?.name}
                </Typography>
              </Stack>
              {uploadLoader ? (
                <CircularProgress size={32} color="primary" />
              ) : (
                <FileUploader
                  handleChange={(e) => handleUpload(e)}
                  name="file"
                  multiple
                  maxSize={15}
                  types={fileTypes}
                />
              )}
            </Stack>
          </Box>
        </Grid>
        {isLoading ? (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={22} />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {!!categories &&
              categories[0]?.files?.map((v, index) => {
                return (
                  <Fragment key={index}>
                    <Grid item lg={4} sm={6} xs={12}>
                      <FileTypes file={v} getCategories={getCategories} image={!!categories && categories[0]?.bg_url} />
                    </Grid>
                  </Fragment>
                );
              })}
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

function FileTypes({ file, getCategories, image }) {
  const [openM2, setOpenM2] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const project = () => {
    const link = `https://iinv.tech/drag-demo-backend/file/` + file.id;
    switch (file.extension) {
      case "pdf":
        return (
          <Box
            sx={[
              cardStyle,
              {
                backgroundImage: file.thumbnail_url
                  ? `url(${file.thumbnail_url})`
                  : 'url("https://media.istockphoto.com/id/184601291/photo/xxxl-dark-concrete.jpg?b=1&s=170667a&w=0&k=20&c=KRRXq0P41imqerPjYF4EgX7QOdbybyprM8ofKYoIzT4=")',
              },
            ]}
          >

            <Box sx={cardInner}>
              <Box>
                <Typography
                  variant="p"
                  component="p"
                  fontSize="14px"
                  textAlign="center"
                >
                  {file.name}
                </Typography>

                <Typography
                  variant="small"
                  display="block"
                  fontSize="12px"
                  mt={4}
                  mb={1}
                >
                  {file.size}
                </Typography>
                <Stack direction="row"
                  alignItems="center"
                  // justifyContent="center"
                  spacing={2}>
                  <Button variant="contained">
                    <a
                      href={link}
                      target="_blank"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {t("view")}
                    </a>
                  </Button>
                  <Button variant="contained"
                    onClick={() => {
                      setOpenM2(true);
                    }}
                    fontSize="medium">
                    {t("delete")}
                  </Button>

                </Stack>
              </Box>
            </Box>
          </Box>
        );
      case "png":
      case "jpg":
      case "jpeg":
        return (
          <Box
            sx={[
              cardStyle,
              {
                backgroundImage: file.file_url
                  ? `url(${file.file_url})`
                  : 'url("https://media.istockphoto.com/id/184601291/photo/xxxl-dark-concrete.jpg?b=1&s=170667a&w=0&k=20&c=KRRXq0P41imqerPjYF4EgX7QOdbybyprM8ofKYoIzT4=")',
              },
            ]}
          >
            <Box sx={cardInner}>
              <Box>
                <Typography
                  variant="p"
                  component="p"
                  fontSize="14px"
                  textAlign="center"
                >
                  {file.name}
                </Typography>

                <Typography
                  variant="small"
                  display="block"
                  fontSize="12px"
                  mt={4}
                  mb={1}
                >
                  {file.size}
                </Typography>
                <Stack direction="row"
                  alignItems="center"
                  spacing={2}>
                  <Button variant="contained">
                    <a
                      href={file.file_url}
                      target="_blank"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {t("view")}
                    </a>
                  </Button>
                  <Button variant="contained"
                    onClick={() => {
                      setOpenM2(true);
                    }}
                    fontSize="medium">
                    {t("delete")}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        );
      case "doc":
      case "docx":
        return (
          <Box
            sx={[
              cardStyle,
              {
                backgroundImage:image ? `url(${image})`: 'url("https://media.istockphoto.com/id/184601291/photo/xxxl-dark-concrete.jpg?b=1&s=170667a&w=0&k=20&c=KRRXq0P41imqerPjYF4EgX7QOdbybyprM8ofKYoIzT4=")',
              },
            ]}
          >
            <Box sx={cardInner}>
              <Box>
                <Typography
                  variant="p"
                  component="p"
                  fontSize="14px"
                  textAlign="center"
                >
                  {file.name}
                </Typography>

                <Typography
                  variant="small"
                  display="block"
                  fontSize="12px"
                  mt={4}
                  mb={1}
                >
                  {file.size}
                </Typography>
                <Stack direction="row"
                  alignItems="center"
                  spacing={2}>
                  <Button variant="contained">
                    <a
                      href={file.file_url}
                      target="_blank"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {t("view")}
                    </a>
                  </Button>
                  <Button variant="contained"
                    onClick={() => {
                      setOpenM2(true);
                    }}
                    fontSize="medium">
                    {t("delete")}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        );
      case "csv":
        return (
          <Box
            sx={[
              cardStyle,
              {
                backgroundImage:image ? `url(${image})`: 'url("https://media.istockphoto.com/id/184601291/photo/xxxl-dark-concrete.jpg?b=1&s=170667a&w=0&k=20&c=KRRXq0P41imqerPjYF4EgX7QOdbybyprM8ofKYoIzT4=")',
              },
            ]}
          >
           
            <Box sx={cardInner}>
              <Box>
                <Typography
                  variant="p"
                  component="p"
                  fontSize="14px"
                  textAlign="center"
                >
                  {file.name}
                </Typography>

                <Typography
                  variant="small"
                  display="block"
                  fontSize="12px"
                  mt={4}
                  mb={1}
                >
                  {file.size}
                </Typography>
                <Stack direction="row"
                  alignItems="center"
                  spacing={2}>
                  <Button variant="contained">
                    <a
                      href={file.file_url}
                      target="_blank"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {t("view")}
                    </a>
                  </Button>
                  <Button variant="contained"
                    onClick={() => {
                      setOpenM2(true);
                    }}
                    fontSize="medium">
                    {t("delete")}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        );
      case "xlsx":
        return (
          <Box
            sx={[
              cardStyle,
              {
                backgroundImage:image ? `url(${image})`: 'url("https://media.istockphoto.com/id/184601291/photo/xxxl-dark-concrete.jpg?b=1&s=170667a&w=0&k=20&c=KRRXq0P41imqerPjYF4EgX7QOdbybyprM8ofKYoIzT4=")',
              },
            ]}
          >
           
            <Box sx={cardInner}>
              <Box>
                <Typography
                  variant="p"
                  component="p"
                  fontSize="14px"
                  textAlign="center"
                >
                  {file.name}
                </Typography>

                <Typography
                  variant="small"
                  display="block"
                  fontSize="12px"
                  mt={4}
                  mb={1}
                >
                  {file.size}
                </Typography>
                <Stack direction="row"
                  alignItems="center"
                  spacing={2}>
                  <Button variant="contained">
                    <a
                      href={file.file_url}
                      target="_blank"
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      {t("view")}
                    </a>
                  </Button>
                  <Button variant="contained"
                    onClick={() => {
                      setOpenM2(true);
                    }}
                    fontSize="medium">
                    {t("delete")}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        );
      default:
        return "";
    }
  };
  const handleDelete = async (id) => {
    setIsLoader(true);
    try {
      await API("delete", `admin/files/${id}`);
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
      <Box className="file">{project()}</Box>
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
                  onClick={() => handleDelete(file.id)}
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
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
};

const cardInner = {
  backgroundColor: "#ffffffb0",
  p: 1,
  width: "90%",
  minHeight: "150px",
  // display: "flex",
  // direction:"column",
  alignItems: "center",
};

const flexWrapper = {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "flex-start",
  columnGap: "15px",
  flexWrap: "wrap",
};
