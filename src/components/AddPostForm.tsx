import { mdiLink } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";
import { Button } from "react-bulma-components";
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

  const [user] = useAuthState(auth);

  async function savePost(e: any) {
    e.preventDefault();
    if (!body || !user || !state.user) {
      return;
    }

    setLoading(true);
    await createPost(body, state.user);
    setBody("");
    setLoading(false);
  }

  return (
    <>
      <article className="media">
        <figure className="media-left">
          <p className="image is-64x64">
            <img src={state.user?.avatar} alt="Аватар" className="is-rounded" />
          </p>
        </figure>
        <form className="media-content" noValidate onSubmit={savePost}>
          <div className="field">
            <div className="control">
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="textarea"
                placeholder="Поделитесь своими мыслями..."
                rows={2}
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
            </div>
          </nav>
        </form>
      </article>

      <Modal
        isActive={isModalOpen}
        onClickOutside={() => setIsModalOpen(false)}
      >
        <div>Перетащите сюда файл...</div>
      </Modal>
    </>
  );
};

export default AddPostForm;
