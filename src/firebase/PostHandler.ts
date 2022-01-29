import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { createImagesNames } from "../utils/createImageNames";
import { IPost, IUser } from "../utils/interfaces";
import { db, uploadImages } from "./firebase";

export class PostHandler {
  static async addPost(body: string, user: IUser, images: File[]) {
    const imageNames = createImagesNames(user.handle, images);

    try {
      await uploadImages(images, imageNames.names);

      await addDoc(collection(db, "posts"), {
        createdAt: new Date().toISOString(),
        body,
        user: user.handle,
        name: user.name,
        avatar: user.avatar,
        likes: 0,
        comments: 0,
        photos: imageNames.images,
      });
    } catch (error) {
      console.error(error);
    }
  }

  static async deletePost(postId: string) {
    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (error) {
      console.error(error);
    }
  }

  static async getPost(postId: string) {
    try {
      const postDoc = await getDoc(doc(db, "posts", postId));

      return { id: postDoc.id, ...postDoc.data() } as IPost;
    } catch (error) {
      console.error(error);
    }
  }

  static subscribeToPosts(callback: (posts: IPost[]) => void) {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    return onSnapshot(q, (snapshot) =>
      callback(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as IPost[]
      )
    );
  }

  static async getMorePosts(lastCreatedAt: string) {
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastCreatedAt),
        limit(10)
      );
      const docs = await getDocs(q);

      return docs.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as IPost[];
    } catch (error) {
      console.error(error);
    }
  }
}
