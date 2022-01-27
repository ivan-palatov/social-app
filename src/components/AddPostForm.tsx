import { mdiImage, mdiLink, mdiLoading, mdiUpload } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useState } from "react";
import { Button } from "react-bulma-components";
import { useDropzone } from "react-dropzone";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, createPost } from "../firebase";
import { useAppSelector } from "../hooks";
import Modal from "./Modal";

interface IProps {}

const AddPostForm: React.FC<IProps> = () => {
  const state = useAppSelector((state) => state.user);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPhotos(acceptedFiles);
    setIsModalOpen(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 4,
  });

  const [user] = useAuthState(auth);

  async function savePost(e: any) {
    e.preventDefault();
    if (!body || !user || !state.user) {
      return;
    }

    setLoading(true);
    await createPost(body, state.user, photos);
    setPhotos([]);
    setBody("");
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBody(e.target.value);

    // Делаем textarea автоматически расширяемой
    e.currentTarget.style.height = "inherit";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  }

  return (
    <>
      <article className="media">
        <figure className="media-left">
          <p className="image is-48x48">
            <img src={state.user?.avatar} alt="Аватар" className="is-rounded" />
          </p>
        </figure>
        <form className="media-content" noValidate onSubmit={savePost}>
          <div className="field">
            <div className="control">
              <textarea
                id="body"
                value={body}
                onChange={handleChange}
                className="textarea is-clipped"
                placeholder="Поделитесь своими мыслями..."
                rows={1}
              />
            </div>
          </div>
          <nav className="level">
            <div className="level-left">
              <div className="level-item">
                <Button
                  className="is-success"
                  style={{ margin: "10px 0" }}
                  disabled={loading}
                >
                  Опубликовать
                </Button>
              </div>
              <div className="level-item">
                <span
                  className="icon is-clickable"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Icon path={mdiLink} />
                </span>
              </div>
              {photos.length !== 0 && (
                <div className="level-item">
                  <span className="icon is-medium">
                    <span>{photos.length} </span>
                    <Icon path={mdiImage} />
                  </span>
                </div>
              )}
              {loading && (
                <div className="level-item">
                  <span className="icon">
                    <Icon path={mdiLoading} spin />
                  </span>
                </div>
              )}
            </div>
          </nav>
        </form>
      </article>

      <Modal
        isActive={isModalOpen}
        onClickOutside={() => setIsModalOpen(false)}
      >
        <div className="file is-large is-boxed is-centered" {...getRootProps()}>
          <label className="file-label">
            <input className="file-input" {...getInputProps()} />
            <span className="file-cta">
              <span className="file-icon">
                <Icon path={mdiUpload} />
              </span>
              <span className="file-label">
                {isDragActive ? "Положите фото сюда" : "Переместите фото сюда"}
              </span>
            </span>
          </label>
        </div>
      </Modal>
    </>
  );
};

export default AddPostForm;
