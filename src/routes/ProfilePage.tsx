import React, { useEffect } from "react";
import { Button } from "react-bulma-components";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import AddPostForm from "../components/post/AddPostForm";
import Post from "../components/post/Post";
import { PostHandler } from "../firebase/PostHandler";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchMorePosts,
  setLatestSnapshot,
  setPosts,
  setPostsFromLatestSnapshot,
  setPostsFromSnapshot,
  setPostsType,
} from "../slices/postsSlice";

function ProfilePage() {
  const { handle } = useParams();
  const postsState = useAppSelector((state) => state.posts);
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!handle) {
      return;
    }

    if (postsState.postsType !== handle) {
      dispatch(setPosts([]));
      dispatch(setLatestSnapshot([]));
      dispatch(setPostsType(handle));
    }
  }, [handle, postsState.postsType, dispatch]);

  useEffect(() => {
    const unsubscribe = PostHandler.subscribeToPosts(
      (posts) => dispatch(setPostsFromSnapshot(posts)),
      handle
    );

    return () => unsubscribe();
  }, [dispatch, handle]);

  return (
    <>
      {userState.user && userState.user.handle === handle && <AddPostForm />}
      {postsState.latestSnapshot.length !== 0 && (
        <Button
          onClick={() => dispatch(setPostsFromLatestSnapshot())}
          className="is-fullwidth"
        >
          Показать новые посты
        </Button>
      )}
      <InfiniteScroll
        className="is-fullwidth"
        dataLength={postsState.posts.length}
        next={() => dispatch(fetchMorePosts(postsState.lastCreatedAt, handle))}
        hasMore={postsState.hasMore}
        loader={
          <progress className="progress is-small is-success" max="100">
            15%
          </progress>
        }
        endMessage={
          <p className="has-text-centered mt-3">
            {postsState.posts.length === 0
              ? "Постов пока нет 😕"
              : "Вы всё уже прочитали 😄"}
          </p>
        }
      >
        {postsState.posts.map((post) => (
          <Post {...post} key={post.id} shouldRenderDelete />
        ))}
      </InfiniteScroll>
    </>
  );
}

export default ProfilePage;
