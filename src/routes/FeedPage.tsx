import React, { useEffect } from "react";
import { Button, Columns } from "react-bulma-components";
import InfiniteScroll from "react-infinite-scroll-component";
import AddPostForm from "../components/AddPostForm";
import Post from "../components/Post";
import { subscribeToPosts } from "../firebase";
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
    const unsubscribe = subscribeToPosts((posts) =>
      dispatch(setPostsFromSnapshot(posts))
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-12-mobile is-8-tablet is-6-desktop">
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
            <progress className="progress is-small is-primary" max="100">
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
      </Columns.Column>
    </Columns>
  );
}

export default FeedPage;
