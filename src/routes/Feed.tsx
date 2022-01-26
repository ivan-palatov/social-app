import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { Button, Columns } from "react-bulma-components";
import InfiniteScroll from "react-infinite-scroll-component";
import AddPostForm from "../components/AddPostForm";
import Post from "../components/Post";
import { db } from "../firebase";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchMorePosts,
  IPost,
  setPostsFromLatestSnapshot,
  setPostsFromSnapshot,
} from "../slices/postsSlice";

interface IProps {}

const Feed: React.FC<IProps> = () => {
  const state = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) =>
      dispatch(
        setPostsFromSnapshot(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IPost[]
        )
      )
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-12-mobile is-8-tablet is-6-desktop">
        <AddPostForm />
        {state.latestSnapshot.length !== 0 && (
          <Button
            onClick={() => dispatch(setPostsFromLatestSnapshot())}
            className="is-fullwidth"
          >
            Показать новые посты
          </Button>
        )}
        <InfiniteScroll
          className="is-fullwidth"
          dataLength={state.posts.length}
          next={() => dispatch(fetchMorePosts(state.lastCreatedAt))}
          hasMore={state.hasMore}
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
          {state.posts.map((post) => (
            <Post {...post} key={post.id} />
          ))}
        </InfiniteScroll>
      </Columns.Column>
    </Columns>
  );
};

export default Feed;
