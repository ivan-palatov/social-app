import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { IComment, IUser } from "../utils/interfaces";
import { db } from "./firebase";

export class CommentHandler {
  static async addComment(postId: string, body: string, user: IUser) {
    try {
      await addDoc(collection(db, "comments"), {
        createdAt: new Date().toISOString(),
        body,
        user: user.handle,
        name: user.name,
        avatar: user.avatar,
        postId,
      });

      await updateDoc(doc(db, "posts", postId), { comments: increment(1) });
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteComment(postId: string, commentId: string) {
    try {
      await deleteDoc(doc(db, "comments", commentId));
      await updateDoc(doc(db, "posts", postId), { comments: increment(-1) });
    } catch (error) {
      console.error(error);
    }
  }

  static subscribeToComments(
    postId: string,
    callback: (comments: IComment[]) => void
  ) {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) =>
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as IComment[]
      )
    );
  }
}
