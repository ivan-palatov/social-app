import { AnimatePresence } from "framer-motion";
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import EditPage from "./EditPage";
import Empty from "./Empty";
import FeedPage from "./FeedPage";
import LoginPage from "./LoginPage";
import NotFoundPage from "./NotFoundPage";
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
        <Route path="/" element={<Empty />}>
          <Route index element={<FeedPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="reset" element={<ResetPasswordPage />} />
          <Route path="edit" element={<EditPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path=":handle" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default Pages;
