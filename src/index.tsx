import "bulma/css/bulma.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import SimpleReactLightbox from "simple-react-lightbox";
import App from "./App";
import "./css/bulma-badge.min.css";
import "./css/bulma-tooltip.min.css";
import "./css/index.css";
import "./css/modal-fx.min.css";
import { store } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <SimpleReactLightbox>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </SimpleReactLightbox>
  </React.StrictMode>,
  document.getElementById("root")
);
