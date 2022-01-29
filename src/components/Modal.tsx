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
    <div className={isActive ? "modal is-active" : "modal"}>
      <div className="modal-background" onClick={onClickOutside}></div>
      <div className="modal-content">{children}</div>
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
