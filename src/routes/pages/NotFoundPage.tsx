import React from "react";

interface IProps {}

const NotFoundPage: React.FC<IProps> = () => {
  return (
    <div className="is-flex is-fullwidth is-fullheight is-justify-content-center is-align-items-center">
      <span className="is-size-1 has-text-centered">Страница не найдена</span>
    </div>
  );
};

export default NotFoundPage;
