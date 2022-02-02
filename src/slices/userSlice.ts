import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LikeHandler } from "../firebase/LikeHandler";
import { UserHandler } from "../firebase/UserHandler";
import { AppDispatch } from "../store";
import { INotification, IUser } from "../utils/interfaces";

interface IUserState {
  user?: IUser;
  notifications: INotification[];
  loading: boolean;
}

const initialState: IUserState = {
  loading: true,
  notifications: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | undefined>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addLike: (state, action: PayloadAction<string>) => {
      state.user?.likes.push(action.payload);
    },
    removeLike: (state, action: PayloadAction<string>) => {
      state.user?.likes.splice(state.user!.likes.indexOf(action.payload), 1);
    },
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
    },
  },
});

export const fetchUserData = (uid: string) => async (dispatch: AppDispatch) => {
  const user = await UserHandler.getUserData(uid);

  dispatch(setLoading(false));
  if (!user) {
    return;
  }

  dispatch(setUser(user));
};

const { addLike, removeLike } = userSlice.actions;

export const createLike =
  (storyId: string, userHandle: string) => async (dispatch: AppDispatch) => {
    dispatch(addLike(storyId));
    await LikeHandler.addLike(storyId, userHandle);
  };

export const deleteLike =
  (storyId: string, userHandle: string) => async (dispatch: AppDispatch) => {
    dispatch(removeLike(storyId));
    await LikeHandler.removeLike(storyId, userHandle);
  };

export const { setUser, setLoading, setNotifications } = userSlice.actions;
export const userReducer = userSlice.reducer;
