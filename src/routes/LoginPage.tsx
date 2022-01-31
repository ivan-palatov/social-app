import { mdiEmail, mdiGoogle, mdiLoading, mdiLock } from "@mdi/js";
import Icon from "@mdi/react";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Button, Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import * as yup from "yup";
import TextInput from "../components/form/TextInput";
import { auth } from "../firebase/firebase";
import { UserHandler } from "../firebase/UserHandler";

const validationSchema = yup.object({
  email: yup
    .string()
    .required("Email обязателен к заполнению")
    .email("Неверный формат email'а"),
  password: yup.string().trim().required("Пароль обязателен к заполнению"),
});

function LoginPage() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      window.location.assign("/");
    }
  }, [user]);

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-5-tablet is-4-desktop is-3-widescreen">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async ({ email, password }, { setSubmitting }) => {
            await UserHandler.logInWithEmailAndPassword(email, password);
            setSubmitting(false);
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            isSubmitting,
          }) => (
            <Form className="box" noValidate>
              <TextInput
                displayName="Email"
                id="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
                iconPath={mdiEmail}
              />
              <TextInput
                displayName="Пароль"
                id="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : undefined}
                iconPath={mdiLock}
              />
              <nav className="level is-fullwidth">
                <div className="level-left">
                  <div className="level-item">
                    <Button
                      className="is-success"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Сохранить
                    </Button>
                  </div>
                  {isSubmitting && (
                    <div className="level-item">
                      <span className="icon">
                        <Icon path={mdiLoading} spin />
                      </span>
                    </div>
                  )}
                </div>
              </nav>
            </Form>
          )}
        </Formik>

        <div
          className="is-flex is-align-items-center"
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
