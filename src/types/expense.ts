export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export const EXPENSE_CATEGORIES = [
  "food",
  "transport",
  "entertainment",
  "health",
  "shopping",
  "bills",
  "other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
