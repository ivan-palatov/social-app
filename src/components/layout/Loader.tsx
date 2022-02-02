import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

interface IProps {}

const Loader: React.FC<IProps> = () => {
  return (
    <div className="is-flex is-justify-content-center mt-4">
      <span className="icon is-large">
        <Icon path={mdiLoading} spin className="mdi-48px" />
      </span>
    </div>
  );
};

export default React.memo(Loader);
