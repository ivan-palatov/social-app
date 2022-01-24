import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/");
  }, [user, loading, navigate]);

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-5-tablet is-4-desktop is-3-widescreen">
        <form
          className="box"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            logInWithEmailAndPassword(email, password);
          }}
        >
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
                <FontAwesomeIcon icon={faEnvelope} />
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
                <FontAwesomeIcon icon={faLock} />
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
          <Button onClick={signInWithGoogle}>
            <span className="icon">
              <FontAwesomeIcon icon={faGoogle} />
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
export default Login;
