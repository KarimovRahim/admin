import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosRequest } from '../utils/axiosConfig.js';

export const GetUser = createAsyncThunk(
  "user/getAll",
  async (_, { rejectedWithValue }) => {
    try {
      const response = await axiosRequest.get('/User/AllItems');
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectedWithValue(error.response?.data || "Ошибка при получении пользователей");
    }
  }
);

export const DeleteUser = createAsyncThunk(
  "user/delete",
  async(id, { rejectedWithValue, dispatch}) => {
    try {
      const response = await axiosRequest.delete(`/User/Delete?id=${id}`)
      dispatch(GetUser());
    } catch (error) {
      console.error(error)
      return rejectedWithValue(error.response?.data || "Ошибка при удалении пользователя.")
    }
  }
);