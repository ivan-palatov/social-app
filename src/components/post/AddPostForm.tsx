import { mdiLink, mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-bulma-components";
import { PostHandler } from "../../firebase/PostHandler";
import { useAppSelector } from "../../hooks";
import AutoExpandingTextArea from "../form/AutoExpandingTextArea";
import Modal from "../Modal";
import ImagesDropzone from "./ImagesDropzone";
import ImagesPreview from "./ImagesPreview";

interface IProps {}

const AddPostForm: React.FC<IProps> = () => {
  const state = useAppSelector((state) => state.user);
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<
    (File & {
      preview: string;
    })[]
  >([]);

  const componentWillUnmount = useRef(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const files = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );

    setImages(files);
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

    return () => images.forEach((photo) => URL.revokeObjectURL(photo.preview));
  }, [images]);

  async function handleSubmitPost(e: any) {
    e.preventDefault();
    if (!body.trim() || !state.user) {
      return;
    }

    setIsLoading(true);
    await PostHandler.addPost(body.trim(), state.user, images);
    setImages([]);
    setBody("");
    setIsLoading(false);
  }

  function removePhoto(name: string) {
    setImages((photos) => photos.filter((photo) => photo.name !== name));
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
          <AutoExpandingTextArea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="textarea is-clipped"
            placeholder="Поделитесь своими мыслями..."
            rows={1}
          />
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
              <ImagesPreview images={images} onRemovePhoto={removePhoto} />
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
        <ImagesDropzone onDrop={onDrop} />
      </Modal>
    </>
  );
};

export default AddPostForm;
