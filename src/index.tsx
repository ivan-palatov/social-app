import "bulma/css/bulma.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SimpleReactLightbox from "simple-react-lightbox";
import App from "./App";
import "./index.css";
import "./modal-fx.min.css";
import reportWebVitals from "./reportWebVitals";
import EditPage from "./routes/EditPage";
import FeedPage from "./routes/FeedPage";
import HomePage from "./routes/HomePage";
import LoginPage from "./routes/LoginPage";
import PostPage from "./routes/PostPage";
import ProfilePage from "./routes/ProfilePage";
import RegisterPage from "./routes/RegisterPage";
import ResetPage from "./routes/ResetPasswordPage";
import { store } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <SimpleReactLightbox>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="reset" element={<ResetPage />} />
              <Route path="edit" element={<EditPage />} />
              <Route path="feed" element={<FeedPage />} />
              <Route path="post/:id" element={<PostPage />} />
              <Route path=":handle" element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </SimpleReactLightbox>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
