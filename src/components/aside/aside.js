import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import Groups3Icon from "@mui/icons-material/Groups3";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import QRCode from "react-qr-code";

import { Logo } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/reducer";
import API from "../../axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const _paths = {
  SUPER_ADMIN: [
    {
      title: "SUPER_ADMIN.Manage_User",
      route: "/",
      icon: <HomeIcon />,
    },
    {
      title: "SUPER_ADMIN.Categories",
      route: "/categories",
      icon: <CategoryIcon />,
    },
  ],
  ADMIN: [
    {
      title: "ADMIN.Users",
      route: "/projects",
      icon: <Groups3Icon />,
    },
  ],
  CLIENT: [
    {
      title: "CLIENT.files",
      route: "/files",
      icon: <InsertDriveFileIcon />,
    },
  ],
};
export default function Aside({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [expOpen, setExpOpen] = React.useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.storeReducer);
  const qrUrl = window.location.href + "&mode=qr&project=" + user.id;
  const qrUrl2 = window.location.href + "&mode=qr&project=" + user.id;

  const handleClick = () => {
    setExpOpen(!expOpen);
  };

  const signOut = () => {
    API("post", "logout");
    dispatch(logout());
  };

  const changeRoute = (r) => {
    return navigate(r);
  };

  const openQrCodeForPrinter = () => {
    window.open(`/qr?${qrUrl}`, "_blank");
  };

  return (
    <>
      <Drawer
        variant={isMdUp ? "permanent" : "temporary"}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
      >
        <List sx={{ mt: 2 }}>
          <ListItem>
            <Box sx={{ margin: "0 auto" }}>
              <Link
                to={
                  user.role === "SUPER_ADMIN"
                    ? "/"
                    : user.role === "ADMIN"
                    ? "/projects"
                    : user.role === "CLIENT" && "/files"
                }
              >
                <div>
                  <img src={Logo} alt="logo" width="150px" />
                </div>
              </Link>
            </Box>
          </ListItem>
        </List>
        <div style={{ margin: "1rem 0" }}>
          <Divider />
        </div>
        <List className="listItemStyle">
          {_paths[user.role].map((_v, _i) => (
            <NavItem
              key={_i}
              text={_v.title}
              path={_v.route}
              myFunction={() => changeRoute(_v.route)}
              icon={_v.icon}
            />
          ))}
          <NavItem
            text={t("LAYOUT.Logout")}
            myFunction={signOut}
            icon={<LogoutIcon sx={{ color: "secondary.dark" }} />}
          />
        </List>
        <Box
          onClick={openQrCodeForPrinter}
          sx={{ position: "absolute", bottom: 10, right: "50px", left: "50px" }}
        >
          <div
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 100,
              width: "100%",
            }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={qrUrl}
              viewBox={`0 0 256 256`}
              level="H"
            />
          </div>
          <div style={{ fontSize: "0.54em", wordBreak:'break-all',textAlign: "center" }}>{qrUrl}</div>
          <div style={{ width: "100%", position: "absolute", top: "40px" }}>
            <div
              style={{
                background: "#FFFFFF",
                textAlign: "center",
                width: "32px",
                margin: "0 auto",
              }}
            >
              <img
                className="qr-icon"
                src={Logo}
                class="center"
                height={16}
                width={32}
                style={{}}
              />
            </div>
          </div>
        </Box>
      </Drawer>
    </>
  );
}

const NavItem = (props) => {
  var routeName = window.location.pathname;
  const { t } = useTranslation();
  return (
    <ListItem sx={{ padding: 0 }}>
      <ListItemButton
        onClick={props.myFunction}
        selected={props.path === routeName}
        sx={linkStyles}
      >
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText
          primary={t(props.text)}
          sx={{ color: "secondary.main" }}
        />
      </ListItemButton>
    </ListItem>
  );
};

const linkStyles = {
  "&.Mui-selected": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    "& *": {
      color: "primary.main",
      transition: "0.2s all ease-in-out",
    },
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      "& *": {
        color: "primary.main",
      },
    },
    "&::before": {
      height: "100%",
    },
  },
  "&::before": {
    content: `''`,
    position: "absolute",
    top: "50%",
    right: "0",
    transform: "translateY(-50%)",
    height: "0",
    width: "4px",
    backgroundColor: "primary.main",
    transition: "0.2s all ease-in-out",
  },
  "&:hover::before": {
    height: "100%",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    "& *": {
      color: "primary.main",
      transition: "0.2s all ease-in-out",
    },
  },
};
