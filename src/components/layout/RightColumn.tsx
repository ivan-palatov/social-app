import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserHandler } from "../../firebase/UserHandler";
import { useAppSelector } from "../../hooks";
import { IUser } from "../../utils/interfaces";
import Loader from "./Loader";

interface IProps {}

const RightColumn: React.FC<IProps> = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const state = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback(
    (path: string) => {
      if (location.pathname === path) {
        return;
      }

      navigate(path);
    },
    [location.pathname, navigate]
  );

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      setUsers((await UserHandler.getUsers())!);
      setIsLoading(false);
    }

    console.log("wtf");

    fetchUsers();
  }, []);

  return (
    <div className="mt-3">
      <div className="has-text-centered is-fullwidth is-size-6">
        <strong>Пользователи</strong>
      </div>
      <ul className="mt-4">
        {isLoading ? (
          <Loader />
        ) : (
          users
            .filter((user) => user.id !== state.user?.id)
            .map((user) => (
              <li
                className="media is-clickable"
                key={user.id}
                onClick={() => handleClick(`/${user.handle}`)}
              >
                <figure className="media-left image is-48x48">
                  <img src={user.avatar} alt="Аватар" className="is-rounded" />
                </figure>
                <div className="media-content is-size-7">
                  <strong>{user.name}</strong>
                  <br />
                  <small>@{user.handle}</small>
                </div>
              </li>
            ))
        )}
      </ul>
    </div>
  );
};

export default React.memo(RightColumn);
