import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";
import { Button } from "react-bulma-components";
import { CommentHandler } from "../firebase/CommentHandler";
import Modal from "./Modal";

interface IProps {
  postId: string;
  commentId: string;
}

const DeleteComment: React.FC<IProps> = ({ postId, commentId }) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleDeleteComment() {
    setIsLoading(true);

    await CommentHandler.deleteComment(postId, commentId);
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
              <p>Вы уверены, что хотите удалить этот комментарий?</p>
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
                    <Button className="is-danger" onClick={handleDeleteComment}>
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

export default DeleteComment;
