import { useTranslation } from "react-i18next";
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
import { FiTrash2 } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import { format } from "date-fns";

export const ExpenseList = () => {
  const { t } = useTranslation();
  const { expenses, loading, deleteExpense } = useExpenses();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("recentExpenses")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentExpenses")}</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t("noExpenses")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("title")}</TableHead>
                  <TableHead>{t("category")}</TableHead>
                  <TableHead>{t("amount")}</TableHead>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.slice(0, 10).map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{expense.title}</div>
                        {expense.description && (
                          <div className="text-sm text-muted-foreground">
                            {expense.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t(expense.category)}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {t("currency")}
                      {expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(expense.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <TbEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
