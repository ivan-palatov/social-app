import { mdiBellOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationHandler } from "../firebase/NotificationHandler";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setNotifications } from "../slices/notificationsSlice";

interface IProps {}

const NotificationBell: React.FC<IProps> = () => {
  const userState = useAppSelector((state) => state.user);
  const notificationsState = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userState.user) {
      return;
    }

    const unsubscribe = NotificationHandler.subscribeToNotifications(
      (snap) => dispatch(setNotifications(snap)),
      userState.user.handle
    );

    return () => unsubscribe();
  }, [dispatch, userState.user]);

  function openNotifications() {
    if (location.pathname === "/notifications") {
      return;
    }

    navigate("/notifications");
  }

  return (
    <div
      style={{ marginLeft: "auto", position: "relative" }}
      className="is-clickable"
      onClick={openNotifications}
    >
      <span className="icon is-medium">
        <Icon path={mdiBellOutline} />
      </span>
      {notificationsState.unreadSize > 0 && (
        <span
          className="badge is-danger is-bottom-left"
          style={{ right: -7, bottom: 9, left: "auto" }}
        >
          {notificationsState.unreadSize}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
