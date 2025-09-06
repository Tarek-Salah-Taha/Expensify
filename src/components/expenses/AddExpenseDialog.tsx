import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useExpenses } from "@/hooks/useExpenses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import { EXPENSE_CATEGORIES } from "@/types/expense";

// Simple Arabic Calendar Component
const ArabicDatePicker = ({ value, onChange, isArabic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : new Date()
  );

  // Arabic months
  const arabicMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const formatDisplayDate = (date) => {
    if (!isArabic) {
      return date.toISOString().split("T")[0];
    }

    const day = date.getDate();
    const month = arabicMonths[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange(date.toISOString().split("T")[0]);
    setIsOpen(false);
  };

  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    const current = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
      if (current > lastDay && weekDays[6].getMonth() !== month) break;
    }

    return calendar;
  };

  const changeMonth = (increment) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  if (!isArabic) {
    return (
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    );
  }

  return (
    <div className="relative">
      <div
        className="flex items-center justify-between w-full px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span dir="rtl" className="text-right flex-1">
          {value ? formatDisplayDate(new Date(value)) : "اختر التاريخ"}
        </span>
        <FaCalendarAlt className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-80 mt-1 bg-popover border border-border rounded-md shadow-lg p-4"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-accent rounded"
            >
              ❮
            </button>
            <div className="text-center font-medium">
              {arabicMonths[selectedDate.getMonth()]}{" "}
              {selectedDate.getFullYear()}
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-accent rounded"
            >
              ❯
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {[
              "الأحد",
              "الاثنين",
              "الثلاثاء",
              "الأربعاء",
              "الخميس",
              "الجمعة",
              "السبت",
            ].map((day) => (
              <div key={day} className="text-center text-xs font-medium p-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendar()
              .flat()
              .map((date, index) => {
                const isCurrentMonth =
                  date.getMonth() === selectedDate.getMonth();
                const isSelected =
                  value &&
                  new Date(value).toDateString() === date.toDateString();
                const isToday =
                  new Date().toDateString() === date.toDateString();

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className={`
                    p-2 text-sm rounded hover:bg-accent hover:text-accent-foreground
                    ${!isCurrentMonth ? "text-muted-foreground" : ""}
                    ${isSelected ? "bg-primary text-primary-foreground" : ""}
                    ${isToday && !isSelected ? "bg-accent" : ""}
                  `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-4 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={() => handleDateSelect(new Date())}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded"
            >
              اليوم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AddExpenseDialog = () => {
  const { t, i18n } = useTranslation();
  const { addExpense } = useExpenses();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const isArabic = i18n.language === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addExpense({
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description,
      });

      setFormData({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FaPlus className={`h-4 w-4 ${isArabic ? "ml-2" : "mr-2"}`} />
          {t("addExpense")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle>{t("addExpense")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{t("amount")}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t("category")}</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("category")} />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {t(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{t("date")}</Label>
            <ArabicDatePicker
              value={formData.date}
              onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
              isArabic={isArabic}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("description")} ({t("optional")})
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              placeholder={t("enterDescription")}
            />
          </div>

          <div
            className={`flex gap-2 ${
              isArabic ? "justify-start" : "justify-end"
            }`}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("loading") : t("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
