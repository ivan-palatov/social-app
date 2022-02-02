import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import EditPage from "./routes/EditPage";
import FeedPage from "./routes/FeedPage";
import HomePage from "./routes/HomePage";
import LoginPage from "./routes/LoginPage";
import PostPage from "./routes/PostPage";
import ProfilePage from "./routes/ProfilePage";
import RegisterPage from "./routes/RegisterPage";
import ResetPasswordPage from "./routes/ResetPasswordPage";

interface IProps {}

const Pages: React.FC<IProps> = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="reset" element={<ResetPasswordPage />} />
        <Route path="edit" element={<EditPage />} />
        <Route path="feed" element={<FeedPage />} />
        <Route path="post/:id" element={<PostPage />} />
        <Route path=":handle" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default Pages;
