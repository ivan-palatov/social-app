import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { getPost, subscribeToComments } from "../firebase";
import { useAppSelector } from "../hooks";
import { IPost } from "../slices/postsSlice";

export interface IComment {
  id: string;
  body: string;
  createdAt: string;
  postId: string;
  user: string;
  name: string;
  avatar: string;
}

const PostPage: React.FC = () => {
  const { id } = useParams();
  const state = useAppSelector((state) => state.posts);
  const [post, setPost] = useState<IPost>();
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    async function populatePost() {
      setIsLoading(true);

      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        setPost(existingPost);
        setIsLoading(false);
        return;
      }

      const post = await getPost(id!);
      if (!post) {
        setNotFound(true);
        return;
      }

      setPost(post);
      setIsLoading(false);
    }

    populatePost();
  }, [state.posts, id]);

  useEffect(() => {
    const unsubscribe = subscribeToComments(id!, setComments);

    return unsubscribe;
  }, [id]);

  if (isLoading || !post) {
    return <div>Загрузка...</div>;
  }

  if (notFound) {
    return <div>Такого поста не существует!</div>;
  }

  return (
    <>
      <Post {...post!} />
      {comments.length !== 0 && <div>{comments.length}</div>}
    </>
  );
};

export default PostPage;
