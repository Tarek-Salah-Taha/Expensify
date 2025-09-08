import React, { createContext, useContext, ReactNode } from "react";
import { useExpenses as useExpensesHook } from "@/hooks/useExpenses";
import { Expense, ExpenseFormData } from "@/types/expense";

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  addExpense: (formData: ExpenseFormData) => Promise<void>;
  updateExpense: (id: string, formData: ExpenseFormData) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  refreshExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({
  children,
}) => {
  const expenseState = useExpensesHook();

  return (
    <ExpenseContext.Provider value={expenseState}>
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;
