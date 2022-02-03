import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { INotification, IUser } from "../utils/interfaces";
import { db } from "./firebase";

export class NotificationHandler {
  static subscribeToNotifications(
    callback: (posts: INotification[]) => void,
    handle: string
  ) {
    const q = query(
      collection(db, "notifications"),
      where("to", "==", handle),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as INotification[]
      );
    });
  }

  static async markAllAsRead(handle: string) {
    try {
      const batch = writeBatch(db);

      const q = query(
        collection(db, "notifications"),
        where("to", "==", handle)
      );
      const noteDocs = await getDocs(q);

      noteDocs.forEach((doc) => batch.update(doc.ref, { isRead: true }));
      await batch.commit();
    } catch (error) {
      console.error(error);
    }
  }

  static async createNotification(
    user: IUser,
    postId: string,
    type: "like" | "comment",
    to: string
  ) {
    try {
      await addDoc(collection(db, "notifications"), {
        from: user.handle,
        name: user.name,
        avatar: user.avatar,
        createdAt: new Date().toISOString(),
        isRead: false,
        postId,
        type,
        to,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
