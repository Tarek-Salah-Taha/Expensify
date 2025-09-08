import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useExpenses } from "@/hooks/useExpenseContext";
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
  const { t, i18n } = useTranslation();
  const { expenses, loading } = useExpenses();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  // Detect direction
  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

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
      <div dir={direction} className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div dir={direction} className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <AddExpenseDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Expenses */}
        <Card
          onClick={() => setActiveCard("total")}
          className={`cursor-pointer transition-all ${
            activeCard === "total"
              ? "ring-2 ring-primary shadow-md bg-primary/10"
              : "hover:ring-2 hover:ring-primary/50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <FiDollarSign
                className={`h-4 w-4 text-muted-foreground text-emerald-600 ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              <CardTitle className="text-base font-medium">
                {t("totalExpenses")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {stats.totalExpenses.toFixed(2)} {t("currency")}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("expensesTotal")}: {stats.expenseCount}
            </p>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card
          onClick={() => setActiveCard("month")}
          className={`cursor-pointer transition-all ${
            activeCard === "month"
              ? "ring-2 ring-primary shadow-md bg-primary/10"
              : "hover:ring-2 hover:ring-primary/50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <FiCalendar
                className={`h-4 w-4 text-muted-foreground text-red-600 ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              <CardTitle className="text-base font-medium">
                {t("thisMonth")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {stats.thisMonthTotal.toFixed(2)} {t("currency")}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("expensesThisMonth")}: {stats.thisMonthCount}
            </p>
          </CardContent>
        </Card>

        {/* Average per Expense */}
        <Card
          onClick={() => setActiveCard("average")}
          className={`cursor-pointer transition-all ${
            activeCard === "average"
              ? "ring-2 ring-primary shadow-md bg-primary/10"
              : "hover:ring-2 hover:ring-primary/50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <FiTrendingUp
                className={`h-4 w-4 text-muted-foreground text-yellow-600 ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              <CardTitle className="text-base font-medium">
                {t("averagePerExpense")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {stats.expenseCount > 0
                ? (stats.totalExpenses / stats.expenseCount).toFixed(2)
                : "0.00"}{" "}
              {t("currency")}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("perExpenseAverage")}
            </p>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card
          onClick={() => setActiveCard("categories")}
          className={`cursor-pointer transition-all ${
            activeCard === "categories"
              ? "ring-2 ring-primary shadow-md bg-primary/10"
              : "hover:ring-2 hover:ring-primary/50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <FiPieChart
                className={`h-4 w-4 text-muted-foreground text-violet-600 ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              <CardTitle className="text-base font-medium">
                {t("categoriesUsed")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {new Set(expenses.map((e) => e.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("differentCategories")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <ExpenseCharts />
      </div>

      {/* Recent Expenses Table */}
      <div className="overflow-x-auto">
        <ExpenseList />
      </div>
    </div>
  );
};
