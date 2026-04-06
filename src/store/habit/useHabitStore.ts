import { create } from "zustand";
import {
  subscribeToHabits as firebaseSubscribe,
  addHabitToFirebase,
  updateHabitInFirebase,
  deleteHabitFromFirebase,
} from "../../services/habitService";


/* =========================
   TYPES
========================= */

type Category = {
  id: string;
  name: string;
  color?: string;
};

type HabitInstance = {
  id: string;
  date: string;
  time: string;
  completed: boolean;
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
  scheduledInstances: HabitInstance[];
};

/* =========================
   STORE TYPE
========================= */

type HabitStore = {
  // Form State
  habitName: string;
  amount: string;
  unit: string;
  selectedCategory: Category | null;
  categories: Category[];

  frequency: "Daily" | "Weekly";
  selectedDays: string[];
  reminders: string[];
  startDate: string;

  // Data State
  editingHabit: Habit | null;
  habits: Habit[];

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

  toggleHabitCompletionForDate: (
    habitId: string,
    instanceId: string
  ) => Promise<void>;

  deleteHabitInstance: (
    habitId: string,
    instanceId: string
  ) => Promise<void>;

  deleteHabit: (habitId: string) => Promise<void>;

  subscribeToHabits: () => () => void;
};

/* =========================
   HELPERS
========================= */

// Ensure array safety
const normalizeArray = (arr: any) =>
  Array.isArray(arr) ? arr : [];

// Clean reminders (remove duplicates + trim)
const normalizeReminders = (reminders: any) =>
  Array.isArray(reminders)
    ? [...new Set(reminders.map((r: string) => r.trim()).filter(Boolean))]
    : [];

/* =========================
   STORE
========================= */

export const useHabitStore = create<HabitStore>((set, get) => ({
  /* ---------- INITIAL STATE ---------- */

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

  /* ---------- SETTERS ---------- */

  setHabitName: (v) => set({ habitName: v }),
  setAmount: (v) => set({ amount: v }),
  setUnit: (v) => set({ unit: v }),
  setSelectedCategory: (v) => set({ selectedCategory: v }),

  setFrequency: (v) =>
    set({
      frequency: v,
      // Reset days if switching to Daily
      selectedDays: v === "Daily" ? [] : get().selectedDays,
    }),

  setSelectedDays: (v) => set({ selectedDays: v }),
  setReminders: (v) => set({ reminders: v }),
  setStartDate: (v) => set({ startDate: v }),
  setEditingHabit: (v) => set({ editingHabit: v }),

  /* ---------- RESET FORM ---------- */

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

    const instances: HabitInstance[] = [];
    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(today);
      dateObj.setDate(dateObj.getDate() + i);

      const currentDate = dateObj.toISOString().split("T")[0];

      cleanReminders.forEach((time) => {
        instances.push({
          id: `${habit.id}-${currentDate}-${time}`,
          date: currentDate,
          time,
          completed: false,
        })
      })
    }

    const habitData = {
      name: state.habitName.trim(),
      //goalAmount: state.amount.trim(),
      //goalUnit: state.unit.trim(),
      //category: state.selectedCategory,
      frequency: state.frequency,
      //selectedDays:
      // state.frequency === "Weekly" ? state.selectedDays : [],
      reminders: cleanReminders,
      startDate: today,
      scheduledInstances: instances,
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

  /* ---------- REALTIME SUBSCRIBE ---------- */

  subscribeToHabits: () => {
    const unsubscribe = firebaseSubscribe((data) => {
      console.log("📡 RAW SNAPSHOT", data);

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
        scheduledInstances: normalizeArray(h.scheduledInstances),
      }));

      console.log("🧠 NORMALIZED DATA", safeData);

      set({ habits: safeData });
    });

    return unsubscribe;
  },

  /* ---------- TOGGLE COMPLETION ---------- */

  toggleHabitCompletionForDate: async (habitId, instanceId) => {
    const state = get();
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return;

    const updatedInstances = habit.scheduledInstances.map((i) =>
      i.id === instanceId
        ? { ...i, completed: !i.completed }
        : i
    );

    await updateHabitInFirebase(habitId, {
      ...habit,
      scheduledInstances: updatedInstances,
    });
  },

  /* ---------- DELETE INSTANCE ---------- */

  deleteHabitInstance: async (habitId, instanceId) => {
    const state = get();
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return;

    const updatedInstances = habit.scheduledInstances.filter(
      (i) => i.id !== instanceId
    );

    await updateHabitInFirebase(habitId, {
      scheduledInstances: updatedInstances,
    });
  },

  /* ---------- DELETE HABIT ---------- */

  deleteHabit: async (habitId) => {
    console.log("🔥 DELETE HABIT", habitId);

    try {
      await deleteHabitFromFirebase(habitId);

      console.log("✅ FIREBASE DELETE CONFIRMED");

      set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId),
      }));
    } catch (err) {
      console.error("❌ DELETE ERROR", err);
    }
  },
}));