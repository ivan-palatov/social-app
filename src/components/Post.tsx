import {
  mdiClockOutline,
  mdiComment,
  mdiHeart,
  mdiHeartOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
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

    // Удаляем лайк
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
    <div className="card">
      <div className="card-content">
        <div className="content">{props.body}</div>
      </div>
      <div className="card-footer is-flex is-justify-content-space-around">
        <span className="icon-text mr-3 is-clickable" onClick={handleLike}>
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
        <span className="icon-text mr-3 is-clickable">
          <span>{props.comments}</span>
          <span className="icon">
            <Icon path={mdiComment} />
          </span>
          <span>Комментариев</span>
        </span>
        <span className="icon-text">
          <span className="icon">
            <Icon path={mdiClockOutline} />
          </span>
          <span>{timeSince(props.createdAt)}</span>
        </span>
      </div>
    </div>
  );
};

export default Post;
