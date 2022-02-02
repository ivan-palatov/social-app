import { mdiArrowUp } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { Columns, Container, Navbar } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, Outlet } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import AnimatedPage from "./components/AnimatedPage";
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
      <Navbar>
        <Navbar.Brand>
          <Link to="/" className="navbar-item">
            Social App
          </Link>
          <Navbar.Burger
            onClick={() => setIsBurgerActive(!isBurgerActive)}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenu"
            className={isBurgerActive ? "is-active" : ""}
          />
        </Navbar.Brand>
        <Navbar.Menu
          id="navbarMenu"
          className={isBurgerActive ? "is-active" : ""}
        >
          {user ? (
            <Navbar.Item renderAs={Link} to="/me">
              Профиль
            </Navbar.Item>
          ) : (
            <>
              <Navbar.Item renderAs={Link} to="/login">
                Войти
              </Navbar.Item>
              <Navbar.Item renderAs={Link} to="/register">
                Зарегистрироваться
              </Navbar.Item>
            </>
          )}
        </Navbar.Menu>
      </Navbar>
      <Container>
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
      </Container>
    </>
  );
};

export default App;
