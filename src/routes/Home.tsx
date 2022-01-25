import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button } from "react-bulma-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth, db, logout } from "../firebase";

function Home() {
  const [name, setName] = useState("");

  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!user || loading) return;

    const fetchUserName = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();

        setName(data.name);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserName();
  }, [loading, user]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return (
      <div>
        Вы не авторизированы <Link to="/login">Войдите</Link> или{" "}
        <Link to="/register">Зарегистрируйтесь</Link>
      </div>
    );
  }

  return (
    <div>
      <div>
        Вас зовут {name}
        <div>{user?.email}</div>
        <Button onClick={logout}>Выйти</Button>
      </div>
    </div>
  );
}
export default Home;
