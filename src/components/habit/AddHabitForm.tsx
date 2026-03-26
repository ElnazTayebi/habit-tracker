const AddHabitForm = () => {
return(
    <div className="w-full max-w-sm space-y-6 p-6 bg-[rgb(var(--card))] rounded-xl shadow">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                    ✔
                </div>
                <span className="font-semibold text-lg">HabitTrack</span>
            </div>
              <h2 className="mt-6 text-xl ">
                Add Habit
            </h2>
    </div>
)
}
export default AddHabitForm;