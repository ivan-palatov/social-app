import {
  createUserWithEmailAndPassword,
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
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createImageName } from "../utils/createImageNames";
import { IUser } from "../utils/interfaces";
import {
  auth,
  db,
  firebaseConfig,
  googleProvider,
  uploadImage,
} from "./firebase";

export class UserHandler {
  static defaultAvatar = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/default_avatar.jpeg?alt=media`;

  static retries = 0;

  private static async addUser(
    user: User,
    name: string,
    authProvider: "google" | "local"
  ) {
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider,
      email: user.email,
      handle: user.email?.substring(0, user.email?.indexOf("@")),
      createdAt: new Date().toISOString(),
      bio: "",
      website: "",
      avatar: UserHandler.defaultAvatar,
    });
  }

  static async signInWithGoogle() {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);

      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);

      // Если юзер уже существует в базе - останавливаемся
      if (docs.docs.length !== 0) {
        return;
      }

      // Если ещё нет в базе - создаём
      await UserHandler.addUser(
        user,
        user.displayName || "Пользователь",
        "google"
      );
    } catch (err) {
      console.error(err);
    }
  }

  static async registerWithEmailAndPassword(
    name: string,
    email: string,
    password: string
  ) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await UserHandler.addUser(user, name, "local");
    } catch (err) {
      console.error(err);
    }
  }

  static async logInWithEmailAndPassword(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  }

  static async sendPasswordReset(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error(err);
    }
  }

  static logout() {
    signOut(auth);
  }

  static async updateProfile(
    name: string,
    bio: string,
    website: string,
    user: User
  ) {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const doc = await getDocs(q);
      const ref = doc.docs[0].ref;

      await updateDoc(ref, { name, bio, website });
    } catch (error) {
      console.error(error);
    }
  }

  static async updateAvatar(image: File, user: IUser) {
    const photoName = createImageName(user.handle, image);

    await uploadImage(image, photoName.name);

    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const doc = await getDocs(q);
      const ref = doc.docs[0].ref;

      await updateDoc(ref, { avatar: photoName.image });
    } catch (error) {
      console.error(error);
    }
  }

  static async getUserData(uid: string) {
    try {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      const likes = await getDocs(
        query(collection(db, "likes"), where("userHandle", "==", data.handle))
      );

      UserHandler.retries = 0;

      return {
        ...data,
        id: doc.docs[0].id,
        likes: likes.docs.map((d) => d.data().storyId) as any[],
      } as IUser;
    } catch (error) {
      if (UserHandler.retries < 5) {
        await UserHandler.getUserData(uid);
        UserHandler.retries++;
      }

      console.error(error);
    }
  }

  static async getUsers() {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt"), limit(10));
      const docs = await getDocs(q);

      return docs.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IUser[];
    } catch (error) {
      console.error(error);
    }
  }

  static async getUserDataByHandle(handle: string) {
    try {
      const q = query(collection(db, "users"), where("handle", "==", handle));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      return {
        ...data,
        id: doc.docs[0].id,
      } as IUser;
    } catch (error) {
      console.error(error);
    }
  }
}
