import { firebaseConfig } from "../firebase/firebase";

export function createImagesNames(handle: string, images: File[]) {
  const names = images.map(
    (image) => `${handle}_${new Date().getTime()}_${image.name}`
  );

  return {
    names,
    images: names.map(
      (name) =>
        `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${name}?alt=media`
    ),
  };
}

export function createImageName(handle: string, image: File) {
  const name = `${handle}_${new Date().getTime()}_${image.name}`;

  return {
    name,
    image: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${name}?alt=media`,
  };
}
