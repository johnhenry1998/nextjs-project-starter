"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Expense, getExpenses, updateExpense, CATEGORIES } from "../../../lib/expenses";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

export default function EditTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  const [expense, setExpense] = useState<Expense | null>(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"chi" | "thu">("chi");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const expenses = getExpenses();
    const found = expenses.find((exp) => exp.id === id);
    if (found) {
      setExpense(found);
      setAmount(found.amount.toString());
      setType(found.type);
      setCategory(found.category);
      setDescription(found.description || "");
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Số tiền không hợp lệ!");
      return;
    }

    if (!expense) {
      alert("Giao dịch không tồn tại.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateExpense({
        ...expense,
        amount: numAmount,
        type,
        category,
        description: description.trim() || undefined,
      });
      router.refresh();
      router.push("/");
    } catch (error: any) {
      alert("Có lỗi khi cập nhật dữ liệu: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!expense) {
    return (
      <div className="text-center py-20">
        <p>Không tìm thấy giao dịch.</p>
        <Button onClick={() => router.push("/")}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Chỉnh sửa giao dịch</h1>
        <p className="text-muted-foreground">Cập nhật thông tin giao dịch</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Số tiền</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-center text-3xl font-bold"
            />
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label>Loại giao dịch</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={type === "chi" ? "default" : "outline"}
              onClick={() => {
                setType("chi");
                setCategory("");
              }}
              className="h-12"
            >
              Chi tiêu
            </Button>
            <Button
              type="button"
              variant={type === "thu" ? "default" : "outline"}
              onClick={() => {
                setType("thu");
                setCategory("");
              }}
              className="h-12"
            >
              Thu nhập
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Danh mục</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES[type].map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Mô tả (tùy chọn)</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ví dụ: Ăn trưa tại quán cơm..."
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            className="h-12"
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            className="h-12"
            disabled={isSubmitting || !amount || !category}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </div>
  );
}
