import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faLock,
  faPortrait,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [user, loading] = useAuthState(auth);

  const register = (e: any) => {
    // TODO: validate inputs
    e.preventDefault();
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) window.location.assign("/edit");
  }, [user, loading]);

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-5-tablet is-4-desktop is-3-widescreen">
        <form className="box" noValidate onSubmit={register}>
          <div className="field">
            <label htmlFor="name" className="label">
              Отображаемое имя
            </label>
            <div className="control has-icons-left">
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Иванов Иван"
                className="input"
                required
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faPortrait} />
              </span>
            </div>
          </div>
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
            Зарегистрироваться
          </Button>
        </form>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ marginRight: 10 }}>Зарегистрироваться с помощью </div>
          <Button onClick={signInWithGoogle}>
            <span className="icon">
              <FontAwesomeIcon icon={faGoogle} />
            </span>
          </Button>
        </div>
        <div>
          Уже есть аккаунт? <Link to="/login">Войдите</Link> сейчас.
        </div>
      </Columns.Column>
    </Columns>
  );
}
export default Register;
