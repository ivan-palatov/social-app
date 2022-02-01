import React, { useEffect } from "react";
import { Button } from "react-bulma-components";
import { useParams } from "react-router-dom";
import InfinitePosts from "../components/InfinitePosts";
import AddPostForm from "../components/post/AddPostForm";
import { PostHandler } from "../firebase/PostHandler";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
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
    if (postsState.postsType !== handle) {
      dispatch(setPosts([]));
      dispatch(setLatestSnapshot([]));
      dispatch(setPostsType(handle!));
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
      <InfinitePosts handle={handle} />
    </>
  );
}

export default ProfilePage;
