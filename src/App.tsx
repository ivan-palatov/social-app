import { mdiArrowUp } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, Outlet } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import AnimatedPage from "./components/AnimatedPage";
import LeftColumn from "./components/layout/LeftColumn";
import NotificationBell from "./components/NotificationBell";
import { auth } from "./firebase/firebase";
import { useAppDispatch } from "./hooks";
import { fetchUserData, setLoading } from "./slices/userSlice";

const App = () => {
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
            data-target="navigation-menu"
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
      </nav>
      <div
        className={
          isBurgerActive
            ? "mobile-navigation mobile-navigation-active"
            : "mobile-navigation"
        }
        id="navigation-menu"
        onClick={() => setIsBurgerActive(false)}
      >
        <LeftColumn />
      </div>
      <main className="container">
        <div className="is-centered columns">
          <div className="column is-hidden-touch">
            <LeftColumn />
          </div>
          <div className="column is-12-mobile is-8-tablet is-7-desktop">
            <AnimatedPage>
              <Outlet />
            </AnimatedPage>
          </div>
          <div className="column is-hidden-mobile">Право</div>
        </div>
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
