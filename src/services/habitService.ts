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

/* =========================
   COLLECTIONS
========================= */

const habitsCollection = collection(db, "habits");
const completionsCollection = collection(db, "completions");
console.log("🔥 DB INSTANCE:", db);

/* =========================
   HABITS
========================= */

// ➕ ADD HABIT
export const addHabitToFirebase = async (habit: any) => {
  const docRef = await addDoc(habitsCollection, habit);
  await addDoc(collection(db, "TEST_COLLECTION"), {
  test: "hello",
  time: Date.now(),
});

  return {
    id: docRef.id,
    ...habit,
  };
};

// 📥 GET HABITS
export const getHabitsFromFirebase = async () => {
  const snapshot = await getDocs(habitsCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 🔥 REALTIME HABITS
export const subscribeToHabits = (callback: (data: any[]) => void) => {
  return onSnapshot(habitsCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("📡 HABITS SNAPSHOT:", data);
    callback(data);
  });
};

// ✏️ UPDATE HABIT
export const updateHabitInFirebase = async (
  id: string,
  updatedHabit: any
) => {
  const ref = doc(db, "habits", id);
  await updateDoc(ref, updatedHabit);
};

// ❌ DELETE HABIT
export const deleteHabitFromFirebase = async (id: string) => {
  await deleteDoc(doc(db, "habits", id));
};

/* =========================
   COMPLETIONS
========================= */

// ➕ ADD COMPLETION
export const addCompletionToFirebase = async (completion: any) => {
  const docRef = await addDoc(completionsCollection, completion);
console.log("🔥 COLLECTION PATH:", completionsCollection.path);
  return {
    id: docRef.id,
    ...completion,
  };
  
};

// ❌ DELETE COMPLETION
export const deleteCompletionFromFirebase = async (id: string) => {
  await deleteDoc(doc(db, "completions", id));
};

// 🔥 SUBSCRIBE COMPLETIONS
export const subscribeToCompletions = (
  callback: (data: any[]) => void
) => {
  return onSnapshot(completionsCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(data);
  });
};