import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostHandler } from "../firebase/PostHandler";
import { AppDispatch } from "../store";
import { IPost } from "../utils/interfaces";

interface IPostsState {
  posts: IPost[];
  lastCreatedAt: string;
  hasMore: boolean;
  latestSnapshot: IPost[];
  fetchedMore: boolean;
  postsType: string;
}

const initialState: IPostsState = {
  posts: [],
  hasMore: true,
  lastCreatedAt: "",
  latestSnapshot: [],
  fetchedMore: false,
  postsType: "feed",
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = [...state.posts, ...action.payload];
    },
    addLike: (state, action: PayloadAction<string>) => {
      state.posts[
        state.posts.findIndex((post) => post.id === action.payload)
      ].likes += 1;
    },
    removeLike: (state, action: PayloadAction<string>) => {
      state.posts[
        state.posts.findIndex((post) => post.id === action.payload)
      ].likes -= 1;
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
    setPostsType: (state, action: PayloadAction<string>) => {
      state.postsType = action.payload;
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
      if (payload.length === 0) {
        state.hasMore = false;
        return;
      }

      // ???????? ?????????????????????? ???????????? ???? ?????????? ??????. ????????????????, ???? ???????????? ?????????? ???? ???????????????? ??????????????
      if (!state.fetchedMore) {
        state.posts = payload;
        state.lastCreatedAt = payload[payload.length - 1].createdAt;
        return;
      }

      // ?????????? - ?????????????????? ?????????????????? ?????????????? ?? "??????", ???????? ?????????????????? ???????? ????????????????
      if (payload[0].id === state.posts[0].id) {
        return;
      }

      state.latestSnapshot = payload;
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    setLatestSnapshot: (state, action: PayloadAction<IPost[]>) => {
      state.latestSnapshot = action.payload;
    },
  },
});

export const fetchMorePosts =
  (lastCreatedAt: string, handle?: string) => async (dispatch: AppDispatch) => {
    const posts = await PostHandler.getMorePosts(lastCreatedAt, handle);

    if (!posts || posts.length === 0) {
      dispatch(setHasMore(false));
      return;
    }

    dispatch(setFetchedMore(true));
    dispatch(setLastCreatedAt(posts[posts.length - 1].createdAt));
    dispatch(addPosts(posts));
  };

export const {
  addPosts,
  setPosts,
  addLike,
  removeLike,
  setHasMore,
  setLastCreatedAt,
  setFetchedMore,
  setPostsFromLatestSnapshot,
  setPostsFromSnapshot,
  removePost,
  setPostsType,
  setLatestSnapshot,
} = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
