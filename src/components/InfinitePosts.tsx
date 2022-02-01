import React, { memo, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchMorePosts } from "../slices/postsSlice";
import Post from "./post/Post";

interface IProps {
  handle?: string;
}

const InfinitePosts: React.FC<IProps> = ({ handle }) => {
  const state = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  const fetchMore = useCallback(() => {
    dispatch(fetchMorePosts(state.lastCreatedAt, handle));
  }, [dispatch, state.lastCreatedAt, handle]);

  return (
    <InfiniteScroll
      className="is-fullwidth"
      dataLength={state.posts.length}
      next={fetchMore}
      hasMore={state.hasMore}
      loader={
        <progress className="progress is-small is-success" max="100">
          15%
        </progress>
      }
      endMessage={
        <p className="has-text-centered mt-3">
          {state.posts.length === 0
            ? "Постов пока нет 😕"
            : "Вы всё уже прочитали 😄"}
        </p>
      }
    >
      {state.posts.map((post) => (
        <Post {...post} key={post.id} shouldRenderDelete />
      ))}
    </InfiniteScroll>
  );
};

export default memo(InfinitePosts);
