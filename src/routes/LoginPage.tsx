import { mdiEmail, mdiGoogle, mdiLock } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { Button, Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { UserHandler } from "../firebase/UserHandler";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) window.location.assign("/");
  }, [user, loading]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    UserHandler.logInWithEmailAndPassword(email, password);
  }

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-5-tablet is-4-desktop is-3-widescreen">
        <form className="box" noValidate onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email" className="label">
              Email
            </label>
            <div className="control has-icons-left">
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="example@gmail.com"
                className="input"
                required
              />
              <span className="icon is-small is-left">
                <Icon path={mdiEmail} />
              </span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="password" className="label">
              Пароль
            </label>
            <div className="control has-icons-left">
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="input"
                required
              />
              <span className="icon is-small is-left">
                <Icon path={mdiLock} />
              </span>
            </div>
          </div>
          <Button className="is-success" type="submit">
            Войти
          </Button>
        </form>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ marginRight: 10 }}>Войти с помощью </div>
          <Button onClick={UserHandler.signInWithGoogle}>
            <span className="icon">
              <Icon path={mdiGoogle} />
            </span>
          </Button>
        </div>
        <div>
          <Link to="/reset">Забыли пароль?</Link>
        </div>
        <div>
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link> сейчас.
        </div>
      </Columns.Column>
    </Columns>
  );
}
export default LoginPage;
