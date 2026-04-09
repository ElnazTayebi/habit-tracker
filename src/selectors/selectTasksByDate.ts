type Task = {
  id: string;
  habitId: string;
  habitName: string;
  date: string;
  time: string;
  completed: boolean;
  startDate: string;
};

const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

const selectTasksByDate = (
  habits: any[],
  completions: any[],
  selectedDate: string
): Task[] => {
  const dayName = getDayName(selectedDate);

  return (habits || []).flatMap((habit) => {
    // ⛔ اگر قبل از startDate هست → نشون نده
    if (selectedDate < habit.startDate) return [];

    // ✅ بررسی اجرا شدن
    const shouldRun =
      habit.frequency === "Daily" ||
      (habit.frequency === "Weekly" &&
        habit.selectedDays?.includes(dayName));

    if (!shouldRun) return [];

    // ✅ تبدیل reminder → task
    return (habit.reminders || []).map((time: string) => {
      const isCompleted = completions.some(
        (c) =>
        { const match =
           c.habitId === habit.id &&
          c.date === selectedDate &&
          c.time === time
          if(match){
            console.log("Match true", c)
          }
          return match;
        }

      );
completions.forEach((c) => {
  console.log("COMPARE:", {
    c_habitId: c.habitId,
    habitId: habit.id,
    c_date: c.date,
    selectedDate,
    c_time: c.time,
    time,
  });
});
      const task = {
        id: `${habit.id}-${selectedDate}-${time}`,
        habitId: habit.id,
        habitName: habit.name,
        date: selectedDate,
        time,
        completed: isCompleted,
        startDate: habit.startDate,
      };
      return{...task};
    });
  });
};

export default selectTasksByDate;