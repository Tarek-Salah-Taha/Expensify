import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseFormData } from "@/types/expense";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const LOCAL_STORAGE_KEY = "expense-tracker-expenses";

export const useExpenses = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExpenses = useCallback(async () => {
    setLoading(true);

    if (isAuthenticated && supabase && user) {
      // Load from Supabase
      try {
        const { data, error } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });

        if (error) throw error;

        const formattedExpenses: Expense[] = (data || []).map((item) => ({
          id: item.id,
          title: item.title,
          amount: item.amount,
          category: item.category,
          date: item.date,
          description: item.description,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        setExpenses(formattedExpenses);
      } catch (error) {
        console.error("Error loading expenses:", error);
        toast.error(t("error"));
      }
    } else {
      // Load from localStorage
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          const parsedExpenses = JSON.parse(stored);
          setExpenses(Array.isArray(parsedExpenses) ? parsedExpenses : []);
        } catch (error) {
          console.error("Error parsing stored expenses:", error);
          setExpenses([]);
        }
      }
    }

    setLoading(false);
  }, [isAuthenticated, user, t]);

  // Load expenses on mount
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const saveToLocalStorage = useCallback((newExpenses: Expense[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newExpenses));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, []);

  const addExpense = useCallback(
    async (formData: ExpenseFormData) => {
      const newExpense: Expense = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isAuthenticated && supabase && user) {
        // Save to Supabase
        try {
          const { error } = await supabase.from("expenses").insert([
            {
              id: newExpense.id,
              user_id: user.id,
              title: newExpense.title,
              amount: newExpense.amount,
              category: newExpense.category,
              date: newExpense.date,
              description: newExpense.description,
              created_at: newExpense.createdAt,
              updated_at: newExpense.updatedAt,
            },
          ]);

          if (error) throw error;

          // Update state immediately
          setExpenses((prev) => {
            const newExpenses = [newExpense, ...prev];

            return newExpenses;
          });
          toast.success(t("expenseAdded"));
        } catch (error) {
          console.error("Error adding expense:", error);
          toast.error(t("error"));
        }
      } else {
        // Save to localStorage
        try {
          // Calculate the new expenses array
          const newExpenses = [newExpense, ...expenses];

          // Save to localStorage first
          saveToLocalStorage(newExpenses);

          // Then update state with the new array
          setExpenses(newExpenses);

          // Show success message
          toast.success(t("expenseAdded"));
        } catch (error) {
          console.error("Error adding expense to localStorage:", error);
          toast.error(t("error"));
        }
      }
    },
    [isAuthenticated, user, t, saveToLocalStorage, expenses]
  );

  const updateExpense = useCallback(
    async (id: string, formData: ExpenseFormData) => {
      const updatedExpense = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      if (isAuthenticated && supabase && user) {
        // Update in Supabase
        try {
          const { error } = await supabase
            .from("expenses")
            .update({
              title: updatedExpense.title,
              amount: updatedExpense.amount,
              category: updatedExpense.category,
              date: updatedExpense.date,
              description: updatedExpense.description,
              updated_at: updatedExpense.updatedAt,
            })
            .eq("id", id)
            .eq("user_id", user.id);

          if (error) throw error;

          setExpenses((prev) =>
            prev.map((expense) =>
              expense.id === id ? { ...expense, ...updatedExpense } : expense
            )
          );
          toast.success(t("expenseUpdated"));
        } catch (error) {
          console.error("Error updating expense:", error);
          toast.error(t("error"));
        }
      } else {
        // Update in localStorage
        const newExpenses = expenses.map((expense) =>
          expense.id === id ? { ...expense, ...updatedExpense } : expense
        );
        saveToLocalStorage(newExpenses);
        setExpenses(newExpenses);
        toast.success(t("expenseUpdated"));
      }
    },
    [isAuthenticated, user, t, saveToLocalStorage, expenses]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (isAuthenticated && supabase && user) {
        // Delete from Supabase
        try {
          const { error } = await supabase
            .from("expenses")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

          if (error) throw error;

          setExpenses((prev) => prev.filter((expense) => expense.id !== id));
          toast.success(t("expenseDeleted"));
        } catch (error) {
          console.error("Error deleting expense:", error);
          toast.error(t("error"));
        }
      } else {
        // Delete from localStorage
        const newExpenses = expenses.filter((expense) => expense.id !== id);
        saveToLocalStorage(newExpenses);
        setExpenses(newExpenses);
        toast.success(t("expenseDeleted"));
      }
    },
    [isAuthenticated, user, t, saveToLocalStorage, expenses]
  );

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses: loadExpenses,
  };
};
