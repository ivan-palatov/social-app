import React from "react";
import { Link } from "react-router-dom";
import { IComment } from "../routes/PostPage";
import { timeSince } from "../utils/timeSince";

interface IProps extends IComment {}

const Comment: React.FC<IProps> = (props) => {
  return (
    <article className="media ml-5">
      <figure className="media-left">
        <p className="image is-48x48">
          <img src={props.avatar} alt="Аватар" className="is-rounded" />
        </p>
      </figure>
      <div className="media-content">
        <div className="content">
          <div>
            <strong>{props.name}</strong>{" "}
            <Link to={`/${props.user}`}>@{props.user}</Link>{" "}
            <small>{timeSince(props.createdAt)}</small>
            <br />
            {props.body}
          </div>
        </div>
      </div>
    </article>
  );
};

export default Comment;
