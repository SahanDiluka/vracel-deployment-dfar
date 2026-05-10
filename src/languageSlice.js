// src/store/languageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    current: localStorage.getItem("language") ?? "en",
  },
  reducers: {
    setLanguage: (state, action) => {
      state.current = action.payload;
      localStorage.setItem("language", action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const selectLanguage = (state) => state.language.current;
export default languageSlice.reducer;
