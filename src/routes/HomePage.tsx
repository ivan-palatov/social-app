import React from "react";
import { Button } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { UserHandler } from "../firebase/UserHandler";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setUser } from "../slices/userSlice";

function HomePage() {
  const state = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [user, loading] = useAuthState(auth);

  function logout() {
    UserHandler.logout();
    dispatch(setUser(undefined));
  }

  if (loading || state.loading) {
    return <div>Загрузка...</div>;
  }

  if (!user || !state.user) {
    return (
      <div>
        Вы не авторизированы <Link to="/login">Войдите</Link> или{" "}
        <Link to="/register">Зарегистрируйтесь</Link>
      </div>
    );
  }

  return (
    <div>
      Вас зовут {state.user.name}
      <div>{user?.email}</div>
      <Button onClick={logout}>Выйти</Button>
    </div>
  );
}

export default HomePage;
