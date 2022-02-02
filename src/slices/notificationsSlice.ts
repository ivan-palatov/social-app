import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "../utils/interfaces";

interface IUserState {
  notifications: INotification[];
  loading: boolean;
  unreadSize: number;
}

const initialState: IUserState = {
  loading: true,
  notifications: [],
  unreadSize: 0,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
      state.unreadSize = action.payload.filter((note) => !note.isRead).length;
      state.loading = false;
    },
  },
});

export const { setNotifications } = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
