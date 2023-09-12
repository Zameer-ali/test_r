import React, { useState } from "react";
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Snackbar,
    Alert,
    Fade,
    CircularProgress,
} from "@mui/material";

import { useSelector } from "react-redux";
import { Logo } from "../../assets";
import {  PasswordInputField, SplashScreen } from "../../components";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../hooks/page-title";

import API from "../../axios";

export default function SetPassword() {
    PageTitle("Set Your Password");
    const [formData, setFormData] = useState({
        password: "",
        showPassword: false,
    });
    const [alert, setAlert] = useState({ open: false, message: "Error!" });
    const [isLoading, setIsLoading] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [secureEntry, setSecureEntry] = useState(true);

    const { token } = useParams();

    const checkToken = async () => {
        setIsLoading(true)
        try {
            await API('get', `check-token/${token}`)
            setIsLoading(false);
        } catch (error) {
            navigate('/sign-in');
            setIsLoading(false);
        }
    }

    const { isLogged, user } = useSelector((state) => state.storeReducer);
    let navigate = useNavigate();

    React.useEffect(() => {
        if (isLogged && user.role === 'SUPER_ADMIN') {
            navigate("/");
        }
        if (isLogged && user.role === 'ADMIN') {
            navigate("/projects");
        }
        if (isLogged && user.role === 'CLIENT') {
            navigate("/files");
        }
        checkToken();
        setFadeIn(true);
    }, []);

    const handleClose = () => setAlert({ ...alert, open: false });

    const showAlertMessage = (msg) => {
        setAlert({
            open: true,
            message: msg,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await API('post', 'set-password', { password: formData.password, token: token })
            setIsLoading(false);
        } catch (error) {
            if (error?.response?.status === 400) {
                showAlertMessage(error.response.data.message);
            } else {
                showAlertMessage('Error occurred. Please try again');
            }
            setIsLoading(false);
        }
    };

    return (
        <>
            {
                isLoading ?
                    <SplashScreen /> :
                    (
                        <Container
                            maxWidth={false}
                            sx={{
                                backgroundColor: "primary.dark",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: { alignItems: "center", md: "center" },
                                height: "100vh",
                            }}
                        >
                            <Fade in={fadeIn} timeout={1500}>
                                <Box
                                    component={Paper}
                                    elevation={24}
                                    sx={{ m: 1, width: "100%", maxWidth: "500px" }}
                                >
                                    <Box
                                        component="div"
                                        sx={{
                                            position: "relative",
                                            padding: { lg: "3rem", md: "2rem", padding: "2rem 1rem" },
                                        }}
                                    >
                                        <Box sx={{ textAlign: "center" }}>
                                            <img src={Logo} width="170" alt="logo" />
                                        </Box>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                textAlign: "center",
                                                paddingTop: "1rem",
                                                color: "secondary.main",
                                                paddingBottom: "2rem",
                                                fontWeight: "bold",
                                            }}
                                            gutterBottom
                                            component="h4"
                                        >
                                            "Set your password"
                                        </Typography>
                                        <form onSubmit={handleForm} autoComplete="off">
                                            <PasswordInputField
                                                label="Password"
                                                name="password"
                                                placeholder="password"
                                                required
                                                onChange={(event) => handleChange(event)}
                                                value={formData.password}
                                                secureEntry={secureEntry}
                                                setSecureEntry={setSecureEntry}
                                            />
                                            <div style={{ textAlign: "center" }}>
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    variant="contained"
                                                    sx={{ marginTop: "3rem", textTransform: "capitalize" }}
                                                >
                                                    {isLoading ? (
                                                        <CircularProgress
                                                            size={15}
                                                            sx={{ color: "#fff", marginRight: 1 }}
                                                        />
                                                    ) : null}
                                                    Set Password
                                                </Button>
                                            </div>
                                        </form>
                                    </Box>
                                    <Box sx={{ p: 1 }}>
                                        <Typography sx={{ textAlign: "center", color: "#ccc" }}>
                                            @ Copyright {new Date().getFullYear()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Fade>
                        </Container>
                    )
            }
            <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}
