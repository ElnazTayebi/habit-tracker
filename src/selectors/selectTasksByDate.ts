type Task = {
  id: string;
  habitId: string;
  habitName: string;
  date: string;
  time: string;
  completed: boolean;
  startDate: string;
};

const selectTasksByDate = (habits: any[], selectedDate: string): Task[] => {
  return (habits || []).flatMap((habit) => {
    if (!Array.isArray(habit.scheduledInstances)) return [];

    return habit.scheduledInstances
      .filter((instance: any) => instance.date === selectedDate)
      .map((instance: any) => ({
        id: instance.id, // ✅ از instance
        habitId: habit.id,
        habitName: habit.name,
        date: instance.date,
        time: instance.time,
        completed: instance.completed,
        startDate: habit.statrtDate,
      }));
  });
};

export default selectTasksByDate;