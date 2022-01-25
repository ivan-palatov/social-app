import { faGlobe, faPortrait } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Columns } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, updateProfile } from "../firebase";

interface IProps {}

const Edit: React.FC<IProps> = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar, setAvatar] = useState("");
  const [waiting, setWaiting] = useState(false);

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
        setWebsite(data.website);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [user, loading, navigate]);

  async function saveChanges(e: any) {
    e.preventDefault();
    setWaiting(true);
    await updateProfile(name, bio, website, user!);
    setWaiting(false);
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
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faPortrait} />
              </span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="website" className="label">
              Web-сайт
            </label>
            <div className="control has-icons-left">
              <input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                type="url"
                placeholder="https://google.com"
                className="input"
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faGlobe} />
              </span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="bio" className="label">
              Напишите что-нибудь о себе
            </label>
            <div className="control">
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="textarea"
              />
            </div>
          </div>
          <Button className="is-success" type="submit" disabled={waiting}>
            {waiting ? "Сохраняем..." : "Сохранить"}
          </Button>
        </form>
      </Columns.Column>
    </Columns>
  );
};

export default Edit;
