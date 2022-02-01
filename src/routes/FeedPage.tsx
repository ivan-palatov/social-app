import React, { useEffect } from "react";
import { Button } from "react-bulma-components";
import InfiniteScroll from "react-infinite-scroll-component";
import AddPostForm from "../components/post/AddPostForm";
import Post from "../components/post/Post";
import { PostHandler } from "../firebase/PostHandler";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchMorePosts,
  setPostsFromLatestSnapshot,
  setPostsFromSnapshot,
} from "../slices/postsSlice";

function FeedPage() {
  const [postsState, userState] = useAppSelector((state) => [
    state.posts,
    state.user,
  ]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = PostHandler.subscribeToPosts((posts) =>
      dispatch(setPostsFromSnapshot(posts))
    );

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      {
        userState.user && (
          <AddPostForm />
        ) /** TODO: if in user profile and not your profile - hide form */
      }
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
        next={() => dispatch(fetchMorePosts(postsState.lastCreatedAt))}
        hasMore={postsState.hasMore}
        loader={
          <progress className="progress is-small is-success" max="100">
            15%
          </progress>
        }
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Ура!✨ Вы прочитали все посты!💥💥💥</b>
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

export default FeedPage;
