import React, { useEffect, useState } from "react";
import { Columns } from "react-bulma-components";
import { useParams } from "react-router-dom";
import AddCommentForm from "../components/comment/AddCommentForm";
import Comments from "../components/comment/Comments";
import Post from "../components/post/Post";
import { PostHandler } from "../firebase/PostHandler";
import { useAppSelector } from "../hooks";
import { IPost } from "../utils/interfaces";

function PostPage() {
  const { id } = useParams();
  const state = useAppSelector((state) => state.posts);
  const [post, setPost] = useState<IPost>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function populatePost() {
      setIsLoading(true);

      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        setPost(existingPost);
        setIsLoading(false);
        return;
      }

      const post = await PostHandler.getPost(id!);
      if (!post) {
        setIsLoading(false);
        return;
      }

      setPost(post);
      setIsLoading(false);
    }

    window.scrollTo(0, 0);

    populatePost();
  }, [state.posts, id]);

  if (isLoading) {
    return (
      <progress className="progress is-small is-success" max="100">
        15%
      </progress>
    );
  }

  if (!post || !id) {
    // TODO: make 404
    return null;
  }

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-12-mobile is-8-tablet is-6-desktop">
        <Post {...post} />
        <AddCommentForm postId={id} />
        <Comments postId={id} />
      </Columns.Column>
    </Columns>
  );
}

export default PostPage;
