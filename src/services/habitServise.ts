// services/habitService.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

const habitsCollection = collection(db, "habits");

// ➕ Add habit
export const addHabitToFirebase = async (habit: any) => {
  return await addDoc(habitsCollection, habit);
};

// 📥 Get habits once
export const getHabitsFromFirebase = async () => {
  const snapshot = await getDocs(habitsCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 🔥 REALTIME SUBSCRIBE
export const subscribeToHabits = (callback: (data: any[]) => void) => {
  return onSnapshot(habitsCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(data);
  });
};

// ❌ delete instance (اگر instance-level داری)
export const deleteHabitInstanceFromFirebase = async (id: string) => {
  await deleteDoc(doc(db, "habits", id));
};