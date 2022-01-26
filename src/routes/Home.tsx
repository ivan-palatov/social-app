import React from "react";
import { Button } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth, logout } from "../firebase";
import { useAppSelector } from "../hooks";

function Home() {
  const state = useAppSelector((state) => state.user);
  const [user, loading] = useAuthState(auth);

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
      <div>
        Вас зовут {state.user.name}
        <div>{user?.email}</div>
        <Button onClick={logout}>Выйти</Button>
      </div>
    </div>
  );
}
export default Home;
