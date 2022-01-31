import { mdiEmail, mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Button, Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import TextInput from "../components/form/TextInput";
import { auth } from "../firebase/firebase";
import { UserHandler } from "../firebase/UserHandler";

const validationSchema = yup.object({
  email: yup
    .string()
    .required("Email обязателен к заполнению")
    .email("Неверный формат email'а"),
});

function ResetPage() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) navigate("/");
  }, [user, loading, navigate]);

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-5-tablet is-4-desktop is-3-widescreen">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async ({ email }, { setSubmitting }) => {
            await UserHandler.sendPasswordReset(email);
            setSubmitting(false);
          }}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
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
              <nav className="level is-fullwidth">
                <div className="level-left">
                  <div className="level-item">
                    <Button
                      className="is-success"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Отправить
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

        <div>
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link> сейчас.
        </div>
      </Columns.Column>
    </Columns>
  );
}
export default ResetPage;
