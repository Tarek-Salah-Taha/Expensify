import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
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
import { FiTrash2 } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import { format } from "date-fns";
import { Expense, ExpenseFormData } from "@/types/expense";

// Categories for the expense form
const EXPENSE_CATEGORIES = [
  "food",
  "transport",
  "entertainment",
  "shopping",
  "healthcare",
  "utilities",
  "education",
  "travel",
  "other",
];

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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    description: expense.description || "",
  });

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
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
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
            <Label htmlFor="edit-date">{t("date")}</Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
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

          <div className="flex gap-3 pt-4">
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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

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
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t("cancel") || "Cancel"}
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
  const { t } = useTranslation();
  const { expenses, loading, deleteExpense, updateExpense } = useExpenses();

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
    <Card className="border rounded-lg shadow-sm overflow-hidden" dir="auto">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="text-xl font-semibold">
          {t("recentExpenses")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {expenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t("noExpenses")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <Table className="hidden md:table">
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="font-semibold text-start">
                    {t("title")}
                  </TableHead>
                  <TableHead className="font-semibold text-start">
                    {t("category")}
                  </TableHead>
                  <TableHead className="font-semibold text-start">
                    {t("amount")}
                  </TableHead>
                  <TableHead className="font-semibold text-start">
                    {t("date")}
                  </TableHead>
                  <TableHead className="font-semibold text-end">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.slice(0, 10).map((expense) => (
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
                      {format(new Date(expense.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex justify-end gap-2">
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {expenses.slice(0, 10).map((expense) => (
                <div
                  key={expense.id}
                  className="border rounded-lg p-4 bg-card shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 me-3">
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
                    <div className="text-end">
                      <span className="text-sm text-muted-foreground">
                        {t("date")}:
                      </span>
                      <p>{format(new Date(expense.date), "MMM dd, yyyy")}</p>
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
                        <TbEdit className="h-4 w-4 me-1" />
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
                        <FiTrash2 className="h-4 w-4 me-1" />
                        {t("delete")}
                      </Button>
                    </DeleteConfirmationDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
