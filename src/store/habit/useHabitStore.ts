import { create } from "zustand";
import {
  subscribeToHabits as firebaseSubscribe,
  addHabitToFirebase,
  updateHabitInFirebase,
  deleteHabitFromFirebase,
  addCompletionToFirebase,
  deleteCompletionFromFirebase,
  subscribeToCompletions as firebaseSubscribeCompletions,
} from "../../services/habitService";

/* =========================
   TYPES
========================= */

type Category = {
  id: string;
  name: string;
  color?: string;
};

export type Habit = {
  id: string;
  name: string;
  goalAmount: string;
  goalUnit: string;
  category: Category | null;
  frequency: "Daily" | "Weekly";
  selectedDays: string[];
  reminders: string[];
  startDate: string;
};

type CompletedInstance = {
  id: string;
  habitId: string;
  date: string;
  time: string;
};

/* =========================
   STORE TYPE
========================= */

type HabitStore = {
  // Form
  habitName: string;
  amount: string;
  unit: string;
  selectedCategory: Category | null;
  categories: Category[];

  frequency: "Daily" | "Weekly";
  selectedDays: string[];
  reminders: string[];
  startDate: string;

  // Data
  editingHabit: Habit | null;
  habits: Habit[];
  completions: CompletedInstance[];

  // Setters
  setHabitName: (v: string) => void;
  setAmount: (v: string) => void;
  setUnit: (v: string) => void;
  setSelectedCategory: (v: Category | null) => void;
  setFrequency: (v: "Daily" | "Weekly") => void;
  setSelectedDays: (v: string[]) => void;
  setReminders: (v: string[]) => void;
  setStartDate: (v: string) => void;
  setEditingHabit: (v: Habit | null) => void;

  // Actions
  resetForm: () => void;
  saveHabit: () => Promise<void>;

  toggleCompletion: (
    habitId: string,
    date: string,
    time: string
  ) => Promise<void>;

  deleteHabit: (habitId: string) => Promise<void>;

  subscribeToHabits: () => () => void;
  subscribeToCompletions: () => () => void;
};

/* =========================
   HELPERS
========================= */

const normalizeArray = (arr: any) =>
  Array.isArray(arr) ? arr : [];

const normalizeReminders = (reminders: any) =>
  Array.isArray(reminders)
    ? [...new Set(reminders.map((r: string) => r.trim()).filter(Boolean))]
    : [];

/* =========================
   STORE
========================= */

export const useHabitStore = create<HabitStore>((set, get) => ({
  /* ---------- INITIAL ---------- */

  habitName: "",
  amount: "",
  unit: "",
  selectedCategory: null,

  categories: [
    { id: "1", name: "Health" },
    { id: "2", name: "Study" },
    { id: "3", name: "Work" },
  ],

  frequency: "Daily",
  selectedDays: [],
  reminders: [],
  startDate: "",

  editingHabit: null,
  habits: [],
  completions: [],

  /* ---------- SETTERS ---------- */

  setHabitName: (v) => set({ habitName: v }),
  setAmount: (v) => set({ amount: v }),
  setUnit: (v) => set({ unit: v }),
  setSelectedCategory: (v) => set({ selectedCategory: v }),

  setFrequency: (v) =>
    set({
      frequency: v,
      selectedDays: v === "Daily" ? [] : get().selectedDays,
    }),

  setSelectedDays: (v) => set({ selectedDays: v }),
  setReminders: (v) => set({ reminders: v }),
  setStartDate: (v) => set({ startDate: v }),
  setEditingHabit: (v) => set({ editingHabit: v }),

  /* ---------- RESET ---------- */

  resetForm: () =>
    set({
      habitName: "",
      amount: "",
      unit: "",
      selectedCategory: null,
      frequency: "Daily",
      selectedDays: [],
      reminders: [],
      startDate: "",
    }),

  /* ---------- SAVE HABIT ---------- */

  saveHabit: async () => {
    const state = get();

    const cleanReminders = normalizeReminders(state.reminders);

    const today =
      state.startDate || new Date().toISOString().split("T")[0];

    const habitData = {
      name: state.habitName.trim(),
      frequency: state.frequency,
      selectedDays: state.selectedDays,
      reminders: cleanReminders,
      startDate: today,
    };

    try {
      if (state.editingHabit) {
        await updateHabitInFirebase(state.editingHabit.id, habitData);
      } else {
        await addHabitToFirebase(habitData);
      }
    } catch (err) {
      console.error("❌ SAVE ERROR", err);
    }
  },

  /* ---------- SUBSCRIBE HABITS ---------- */

  subscribeToHabits: () => {
    const unsubscribe = firebaseSubscribe((data) => {
      const safeData: Habit[] = data.map((h) => ({
        id: h.id,
        name: h.name ?? "",
        goalAmount: h.goalAmount ?? "",
        goalUnit: h.goalUnit ?? "",
        category: h.category ?? null,
        frequency: h.frequency ?? "Daily",
        selectedDays: normalizeArray(h.selectedDays),
        reminders: normalizeReminders(h.reminders),
        startDate: h.startDate ?? "",
      }));

      set({ habits: safeData });
    });

    return unsubscribe;
  },

  /* ---------- SUBSCRIBE COMPLETIONS ---------- */

  subscribeToCompletions: () => {
    const unsubscribe = firebaseSubscribeCompletions((data) => {
      set({ completions: data });
    });

    return unsubscribe;
  },

  /* ---------- TOGGLE COMPLETION ---------- */

  toggleCompletion: async (habitId, date, time) => {
    const state = get();

    const existing = state.completions.find(
      (c) =>
        c.habitId === habitId &&
        c.date === date &&
        c.time === time
    );

    if (existing) {
      await deleteCompletionFromFirebase(existing.id);

      set({
        completions: state.completions.filter(
          (c) => c.id !== existing.id
        ),
      });
    } else {
      const newCompletion = {
        habitId,
        date,
        time,
      };
console.log("🔥 ADDING COMPLETION:", newCompletion);
      const saved = await addCompletionToFirebase(newCompletion);

console.log("✅ SAVED:", saved);
      set({
        completions: [...state.completions, saved],
      });
      
console.log("AFTER SET:", get().completions);
    }
  },

  /* ---------- DELETE HABIT ---------- */

  deleteHabit: async (habitId) => {
    try {
      await deleteHabitFromFirebase(habitId);

      set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId),
      }));
    } catch (err) {
      console.error("❌ DELETE ERROR", err);
    }
  },
}));