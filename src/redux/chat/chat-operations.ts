import { createAsyncThunk } from "@reduxjs/toolkit";

import { comments } from "../../fakeData";
import { ICommentsArray } from "../../types/chatTypes";

const asyncGetComments = (): Promise<ICommentsArray> => {
  return new Promise((resolve, reject) =>
    setTimeout(() => resolve(comments), 500)
  );
};

export const fetchComments = createAsyncThunk(
  "chat/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await asyncGetComments();
      return response;
    } catch (error) {
      let message = "Unknown Error";
      if (error instanceof Error) message = error.message;

      return thunkAPI.rejectWithValue(message);
    }
  }
);
