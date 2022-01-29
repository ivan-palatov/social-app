import { mdiLink, mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-bulma-components";
import { PostHandler } from "../firebase/PostHandler";
import { useAppSelector } from "../hooks";
import Modal from "./Modal";
import PhotosDropzone from "./PhotosDropzone";
import PhotosPreview from "./PhotosPreview";

interface IProps {}

const AddPostForm: React.FC<IProps> = () => {
  const state = useAppSelector((state) => state.user);
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photos, setPhotos] = useState<
    (File & {
      preview: string;
    })[]
  >([]);

  const componentWillUnmount = useRef(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const files = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );

    setPhotos(files);
    setIsModalOpen(false);
  }, []);

  // Сменит значение только тогда, когда компонент будет удаляться из дерева
  useEffect(
    () => () => {
      componentWillUnmount.current = true;
    },
    []
  );

  useEffect(() => {
    // Если компонент не будет удалён из дерева - НЕ убираем созданные objectURLs
    if (!componentWillUnmount.current) {
      return;
    }

    return () => photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
  }, [photos]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBody(e.target.value);

    // Делаем textarea автоматически расширяемой
    e.currentTarget.style.height = "inherit";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  }

  async function handleSubmitPost(e: any) {
    e.preventDefault();
    if (!body || !state.user) {
      return;
    }

    setIsLoading(true);
    await PostHandler.addPost(body, state.user, photos);
    setPhotos([]);
    setBody("");
    setIsLoading(false);
  }

  function removePhoto(name: string) {
    setPhotos((photos) => photos.filter((photo) => photo.name !== name));
  }

  return (
    <>
      <article className="media">
        <figure className="media-left">
          <p className="image is-48x48">
            <img src={state.user?.avatar} alt="Аватар" className="is-rounded" />
          </p>
        </figure>
        <form className="media-content" noValidate onSubmit={handleSubmitPost}>
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
                  disabled={isLoading}
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
              <PhotosPreview photos={photos} onRemovePhoto={removePhoto} />
              {isLoading && (
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
        <PhotosDropzone onDrop={onDrop} />
      </Modal>
    </>
  );
};

export default AddPostForm;
