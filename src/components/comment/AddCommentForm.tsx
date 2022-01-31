import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";
import { Button } from "react-bulma-components";
import { CommentHandler } from "../../firebase/CommentHandler";
import { useAppSelector } from "../../hooks";

interface IProps {
  postId: string;
}

const AddCommentForm: React.FC<IProps> = (props) => {
  const state = useAppSelector((state) => state.user);
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBody(e.target.value);

    // Делаем textarea автоматически расширяемой
    e.currentTarget.style.height = "inherit";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  }

  async function handleSubmitComment(e: any) {
    e.preventDefault();
    if (!body.trim() || !state.user) {
      return;
    }

    setIsLoading(true);
    await CommentHandler.addComment(props.postId, body.trim(), state.user);
    setBody("");
    setIsLoading(false);
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
