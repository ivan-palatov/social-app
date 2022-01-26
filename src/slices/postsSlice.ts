import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import { AppDispatch } from "../store";

export interface IPost {
  id: string;
  body: string;
  createdAt: string;
  likes: number;
  comments: number;
  user: string;
}

interface IPostsState {
  posts: IPost[];
  lastCreatedAt: string;
  hasMore: boolean;
  latestSnapshot: IPost[];
  fetchedMore: boolean;
}

const initialState: IPostsState = {
  posts: [],
  hasMore: true,
  lastCreatedAt: "",
  latestSnapshot: [],
  fetchedMore: false,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = [...state.posts, ...action.payload];
    },
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    setLastCreatedAt: (state, action: PayloadAction<string>) => {
      state.lastCreatedAt = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setFetchedMore: (state, action: PayloadAction<boolean>) => {
      state.fetchedMore = action.payload;
    },
    setPostsFromLatestSnapshot: (state) => {
      state.posts = state.latestSnapshot;
      state.lastCreatedAt =
        state.latestSnapshot[state.latestSnapshot.length - 1].createdAt;
      state.latestSnapshot = [];
      state.hasMore = true;
    },
    setPostsFromSnapshot: (state, action: PayloadAction<IPost[]>) => {
      const { payload } = action;
      // Если бесконечный скролл не делал доп. запросов, то меняем посты на нынешний снапшот
      if (!state.fetchedMore) {
        state.posts = payload;
        state.lastCreatedAt = payload[payload.length - 1].createdAt;
        return;
      }

      // Иначе - добавляем последний снапшот в "кэш"
      state.latestSnapshot = payload;
    },
  },
});

export const fetchMorePosts =
  (state: IPostsState) => async (dispatch: AppDispatch) => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(state.lastCreatedAt),
      limit(10)
    );
    const docs = await getDocs(q);

    if (docs.size === 0) {
      dispatch(setHasMore(false));
      return;
    }
    dispatch(setFetchedMore(true));
    dispatch(setLastCreatedAt(docs.docs[docs.size - 1].data().createdAt));
    dispatch(
      addPosts(
        docs.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as IPost[]
      )
    );
  };

export const {
  addPosts,
  setPosts,
  setHasMore,
  setLastCreatedAt,
  setFetchedMore,
  setPostsFromLatestSnapshot,
  setPostsFromSnapshot,
} = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
