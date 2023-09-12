import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Box,
  Switch,
  Stack,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import API from "../../../axios";
import { InputField, SelectBox } from "../../../components";
import { openPopUp } from "../../../store/reducer";
import { useTranslation } from "react-i18next";

export default function UserForm({ item = null, afterSubmit = () => { } }) {
  console.log(item)
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: true,
    project_status: '',
    type: "ADD",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!!item) {
      setFormData({
        ...formData,
        id: item.id,
        name: item.name,
        email: item.email,
        status: item.active,
        project_status: item.project_status ?? 'in_progress',
        type: "EDIT",
        _method: "patch",
      });
    }
  }, []);

  const handleChange = (e) => {

    var { name, value } = e.target;
    console.log(e.target.value)
    setFormData({ ...formData, [name]: value });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let _url =
      formData.type === "ADD" ? "admin/users" : `admin/users/${formData.id}`;
    let _fd = {
      name: formData.name,
      email: formData.email,
      status: formData.status === true ? 1 : 0,
      project_status: formData.project_status,
    };
    if (formData.type === "EDIT") {
      _fd._method = "patch";
    }
    try {
      let { data } = await API("post", _url, _fd);
      setIsLoading(false);
      if (formData.type === "ADD") {
        dispatch(openPopUp({ message: t("client_create") }));
      } else {
        dispatch(openPopUp({ message: t("client_update") }));
      }
      afterSubmit();
    } catch (error) {
      setIsLoading(false);
      dispatch(openPopUp({ message: t("error_msg") }));
    }
  };

  return (
    <Box component="form" autoComplete="off" onSubmit={handleForm}>
      <Stack spacing={2} direction={{ sm: "column", xs: "column" }}>
      <Box sx={{ maxWidth:'400px' }}>
        <InputField
          type="text"
          label={t("COMMON.Name")}
          name="name"
          placeholder="Admin"
          required
          color="primary"
          value={formData.name}
          onChange={handleChange}
        />
        </Box>
        {formData.type === "ADD" && (
          <>
            <InputField
              type="email"
              label={t("COMMON.Email")}
              name="email"
              placeholder="admin@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </>
        )}
        {formData.type !== "ADD" && (
          <>
            <Box sx={{ maxWidth:'400px' }}>
              <SelectBox
                items={[{ label: "In Progress", value: "in_progress" }, { label: "Completed", value: "completed" }, { label: "Canceled", value: "cancelled" }]}
                label={t('COMMON.project_status')}
                name="project_status"
                size="small"
                initValue={formData.project_status}
                handleChange={handleChange}
              />
            
            <Stack direction="row"  alignItems="center" justifyContent="space-between" mt={2}>
              <Typography variant="body1">{t('COMMON.User_status')}</Typography>
              <Switch
                checked={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked })
                }
              />
            </Stack>
            </Box>
          </>
        )}

      </Stack>
      <Box mt={2}>
        <Button variant="contained" type="submit" disabled={isLoading}>
          {isLoading && <CircularProgress size={16} color="primary" />}
          {formData.type === "ADD" ? t("COMMON.Add") : t("COMMON.Save")}
        </Button>
      </Box>
    </Box>
  );
}
