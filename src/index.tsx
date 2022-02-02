import "bulma/css/bulma.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import SimpleReactLightbox from "simple-react-lightbox";
import "./css/bulma-tooltip.min.css";
import "./css/index.css";
import "./css/modal-fx.min.css";
import Pages from "./routes/Pages";
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
