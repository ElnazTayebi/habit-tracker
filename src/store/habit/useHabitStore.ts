import { subscribeToHabits as firebaseSubscribe } from "../../services/habitService";
import { addHabitToFirebase } from "../../services/habitService";
import { create } from "zustand";

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

type Habit = {
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

type HabitStore = {
  habitName: string;
  amount: string;
  unit: string;
  selectedCategory: Category | null;
  categories: Category[];
  frequency: "Daily" | "Weekly";
  selectedDays: string[];
  reminders: string[];
  startDate: string;
  editingHabit: Habit | null;
  habits: Habit[];

  setHabitName: (value: string) => void;
  setAmount: (value: string) => void;
  setUnit: (value: string) => void;
  setSelectedCategory: (value: Category | null) => void;
  setFrequency: (value: "Daily" | "Weekly") => void;
  setSelectedDays: (value: string[]) => void;
  setReminders: (value: string[]) => void;
  setStartDate: (value: string) => void;
  setEditingHabit: (value: Habit | null) => void;

  resetForm: () => void;
  saveHabit: () => Promise<void>;

  toggleHabitInstanceCompletion: (habitId: string, instanceId: string) => void;
  deleteHabitInstance: (habitId: string, instanceId: string) => void;
 subscribeToHabits: () => () => void;
};

export const useHabitStore = create<HabitStore>((set, get) => ({
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

  setHabitName: (value) => set({ habitName: value }),
  setAmount: (value) => set({ amount: value }),
  setUnit: (value) => set({ unit: value }),
  setSelectedCategory: (value) => set({ selectedCategory: value }),
  setFrequency: (value) => set({ frequency: value }),
  setSelectedDays: (value) => set({ selectedDays: value }),
  setReminders: (value) => set({ reminders: value }),
  setStartDate: (value) => set({ startDate: value }),
  setEditingHabit: (value) => set({ editingHabit: value }),

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

  saveHabit: async () => {
    const state = get();

    const today = new Date().toISOString().split("T")[0];

    const instances: HabitInstance[] = state.reminders.map((time, index) => ({
      id: Date.now().toString() + index,
      date: today,
      time,
      completed: false,
    }));

    const newHabit: Habit = {
      id: state.editingHabit
        ? state.editingHabit.id
        : Date.now().toString(),
      name: state.habitName,
      goalAmount: state.amount,
      goalUnit: state.unit,
      category: state.selectedCategory,
      frequency: state.frequency,
      selectedDays: state.selectedDays,
      reminders: state.reminders,
      startDate: state.startDate,
      scheduledInstances: instances,
    };

    if (state.editingHabit) {
      set({
        habits: state.habits.map((h) =>
          h.id === state.editingHabit?.id ? newHabit : h
        ),
        editingHabit: null,
      });
    } else {
     await addHabitToFirebase(newHabit)
    }
  },

subscribeToHabits: () => {
  const unsubscribe = firebaseSubscribe((data) => {
    const safeData = data.map((h) => ({
      ...h,
      scheduledInstances: Array.isArray(h.scheduledInstances)
        ? h.scheduledInstances
        : [],
    }));

    set({ habits: safeData });
  });

  return unsubscribe;
},

  toggleHabitInstanceCompletion: (habitId, instanceId) => {
    set((state) => ({
      habits: state.habits.map((habit) => {
        if (habit.id !== habitId) return habit;

        return {
          ...habit,
          scheduledInstances: habit.scheduledInstances.map((instance) =>
            instance.id === instanceId
              ? { ...instance, completed: !instance.completed }
              : instance
          ),
        };
      }),
    }));
  },

  deleteHabitInstance: (habitId, instanceId) => {
    set((state) => ({
      habits: state.habits.map((habit) => {
        if (habit.id !== habitId) return habit;

        return {
          ...habit,
          scheduledInstances: habit.scheduledInstances.filter(
            (i) => i.id !== instanceId
          ),
        };
      }),
    }));
  },
}));