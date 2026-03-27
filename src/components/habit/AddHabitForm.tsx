import { useState, useRef, useEffect } from "react";
import Input from "../ui/Input";
import Label from "../ui/Label";
import { ChevronDown, Plus, Check, Clock, Calendar } from "lucide-react";

// --- Types ---
interface Category {
  id: string;
  name: string;
  color: string;
}

const initialCategories: Category[] = [
  { id: "1", name: "Wellness", color: "rgb(var(--success))" },
  { id: "2", name: "Education", color: "rgb(var(--warning))" },
  { id: "3", name: "Mindfulness", color: "rgb(var(--primary))" },
];

const colors = [
  "rgb(239 68 68)", "rgb(59 130 246)", "rgb(34 197 94)", "rgb(234 179 8)", "rgb(99 102 241)", 
  "rgb(6 182 212)", "rgb(236 72 153)", "rgb(99 102 241)", "rgb(20 184 166)", "rgb(244 63 94)"
];

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
    const [habitName, setHabitName] = useState("");
    const [amount, setAmount] = useState("");
    const [unit, setUnit] = useState("");

    // --- Category States ---
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isAddingNewCat, setIsAddingNewCat] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategories[0]);
    const [newCatName, setNewCatName] = useState("");
    const [newCatColor, setNewCatColor] = useState(colors[4]);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    
    // --- Frequency States ---
    const [frequency, setFrequency] = useState<"Daily" | "Weekly">("Daily");
    const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Wed", "Fri"]);

    // --- Reminder States ---
    const [reminders, setReminders] = useState<string[]>(["08:00"]);
    const [repeatInterval, setRepeatInterval] = useState("none");

    // --- Start Date State ---
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const catDropdownRef = useRef<HTMLDivElement>(null);
    const colorPickerRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
                setIsCatOpen(false);
            }
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setIsColorPickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const addReminder = () => {
        setReminders([...reminders, "12:00"]);
    };

    const updateReminder = (index: number, value: string) => {
        const newReminders = [...reminders];
        newReminders[index] = value;
        setReminders(newReminders);
    };

    const removeReminder = (index: number) => {
        if (reminders.length > 1) {
            setReminders(reminders.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="w-full max-w-sm space-y-6 p-6 bg-[rgb(var(--card))] rounded-[var(--radius)] shadow-lg mx-auto border border-[rgb(var(--border))]">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[rgb(var(--primary))] bg-opacity-20 flex items-center justify-center">
                    <Check size={16} className="text-[rgb(var(--primary))]" strokeWidth={3} />
                </div>
                <span className="font-bold text-lg text-[rgb(var(--text))]">HabitTrack</span>
            </div>

            <h2 className="mt-6 text-xl font-bold text-[rgb(var(--text))]">
                Add Habit
            </h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Habit Name */}
                <div className="space-y-2">
                    <Label htmlFor="habitName" className="text-[rgb(var(--text))]">Habit Name</Label>
                    <Input
                        id="habitName"
                        placeholder="e.g. Morning Meditation"
                        className="w-full p-3 rounded-[var(--radius)] bg-[rgb(var(--card-muted))] border-none text-[rgb(var(--text))] placeholder:text-[rgb(var(--muted))]"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                    />
                </div>

                {/* Category (Hybrid Input) */}
                <div className="space-y-2" ref={catDropdownRef}>
                    <Label className="text-[rgb(var(--text))]">Category</Label>
                    <div className="relative">
                        {!isAddingNewCat ? (
                            <button
                                type="button"
                                onClick={() => setIsCatOpen(!isCatOpen)}
                                className="w-full flex items-center justify-between p-3 rounded-[var(--radius)] bg-[rgb(var(--card-muted))] text-sm text-left text-[rgb(var(--text))]"
                            >
                                <div className="flex items-center gap-3">
                                    {selectedCategory && (
                                        <div 
                                            className="w-3 h-3 rounded-full" 
                                            style={{ backgroundColor: selectedCategory.color }}
                                        />
                                    )}
                                    <span>{selectedCategory ? selectedCategory.name : "Select category"}</span>
                                </div>
                                <ChevronDown size={16} className="text-[rgb(var(--muted))]" />
                            </button>
                        ) : (
                            <div className="relative flex items-center">
                                <div className="absolute left-3 z-10" ref={colorPickerRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                                        className="w-5 h-5 rounded-full border-2 border-[rgb(var(--card))] shadow-sm"
                                        style={{ backgroundColor: newCatColor }}
                                    />
                                    {isColorPickerOpen && (
                                        <div className="absolute top-full left-0 mt-2 p-2 bg-[rgb(var(--card))] rounded-[var(--radius)] shadow-xl border border-[rgb(var(--border))] grid grid-cols-5 gap-1 z-20">
                                            {colors.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewCatColor(color);
                                                        setIsColorPickerOpen(false);
                                                    }}
                                                    className="w-5 h-5 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: color }}
                                                >
                                                    {newCatColor === color && <Check size={10} className="text-white" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Input
                                    type="text"
                                    autoFocus
                                    placeholder="Category Name"
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    className="w-full p-3 pl-10 rounded-[var(--radius)] bg-[rgb(var(--card-muted))] border-none text-[rgb(var(--text))]"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingNewCat(false);
                                        setSelectedCategory(initialCategories[0]);
                                    }}
                                    className="absolute right-3 text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--primary))]"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {isCatOpen && !isAddingNewCat && (
                            <div className="absolute z-20 top-full left-0 w-full mt-1 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-[var(--radius)] shadow-lg overflow-hidden">
                                {initialCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setIsCatOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-[rgb(var(--card-muted))] text-sm text-left text-[rgb(var(--text))]"
                                    >
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="flex-1">{cat.name}</span>
                                        {selectedCategory?.id === cat.id && <Check size={14} className="text-[rgb(var(--primary))]" />}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingNewCat(true);
                                        setIsCatOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 p-3 border-t border-[rgb(var(--border))] bg-[rgb(var(--card-muted))] bg-opacity-50 hover:bg-[rgb(var(--card-muted))] text-sm text-[rgb(var(--primary))] font-bold"
                                >
                                    <Plus size={16} />
                                    <span>Add New Category...</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Goal */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[rgb(var(--text))] uppercase tracking-wider">Goal</h4>
                    <div className="flex gap-4">
                        <div className="flex flex-col w-1/3 space-y-2">
                            <Label className="text-xs text-[rgb(var(--muted))]">Amount</Label>
                            <Input
                                type="number"
                                placeholder="30"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="p-3 rounded-[var(--radius)] bg-[rgb(var(--card-muted))] border-none text-[rgb(var(--text))]"
                            />
                        </div>
                        <div className="flex flex-col flex-1 space-y-2">
                            <Label className="text-xs text-[rgb(var(--muted))]">Unit</Label>
                            <Input
                                type="text"
                                placeholder="e.g. minutes"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="p-3 rounded-[var(--radius)] bg-[rgb(var(--card-muted))] border-none text-[rgb(var(--text))]"
                            />
                        </div>
                    </div>
                </div>

                {/* Frequency */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-[rgb(var(--text))]">Frequency</Label>
                        <div className="flex p-1 bg-[rgb(var(--card-muted))] rounded-lg">
                            {(["Daily", "Weekly"] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFrequency(type)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                                        frequency === type
                                            ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] shadow-md"
                                            : "text-[rgb(var(--muted))]"
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    {frequency === "Weekly" && (
                        <div className="flex justify-between items-center animate-in fade-in slide-in-from-top-1 duration-200">
                            {daysOfWeek.map((day) => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => toggleDay(day.value)}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                                        selectedDays.includes(day.value)
                                            ? "bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                                            : "bg-transparent border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                                    }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reminders */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-[rgb(var(--text))]">Reminders</Label>
                        <button 
                            type="button" 
                            onClick={addReminder}
                            className="p-1.5 rounded-full bg-[rgb(var(--primary))] bg-opacity-10 text-[rgb(var(--primary))] hover:bg-opacity-20 transition-all"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {reminders.map((time, index) => (
                            <div key={index} className="flex items-center gap-2 p-2.5 rounded-[var(--radius)] bg-[rgb(var(--card-muted))] border border-[rgb(var(--border))]">
                                <Clock size={14} className="text-[rgb(var(--muted))]" />
                                <input 
                                    type="time" 
                                    value={time}
                                    onChange={(e) => updateReminder(index, e.target.value)}
                                    className="bg-transparent text-sm font-medium outline-none text-[rgb(var(--text))]"
                                />
                                {reminders.length > 1 && (
                                    <button 
                                        type="button"
                                        onClick={() => removeReminder(index)}
                                        className="text-[rgb(var(--muted))] hover:text-[rgb(var(--danger))]"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input 
                            type="checkbox" 
                            id="repeatInterval"
                            checked={repeatInterval !== "none"}
                            onChange={(e) => setRepeatInterval(e.target.checked ? "1h" : "none")}
                            className="w-4 h-4 rounded border-[rgb(var(--border))] text-[rgb(var(--primary))] focus:ring-[rgb(var(--primary))]"
                        />
                        <label htmlFor="repeatInterval" className="text-xs text-[rgb(var(--muted))] font-medium cursor-pointer">
                            Repeat every 1 hour
                        </label>
                    </div>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                    <Label className="text-[rgb(var(--text))]">Start Date</Label>
                    <div className="relative flex items-center">
                        <Calendar size={16} className="absolute left-3 text-[rgb(var(--muted))]" />
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-3 pl-10 rounded-[var(--radius)] bg-[rgb(var(--card-muted))] border-none text-sm text-[rgb(var(--text))]"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-4 rounded-[var(--radius)] bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] font-bold hover:opacity-90 transition-all shadow-lg shadow-[rgb(var(--primary)/0.2)] active:scale-[0.98]"
                >
                    Save Habit
                </button>
            </form>
        </div>
    );
};

export default AddHabitForm;