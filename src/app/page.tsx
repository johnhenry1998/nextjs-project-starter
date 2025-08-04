"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useExpenses } from "../hooks/useExpenses";
import ExpenseChart from "../components/ExpenseChart";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const { balance, categoryTotals, currentMonthExpenses, error, loading } = useExpenses();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const totalIncome = currentMonthExpenses
    .filter(exp => exp.type === "thu")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalExpense = currentMonthExpenses
    .filter(exp => exp.type === "chi")
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Tài chính của tôi</h1>
        <p className="text-muted-foreground">
          Quản lý chi tiêu tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
        </p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số dư hiện tại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance.toLocaleString("vi-VN")} VND
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Thu nhập tháng này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalIncome.toLocaleString("vi-VN")} VND
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chi tiêu tháng này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalExpense.toLocaleString("vi-VN")} VND
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Button */}
      <div className="text-center">
        <Link href="/add-entry">
          <Button size="lg" className="text-lg px-8 py-6 h-auto">
            ➕ Ghi chi tiêu nhanh
          </Button>
        </Link>
      </div>

      {/* Chart Section */}
      <Card>
        <CardContent className="pt-6">
          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">Không thể tải dữ liệu: {error}</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </div>
          ) : (
            <ExpenseChart data={categoryTotals} />
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {currentMonthExpenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentMonthExpenses
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 5)
                .map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm px-2 py-1 rounded ${
                          expense.type === "thu" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {expense.type === "thu" ? "Thu" : "Chi"}
                        </span>
                        <span className="font-medium">{expense.category}</span>
                      </div>
                      {expense.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {expense.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`font-semibold ${
                        expense.type === "thu" ? "text-green-600" : "text-red-600"
                      }`}>
                        {expense.type === "thu" ? "+" : "-"}
                        {expense.amount.toLocaleString("vi-VN")} VND
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/edit-transaction/${expense.id}?id=${expense.id}`)}
                      >
                        Sửa
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
