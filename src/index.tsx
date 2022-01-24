import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Reset from "./routes/Reset";

// firebase.initializeApp({
//   apiKey: "AIzaSyDb_NC7rr_2rMEpvLjXnO2wWLR7wX3V7u0",
//   authDomain: "social-9a688.firebaseapp.com",
//   projectId: "social-9a688",
//   storageBucket: "social-9a688.appspot.com",
//   messagingSenderId: "405032755686",
//   appId: "1:405032755686:web:422c31ad240e90f729b627",
//   measurementId: "G-02S8YBVNRC",
// });

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset" element={<Reset />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
