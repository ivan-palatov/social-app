import { faPortrait } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

interface IProps {}

const Edit: React.FC<IProps> = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar, setAvatar] = useState("");

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      return navigate("/login");
    }

    const fetchUserData = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
        setBio(data.bio);
        setAvatar(data.avatar);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [user, loading, navigate]);

  function saveChanges(e: any) {
    e.preventDefault();
  }

  return (
    <Columns className="is-centered">
      <Columns.Column className="is-5-tablet is-4-desktop is-3-widescreen">
        <form className="box" noValidate onSubmit={saveChanges}>
          <div className="field">
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
                required
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faPortrait} />
              </span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="bio" className="label">
              Пароль
            </label>
            <div className="control">
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>
          <Button className="is-success" type="submit">
            Сохранить
          </Button>
        </form>
      </Columns.Column>
    </Columns>
  );
};

export default Edit;
