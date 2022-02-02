import { AnimatePresence } from "framer-motion";
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import App from "../App";
import EditPage from "./EditPage";
import FeedPage from "./FeedPage";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import NotificationsPage from "./NotificationsPage";
import PostPage from "./PostPage";
import ProfilePage from "./ProfilePage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";

interface IProps {}

const Pages: React.FC<IProps> = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="reset" element={<ResetPasswordPage />} />
          <Route path="edit" element={<EditPage />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path=":handle" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default Pages;
