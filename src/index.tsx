import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SimpleReactLightbox from "simple-react-lightbox";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Edit from "./routes/Edit";
import Feed from "./routes/Feed";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Reset from "./routes/Reset";
import { store } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <SimpleReactLightbox>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="reset" element={<Reset />} />
              <Route path="edit" element={<Edit />} />
              <Route path="feed" element={<Feed />} />
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
