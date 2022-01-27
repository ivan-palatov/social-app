import { firebaseConfig } from "../firebase";

export function createPhotosNames(handle: string, photos: File[]) {
  const names = photos.map(
    (photo) => `${handle}_${new Date().getTime()}_${photo.name}`
  );

  return {
    names,
    photos: names.map(
      (name) =>
        `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${name}?alt=media`
    ),
  };
}
