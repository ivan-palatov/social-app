import { mdiArrowUp } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import BurgerButton from "./components/layout/BurgerButton";
import LeftColumn from "./components/layout/LeftColumn";
import Offline from "./components/layout/Offline";
import RightColumn from "./components/layout/RightColumn";
import NotificationBell from "./components/NotificationBell";
import { auth } from "./firebase/firebase";
import { useAppDispatch } from "./hooks";
import Pages from "./routes/Pages";
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

  const handleBurgerClick = useCallback(
    () => setIsBurgerActive((state) => !state),
    []
  );

  return (
    <>
      <nav
        className="navbar is-success"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand is-align-items-center">
          <Link to="/" className="navbar-item">
            Social App
          </Link>
          <NotificationBell />
          <BurgerButton isActive={isBurgerActive} onClick={handleBurgerClick} />
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
            <Pages />
          </div>
          <div className="column is-hidden-mobile">
            <RightColumn />
          </div>
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
      <Offline />
    </>
  );
};

export default App;
