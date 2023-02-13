import { createSlice } from "@reduxjs/toolkit";
import { ICommentsArray } from "../../types/chatTypes";

import { fetchComments } from "./chat-operations";

interface chatState {
  items: ICommentsArray;
  isLoading: boolean;
  error: null | string;
}

const initialState: chatState = {
  items: [],
  isLoading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addComment: (state, { payload }) => {
      state.items = [...state.items, payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.items = action.payload;
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action);
      if (typeof action.payload === "string") state.error = action.payload;
    });
  },
});

export const { addComment } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
