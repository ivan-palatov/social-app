import { configureStore } from "@reduxjs/toolkit";
import { notificationsReducer } from "./slices/notificationsSlice";
import { postsReducer } from "./slices/postsSlice";
import { userReducer } from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
