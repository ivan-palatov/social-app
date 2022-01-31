import { mdiAccount, mdiLoading, mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Button, Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Avatar from "../components/edit/Avatar";
import TextArea from "../components/form/TextArea";
import TextInput from "../components/form/TextInput";
import { auth } from "../firebase/firebase";
import { UserHandler } from "../firebase/UserHandler";
import { useAppSelector } from "../hooks";

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Имя не может быть пустым")
    .min(3, "Минимум 3 символа")
    .max(100, "Максимум 100 символов"),
  bio: yup.string().trim(),
  website: yup.string().trim().url("Web-сайт должен иметь реальный URL"),
});

function EditPage() {
  const state = useAppSelector((state) => state.user);

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      return navigate("/login");
    }
    if (!state.user) {
      return;
    }
  }, [user, loading, state, navigate]);

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-6-tablet is-7-desktop is-4-widescreen">
        <Formik
          initialValues={{
            name: state.user?.name || "",
            bio: state.user?.bio || "",
            website: state.user?.website || "",
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async ({ name, bio, website }, { setSubmitting }) => {
            await UserHandler.updateProfile(
              name.trim(),
              bio.trim(),
              website.trim(),
              user!
            );
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form
              className="box is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
              noValidate
            >
              <Avatar />
              <TextInput
                displayName="Отображаемое имя"
                id="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                placeholder="Иванов Иван"
                iconPath={mdiAccount}
                error={touched.name ? errors.name : undefined}
              />
              <TextInput
                displayName="Web-сайт"
                id="website"
                value={values.website}
                onChange={handleChange}
                onBlur={handleBlur}
                type="url"
                placeholder="https://google.com"
                iconPath={mdiWeb}
                error={touched.website ? errors.website : undefined}
              />
              <TextArea
                displayName="Напишите что-нибудь о себе"
                id="bio"
                value={values.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.bio ? errors.bio : undefined}
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
      </Columns.Column>
    </Columns>
  );
}

export default EditPage;
