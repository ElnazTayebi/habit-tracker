import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const habitsCollection = collection(db, "habits");

// ➕ ADD
export const addHabitToFirebase = async (habit: any) => {
  const docRef = await addDoc(habitsCollection, habit);

  return {
    id: docRef.id, // ✅ Firebase ID
    ...habit,
  };
};

// 📥 GET
export const getHabitsFromFirebase = async () => {
  const snapshot = await getDocs(habitsCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 🔥 REALTIME
export const subscribeToHabits = (callback: (data: any[]) => void) => {
  return onSnapshot(habitsCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id, // ✅ مهم
      ...doc.data(),
    }));

    console.log("📡 SNAPSHOT:", data);
    callback(data);
  });
};

// ✏️ UPDATE
export const updateHabitInFirebase = async (id: string, updatedHabit: any) => {
  console.log("🔥 UPDATE:", id);

  const ref = doc(db, "habits", id);
  await updateDoc(ref, updatedHabit);
};

// ❌ DELETE
export const deleteHabitFromFirebase = async (id: string) => {
  console.log("🔥 DELETE:", id);

  await deleteDoc(doc(db, "habits", id));
};