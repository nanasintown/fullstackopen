import { createSlice } from '@reduxjs/toolkit';

export const initialState = 'NOTIFICATION!';

const notificationSlice = createSlice({
  name: 'notification',

  initialState,

  reducers: {
    notificationChange(state, action) {
      return action.payload;
    },
  },
});

export const { notificationChange } = notificationSlice.actions;

export default notificationSlice.reducer;
