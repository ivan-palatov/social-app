import React from "react";
import ReactDOM from "react-dom";

interface IProps {
  isActive?: boolean;
  onClickOutside: () => void;
}

const Modal: React.FC<IProps> = ({
  children,
  isActive = false,
  onClickOutside,
}) => {
  return ReactDOM.createPortal(
    <div
      className={
        isActive
          ? "modal modal-fx-fadeInScale is-active"
          : "modal modal-fx-fadeInScale"
      }
    >
      <div className="modal-background" onClick={onClickOutside}></div>
      {children}
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClickOutside}
      ></button>
    </div>,
    document.body
  );
};

export default Modal;
