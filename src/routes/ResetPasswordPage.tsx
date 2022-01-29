import { mdiEmail } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { Button, Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { UserHandler } from "../firebase/UserHandler";

function ResetPage() {
  const [email, setEmail] = useState("");

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) navigate("/");
  }, [user, loading, navigate]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    UserHandler.sendPasswordReset(email);
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
                placeholder="Email"
                className="input"
                required
              />
              <span className="icon is-small is-left">
                <Icon path={mdiEmail} />
              </span>
            </div>
          </div>
          <Button className="is-success" type="submit">
            Отправить смену пароля на email
          </Button>
        </form>
        <div>
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link> сейчас.
        </div>
      </Columns.Column>
    </Columns>
  );
}
export default ResetPage;
