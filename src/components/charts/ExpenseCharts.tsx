import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useExpenses } from "@/hooks/useExpenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
  "hsl(var(--destructive))",
  "hsl(var(--card))",
  "hsl(var(--border))",
];

export const ExpenseCharts = () => {
  const { t, i18n } = useTranslation();
  const { expenses, loading } = useExpenses();
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenSize.width < 640;
  const isTablet = screenSize.width < 1024;

  // Custom label rendering function with better mobile handling
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    category,
    percent,
    index,
  }) => {
    // No labels on mobile to prevent overcrowding
    if (isMobile) return null;

    // Hide labels for very small slices
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + (isTablet ? 20 : 30);

    if (i18n.language === "ar") {
      // Arabic (RTL) layout
      let x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      const isRightSide = x > cx;

      if (isRightSide) {
        x = x - 5;
      } else {
        x = x + 5;
      }

      return (
        <text
          x={x}
          y={y}
          fill="hsl(var(--foreground))"
          textAnchor={isRightSide ? "end" : "start"}
          dominantBaseline="central"
          fontSize={isTablet ? 10 : 12}
          className="font-medium"
        >
          {`${(percent * 100).toFixed(0)}% ${category}`}
        </text>
      );
    } else {
      // English (LTR) layout
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      const isRightSide = x > cx;

      return (
        <text
          x={x}
          y={y}
          fill="hsl(var(--foreground))"
          textAnchor={isRightSide ? "start" : "end"}
          dominantBaseline="central"
          fontSize={isTablet ? 10 : 12}
          className="font-medium"
        >
          {`${category} ${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
  };

  const categoryData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category: t(category),
      amount,
      fill: COLORS[
        Object.keys(categoryTotals).indexOf(category) % COLORS.length
      ],
    }));
  }, [expenses, t]);

  const monthlyData = useMemo(() => {
    // Arabic month names (Gregorian calendar)
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

    const monthlyTotals = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      let month: string;

      if (i18n.language === "ar") {
        // Use custom Arabic month names for Gregorian calendar
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        month = `${arabicMonths[monthIndex]} ${year}`;
      } else {
        // Use English locale
        month = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }

      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Sort entries by date
    return Object.entries(monthlyTotals)
      .map(([month, amount]) => ({
        month,
        amount,
        // Create sortable date for proper ordering
        sortDate:
          expenses.find((e) => {
            const date = new Date(e.date);
            const testMonth =
              i18n.language === "ar"
                ? `${arabicMonths[date.getMonth()]} ${date.getFullYear()}`
                : date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  });
            return testMonth === month;
          })?.date || "",
      }))
      .sort((a, b) => {
        const dateA = new Date(a.sortDate);
        const dateB = new Date(b.sortDate);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6) // Last 6 months
      .map(({ month, amount }) => ({ month, amount }));
  }, [expenses, i18n.language]);

  const chartConfig = {
    amount: {
      label: t("amount"),
    },
  };

  if (loading) {
    return (
      <div className="space-y-4 lg:grid lg:gap-4 lg:grid-cols-2 lg:space-y-0">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32 sm:h-6 sm:w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] sm:h-[250px] lg:h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32 sm:h-6 sm:w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] sm:h-[250px] lg:h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{t("charts")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {t("noExpenses")}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 lg:grid lg:gap-4 lg:grid-cols-2 lg:space-y-0">
      {/* Category Distribution */}
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg mb-1">
            {t("expensesByCategory")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 lg:p-6">
          <ChartContainer
            config={chartConfig}
            className="w-full h-[200px] sm:h-[280px] lg:h-[320px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                margin={{
                  top: isMobile ? 5 : 20,
                  right: isMobile ? 5 : 30,
                  bottom: isMobile ? 5 : 20,
                  left: isMobile ? 5 : 30,
                }}
              >
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={isMobile ? "60%" : isTablet ? "55%" : "50%"}
                  innerRadius={isMobile ? "25%" : "0%"}
                  dataKey="amount"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg p-2 sm:p-3 shadow-md text-xs sm:text-sm max-w-[160px] sm:max-w-[220px]">
                          <p className="font-medium truncate text-xs sm:text-sm">
                            {data.category}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {t("currency")}
                            {data.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {(
                              (data.amount /
                                categoryData.reduce(
                                  (sum, item) => sum + item.amount,
                                  0
                                )) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg mb-1">
            {t("monthlySpending")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 lg:p-6">
          <ChartContainer
            config={chartConfig}
            className="w-full h-[200px] sm:h-[280px] lg:h-[320px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: isMobile ? 5 : 20,
                  right:
                    i18n.language === "ar"
                      ? isMobile
                        ? 10
                        : 40
                      : isMobile
                      ? 5
                      : 30,
                  left:
                    i18n.language === "ar"
                      ? isMobile
                        ? 20
                        : 80
                      : isMobile
                      ? 10
                      : 20,
                  bottom: isMobile ? 30 : 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: isMobile ? 8 : isTablet ? 10 : 12,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                  tickFormatter={(value) => {
                    if (isMobile) {
                      const parts = value.split(" ");
                      // For Arabic, keep first 3 characters; for English, keep first 3 characters
                      return parts[0].slice(0, 3);
                    }
                    return value;
                  }}
                  interval={0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 50 : 40}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{
                    fontSize: isMobile ? 8 : isTablet ? 10 : 12,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                  tickFormatter={(value) => {
                    if (isMobile) {
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                      if (value >= 100) return Math.round(value).toString();
                      return value.toFixed(0);
                    }
                    return value.toLocaleString();
                  }}
                  width={
                    i18n.language === "ar"
                      ? isMobile
                        ? 35
                        : 70
                      : isMobile
                      ? 25
                      : 50
                  }
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 sm:p-3 shadow-md text-xs sm:text-sm max-w-[140px] sm:max-w-none">
                          <p className="font-medium text-xs sm:text-sm">
                            {label}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {t("currency")}
                            {Number(payload[0].value || 0).toFixed(2)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--primary))"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={isMobile ? 30 : isTablet ? 40 : 60}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
