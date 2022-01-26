import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
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
  loading: boolean;
  lastCreatedAt: string;
  hasMore: boolean;
  hasNewSnapshot: boolean;
  latestSnapshot: IPost[];
  fetchedMore: boolean;
}

const initialState: IPostsState = {
  posts: [],
  loading: true,
  hasMore: true,
  lastCreatedAt: "",
  hasNewSnapshot: false,
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setHasNewSnapshot: (state, action: PayloadAction<boolean>) => {
      state.hasNewSnapshot = action.payload;
    },
    setLatestSnapshot: (state, action: PayloadAction<IPost[]>) => {
      state.latestSnapshot = action.payload;
    },
    setFetchedMore: (state, action: PayloadAction<boolean>) => {
      state.fetchedMore = action.payload;
    },
  },
});

export const setPostsFromSnapshot =
  (fetchedMore: boolean, snapshot: QuerySnapshot<DocumentData>) =>
  (dispatch: AppDispatch) => {
    if (!fetchedMore) {
      dispatch(
        setPosts(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as IPost[]
        )
      );
      dispatch(
        setLastCreatedAt(snapshot.docs[snapshot.size - 1].data().createdAt)
      );
      return;
    }
    dispatch(setHasNewSnapshot(true));
    dispatch(
      setLatestSnapshot(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as IPost[]
      )
    );
  };

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
  setHasNewSnapshot,
  setLoading,
  setHasMore,
  setLastCreatedAt,
  setLatestSnapshot,
  setFetchedMore,
} = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
