import React, { useEffect, useState } from "react";
import { Columns } from "react-bulma-components";
import { useParams } from "react-router-dom";
import AddCommentForm from "../components/AddCommentForm";
import Comment from "../components/Comment";
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

function PostPage() {
  const { id } = useParams();
  const state = useAppSelector((state) => state.posts);
  const [post, setPost] = useState<IPost>();
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
        setIsLoading(false);
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

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!post) {
    return <div>Такого поста не существует!</div>;
  }

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-12-mobile is-8-tablet is-6-desktop">
        <Post {...post!} />
        <AddCommentForm postId={post.id} />
        {comments.map((comment) => (
          <Comment {...comment} key={comment.id} />
        ))}
      </Columns.Column>
    </Columns>
  );
}

export default PostPage;
