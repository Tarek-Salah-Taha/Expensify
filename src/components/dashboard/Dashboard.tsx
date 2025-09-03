import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useExpenses } from "@/hooks/useExpenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FiPieChart,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";

import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseCharts } from "@/components/charts/ExpenseCharts";

export const Dashboard = () => {
  const { t } = useTranslation();
  const { expenses, loading } = useExpenses();

  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const thisMonthTotal = thisMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return {
      totalExpenses,
      thisMonthTotal,
      expenseCount: expenses.length,
      thisMonthCount: thisMonthExpenses.length,
    };
  }, [expenses]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        <AddExpenseDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalExpenses")}
            </CardTitle>
            <FiDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t("currency")}
              {stats.totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.expenseCount} expenses total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("thisMonth")}
            </CardTitle>
            <FiCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t("currency")}
              {stats.thisMonthTotal.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.thisMonthCount} expenses this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average per Expense
            </CardTitle>
            <FiTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t("currency")}
              {stats.expenseCount > 0
                ? (stats.totalExpenses / stats.expenseCount).toFixed(2)
                : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Per expense average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categories Used
            </CardTitle>
            <FiPieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(expenses.map((e) => e.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Different categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <ExpenseCharts />

      {/* Recent Expenses Table */}
      <ExpenseList />
    </div>
  );
};
