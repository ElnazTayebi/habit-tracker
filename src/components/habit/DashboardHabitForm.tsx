import {
  Square,
  CheckSquare,
  Trash2,
  Clock,
  Edit,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useHabitStore } from "../../store/habit/useHabitStore";
import { useMemo, useState } from "react";


const DashboardHabitForm = () => {
  const {
    habits,
    setEditingHabit,
    toggleHabitInstanceCompletion,
    deleteHabitInstance,
    deleteHabit,
  } = useHabitStore();

  const navigate = useNavigate();

  const [openId, setOpenId] = useState<string | null>(null);

  // ✅ FIX 1: date استاندارد (خیلی مهم)
  const formatDate = (date: Date) =>
    date.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(
    formatDate(new Date())
  );

  // ✅ FIX 2: safe + clean tasks
  const tasks = useMemo(() => {
    console.log("🧠 served DATA", habits);
    const filteredTask =  (habits || [])
      console.log("🧠 RAW HABITS:", habits);

  (habits || []).forEach((habit) => {
    console.log("👉 HABIT ID:", habit.id);
    console.log(
      "👉 isArray:",
      Array.isArray(habit.scheduledInstances)
    );
  });

  const mapped = (habits || []).flatMap((habit) => {
    

   

    return  ({
      id: habit.id, // 🔥 derived id
      habitId: habit.id,
      habitName: habit.name,
      date: habit.startDate,
      completed: false, // we'll fix this later
      schaduledInstances : habit.scheduledInstances,
      category: habit.category ?? null,
      goalAmount: habit.goalAmount ?? "-",
      goalUnit: habit.goalUnit ?? "",
      frequency: habit.frequency ?? "-",
      selectedDays: habit.selectedDays ?? [],
      reminders: habit.reminders ?? [],
      
      startDate: habit.startDate ?? "-",
    });
   
  });

  console.log("🧠 FINAL TASKS:", mapped);
  return  mapped.filter((t) => t.date === selectedDate);;
}, [habits, selectedDate]);

  const progress = useMemo(() => {
    if (!tasks.length) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  // ✅ FIX 3: date safe
  const goNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(formatDate(date));
  };

  const goPrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(formatDate(date));
  };



  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6 text-[rgb(var(--text))]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[rgb(var(--muted))]" />
          <h2 className="text-lg font-semibold">
            Habits
          </h2>
        </div>

        <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
          <button onClick={goPrevDay}>
            <ChevronLeft className="w-4 h-4" />
          </button>

          {selectedDate}

          <button onClick={goNextDay}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* PROGRESS */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-[rgb(var(--progress-bg))] stroke-current"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              className="text-[rgb(var(--primary))] stroke-current transition-all duration-500 ease-out"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 - (progress / 100) * (2 * Math.PI * 40)}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-[rgb(var(--text))]">{progress}%</span>
            <span className="text-[rgb(var(--muted))] text-lg">Progress</span>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div> 
      </div>
      <div className="space-y-4">
         

        {
        tasks.map((t) => {
          const isOpen = openId === t.id;
          console.log("this is my tasks", t);
          return (
            <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">

              <div className="p-4 flex items-center justify-between">

                {/* LEFT */}
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() =>
                      toggleHabitInstanceCompletion(t.habitId, t.id)
                    }
                    className="transition-transform active:scale-90"
                  >
                    {t.completed ? (
                      <CheckSquare className="w-6 h-6 text-green-500 fill-green-50" />
                    ) : (
                      <Square className="w-6 h-6 text-gray-300" />
                    )}
                  </button>

                  <div>
                    <div className={`text-lg font-semibold ${t.completed ? "line-through text-gray-400" : "text-gray-800"}`}>{t.habitName}</div>

                    {/* ✅ FIX 4: time safe */}
                    <div className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {t.schaduledInstances.at(0)?.time || "--:--"}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex gap-1 items-center">

                  <button
                    className="p-2 text-gray-400 hover:text-[rgb(var(--primary))] hover:bg-blue-50 rounded-full transition-colors"
                    onClick={() => {
                      const habitToEdit = habits.find(h => h.id === t.habitId);

                      setEditingHabit(habitToEdit || null);

                      navigate("/add-habit");
                    }}
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  <button
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    onClick={async () => {
                      console.log("CLICK DELETE → habitId:", t.habitId);
                      console.log("CLICK DELETE → instanceId:", t.id);

                      await deleteHabit(t.habitId);
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                    onClick={() =>
                      setOpenId(isOpen ? null : t.id)
                    }
                  >
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                </div>
              </div>

              {/* DROPDOWN */}
              {isOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-50 bg-gray-50/30">
                  <div className="grid grid-cols-2 gap-4 text-sm">

                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 text-xs font-medium uppercase">Category</span>
                      <div className="flex items-center gap-2 text-gray-700">
                        {t.category && (
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: t.category?.color || "gray" }}
                          />
                        )}
                        {t.category?.name || "-"}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 text-xs font-medium uppercase">Goal</span>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {t.goalAmount} {t.goalUnit}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 text-xs font-medium uppercase">Frequency</span>
                      <div className="flex items-center gap-2 text-gray-700">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        {t.frequency}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-gray-400 text-xs font-medium uppercase">Start Date</span>
                      <div className="flex items-center gap-2 text-gray-700">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        {t.startDate}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400">No habits for this day.</p>
          </div>
        )}

      </div>
    </div>
  );
};
export default DashboardHabitForm;