import React, { useState } from "react";
import { UserHandler } from "../../firebase/UserHandler";
import { useAppSelector } from "../../hooks";
import ChangeAvatar from "./ChangeAvatar";

interface IProps {}

const Avatar: React.FC<IProps> = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const state = useAppSelector((state) => state.user);

  return (
    <>
      <figure
        className="image is-128x128 is-hoverable is-clickabe mb-3"
        onClick={() => setIsModalActive(true)}
      >
        <img
          className="is-rounded"
          src={state.user?.avatar || UserHandler.defaultAvatar}
          alt="Аватар"
        />
        <div className="is-hoverable-overlay"></div>
        <div className="is-hoverable-info">
          <div className="is-hoverable-text">Изменить</div>
        </div>
      </figure>

      <ChangeAvatar
        onClickOutside={() => setIsModalActive(false)}
        isActive={isModalActive}
      />
    </>
  );
};

export default Avatar;
