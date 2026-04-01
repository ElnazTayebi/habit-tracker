/* import { create } from "zustand";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface HabitInstance {
  id: string;
  date: string;
  time: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  category: Category | null;
  goalAmount: string;
  goalUnit: string;
  frequency: "Daily" | "Weekly";
  selectedDays: string[];
  reminders: string[];
  startDate: string;
  scheduledInstances: HabitInstance[];
  createdAt: Timestamp;
}

interface HabitState {
  // form state
  habitName: string;
  amount: string;
  unit: string;
  selectedCategory: Category | null;

  categories: Category[];

  frequency: "Daily" | "Weekly";
  selectedDays: string[];
  reminders: string[];
  startDate: string;

  habits: Habit[];

  // 🆕 EDIT STATE
  editingHabit: Habit | null;

  // setters
  setHabitName: (v: string) => void;
  setAmount: (v: string) => void;
  setUnit: (v: string) => void;
  setSelectedCategory: (c: Category | null) => void;

  addCategory: (c: Category) => void;

  setFrequency: (v: "Daily" | "Weekly") => void;
  setSelectedDays: (v: string[]) => void;
  setReminders: (v: string[]) => void;
  setStartDate: (v: string) => void;

  // edit
  setEditingHabit: (h: Habit | null) => void;
  updateHabit: (habit: Habit) => Promise<void>;

  // firebase
  subscribeToHabits: () => () => void;

  saveHabit: () => Promise<void>;

  toggleHabitInstanceCompletion: (
    habitId: string,
    instanceId: string
  ) => Promise<void>;

  deleteHabitInstance: (
    habitId: string,
    instanceId: string
  ) => Promise<void>;

  deleteHabit: (habitId: string) => Promise<void>;

  resetForm: () => void;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  // ======================
  // STATE
  // ======================
  habitName: "",
  amount: "",
  unit: "",
  selectedCategory: null,

  categories: [
    { id: "1", name: "Wellness", color: "#22c55e" },
    { id: "2", name: "Education", color: "#f97316" },
    { id: "3", name: "Mindfulness", color: "#3b82f6" },
  ],

  frequency: "Daily",
  selectedDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  reminders: ["08:00"],
  startDate: new Date().toISOString().split("T")[0],

  habits: [],

  // 🆕 EDIT STATE
  editingHabit: null,

  // ======================
  // SETTERS
  // ======================
  setHabitName: (v) => set({ habitName: v }),
  setAmount: (v) => set({ amount: v }),
  setUnit: (v) => set({ unit: v }),
  setSelectedCategory: (c) => set({ selectedCategory: c }),

  addCategory: (c) =>
    set((s) => ({ categories: [...s.categories, c] })),

  setFrequency: (v) => set({ frequency: v }),
  setSelectedDays: (v) => set({ selectedDays: v }),
  setReminders: (v) => set({ reminders: v }),
  setStartDate: (v) => set({ startDate: v }),

  // ======================
  // EDIT FUNCTIONS
  // ======================
  setEditingHabit: (h) => set({ editingHabit: h }),

  updateHabit: async (habit) => {
    await updateDoc(doc(db, "habits", habit.id), {
      name: habit.name,
      category: habit.category,
      goalAmount: habit.goalAmount,
      goalUnit: habit.goalUnit,
      frequency: habit.frequency,
      selectedDays: habit.selectedDays,
      reminders: habit.reminders,
      startDate: habit.startDate,
      scheduledInstances: habit.scheduledInstances,
    });

    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === habit.id ? habit : h
      ),
    }));
  },

  // ======================
  // FIREBASE
  // ======================
  subscribeToHabits: () => {
    const ref = collection(db, "habits");

    return onSnapshot(ref, (snap) => {
      const data: Habit[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Habit, "id">),
      }));

      set({ habits: data });
    });
  },

  saveHabit: async () => {
    const state = get();

    if (!state.habitName.trim()) return;

    const instances: HabitInstance[] = [];
    const start = new Date(state.startDate);

    for (let i = 0; i < 30; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      const dateStr = date.toISOString().split("T")[0];
      const day = date.toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (state.selectedDays.includes(day)) {
        state.reminders.forEach((time) => {
          instances.push({
            id: crypto.randomUUID(),
            date: dateStr,
            time,
            completed: false,
          });
        });
      }
    }

    await addDoc(collection(db, "habits"), {
      name: state.habitName,
      category: state.selectedCategory,
      goalAmount: state.amount,
      goalUnit: state.unit,
      frequency: state.frequency,
      selectedDays: state.selectedDays,
      reminders: state.reminders,
      startDate: state.startDate,
      scheduledInstances: instances,
      createdAt: Timestamp.now(),
    });

    get().resetForm();
  },

  toggleHabitInstanceCompletion: async (habitId, instanceId) => {
    const habit = get().habits.find((h) => h.id === habitId);
    if (!habit) return;

    const updated = habit.scheduledInstances.map((i) =>
      i.id === instanceId
        ? { ...i, completed: !i.completed }
        : i
    );

    await updateDoc(doc(db, "habits", habitId), {
      scheduledInstances: updated,
    });
  },

  deleteHabitInstance: async (habitId, instanceId) => {
    const habit = get().habits.find((h) => h.id === habitId);
    if (!habit) return;

    const updated = habit.scheduledInstances.filter(
      (i) => i.id !== instanceId
    );

    await updateDoc(doc(db, "habits", habitId), {
      scheduledInstances: updated,
    });
  },

  deleteHabit: async (habitId) => {
    await deleteDoc(doc(db, "habits", habitId));
  },

  // ======================
  // RESET
  // ======================
  resetForm: () =>
    set({
      habitName: "",
      amount: "",
      unit: "",
      frequency: "Daily",
      selectedDays: [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ],
      reminders: ["08:00"],
      startDate: new Date().toISOString().split("T")[0],
      selectedCategory: null,
    }),
})); */
import  {create} from "zustand";

type Category = {
  id: string;
  name: string;
};

type HabitStore = {
  habitName: string;
  setHabitName: (v: string) => void;

  categories: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: (c: Category) => void;
};

export const useHabitStore = create<HabitStore>((set) => ({
  habitName: "",
  setHabitName: (v) => set({ habitName: v }),

  categories: [
    { id: "1", name: "Health" },
    { id: "2", name: "Study" },
  ],

  selectedCategory: null,
  setSelectedCategory: (c) => set({ selectedCategory: c }),
}));
