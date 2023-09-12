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
import { InputField, PasswordInputField } from "../../../components";
import { openPopUp } from "../../../store/reducer";
import { useTranslation } from "react-i18next";

export default function AdminForm({ item = null, afterSubmit = () => { } }) {
    const [isLoading, setIsLoading] = useState(false);
    const {t} = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        status: true,
        type: "ADD",
    });
    const [secureEntry, setSecureEntry] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!!item) {
            setFormData({
                ...formData,
                id: item.id,
                name: item.name,
                email: item.email,
                status: item.active,
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
        let _url =
            formData.type === "ADD"
                ? "superadmin/admins"
                : `superadmin/admins/${formData.id}`;
        let _fd = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            status: formData.status === true ? 1 : 0,
        }
        if (formData.type === 'EDIT') {
            _fd._method = 'patch'
        }
        try {
            let { data } = await API("post", _url, _fd)
            setIsLoading(false);
            if (formData.type === "ADD") {
                dispatch(openPopUp({ message: t("admin_create")}))
            } else {
                dispatch(openPopUp({ message:  t("admin_update") }))
            }
            afterSubmit();
        } catch (error) {
            setIsLoading(false);
            dispatch(openPopUp({ message:  t("error_msg")}))
        }
    };

    return (
        <Box component='form' autoComplete="off" onSubmit={handleForm}>
            <Stack spacing={2}>
                <InputField
                    type='text'
                    label={t("COMMON.Name")}
                    name="name"
                    placeholder="Admin"
                    required
                    value={formData.name}
                    onChange={handleChange}
                />
                {formData.type === 'ADD' &&
                    <>
                        <InputField
                            type='email'
                            label={t("COMMON.Email")}
                            name="email"
                            placeholder="admin@example.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <PasswordInputField
                            label={t("COMMON.Password")}
                            name="password"
                            placeholder="password"
                            required
                            onChange={handleChange}
                            value={formData.password}
                            secureEntry={secureEntry}
                            setSecureEntry={setSecureEntry}
                        />
                    </>
                }
                <Box>
                    <Typography variant='body1'>{t("COMMON.Status")}</Typography>
                    <Switch checked={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.checked })} />
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <CircularProgress size={16} color="primary" />
                        )}
                        {formData.type === "ADD" ? t("COMMON.Add") : t("COMMON.Save")}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
