import { mdiFaceMan, mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { Button, Columns } from "react-bulma-components";
import { useDropzone } from "react-dropzone";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { UserHandler } from "../firebase/UserHandler";
import { useAppSelector } from "../hooks";

function EditPage() {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    website: "",
    avatar: "" as string | File,
    isLoading: false,
    avatarEditorScale: 13,
    editor: null as any,
  });
  const userState = useAppSelector((state) => state.user);

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setForm((state) => ({ ...state, avatar: acceptedFiles[0] }));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop,
    noClick: true,
    accept: "image/*",
  });

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

  function saveNewAvatar() {
    const canvas = form.editor.getImage() as HTMLCanvasElement;

    canvas.toBlob(saveFromBlob);
  }

  async function saveFromBlob(blob: Blob | null) {
    if (!blob) {
      return;
    }

    let name = "";

    if (typeof form.avatar === "string") {
      name = form.avatar;
    } else {
      name = form.avatar.name;
    }

    const file = new File([blob], name, { type: blob.type });
    setForm((state) => ({ ...state, isLoading: true }));
    await UserHandler.updateAvatar(file, userState.user!);
    setForm((state) => ({ ...state, isLoading: false }));
  }

  const setEditorRef = (editor: any) =>
    setForm((state) => ({ ...state, editor }));

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-6-tablet is-7-desktop is-4-widescreen">
        <form
          className="box is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
          noValidate
          onSubmit={saveChanges}
        >
          <div {...getRootProps()}>
            <AvatarEditor
              ref={setEditorRef}
              image={form.avatar}
              borderRadius={5000}
              height={256}
              width={256}
              border={10}
              scale={form.avatarEditorScale / 10}
            />
            <input {...getInputProps()} />
            <br />
            <small>Переместите ваше фото на форму выше</small>
          </div>
          <input
            className="mt-3"
            type="range"
            min={10}
            max={40}
            step={1}
            value={form.avatarEditorScale}
            onChange={(e) =>
              setForm((state) => ({
                ...state,
                avatarEditorScale: parseInt(e.target.value),
              }))
            }
            style={{ width: "100%" }}
          />
          <Button
            className="is-success mb-5 mt-3"
            style={{ width: "100%" }}
            onClick={saveNewAvatar}
            disabled={form.isLoading}
          >
            Сохранить аватар
          </Button>
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
      </Columns.Column>
    </Columns>
  );
}

export default EditPage;
