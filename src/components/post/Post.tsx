import { mdiArrowLeft } from "@mdi/js";
import Icon from "@mdi/react";
import React, { Key } from "react";
import Linkify from "react-linkify";
import { Link, useNavigate } from "react-router-dom";
import { SecureLink } from "react-secure-link";
import { useAppSelector } from "../../hooks";
import { IPost } from "../../utils/interfaces";
import { timeSince } from "../../utils/timeSince";
import SRLAppWrapper from "../SRLAppWrapper";
import DeletePost from "./DeletePost";
import PostActions from "./PostActions";

interface IProps extends IPost {
  shouldRenderDelete?: boolean;
}

const Post: React.FC<IProps> = (props) => {
  const state = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  function navigateToPost() {
    if (!props.shouldRenderDelete) {
      return;
    }

    navigate(`/post/${props.id}`);
  }

  function handlePostClick(
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) {
    if (e.target !== e.currentTarget || !props.shouldRenderDelete) {
      return;
    }

    navigate(`/post/${props.id}`);
  }

  return (
    <article className="media">
      <figure className="media-left">
        <p className="image is-64x64">
          <img className="is-rounded" src={props.avatar} alt="Аватар" />
        </p>
      </figure>
      <div className="media-content">
        <div className="content">
          <div>
            <strong>{props.name}</strong>{" "}
            <Link to={`/${props.user}`}>
              <small>@{props.user}</small>
            </Link>{" "}
            <small>{timeSince(props.createdAt)}</small>
            <br />
            <p onClick={handlePostClick} className="is-clickable is-pre-wrap">
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
            {props.photos.length !== 0 && (
              <>
                <SRLAppWrapper>
                  <div className="image-grid">
                    {props.photos.map((photo, i) => (
                      <img
                        key={`${i}`}
                        alt={`Фото ${i + 1}`}
                        src={photo}
                        className="image-grid-item"
                      />
                    ))}
                  </div>
                </SRLAppWrapper>
              </>
            )}
          </div>
        </div>
        <PostActions {...props} navigateToPost={navigateToPost} />
      </div>
      {props.shouldRenderDelete && state.user?.handle === props.user && (
        <DeletePost postId={props.id} />
      )}
      {!props.shouldRenderDelete && (
        <div className="media-right">
          <span
            className="icon is-clickable is-medium"
            onClick={() => {
              navigate(-1);
            }}
          >
            <Icon path={mdiArrowLeft} />
          </span>
        </div>
      )}
    </article>
  );
};

export default Post;
