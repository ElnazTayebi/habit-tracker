import { Square, CheckSquare, Trash2 } from "lucide-react";
import { useHabitStore } from "../../store/habit/useHabitStore";
import { useEffect, useMemo } from "react";

const Dashboard = () => {
  const {
    habits,
    subscribeToHabits,
    toggleHabitInstanceCompletion,
    deleteHabitInstance,
  } = useHabitStore();

  useEffect(() => {
    const unsub = subscribeToHabits();
    return () => unsub();
  }, []);

  const today = new Date().toLocaleDateString("en-CA");

  const tasks = useMemo(() => {
    return (habits || [])
      .flatMap((h) =>
        (h.scheduledInstances || []).map((i) => ({
          ...i,
          habitId: h.id,
          habitName: h.name,
        }))
      )
      .filter(() => true);
  }, [habits, today]);

  return (
<div className="space-y-3 mt-4">
  {tasks.length === 0 && (
    <p className="text-sm text-gray-400">No tasks for today</p>
  )}

  {tasks.map((t) => (
    <div
      key={t.id}
      className="flex items-center justify-between p-3 rounded-xl border bg-white shadow-sm"
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            toggleHabitInstanceCompletion(t.habitId, t.id)
          }
          className="text-blue-500"
        >
          {t.completed ? "☑️" : "⬜"}
        </button>

        <div className="flex flex-col">
          <span className="font-medium">{t.habitName}</span>
          <span className="text-xs text-gray-500">
            {t.time} • {t.date}
          </span>
        </div>
      </div>

      {/* Right side */}
      <button
        onClick={() =>
          deleteHabitInstance(t.habitId, t.id)
        }
        className="text-red-500 text-sm"
      >
        🗑
      </button>
    </div>
  ))}
</div>
  );
};

export default Dashboard;