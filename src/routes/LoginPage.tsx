import { mdiEmail, mdiGoogle, mdiLoading, mdiLock } from "@mdi/js";
import Icon from "@mdi/react";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Button } from "react-bulma-components";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import TextInput from "../components/form/TextInput";
import { UserHandler } from "../firebase/UserHandler";
import { useAppSelector } from "../hooks";

const validationSchema = yup.object({
  email: yup
    .string()
    .required("Email обязателен к заполнению")
    .email("Неверный формат email'а"),
  password: yup.string().trim().required("Пароль обязателен к заполнению"),
});

function LoginPage() {
  const state = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user) {
      navigate("/feed");
    }
  }, [state.user, navigate]);

  return (
    <>
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
              placeholder="example@gmail.com"
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
            <nav className="level is-fullwidth is-mobile">
              <div className="level-left">
                <div className="level-item">
                  <Button
                    className="is-success"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Войти
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

      <div className="is-flex is-align-items-center">
        <div className="mr-3">Войти с помощью </div>
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
    </>
  );
}
export default LoginPage;
