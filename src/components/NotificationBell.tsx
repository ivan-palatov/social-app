import { mdiBellOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationHandler } from "../firebase/NotificationHandler";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setNotifications } from "../slices/userSlice";

interface IProps {}

const NotificationBell: React.FC<IProps> = () => {
  const state = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!state.user) {
      return;
    }

    const unsubscribe = NotificationHandler.subscribeToNotifications(
      (snap) => dispatch(setNotifications(snap)),
      state.user.handle
    );

    return () => unsubscribe();
  }, [dispatch, state.user]);

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
      {state.notifications.filter((note) => !note.isRead).length > 0 && (
        <span
          className="badge is-danger is-bottom-left"
          style={{ right: -7, bottom: 9, left: "auto" }}
        >
          {state.notifications.filter((note) => !note.isRead).length}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
