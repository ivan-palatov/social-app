import React, { useEffect } from "react";
import InfinitePosts from "../components/InfinitePosts";
import Button from "../components/layout/Button";
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

function FeedPage() {
  const postsState = useAppSelector((state) => state.posts);
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // Проверяем, если уже имеющиеся в state посты относятся к общему фиду или к конкретному пользователю
  useEffect(() => {
    if (postsState.postsType !== "feed") {
      dispatch(setPosts([]));
      dispatch(setLatestSnapshot([]));
      dispatch(setPostsType("feed"));
    }
  }, [postsState.postsType, dispatch]);

  useEffect(() => {
    const unsubscribe = PostHandler.subscribeToPosts((posts) =>
      dispatch(setPostsFromSnapshot(posts))
    );

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="mt-3">
      {userState.user && <AddPostForm />}
      {postsState.latestSnapshot.length !== 0 && (
        <Button
          onClick={() => dispatch(setPostsFromLatestSnapshot())}
          className="is-fullwidth"
        >
          Показать новые посты
        </Button>
      )}
      <InfinitePosts />
    </div>
  );
}

export default FeedPage;
