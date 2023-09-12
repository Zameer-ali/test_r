import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { MenuItem, Select, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export default function Header({ toggleDrawer }) {
    const { user } = useSelector((state) => state.storeReducer);
    const [value, setValue] = React.useState('de')
    const { t } = useTranslation();

    // FOR CHANGE LANGUAGE 
    async function handleLang() {
        const key = localStorage.getItem('i18nextLng');
        console.log(key)
        if (key == "en-US") {
            setValue("de");
            i18next.changeLanguage("de");
        } else {
            setValue("en-US");
            i18next.changeLanguage("en-US");
        }
    }
    // 

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2, display: { sm: 'flex', md: 'none' } }}
                        onClick={toggleDrawer}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        {t('HEADER.Dashboard')}
                    </Typography>
                    <Box sx={{ marginLeft: 'auto' }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                        >
                            <Box mx={1}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={value}
                                    variant='standard'
                                    onChange={handleLang}
                                >
                                    <MenuItem value='de'>German</MenuItem>
                                    <MenuItem value='en-US'>English</MenuItem>
                                </Select>
                            </Box>
                            <IconButton
                                size="large"
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <p>{user.name}</p>
                        </Stack>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
