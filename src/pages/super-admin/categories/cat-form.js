import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Box,
  Switch,
  Stack,
  Typography,
  Tooltip,
  Grid,
  FormLabel
} from "@mui/material";

import { useDispatch } from "react-redux";
import API from "../../../axios";
import { InputField } from "../../../components";
import { openPopUp } from "../../../store/reducer";
import { useTranslation } from "react-i18next";
import { FileUploader } from "react-drag-drop-files";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

export default function CatForm({ item = null, afterSubmit = () => { } }) {
  const fileTypes = ["jpg", "png", "jpeg"];
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFiles] = useState(false);
  const [bgImage, setBgImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: true,
    image: "",
    type: "ADD",
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!!item) {
      setFormData({
        ...formData,
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.active,
        bg_image: item.bg_url,
        image: item.image_url,
        type: "EDIT",
        _method: "patch",
      });
    }
  }, []);

  const handleChange = (e) => {
    var { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const _fd = new FormData();
    _fd.append("title", formData.title);
    _fd.append("description", formData.description);
    _fd.append("status", formData.status === true ? "1" : "0");
    _fd.append("image", file);
    _fd.append("bg_image", bgImage);
    let _url =
      formData.type === "ADD"
        ? "superadmin/categories"
        : `superadmin/categories/${formData.id}`;
    if (formData.type === "EDIT") {
      _fd.append("_method", "patch");
    }
    try {
      await API("post", _url, _fd);
      setIsLoading(false);
      if (formData.type === "ADD") {
        dispatch(openPopUp({ message: t("cate_create") }));
      } else {
        dispatch(openPopUp({ message: t("cate_update") }));
      }
      afterSubmit();
    } catch (error) {
      setIsLoading(false);
      dispatch(openPopUp({ message: t("error_msg"), type: 'error' }));
    }
  };

  return (
    <Box component="form" autoComplete="off" onSubmit={handleForm}>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <InputField
            type="text"
            name="title"
            label={t("COMMON.Title")}
            placeholder="Title"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <InputField
            type="text"
            label={t("COMMON.Description")}
            name="description"
            placeholder="Description..."
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          {formData.image ? (
            <ItemLabel title="Icon" url={formData.image} />
          ) :
            <Box variant='p' mb={1.5}>Icon</Box>
          }
          <FileUploader
            handleChange={(file) => setFiles(file)}
            name="file"
            required
            multiple={false}
            maxSize={100}
            types={fileTypes}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          {formData.bg_image ? (
            <ItemLabel title="Background Image" url={formData.bg_image} />
          ) :
            <Box variant='p' mb={1.5}>Background Image</Box>
          }
          <FileUploader
            handleChange={(file) => setBgImage(file)}
            name="bg_image"
            required
            multiple={false}
            maxSize={100}
            types={fileTypes}
          />
         
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">Status</Typography>
          <Switch
            checked={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.checked })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading && <CircularProgress size={16} color="primary" />}
            {formData.type === "ADD" ? t("COMMON.Add") : t("COMMON.Save")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}


const ItemLabel = ({ title, url }) => {
  const { t } = useTranslation();

  return (
    <Box style={{ display: "flex" }}>
      <Box variant='p' mb={1.5} mr={1}>{title}</Box>
      <a
        href={url}
        target="_blank"
        style={{ color: "black", textDecoration: "none" }}
      >
        <Tooltip title={t("Previous_Image")} placement='top'>
          <RemoveRedEyeIcon
            fontSize="medium"
            style={{
              cursor: "pointer",
              color: "black",
              marginTop: "3px",
            }}
          />
        </Tooltip>
      </a>
    </Box>
  );
}