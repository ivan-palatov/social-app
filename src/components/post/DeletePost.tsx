import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";
import { PostHandler } from "../../firebase/PostHandler";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { removePost } from "../../slices/postsSlice";
import Button from "../layout/Button";
import Modal from "../Modal";

interface IProps {
  postId: string;
}

const DeletePost: React.FC<IProps> = ({ postId }) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const state = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  async function handleDeletePost() {
    setIsLoading(true);

    await PostHandler.deletePost(postId);
    if (!state.fetchedMore) {
      return;
    }

    setIsLoading(false);
    setIsModalActive(false);

    dispatch(removePost(postId));
  }

  return (
    <>
      <div className="media-right">
        <button
          className="delete is-small"
          onClick={() => setIsModalActive(true)}
        ></button>
      </div>
      <Modal
        isActive={isModalActive}
        onClickOutside={() => setIsModalActive(false)}
      >
        <div className="modal-content">
          <article className="message is-large is-danger">
            <div className="message-header">
              <p>Вы уверены, что хотите удалить этот пост?</p>
            </div>
            <div className="message-body">
              <nav className="level is-mobile">
                <div className="level-left">
                  {isLoading && (
                    <div className="level-item">
                      <span className="icon">
                        <Icon path={mdiLoading} spin />
                      </span>
                    </div>
                  )}
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <Button className="is-danger" onClick={handleDeletePost}>
                      Да
                    </Button>
                  </div>
                  <div className="level-item">
                    <Button onClick={() => setIsModalActive(false)}>Нет</Button>
                  </div>
                </div>
              </nav>
            </div>
          </article>
        </div>
      </Modal>
    </>
  );
};

export default DeletePost;
