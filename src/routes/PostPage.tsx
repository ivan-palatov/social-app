import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddCommentForm from "../components/comment/AddCommentForm";
import Comments from "../components/comment/Comments";
import Post from "../components/post/Post";
import { PostHandler } from "../firebase/PostHandler";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setPosts } from "../slices/postsSlice";
import { IPost } from "../utils/interfaces";

function PostPage() {
  const { id } = useParams();
  const state = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();
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
      dispatch(setPosts([post]));
      setIsLoading(false);
    }

    window.scrollTo(0, 0);

    populatePost();
  }, [state.posts, id, dispatch]);

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
    <>
      <Post {...post} />
      <AddCommentForm id={id} userHandle={post.user} />
      <Comments postId={id} />
    </>
  );
}

export default PostPage;
