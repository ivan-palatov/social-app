import { mdiComment, mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addLike, IPost, removeLike } from "../slices/postsSlice";
import { createLike, deleteLike } from "../slices/userSlice";
import { timeSince } from "../utils/timeSince";

interface IProps extends IPost {}

const Post: React.FC<IProps> = (props) => {
  const [user] = useAuthState(auth);
  const state = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

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
          <p>
            <strong>{props.name}</strong>{" "}
            <Link to={`/${props.user}`}>
              <small>@{props.user}</small>
            </Link>{" "}
            <small>{timeSince(props.createdAt)}</small>
            <br />
            {props.body}
            {props.photos.length !== 0 && (
              <>
                <br />
                {props.photos.map((photo, i) => (
                  <img
                    key={`${i}`}
                    alt={`Фото ${i}`}
                    src={photo}
                    className="round-corners"
                  />
                ))}
              </>
            )}
          </p>
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
              <span className="icon-text mr-3 is-clickable">
                <span>{props.comments}</span>
                <span className="icon">
                  <Icon path={mdiComment} />
                </span>
              </span>
            </div>
          </div>
        </nav>
      </div>
    </article>
  );
};

export default Post;
