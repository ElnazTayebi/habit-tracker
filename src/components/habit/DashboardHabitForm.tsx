import {
  Square,
  CheckSquare,
  Trash2,
  Clock,
  Edit,
  CalendarDays,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useHabitStore } from "../../store/habit/useHabitStore";
import { useMemo, useState } from "react";

const DashboardHabitForm = () => {
  const {
    habits,
    toggleHabitInstanceCompletion,
    deleteHabitInstance,
  } = useHabitStore();

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  const tasks = useMemo(() => {
    return (habits || [])
      .flatMap((habit) =>
        (habit.scheduledInstances || []).map((instance) => ({
          ...instance,
          habitId: habit.id,
          habitName: habit.name,

          category: habit.category ?? null,
          goalAmount: habit.goalAmount ?? "-",
          goalUnit: habit.goalUnit ?? "",
          frequency: habit.frequency ?? "-",
          selectedDays: habit.selectedDays ?? [],
          reminders: habit.reminders ?? [],
          startDate: habit.startDate ?? "-",
        }))
      )
      .filter((t) => t.date === selectedDate);
  }, [habits, selectedDate]);

  const progress = useMemo(() => {
    if (!tasks?.length) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const goNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toLocaleDateString("en-CA"));
  };

  const goPrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toLocaleDateString("en-CA"));
  };

  return (
    <div className="w-full mt-6 text-[rgb(var(--text))]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[rgb(var(--muted))]" />
          <h2 className="text-lg font-semibold">
            Today's Habits
          </h2>
        </div>

        <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted))]">
          <button onClick={goPrevDay} className="hover:opacity-70">
            ◀
          </button>

          {selectedDate}

          <button onClick={goNextDay} className="hover:opacity-70">
            ▶
          </button>
        </div>

      </div>

      {/* PROGRESS CIRCLE */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">

          <svg className="w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="rgb(var(--progress-bg))"
              strokeWidth="12"
              fill="none"
            />

            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="rgb(var(--progress-fill))"
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={
                2 * Math.PI * 80 * (1 - progress / 100)
              }
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">
              {progress}%
            </div>
            <div className="text-sm text-[rgb(var(--muted))]">
              Progress
            </div>
          </div>

        </div>
      </div>

      {/* LIST */}
      <div className="space-y-3">

        {tasks.map((t) => (
          <div
            key={t.id}
            className="flex items-start justify-between p-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm"
          >

            {/* LEFT */}
            <div className="flex items-start gap-3">

              <button
                onClick={() =>
                  toggleHabitInstanceCompletion(t.habitId, t.id)
                }
              >
                {t.completed ? (
                  <CheckSquare className="w-5 h-5 text-[rgb(var(--success))]" />
                ) : (
                  <Square className="w-5 h-5 text-[rgb(var(--muted))]" />
                )}
              </button>

              <div>

                <div
                  className={`text-sm font-medium ${
                    t.completed
                      ? "line-through text-[rgb(var(--muted))]"
                      : ""
                  }`}
                >
                  {t.habitName}
                </div>

                <div className="text-xs text-[rgb(var(--muted))] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t.time}
                </div>

              </div>
            </div>

            {/* EXTRA */}
            <div className="text-[11px] text-[rgb(var(--muted))] mt-1 space-y-1">

              {t.category && (
                <div className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: t.category.color }}
                  />
                  {t.category.name}
                </div>
              )}

              <div>🎯 {t.goalAmount} {t.goalUnit}</div>
              <div>🔁 {t.frequency}</div>
              <div>🚀 {t.startDate}</div>

              {t.reminders?.length > 0 && (
                <div>⏰ {t.reminders.join(", ")}</div>
              )}

            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  navigate("/add-habit", {
                    state: {
                      mode: "edit",
                      habitId: t.habitId,
                      instanceId: t.id,
                    },
                  })
                }
              >
                <Edit className="w-4 h-4 text-[rgb(var(--primary))]" />
              </button>

              <button
                onClick={() =>
                  deleteHabitInstance(t.habitId, t.id)
                }
              >
                <Trash2 className="w-4 h-4 text-[rgb(var(--danger))]" />
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default DashboardHabitForm;