import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { FiTrash2, FiChevronDown } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { Expense, ExpenseFormData } from "@/types/expense";
import { useExpenses } from "@/hooks/useExpenseContext";

// Categories for the expense form
const EXPENSE_CATEGORIES = [
  "food",
  "transport",
  "entertainment",
  "shopping",
  "health",
  "utilities",
  "education",
  "travel",
  "other",
];

// Pagination constants
const DESKTOP_PAGE_SIZE = 10;
const MOBILE_PAGE_SIZE = 5;

// Simple Arabic Calendar Component
const ArabicDatePicker = ({
  value,
  onChange,
  isArabic,
}: {
  value: string;
  onChange: (date: string) => void;
  isArabic: boolean;
}) => {
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

  const formatDisplayDate = (date: Date) => {
    if (!isArabic) {
      return date.toISOString().split("T")[0];
    }

    const day = date.getDate();
    const month = arabicMonths[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const handleDateSelect = (date: Date) => {
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

  const changeMonth = (increment: number) => {
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
        className={`flex items-center justify-between gap-3 w-full px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md ${
          isArabic ? "flex-row-reverse text-right" : "text-left"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1">
          {value
            ? formatDisplayDate(new Date(value))
            : isArabic
            ? "اختر التاريخ"
            : "Select date"}
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

// Edit Expense Dialog Component
const EditExpenseDialog = ({
  expense,
  onUpdate,
  children,
}: {
  expense: Expense;
  onUpdate: (id: string, formData: ExpenseFormData) => Promise<void>;
  children: React.ReactNode;
}) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    description: expense.description || "",
  });

  const isArabic = i18n.language === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || formData.amount <= 0) {
      return;
    }

    setLoading(true);
    try {
      await onUpdate(expense.id, formData);
      setOpen(false);
    } catch (error) {
      console.error("Error updating expense:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof ExpenseFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("editExpense")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">{t("title")}</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder={t("enterTitle")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">{t("amount")}</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) =>
                handleInputChange("amount", parseFloat(e.target.value) || 0)
              }
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">{t("category")}</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger
                className={`flex ${
                  isArabic ? "flex-row-reverse text-right" : "text-left"
                }`}
              >
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent dir={isArabic ? "rtl" : "ltr"}>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {t(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date">{t("date")}</Label>
            <ArabicDatePicker
              value={formData.date}
              onChange={(date) => handleInputChange("date", date)}
              isArabic={isArabic}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">
              {t("description")} ({t("optional")})
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder={t("enterDescription")}
              rows={3}
            />
          </div>

          <div
            className={`flex gap-3 pt-4 ${
              isArabic ? "justify-start" : "justify-end"
            }`}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={
                loading || !formData.title.trim() || formData.amount <= 0
              }
            >
              {loading ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({
  expense,
  onDelete,
  children,
}: {
  expense: Expense;
  onDelete: (id: string) => Promise<void>;
  children: React.ReactNode;
}) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const isArabic = i18n.language === "ar";

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(expense.id);
    } catch (error) {
      console.error("Error deleting expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteExpense")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteExpenseConfirmation")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isArabic ? "flex-row-reverse" : ""}>
          <AlertDialogCancel disabled={loading}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ExpenseList = () => {
  const { t, i18n } = useTranslation();
  const { expenses, loading, deleteExpense, updateExpense } = useExpenses();
  const isArabic = i18n.language === "ar";

  // Pagination state
  const [desktopVisibleCount, setDesktopVisibleCount] =
    useState(DESKTOP_PAGE_SIZE);
  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(MOBILE_PAGE_SIZE);

  // Reset pagination when expenses change (e.g., after adding/deleting)
  useEffect(() => {
    setDesktopVisibleCount(DESKTOP_PAGE_SIZE);
    setMobileVisibleCount(MOBILE_PAGE_SIZE);
  }, [expenses.length]);

  const handleShowMoreDesktop = () => {
    setDesktopVisibleCount((prev) => prev + DESKTOP_PAGE_SIZE);
  };

  const handleShowMoreMobile = () => {
    setMobileVisibleCount((prev) => prev + MOBILE_PAGE_SIZE);
  };

  const hasMoreDesktop = desktopVisibleCount < expenses.length;
  const hasMoreMobile = mobileVisibleCount < expenses.length;

  if (loading) {
    return (
      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">
            {t("recentExpenses")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="text-xl font-semibold">
          {t("recentExpenses")}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({t("total")}: {expenses.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {expenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t("noExpenses")}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table className="w-full min-w-full">
                <TableHeader className="bg-muted/20">
                  <TableRow>
                    <TableHead className="w-[25%] font-semibold text-start">
                      {t("title")}
                    </TableHead>
                    <TableHead className="w-[15%] font-semibold text-start">
                      {t("category")}
                    </TableHead>
                    <TableHead className="w-[15%] font-semibold text-start">
                      {t("amount")}
                    </TableHead>
                    <TableHead className="w-[20%] font-semibold text-start">
                      {t("date")}
                    </TableHead>
                    <TableHead className="w-[10%] font-semibold text-start">
                      {t("actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.slice(0, desktopVisibleCount).map((expense) => (
                    <TableRow
                      key={expense.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{expense.title}</div>
                          {expense.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {expense.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {t(expense.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <span className="text-foreground font-semibold">
                          {t("currency")}
                          {expense.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex gap-2">
                          <EditExpenseDialog
                            expense={expense}
                            onUpdate={updateExpense}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary"
                            >
                              <TbEdit className="h-4 w-4" />
                            </Button>
                          </EditExpenseDialog>
                          <DeleteConfirmationDialog
                            expense={expense}
                            onDelete={deleteExpense}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </Button>
                          </DeleteConfirmationDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Desktop Show More Button */}
              {hasMoreDesktop && (
                <div className="p-4 border-t bg-muted/10">
                  <Button
                    onClick={handleShowMoreDesktop}
                    variant="ghost"
                    className="w-full flex items-center gap-2 hover:bg-primary/10"
                  >
                    <FiChevronDown className="h-4 w-4" />
                    {t("showMore")} ({expenses.length - desktopVisibleCount}{" "}
                    {t("remaining")})
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {expenses.slice(0, mobileVisibleCount).map((expense) => (
                <div
                  key={expense.id}
                  className="border rounded-lg p-4 bg-card shadow-sm"
                >
                  <div
                    className={`flex items-start mb-3 ${
                      isArabic ? "justify-between" : "justify-between"
                    }`}
                  >
                    <div
                      className={`flex-1 min-w-0 ${isArabic ? "ms-3" : "me-3"}`}
                    >
                      <h3 className="font-semibold text-lg truncate">
                        {expense.title}
                      </h3>
                      {expense.description && (
                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                          {expense.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 flex-shrink-0"
                    >
                      {t(expense.category)}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {t("amount")}:
                      </span>
                      <p className="font-semibold text-foreground">
                        {t("currency")}
                        {expense.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className={isArabic ? "text-start" : "text-end"}>
                      <span className="text-sm text-muted-foreground">
                        {t("date")}:
                      </span>
                      <p>{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex justify-between gap-4 pt-2 border-t">
                    <EditExpenseDialog
                      expense={expense}
                      onUpdate={updateExpense}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 hover:bg-primary/10 hover:text-primary"
                      >
                        <TbEdit
                          className={`h-4 w-4 ${isArabic ? "ms-1" : "me-1"}`}
                        />
                        {t("edit")}
                      </Button>
                    </EditExpenseDialog>
                    <DeleteConfirmationDialog
                      expense={expense}
                      onDelete={deleteExpense}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <FiTrash2
                          className={`h-4 w-4 ${isArabic ? "ms-1" : "me-1"}`}
                        />
                        {t("delete")}
                      </Button>
                    </DeleteConfirmationDialog>
                  </div>
                </div>
              ))}

              {/* Mobile Show More Button */}
              {hasMoreMobile && (
                <div className="pt-2">
                  <Button
                    onClick={handleShowMoreMobile}
                    variant="ghost"
                    className="w-full flex items-center gap-2 hover:bg-primary/10 border border-dashed"
                  >
                    <FiChevronDown className="h-4 w-4" />
                    {t("showMore")} ({expenses.length - mobileVisibleCount}{" "}
                    {t("remaining")})
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
