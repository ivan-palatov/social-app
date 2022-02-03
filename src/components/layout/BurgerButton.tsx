import React from "react";

interface IProps {
  isActive: boolean;
  onClick: () => void;
}

const BurgerButton: React.FC<IProps> = ({ isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      aria-label="menu"
      aria-expanded="false"
      data-target="navigation-menu"
      role="button"
      className={
        isActive ? "navbar-burger is-active ml-3" : "navbar-burger ml-3"
      }
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </div>
  );
};

export default React.memo(BurgerButton);
