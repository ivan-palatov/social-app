import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { timeSince } from "../utils/timeSince";

interface IProps {
  body: string;
  likes: number;
  comments: number;
  createdAt: string;
  [x: string]: any;
}

const Post: React.FC<IProps> = (props) => {
  return (
    <div>
      <div>{props.body}</div>
      <div>
        {props.likes} <FontAwesomeIcon icon={faHeart} color="#dd2222" /> |{" "}
        {props.comments} <FontAwesomeIcon icon={faComment} color="#c7c705" /> |{" "}
        {timeSince(props.createdAt)}
      </div>
    </div>
  );
};

export default Post;
