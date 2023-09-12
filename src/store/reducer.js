import { createSlice } from "@reduxjs/toolkit";

export const myReducer = createSlice({
  name: "storeReducer",
  initialState: {
    isLogged: false,
    user: null,
    token: null,
    openMenu: true,
    open: false,
    type: "success",
    message: "",
  },

  reducers: {
    toggleMenu: (state, data) => {
      state.openMenu = data.payload;
    },
    storeUser: (state, data) => {
      state.isLogged = true;
      state.user = data?.payload;
    },
    loginUser: (state, data) => {
      localStorage.setItem("@ACCESS_TOKEN", data.payload.access_token);
      state.isLogged = true;
      state.user = data.payload.user;
    },
    registerUser: (state, payload) => {
      state.isLogged = true;
      localStorage.setItem("@ACCESS_TOKEN", payload.token);
      state.user = payload.user;
    },
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.isLogged = false;
    },
    openPopUp: (state, data) => {
      state.message = data?.payload?.message;
      state.type = data?.payload?.type ?? state.type;
      state.open = true;
    },
    closePopUp: (state, data) => {
      state.open = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { storeUser, toggleMenu, loginUser, registerUser, logout, closePopUp, openPopUp } =
  myReducer.actions;

export default myReducer.reducer;
