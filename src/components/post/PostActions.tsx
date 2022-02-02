import { mdiCommentOutline, mdiHeart, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { NotificationHandler } from "../../firebase/NotificationHandler";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addLike, removeLike } from "../../slices/postsSlice";
import { createLike, deleteLike } from "../../slices/userSlice";
import { IPost } from "../../utils/interfaces";

interface IProps extends IPost {
  navigateToPost: () => void;
}

const PostActions: React.FC<IProps> = ({ navigateToPost, ...props }) => {
  const state = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  async function handleLike() {
    if (!state.user) {
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

    // Добавляем оповещение о лайке, если юзер не лайкает свой же пост
    if (state.user.handle === props.user) {
      return;
    }

    await NotificationHandler.createNotification(
      state.user,
      props.id,
      "like",
      props.user
    );
  }

  return (
    <nav className="level is-mobile">
      <div className="level-left">
        <div className="level-item">
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
        </div>
        <div className="level-item">
          <span
            className="icon-text mr-3 is-clickable"
            onClick={navigateToPost}
          >
            <span>{props.comments}</span>
            <span className="icon">
              <Icon path={mdiCommentOutline} />
            </span>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default PostActions;
