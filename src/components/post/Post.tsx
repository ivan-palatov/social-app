import { mdiArrowLeft, mdiComment, mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React, { Key } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Linkify from "react-linkify";
import { Link, useNavigate } from "react-router-dom";
import { SecureLink } from "react-secure-link";
import { auth } from "../../firebase/firebase";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addLike, removeLike } from "../../slices/postsSlice";
import { createLike, deleteLike } from "../../slices/userSlice";
import { IPost } from "../../utils/interfaces";
import { timeSince } from "../../utils/timeSince";
import SRLAppWrapper from "../SRLAppWrapper";
import DeletePost from "./DeletePost";

interface IProps extends IPost {
  shouldRenderDelete?: boolean;
}

const Post: React.FC<IProps> = (props) => {
  const [user] = useAuthState(auth);
  const state = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function navigateToPost() {
    navigate(`/post/${props.id}`);
  }

  async function handleLike() {
    if (!user || !state.user) {
      return;
    }

    // Удаляем лайк, если он уже был
    if (state.user.likes.includes(props.id)) {
      dispatch(removeLike(props.id));
      dispatch(deleteLike(props.id, state.user.handle));
      return;
    }

    // Добавляем лайк
    dispatch(createLike(props.id, state.user.handle));
    dispatch(addLike(props.id));
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
            <p
              onClick={(e) => {
                if (e.target !== e.currentTarget) {
                  return;
                }
                navigateToPost();
              }}
              className="is-clickable is-pre-wrap"
            >
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
        <nav className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <span
                className="icon-text mr-3 is-clickable"
                onClick={handleLike}
              >
                <span>{props.likes}</span>
                <span className="icon">
                  <Icon
                    path={
                      state.user?.likes.includes(props.id)
                        ? mdiHeart
                        : mdiHeartOutline
                    }
                    color="red"
                  />
                </span>
              </span>
            </div>
            <div className="level-item">
              <span
                className="icon-text mr-3 is-clickable"
                onClick={navigateToPost}
              >
                <span>{props.comments}</span>
                <span className="icon">
                  <Icon path={mdiComment} />
                </span>
              </span>
            </div>
          </div>
        </nav>
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
