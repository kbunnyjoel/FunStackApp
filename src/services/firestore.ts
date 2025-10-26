import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from '@react-native-firebase/firestore';

import {firebaseFirestore} from '../lib/firebase';

const PHOTO_COLLECTION = 'userPhotos';
const TEXT_COLLECTION = 'userTexts';

export type UserText = {
  id: string;
  text: string;
  createdAt?: Date;
};

export async function savePhoto(userId: string, imageBase64: string) {
  const photoRef = doc(firebaseFirestore, PHOTO_COLLECTION, userId);
  await setDoc(
    photoRef,
    {
      imageBase64,
      updatedAt: serverTimestamp(),
    },
    {merge: true},
  );
}

export function subscribeToPhoto(
  userId: string,
  onChange: (imageBase64: string | null) => void,
) {
  const photoRef = doc(firebaseFirestore, PHOTO_COLLECTION, userId);
  return onSnapshot(photoRef, snapshot => {
    const data = snapshot.data();
    onChange((data?.imageBase64 as string) ?? null);
  });
}

export async function saveUserText(userId: string, text: string) {
  const textsRef = collection(firebaseFirestore, TEXT_COLLECTION);
  await addDoc(textsRef, {
    userId,
    text,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToTexts(
  userId: string,
  onChange: (messages: UserText[]) => void,
) {
  const textsRef = collection(firebaseFirestore, TEXT_COLLECTION);
  const userQuery = query(
    textsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20),
  );

  return onSnapshot(
    userQuery,
    snapshot => {
      if (!snapshot) {
        onChange([]);
        return;
      }
      const items: UserText[] = snapshot.docs.map(document => {
        const data = document.data();
        return {
          id: document.id,
          text: data.text as string,
          createdAt: data.createdAt?.toDate?.(),
        };
      });
      onChange(items);
    },
    error => {
      console.error('Firestore subscribeToTexts error', error);
      onChange([]);
    },
  );
}
