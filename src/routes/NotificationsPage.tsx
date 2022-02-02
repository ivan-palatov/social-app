import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { NotificationHandler } from "../firebase/NotificationHandler";
import { useAppSelector } from "../hooks";

interface IProps {}

const NotificationsPage: React.FC<IProps> = () => {
  const state = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!state.user) {
      return;
    }

    NotificationHandler.markAllAsRead(state.user.handle);
  }, [state.user]);

  return (
    <ul>
      {state.notifications.map((notification) => (
        <li className="media is-align-items-center" key={notification.id}>
          <figure className="media-left image is-32x32">
            <img
              src={notification.avatar}
              alt="Аватар"
              className="is-rounded"
            />
          </figure>
          <div className="media-content">
            <Link to={`/${notification.from}`}>{notification.name}</Link>{" "}
            {notification.type === "like" ? (
              <span>
                поставил лайк вашему{" "}
                <Link to={`/post/${notification.postId}`}>
                  <strong>посту</strong>
                </Link>
              </span>
            ) : (
              <span>
                прокомментировал ваш{" "}
                <Link to={`/post/${notification.postId}`}>
                  <strong>пост</strong>
                </Link>
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NotificationsPage;
