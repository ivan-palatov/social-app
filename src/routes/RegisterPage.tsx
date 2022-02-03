import {
  mdiAccountOutline,
  mdiEmailOutline,
  mdiGoogle,
  mdiLoading,
  mdiLockOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import TextInput from "../components/form/TextInput";
import Button from "../components/layout/Button";
import { UserHandler } from "../firebase/UserHandler";
import { useAppSelector } from "../hooks";

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Имя обязательно к заполнению")
    .min(3, "Минимум 3 символа")
    .max(100, "Максимум 100 символов"),
  email: yup
    .string()
    .required("Email обязателен к заполнению")
    .email("Неверный формат email'а"),
  password: yup
    .string()
    .trim()
    .required("Пароль обязателен к заполнению")
    .min(6, "Пароль должен содержать не менее 6 символов"),
});

function RegisterPage() {
  const state = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user) {
      navigate("/edit");
    }
  }, [state.user, navigate]);

  return (
    <>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        onSubmit={async ({ name, email, password }, { setSubmitting }) => {
          await UserHandler.registerWithEmailAndPassword(name, email, password);
          setSubmitting(false);
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form className="box" noValidate>
            <TextInput
              displayName="Отображаемое имя"
              id="name"
              type="text"
              placeholder="Иванов Иван"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name ? errors.name : undefined}
              iconPath={mdiAccountOutline}
            />
            <TextInput
              displayName="Email"
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : undefined}
              iconPath={mdiEmailOutline}
            />
            <TextInput
              displayName="Пароль"
              id="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : undefined}
              iconPath={mdiLockOutline}
            />
            <nav className="level is-fullwidth is-mobile">
              <div className="level-left">
                <div className="level-item">
                  <Button
                    className="is-success"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Зарегистрироваться
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
        <div className="mr-3">Зарегистрироваться с помощью</div>
        <Button onClick={UserHandler.signInWithGoogle}>
          <span className="icon">
            <Icon path={mdiGoogle} />
          </span>
        </Button>
      </div>
      <div>
        Уже есть аккаунт? <Link to="/login">Войдите</Link> сейчас.
      </div>
    </>
  );
}
export default RegisterPage;
