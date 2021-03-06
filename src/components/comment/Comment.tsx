import React, { Key } from "react";
import Linkify from "react-linkify";
import { Link } from "react-router-dom";
import { SecureLink } from "react-secure-link";
import { useAppSelector } from "../../hooks";
import { IComment } from "../../utils/interfaces";
import { timeSince } from "../../utils/timeSince";
import DeleteComment from "./DeleteComment";

interface IProps extends IComment {}

const Comment: React.FC<IProps> = (props) => {
  const state = useAppSelector((state) => state.user);

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
            <p className="is-pre-wrap">
              <Linkify
                componentDecorator={(
                  decoratedHref: string,
                  decoratedText: string,
                  key: Key
                ) => (
                  <SecureLink href={decoratedHref} key={key}>
                    {decoratedText}
                  </SecureLink>
                )}
              >
                {props.body}
              </Linkify>
            </p>
          </div>
        </div>
      </div>
      {state.user && state.user.handle === props.user && (
        <DeleteComment commentId={props.id} postId={props.postId} />
      )}
    </article>
  );
};

export default Comment;
