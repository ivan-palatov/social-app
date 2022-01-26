import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const app = initializeApp({
  apiKey: "AIzaSyDb_NC7rr_2rMEpvLjXnO2wWLR7wX3V7u0",
  authDomain: "social-9a688.firebaseapp.com",
  projectId: "social-9a688",
  storageBucket: "social-9a688.appspot.com",
  messagingSenderId: "405032755686",
  appId: "1:405032755686:web:422c31ad240e90f729b627",
  measurementId: "G-02S8YBVNRC",
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Регистрация и авторизация ч/з Гугл
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);

    // Если юзер уже существует в базе - останавливаемся
    if (docs.docs.length !== 0) {
      return;
    }

    // Если ещё нет в базе - создаём
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: user.displayName,
      authProvider: "google",
      email: user.email,
      handle: user.email?.substring(0, user.email?.indexOf("@")),
      createdAt: new Date().toISOString(),
      bio: "",
      website: "",
      avatar: "",
    });
  } catch (err) {
    console.error(err);
  }
};

// Авторизация ч/з мэйл и пароль
export const logInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
  }
};

// Регистрация ч/з мэйл и пароль, создание соответствующего юзера
export const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      handle: email.substring(0, email.indexOf("@")),
      createdAt: new Date().toISOString(),
      bio: "",
      website: "",
      avatar: "",
    });
  } catch (err) {
    console.error(err);
  }
};

// Отправка инструкций по сбросу пароля на почту
export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    console.error(err);
  }
};

export const logout = () => {
  signOut(auth);
};

// Изменение информации о юзере
export const updateProfile = async (
  name: string,
  bio: string,
  website: string,
  user: User
) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const doc = await getDocs(q);
    const ref = doc.docs[0].ref;

    await updateDoc(ref, { name, bio, website });
  } catch (error) {
    console.error(error);
  }
};

export const createPost = async (body: string, user: User) => {
  try {
    await addDoc(collection(db, "posts"), {
      createdAt: new Date().toISOString(),
      body,
      user: user.email!.substring(0, user.email!.indexOf("@")),
      likes: 0,
      comments: 0,
    });
  } catch (error) {
    console.error(error);
  }
};
