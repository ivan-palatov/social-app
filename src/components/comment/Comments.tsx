import React, { useEffect, useState } from "react";
import { CommentHandler } from "../../firebase/CommentHandler";
import { IComment } from "../../utils/interfaces";
import Loader from "../layout/Loader";
import Comment from "./Comment";

interface IProps {
  postId: string;
}

const Comments: React.FC<IProps> = ({ postId }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = CommentHandler.subscribeToComments(
      postId,
      (snapshot) => {
        setIsLoading(false);
        setComments(snapshot);
      }
    );

    return () => unsubscribe();
  }, [postId]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {comments.map((comment) => (
        <Comment {...comment} key={comment.id} />
      ))}
    </>
  );
};

export default Comments;
