import "bulma/css/bulma.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import SimpleReactLightbox from "simple-react-lightbox";
import "./index.css";
import "./modal-fx.min.css";
import Pages from "./Pages";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <SimpleReactLightbox>
      <Provider store={store}>
        <BrowserRouter>
          <Pages />
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
