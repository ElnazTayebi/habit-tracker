import { useState, useRef, useEffect } from "react";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Button from "../ui/Button";
import { Check, X } from "lucide-react";
import { useHabitStore } from "../../store/habit/useHabitStore";

const daysOfWeek = [
    { label: "S", value: "Sun" },
    { label: "M", value: "Mon" },
    { label: "T", value: "Tue" },
    { label: "W", value: "Wed" },
    { label: "T", value: "Thu" },
    { label: "F", value: "Fri" },
    { label: "S", value: "Sat" },
];

const AddHabitForm = () => {
    const {
        habitName, setHabitName,
        amount, setAmount,
        unit, setUnit,
        selectedCategory, setSelectedCategory,
        categories,
        frequency, setFrequency,
        selectedDays, setSelectedDays,
        reminders, setReminders,
        startDate, setStartDate,
        resetForm,
        saveHabit,
        editingHabit,
        setEditingHabit
    } = useHabitStore();

    const [isCatOpen, setIsCatOpen] = useState(false);
    const catRef = useRef<HTMLDivElement>(null);


    /*   useEffect(() => {
        if (!editingHabit) resetForm();
      }, []); */

    useEffect(() => {
        if (editingHabit) {
            setHabitName(editingHabit.name);
            setAmount(editingHabit.goalAmount);
            setUnit(editingHabit.goalUnit);
            setSelectedCategory(editingHabit.category);
            setFrequency(editingHabit.frequency);
            setSelectedDays(editingHabit.selectedDays || []);
            setReminders(editingHabit.reminders || []);
            setStartDate(editingHabit.startDate);
        } else {
            resetForm();
        }
    }, [editingHabit]);
    const toggleDay = (day: string) => {
        setSelectedDays(
            selectedDays.includes(day)
                ? selectedDays.filter(d => d !== day)
                : [...selectedDays, day]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isEdit = !!editingHabit;

        await saveHabit();

        resetForm();
        setEditingHabit(null);

        alert(isEdit ? "Updated 🚀" : "Saved 🚀");
    };

    return (
        <div className="max-w-md mx-auto mt-6 p-6 rounded-[var(--radius)] bg-[rgb(var(--card))] border border-[rgb(var(--border))] shadow-sm">

            {/* HEADER */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-white">
                    <Check size={16} />
                </div>
                <h1 className="font-semibold text-lg">HabitTrack</h1>
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-semibold mb-6">
                {editingHabit ? "Edit Habit" : "Add Habit"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* NAME */}
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Habit Name</Label>
                    <Input
                    placeholder="e.g. Morning Meditation"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
                        

                    />
                </div>

                {/* CATEGORY */}
                <div ref={catRef} className="relative">
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Category</Label>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 justify-between text-left"
                        onClick={() => setIsCatOpen(!isCatOpen)}
                        
                    >
                        {selectedCategory?.name || "Select category"}
                        <span className="text-gray-400">▼</span>
                    </Button>

                    {isCatOpen && (
                        <div className="absolute z-10 mt-2 w-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-[var(--radius)] shadow">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setIsCatOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-3 hover:bg-[rgb(var(--card-muted))]"
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* GOAL */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Amount</Label>
                        <Input value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Unit</Label>
                        <Input value={unit} onChange={(e) => setUnit(e.target.value)} 
                        className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
                        />
                    </div>
                </div>

                {/* FREQUENCY */}
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Frequency</Label>
                    <div className="flex gap-2 mt-2">
                        <Button
                            type="button"
                            variant={frequency === "Daily" ? "primary" : "outline"}
                            onClick={() => setFrequency("Daily")}
                            className="px-6 py-2 rounded-[10px]"
                        >
                            Daily
                        </Button>

                        <Button
                            type="button"
                            variant={frequency === "Weekly" ? "primary" : "outline"}
                            onClick={() => setFrequency("Weekly")}
                            className="px-6 py-2 rounded-[10px]"
                        >
                            Weekly
                        </Button>
                    </div>
                </div>

                {/* DAYS */}
                {frequency === "Weekly" && (
                    <div className="flex gap-2 flex-wrap">
                        {daysOfWeek.map(d => (
                            <Button
                                key={d.value}
                                type="button"
                                variant={selectedDays.includes(d.value) ? "primary" : "outline"}
                                onClick={() => toggleDay(d.value)}
                            >
                                {d.label}
                            </Button>
                        ))}
                    </div>
                )}

                {/* REMINDERS */}
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Reminders</Label>

                    {reminders.map((r, i) => (
                        <div className="flex items-center gap-2" >
                        <Input
                            key={i}
                            type="time"
                            value={r}
                            onChange={(e) => {
                                const copy = [...reminders];
                                copy[i] = e.target.value;
                                setReminders(copy);
                            }}
                             className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
                        />
                        <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                        const filtered = reminders.filter((_, index) => index !== i);
                        setReminders(filtered);
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                    <X size={18} />
                </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setReminders([...reminders, "12:00"])}
                    >
                        + Add reminder
                    </Button>
                </div>

                {/* DATE */}
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Start Date</Label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                         className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
                    />
                </div>
                <div className="flex gap-2 mt-2">
                    {/* SUBMIT */}
                    <Button type="submit" variant="primary" className="w-full">
                        {editingHabit ? "Update Habit" : "Save Habit"}
                    </Button>
                    {/* Cancel */}
                    <Button type="button" variant="outline" className="w-full"
                    >
                        cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddHabitForm;