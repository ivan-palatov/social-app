import { DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Columns } from "react-bulma-components";
import InfiniteScroll from "react-infinite-scroll-component";
import AddPostForm from "../components/AddPostForm";
import Post from "../components/Post";
import { getMorePosts, getPosts } from "../firebase";

interface IProps {}

const Feed: React.FC<IProps> = () => {
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [lastCreated, setLastCreated] = useState<string | undefined>("");
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  async function getOtherPosts() {
    setLoading(true);
    const posts = await getMorePosts(lastCreated!);

    setPosts((oldPosts) => [...oldPosts, ...posts.posts]);
    setLastCreated(posts.lastCreated);
    setSize((oldSize) => oldSize + posts.size);
    setLoading(false);

    if (posts.size !== 10) {
      setHasMore(false);
    }
  }

  useEffect(() => {
    async function getFirstPosts() {
      setLoading(true);
      const posts = await getPosts();

      setPosts(posts.posts);
      setLastCreated(posts.lastCreated);
      setSize(posts.size);
      setLoading(false);

      if (posts.size !== 10) {
        setHasMore(false);
      }
    }

    getFirstPosts();
  }, []);

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-5-tablet is-4-desktop is-3-widescreen">
        <AddPostForm />
        <InfiniteScroll
          dataLength={size}
          next={getOtherPosts}
          hasMore={hasMore}
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
          {posts.map((post) => (
            <Post
              body={post.body}
              likes={post.likes}
              comments={post.comments}
              createdAt={post.createdAt}
              key={post.id}
            />
          ))}
        </InfiniteScroll>
      </Columns.Column>
    </Columns>
  );
};

export default Feed;
