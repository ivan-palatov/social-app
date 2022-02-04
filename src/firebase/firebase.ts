import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDb_NC7rr_2rMEpvLjXnO2wWLR7wX3V7u0",
  authDomain: "social-9a688.firebaseapp.com",
  projectId: "social-9a688",
  storageBucket: "social-9a688.appspot.com",
  messagingSenderId: "405032755686",
  appId: "1:405032755686:web:422c31ad240e90f729b627",
  measurementId: "G-02S8YBVNRC",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.error(
      "Оффлайн режим не поддерживается, когда данное приложение открыто в нескольких вкладках"
    );
  } else if (err.code === "unimplemented") {
    console.error(
      "Ваш браузер не поддерживает оффлайн режим, рекомендуем обновиться"
    );
  }
});

export const googleProvider = new GoogleAuthProvider();

export const uploadImage = async (image: File, name: string) => {
  try {
    await uploadBytes(ref(storage, name), image);
  } catch (error) {
    console.error(error);
  }
};

export const uploadImages = async (images: File[], names: string[]) => {
  return Promise.all(images.map((image, i) => uploadImage(image, names[i])));
};
