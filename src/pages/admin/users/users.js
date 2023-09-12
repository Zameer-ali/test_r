import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Typography,
  Stack,
  Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useTranslation } from "react-i18next";
import PageTitle from "../../../hooks/page-title";
import { TableWrapper, UsePagination } from "../../../components";
import API from "../../../axios";
import UserForm from "./user-form";
import { useNavigate } from "react-router-dom";


export default function AdUsers() {
  const { t } = useTranslation();
  PageTitle(t('USER.User'));
  const [showForm, setShowForm] = useState(false);
  const [singleRecord, setSingleRecord] = useState(null);
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const toggleForm = () => setShowForm(!showForm);
  const navigate = useNavigate();

  useEffect(() => {
    getRecord();
  }, [page]);

  const getRecord = async () => {
    setIsLoading(true);
    try {
      let { data } = await API('get', `admin/users?page=${page}`);
      setRecord(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const updateRecord = (item) => {
    setSingleRecord(item);
    setShowForm(true);
  };

  const addRecord = () => {
    if (!!singleRecord) {
      setSingleRecord(null);
    }
    toggleForm();
  };

  return (
    <Container maxWidth="false" sx={{ pt: 3, pb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography component="h6" variant="h6">
              {t('USER.User')}            </Typography>
            <Button onClick={addRecord} variant="contained">
              {!showForm ? t("COMMON.Add") : t("COMMON.Cancel")}
            </Button>
          </Stack>
        </Grid>
        {showForm && (
          <Grid item xs={12}>
            <UserForm
              item={singleRecord}
              afterSubmit={() => {
                getRecord();
                toggleForm();
              }}
            />
          </Grid>
        )}
        {!showForm && (
          <Grid item xs={12} sx={{ overflow: "auto" }}>
            <TableWrapper
              thContent={
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>{t("COMMON.Name")}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{t("COMMON.Email")}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{t("COMMON.User_status")}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{t("COMMON.project_status")}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{t("COMMON.Action")}</TableCell>
                </TableRow>
              }
              spanTd={4}
              isLoading={isLoading}
              isContent={!!record?.data.length}
            >
              {record?.data.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {v.name}
                  </TableCell>
                  <TableCell>
                    {v.email}
                  </TableCell>
                  <TableCell>
                    {v.active ?
                      <Chip label={t("COMMON.Active")} color='primary' /> :
                      <Chip label={t("COMMON.Disabled")} />
                    }
                  </TableCell>
                  <TableCell>
                    {v.project_status === 'in_progress' ? "In Progress" : v.project_status === 'completed' ? "Completed" : v.project_status === 'cancelled' ? "Cancelled" : '--'}
                  </TableCell>
                  <TableCell>
                    <Tooltip title='Edit'>
                      <IconButton
                        onClick={() => updateRecord(v)}
                        color='primary'
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('UPLOAD_FILES.Files')}>
                      <IconButton
                        onClick={() => navigate(`/project/${v.id}`)}
                        color='primary'
                      >
                        <UploadFileIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableWrapper>
            {!!record && record?.last_page > 1 && (
              <Box component="div" sx={{ mt: 2 }}>
                <UsePagination
                  total={record?.total}
                  perPage={record?.per_page}
                  page={page}
                  setPage={setPage}
                />
              </Box>
            )}
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
