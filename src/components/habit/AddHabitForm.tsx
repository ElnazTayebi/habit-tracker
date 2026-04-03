import { useEffect, useRef, useState } from "react";
import { Bell, Calendar, Check, ChevronDown, Clock, Plus, X } from "lucide-react";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Button from "../ui/Button";
import { useHabitStore } from "../../store/habit/useHabitStore";

const daysOfWeek = [
  { label: "Su", value: "Sun" },
  { label: "Mo", value: "Mon" },
  { label: "Tu", value: "Tue" },
  { label: "We", value: "Wed" },
  { label: "Th", value: "Thu" },
  { label: "Fr", value: "Fri" },
  { label: "Sa", value: "Sat" },
];

const AddHabitForm = () => {
  const {
    habitName,
    setHabitName,
    amount,
    setAmount,
    unit,
    setUnit,
    selectedCategory,
    setSelectedCategory,
    categories,
    frequency,
    setFrequency,
    selectedDays,
    setSelectedDays,
    reminders,
    setReminders,
    startDate,
    setStartDate,
    resetForm,
    saveHabit,
    editingHabit,
    setEditingHabit,
  } = useHabitStore();

  const [isCatOpen, setIsCatOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editingHabit) return;

    setHabitName(editingHabit.name);
    setAmount(editingHabit.goalAmount);
    setUnit(editingHabit.goalUnit);
    setSelectedCategory(editingHabit.category);
    setFrequency(editingHabit.frequency);
    setSelectedDays(editingHabit.selectedDays || []);
    setReminders(editingHabit.reminders || []);
    setStartDate(editingHabit.startDate || "");
  }, [
    editingHabit,
    setHabitName,
    setAmount,
    setUnit,
    setSelectedCategory,
    setFrequency,
    setSelectedDays,
    setReminders,
    setStartDate,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(event.target as Node)) {
        setIsCatOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays(
      selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day]
    );
  };

  const addReminder = () => {
    setFormError("");

    const hasEmptyReminder = reminders.some((r) => !r.trim());
    if (hasEmptyReminder) {
      setFormError("ابتدا ساعت خالی reminder را کامل کن.");
      return;
    }

    setReminders([...reminders, ""]);
  };

  const updateReminder = (index: number, value: string) => {
    setFormError("");

    const duplicateIndex = reminders.findIndex(
      (time, i) => i !== index && time === value && value.trim() !== ""
    );

    if (duplicateIndex !== -1) {
      setFormError("یک سا");
      return;
    }

    const updated = [...reminders];
    updated[index] = value;
    setReminders(updated);
  };

  const removeReminder = (index: number) => {
    setFormError("");
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const normalizeReminders = (times: string[]) => {
    return [...new Set(times.map((t) => t.trim()).filter(Boolean))].sort();
  };

  const validateForm = () => {
    if (!habitName.trim()) {
      return "نام عادت الزامی است.";
    }

    if (!selectedCategory) {
      return "لطفاً یک دسته‌بندی انتخاب کن.";
    }

    if (!startDate) {
      return "لطفاً تاریخ شروع را مشخص کن.";
    }

    if (frequency === "Weekly" && selectedDays.length === 0) {
      return "برای حالت هفتگی باید حداقل یک روز انتخاب شود.";
    }

    const cleanReminders = reminders.map((r) => r.trim()).filter(Boolean);
    const uniqueReminders = new Set(cleanReminders);

    if (uniqueReminders.size !== cleanReminders.length) {
      return "ساعت reminder تکراری مجاز نیست.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const cleanReminders = normalizeReminders(reminders);
    setReminders(cleanReminders);

    try {
      const isEdit = !!editingHabit;

      await saveHabit();

      resetForm();
      setEditingHabit(null);
      setIsCatOpen(false);
      setFormError("");

      alert(isEdit ? "Habit updated successfully 🚀" : "Habit saved successfully 🚀");
    } catch (error) {
      console.error(error);
      setFormError("ذخیره عادت با خطا مواجه شد.");
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingHabit(null);
    setIsCatOpen(false);
    setFormError("");
  };

  const safeReminders = Array.isArray(reminders) ? reminders : [];

  const safeDays = Array.isArray(selectedDays) ? selectedDays : [];

  return (
    <div className="max-w-md mx-auto mt-6 p-6 rounded-[var(--radius)] bg-[rgb(var(--card))] border border-[rgb(var(--border))] shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-white">
          <Check size={16} />
        </div>
        <h1 className="font-semibold text-lg">HabitTrack</h1>
      </div>

      <h2 className="text-xl font-semibold mb-6">
        {editingHabit ? "Edit Habit" : "Add Habit"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <Label className="mb-1.5">Habit Name</Label>
          <Input
            placeholder="e.g. Morning Meditation"
            value={habitName}
            onChange={(e) => {
              setFormError("");
              setHabitName(e.target.value);
            }}
            className="w-full rounded-xl bg-[rgb(var(--card-muted))] border border-[rgb(var(--border))] focus:border-[rgb(var(--primary))]"
          />
        </div>

        <div ref={catRef} className="relative">
          <Label className="mb-1.5">Category</Label>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 justify-between"
            onClick={() => setIsCatOpen((prev) => !prev)}
          >
            <span>{selectedCategory?.name || "Select category"}</span>
            <ChevronDown size={16} />
          </Button>

          {isCatOpen && (
            <div className="absolute z-10 mt-2 w-full overflow-hidden bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-[var(--radius)] shadow">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsCatOpen(false);
                    setFormError("");
                  }}
                  className="w-full text-left px-3 py-3 hover:bg-[rgb(var(--card-muted))] transition"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="e.g. 30, 1, 5..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-[rgb(var(--card-muted))] border border-[rgb(var(--border))] focus:border-[rgb(var(--primary))]"
            />
          </div>

          <div className="space-y-2">
            <Label>Unit</Label>
            <Input
              placeholder="e.g. mins, pages, km..."
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-[rgb(var(--card-muted))] border border-[rgb(var(--border))] focus:border-[rgb(var(--primary))]"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="font-semibold">Frequency</Label>

          <div className="flex p-1 bg-[rgb(var(--card-muted))] rounded-xl">
            <button
              type="button"
              onClick={() => {
                setFrequency("Daily");
                setFormError("");
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                frequency === "Daily"
                  ? "bg-[rgb(var(--card))] text-[rgb(var(--primary))] shadow-sm"
                  : "text-[rgb(var(--muted))]"
              }`}
            >
              Daily
            </button>

            <button
              type="button"
              onClick={() => {
                setFrequency("Weekly");
                setFormError("");
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                frequency === "Weekly"
                  ? "bg-[rgb(var(--card))] text-[rgb(var(--primary))] shadow-sm"
                  : "text-[rgb(var(--muted))]"
              }`}
            >
              Weekly
            </button>
          </div>

          {frequency === "Weekly" && (
            <div className="flex justify-between gap-1">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => {
                    toggleDay(day.value);
                    setFormError("");
                  }}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border-2 ${
                    safeDays.includes(day.value)
                      ? "bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-white"
                      : "bg-[rgb(var(--card))] border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="font-semibold flex items-center gap-2">
              <Bell size={16} className="text-[rgb(var(--muted))]" />
              Reminders
            </Label>
          </div>

          <div className="space-y-2">
            {safeReminders.map((time, index) => (
              <div key={`${index}-${time}`} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Clock
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateReminder(index, e.target.value)}
                    className="w-full h-11 pl-9 pr-4 rounded-xl bg-[rgb(var(--card-muted))] border border-[rgb(var(--border))] focus:outline-none focus:border-[rgb(var(--primary))] text-sm font-medium text-[rgb(var(--text))] transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeReminder(index)}
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-[rgb(var(--muted))] hover:text-[rgb(var(--danger))] hover:bg-red-50 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addReminder}
            className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:border-[rgb(var(--primary))] hover:text-[rgb(var(--primary))] transition-all text-sm font-bold"
          >
            <Plus size={16} />
            Add Reminder
          </button>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold flex items-center gap-2">
            <Calendar size={16} className="text-[rgb(var(--muted))]" />
            Start Date
          </Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setFormError("");
            }}
            className="w-full h-12 px-4 rounded-xl bg-[rgb(var(--card-muted))] border border-[rgb(var(--border))] focus:border-[rgb(var(--primary))]"
          />
        </div>

        {formError && (
          <div className="rounded-xl border border-[rgb(var(--danger))] bg-red-50 px-3 py-2 text-sm text-[rgb(var(--danger))]">
            {formError}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <Button type="submit" variant="primary" className="w-full">
            {editingHabit ? "Update Habit" : "Save Habit"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddHabitForm;