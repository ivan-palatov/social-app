import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export class LikeHandler {
  static async addLike(storyId: string, userHandle: string) {
    await addDoc(collection(db, "likes"), { userHandle, storyId });
    await updateDoc(doc(db, "posts", storyId), { likes: increment(1) });
  }

  static async removeLike(storyId: string, userHandle: string) {
    try {
      const data = await getDocs(
        query(
          collection(db, "likes"),
          where("storyId", "==", storyId),
          where("userHandle", "==", userHandle)
        )
      );
      await deleteDoc(doc(db, "likes", data.docs[0].id));
      await updateDoc(doc(db, "posts", storyId), { likes: increment(-1) });
    } catch (error) {
      console.error(error);
    }
  }
}
