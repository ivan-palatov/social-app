import React, { useState } from "react";
import { Button } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, createPost } from "../firebase";

interface IProps {}

const AddPostForm: React.FC<IProps> = () => {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const [user] = useAuthState(auth);

  async function savePost(e: any) {
    e.preventDefault();
    if (!body) {
      return;
    }

    setLoading(true);
    await createPost(body, user!);
    setBody("");
    setLoading(false);
  }

  return (
    <form className="box" noValidate onSubmit={savePost}>
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
          <Button
            className="is-success"
            style={{ margin: "10px 0" }}
            disabled={loading}
          >
            Опубликовать
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddPostForm;
