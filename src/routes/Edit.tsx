import { mdiFaceMan, mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { Button, Columns } from "react-bulma-components";
import { useDropzone } from "react-dropzone";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, updateAvatar, updateProfile } from "../firebase";
import { useAppSelector } from "../hooks";

interface IProps {}

const Edit: React.FC<IProps> = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar, setAvatar] = useState<string | File>("");
  const [waiting, setWaiting] = useState(false);
  const [avatarEditorScale, setAvatarEditorScale] = useState(13);
  const state = useAppSelector((state) => state.user);
  const [editor, setEditor] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAvatar(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop,
    noClick: true,
    accept: "image/*",
  });

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

    setName(state.user.name);
    setBio(state.user.bio);
    setAvatar(state.user.avatar);
    setWebsite(state.user.website);
  }, [user, loading, state, navigate]);

  async function saveChanges(e: any) {
    e.preventDefault();
    setWaiting(true);
    await updateProfile(name, bio, website, user!);
    setWaiting(false);
  }

  function saveNewAvatar() {
    const canvas = editor.getImage() as HTMLCanvasElement;

    canvas.toBlob(saveFromBlob);
  }

  async function saveFromBlob(blob: Blob | null) {
    if (!blob) {
      return;
    }

    let name = "";

    if (typeof avatar === "string") {
      name = avatar;
    } else {
      name = avatar.name;
    }

    const file = new File([blob], name, { type: blob.type });
    setWaiting(true);
    await updateAvatar(file, state.user!);
    setWaiting(false);
  }

  const setEditorRef = (e: any) => setEditor(e);

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
              image={avatar}
              borderRadius={5000}
              height={256}
              width={256}
              border={10}
              scale={avatarEditorScale / 10}
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
            value={avatarEditorScale}
            onChange={(e) => setAvatarEditorScale(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />
          <Button
            className="is-success mb-5 mt-3"
            style={{ width: "100%" }}
            onClick={saveNewAvatar}
            disabled={waiting}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
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
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="textarea"
              />
            </div>
          </div>
          <Button
            className="is-success"
            type="submit"
            disabled={waiting}
            style={{ width: "100%" }}
          >
            Сохранить
          </Button>
        </form>
      </Columns.Column>
    </Columns>
  );
};

export default Edit;
