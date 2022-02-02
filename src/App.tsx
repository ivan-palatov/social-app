import { mdiArrowUp } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, Outlet } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import AnimatedPage from "./components/AnimatedPage";
import NotificationBell from "./components/NotificationBell";
import { auth } from "./firebase/firebase";
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchUserData, setLoading } from "./slices/userSlice";

const App = () => {
  const state = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [isBurgerActive, setIsBurgerActive] = useState(false);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      dispatch(setLoading(false));
      return;
    }

    dispatch(fetchUserData(user.uid));
  }, [user, dispatch, loading]);

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand is-align-items-center">
          <Link to="/" className="navbar-item">
            Social App
          </Link>
          <NotificationBell />
          <div
            onClick={() => setIsBurgerActive(!isBurgerActive)}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenu"
            role="button"
            className={
              isBurgerActive
                ? "navbar-burger is-active ml-3"
                : "navbar-burger ml-3"
            }
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </div>
        </div>
        <div
          id="navbarMenu"
          className={isBurgerActive ? "navbar-menu is-active" : "navbar-menu"}
        >
          <div className="navbar-start">
            {user ? (
              <div className="navbar-item">
                <Link to={`/${state.user?.handle}`}>Профиль</Link>
              </div>
            ) : (
              <>
                <div className="navbar-item">
                  <Link to="/login">Войти</Link>
                </div>
                <div className="navbar-item">
                  <Link to="/register">Регистрация</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container">
        <Columns className="is-centered">
          <Columns.Column className="is-12-mobile is-8-tablet is-7-desktop">
            <AnimatedPage>
              <Outlet />
            </AnimatedPage>
          </Columns.Column>
        </Columns>
        <ScrollToTop
          smooth
          component={
            <span className="icon">
              <Icon path={mdiArrowUp} />
            </span>
          }
          className="button is-scroll-to-top is-success"
        />
      </main>
    </>
  );
};

export default App;
