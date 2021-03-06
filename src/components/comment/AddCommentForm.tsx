import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";
import { CommentHandler } from "../../firebase/CommentHandler";
import { NotificationHandler } from "../../firebase/NotificationHandler";
import { useAppSelector } from "../../hooks";
import AutoExpandingTextArea from "../form/AutoExpandingTextArea";
import Button from "../layout/Button";

interface IProps {
  id: string;
  userHandle: string;
}

const AddCommentForm: React.FC<IProps> = (props) => {
  const state = useAppSelector((state) => state.user);
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmitComment(e: any) {
    e.preventDefault();
    if (!body.trim() || !state.user) {
      return;
    }

    setIsLoading(true);
    await CommentHandler.addComment(props.id, body.trim(), state.user);
    setBody("");
    setIsLoading(false);

    if (state.user.handle === props.userHandle) {
      return;
    }

    await NotificationHandler.createNotification(
      state.user,
      props.id,
      "comment",
      props.userHandle
    );
  }

  if (!state.user) {
    return null;
  }

  return (
    <article className="media ml-5">
      <figure className="media-left">
        <p className="image is-48x48">
          <img src={state.user.avatar} alt="Аватар" className="is-rounded" />
        </p>
      </figure>
      <form className="media-content" noValidate onSubmit={handleSubmitComment}>
        <AutoExpandingTextArea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="textarea is-clipped"
          placeholder="Поделитесь своими мыслями..."
          rows={1}
        />
        <nav className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <Button className="is-success" disabled={isLoading}>
                Опубликовать
              </Button>
            </div>
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
  );
};

export default AddCommentForm;
