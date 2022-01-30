import { mdiFaceMan, mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import ChangeAvatar from "../components/ChangeAvatar";
import { auth } from "../firebase/firebase";
import { UserHandler } from "../firebase/UserHandler";
import { useAppSelector } from "../hooks";

function EditPage() {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    website: "",
    avatar: "",
    isLoading: false,
    isModalActive: false,
  });
  const userState = useAppSelector((state) => state.user);

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleOpenModal = useCallback(
    () => setForm((state) => ({ ...state, isModalActive: true })),
    []
  );

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      return navigate("/login");
    }
    if (!userState.user) {
      return;
    }

    const { name, bio, avatar, website } = userState.user;
    setForm((state) => ({ ...state, name, bio, avatar, website }));
  }, [user, loading, userState, navigate]);

  async function saveChanges(e: any) {
    e.preventDefault();
    setForm((state) => ({ ...state, isLoading: true }));
    await UserHandler.updateProfile(form.name, form.bio, form.website, user!);
    setForm((state) => ({ ...state, isLoading: false }));
  }

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-6-tablet is-7-desktop is-4-widescreen">
        <form
          className="box is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
          noValidate
          onSubmit={saveChanges}
        >
          <figure
            className="image is-128x128 is-hoverable is-clickabe mb-3"
            onClick={handleOpenModal}
          >
            <img
              className="is-rounded"
              src={form.avatar || UserHandler.defaultAvatar}
              alt="Аватар"
            />
            <div className="is-hoverable-overlay"></div>
            <div className="is-hoverable-info">
              <div className="is-hoverable-text">Изменить</div>
            </div>
          </figure>
          <div className="field" style={{ width: "100%" }}>
            <label htmlFor="name" className="label">
              Отображаемое Имя
            </label>
            <div className="control has-icons-left">
              <input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((state) => ({ ...state, name: e.target.value }))
                }
                type="text"
                placeholder="Иванов Иван"
                className="input"
              />
              <span className="icon is-small is-left">
                <Icon path={mdiFaceMan} />
              </span>
            </div>
          </div>
          <div className="field" style={{ width: "100%" }}>
            <label htmlFor="website" className="label">
              Web-сайт
            </label>
            <div className="control has-icons-left">
              <input
                id="website"
                value={form.website}
                onChange={(e) =>
                  setForm((state) => ({ ...state, website: e.target.value }))
                }
                type="url"
                placeholder="https://google.com"
                className="input"
              />
              <span className="icon is-small is-left">
                <Icon path={mdiWeb} />
              </span>
            </div>
          </div>
          <div className="field" style={{ width: "100%" }}>
            <label htmlFor="bio" className="label">
              Напишите что-нибудь о себе
            </label>
            <div className="control">
              <textarea
                id="bio"
                value={form.bio}
                onChange={(e) =>
                  setForm((state) => ({ ...state, bio: e.target.value }))
                }
                className="textarea"
              />
            </div>
          </div>
          <Button
            className="is-success"
            type="submit"
            disabled={form.isLoading}
            style={{ width: "100%" }}
          >
            Сохранить
          </Button>
        </form>
        <ChangeAvatar
          onClickOutside={() =>
            setForm((state) => ({ ...state, isModalActive: false }))
          }
          isActive={form.isModalActive}
        />
      </Columns.Column>
    </Columns>
  );
}

export default EditPage;
