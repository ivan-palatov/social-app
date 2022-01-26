import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AppDispatch } from "../store";

export interface IUser {
  id: string;
  uid: string;
  authProvider: string;
  avatar: string;
  bio: string;
  createdAt: string;
  email: string;
  handle: string;
  name: string;
  website: string;
  likes: string[];
}

interface IUserState {
  user?: IUser;
  loading: boolean;
}

const initialState: IUserState = {
  loading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
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
  },
});

export const fetchUserData = (uid: string) => async (dispatch: AppDispatch) => {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const doc = await getDocs(q);
  const data = doc.docs[0].data();
  const likesDocs = await getDocs(
    query(collection(db, "likes"), where("userHandle", "==", data.handle))
  );

  dispatch(
    setUser({
      ...data,
      id: doc.docs[0].id,
      likes: likesDocs.docs.map((d) => d.data().storyId) as any[],
    } as IUser)
  );
  dispatch(setLoading(false));
};

export const createLike =
  (id: string, userHandle: string) => async (dispatch: AppDispatch) => {
    dispatch(addLike(id));
    // Добавляем лайк в бд
    await addDoc(collection(db, "likes"), { userHandle, storyId: id });
    await updateDoc(doc(db, "posts", id), { likes: increment(1) });
  };

export const deleteLike =
  (id: string, userHandle: string) => async (dispatch: AppDispatch) => {
    dispatch(removeLike(id));
    // Удаляем лайк из бд
    const data = await getDocs(
      query(
        collection(db, "likes"),
        where("storyId", "==", id),
        where("userHandle", "==", userHandle)
      )
    );
    await deleteDoc(doc(db, "likes", data.docs[0].id));
    await updateDoc(doc(db, "posts", id), { likes: increment(-1) });
  };

export const { setUser, setLoading, addLike, removeLike } = userSlice.actions;
export const userReducer = userSlice.reducer;
