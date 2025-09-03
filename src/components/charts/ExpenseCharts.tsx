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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Update on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Custom label rendering function
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
    // Safety check: absolutely no labels on mobile
    if (isMobile) return null;

    // Hide labels for very small slices to reduce clutter
    if (percent < 0.03) return null;

    const RADIAN = Math.PI / 180;

    if (i18n.language === "ar") {
      // Arabic (RTL) layout - different positioning logic
      const radius = outerRadius + 35;
      let x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      // Determine if label is on the right or left side of the chart
      const isRightSide = x > cx;

      // Adjust positioning for RTL - flip the x positioning
      if (isRightSide) {
        x = x - 10; // Pull right-side labels closer to center
      } else {
        x = x + 10; // Push left-side labels further from center
      }

      return (
        <text
          x={x}
          y={y}
          fill="hsl(var(--foreground))"
          textAnchor={isRightSide ? "end" : "start"} // Flipped for RTL
          dominantBaseline="central"
          fontSize={12}
          className="font-medium"
        >
          {`${(percent * 100).toFixed(0)}% ${category}`}
        </text>
      );
    } else {
      // English (LTR) layout
      const radius = outerRadius + 30;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      // Determine if label is on the right or left side of the chart
      const isRightSide = x > cx;

      return (
        <text
          x={x}
          y={y}
          fill="hsl(var(--foreground))"
          textAnchor={isRightSide ? "start" : "end"}
          dominantBaseline="central"
          fontSize={12}
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
    const monthlyTotals = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleDateString("en", {
        month: "short",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyTotals)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  }, [expenses]);

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
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] sm:h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] sm:h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("charts")}</CardTitle>
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            {t("expensesByCategory")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="flex justify-center items-center h-[250px] sm:h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={isMobile ? "70%" : "60%"}
                  innerRadius={isMobile ? "30%" : "0%"}
                  dataKey="amount"
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
                        <div className="bg-background border rounded-lg p-3 shadow-md text-sm max-w-[220px]">
                          <p className="font-medium truncate">
                            {data.category}
                          </p>
                          <p className="text-muted-foreground">
                            {t("currency")}
                            {data.amount.toFixed(2)}
                          </p>
                          {!isMobile && (
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
                          )}
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            {t("monthlySpending")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-[4/3] sm:aspect-video h-[280px] sm:h-[320px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: i18n.language === "ar" ? 40 : 100,
                  left: i18n.language === "ar" ? 80 : 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  tickFormatter={(value) => {
                    if (isMobile) {
                      const parts = value.split(" ");
                      return parts[0].slice(0, 3);
                    }
                    return value;
                  }}
                  interval={0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 60 : 40}
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 9 : 11 }}
                  tickFormatter={(value) => {
                    if (isMobile) {
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                      if (value >= 100) return Math.round(value).toString();
                      return value.toFixed(0);
                    }
                    return value;
                  }}
                  width={isMobile ? 35 : 50}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 sm:p-3 shadow-md text-xs sm:text-sm">
                          <p className="font-medium">{label}</p>
                          <p className="text-muted-foreground">
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
                  maxBarSize={isMobile ? 40 : 60}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
