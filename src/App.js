import './App.css';
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Router from './router/router';
import store from './store/store';
import { Provider } from 'react-redux';

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFBB00",
      light: "#D8345478",
    },
    secondary: {
      light: '#FFFFFF',
      main: '#8E8E8E',
      dark: '#262626',
    },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}