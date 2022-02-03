import {
  mdiAccountPlusOutline,
  mdiBellOutline,
  mdiExitRun,
  mdiFaceManOutline,
  mdiLogin,
  mdiNewspaperVariantOutline,
  mdiPencilOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { UserHandler } from "../../firebase/UserHandler";
import { useAppSelector } from "../../hooks";
import { setUser } from "../../slices/userSlice";

interface IProps {}

const LeftColumn: React.FC<IProps> = () => {
  const state = useAppSelector((state) => state.user);
  const dispatch = useDispatch();

  function logout() {
    UserHandler.logout();
    dispatch(setUser(undefined));
  }

  return (
    <div className="mt-3">
      {state.user && (
        <div className="media is-align-items-center">
          <figure className="media-left image is-48x48">
            <img src={state.user.avatar} alt="Аватар" className="is-rounded" />
          </figure>
          <div className="media-content is-size-7-desktop">
            <strong>{state.user.name}</strong>
            <br />
            <small>@{state.user.handle}</small>
          </div>
        </div>
      )}
      <ul className="mt-4">
        {state.user ? (
          <li className="my-2">
            <Link
              to={`/${state.user.handle}`}
              className="icon-text is-fullwidth py-2"
            >
              <span className="icon">
                <Icon path={mdiFaceManOutline} />
              </span>
              <span>Профиль</span>
            </Link>
          </li>
        ) : (
          <>
            <li className="my-2">
              <Link to="/login" className="icon-text is-fullwidth py-2">
                <span className="icon">
                  <Icon path={mdiLogin} />
                </span>
                <span>Войти</span>
              </Link>
            </li>
            <li className="my-2">
              <Link to="/register" className="icon-text is-fullwidth py-2">
                <span className="icon">
                  <Icon path={mdiAccountPlusOutline} />
                </span>
                <span>Регистрация</span>
              </Link>
            </li>
          </>
        )}
        <li className="my-2">
          <Link to="/" className="icon-text is-fullwidth py-2">
            <span className="icon">
              <Icon path={mdiNewspaperVariantOutline} />
            </span>
            <span>Посты</span>
          </Link>
        </li>
        {state.user && (
          <>
            <li className="my-2">
              <Link to="/notifications" className="icon-text is-fullwidth py-2">
                <span className="icon">
                  <Icon path={mdiBellOutline} />
                </span>
                <span>Новости</span>
              </Link>
            </li>
            <li className="my-2">
              <Link to="/edit" className="icon-text is-fullwidth py-2">
                <span className="icon">
                  <Icon path={mdiPencilOutline} />
                </span>
                <span>Редактировать</span>
              </Link>
            </li>
            <li className="my-2">
              <div
                className="icon-text is-fullwidth py-2 is-clickable"
                onClick={logout}
              >
                <span className="icon">
                  <Icon path={mdiExitRun} />
                </span>
                <span>Выйти</span>
              </div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default LeftColumn;
