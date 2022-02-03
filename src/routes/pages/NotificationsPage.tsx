import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/layout/Loader";
import { NotificationHandler } from "../../firebase/NotificationHandler";
import { useAppSelector } from "../../hooks";
import { timeSince } from "../../utils/timeSince";

interface IProps {}

const NotificationsPage: React.FC<IProps> = () => {
  const userState = useAppSelector((state) => state.user);
  const notificationsState = useAppSelector((state) => state.notifications);

  useEffect(() => {
    if (!userState.user || notificationsState.unreadSize === 0) {
      return;
    }

    NotificationHandler.markAllAsRead(userState.user.handle);
  }, [notificationsState.unreadSize, userState.user]);

  if (notificationsState.loading) {
    return <Loader />;
  }

  return (
    <div className="is-flex is-flex-direction-column is-align-items-center">
      <span className="my-3">
        <strong>Уведомления</strong>
      </span>
      <ul>
        {notificationsState.notifications.map((notification) => (
          <li className="media is-align-items-center" key={notification.id}>
            <figure className="media-left image is-32x32">
              <img
                src={notification.avatar}
                alt="Аватар"
                className="is-rounded"
              />
            </figure>
            <div className="media-content">
              <Link to={`/${notification.from}`}>
                <strong>{notification.name}</strong>
              </Link>{" "}
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
              <span className="ml-2 is-size-7">
                {timeSince(notification.createdAt)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
