"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addExpense, CATEGORIES } from "../../lib/expenses";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import IncomeAllocationModal from "../../components/IncomeAllocationModal";
import { toast } from "sonner";

export default function AddEntryPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"chi" | "thu">("chi");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);

  // Calculator functions
  const appendToAmount = (value: string) => {
    if (value === "." && amount.includes(".")) return;
    setAmount(prev => prev + value);
  };

  const clearAmount = () => {
    setAmount("");
  };

  const deleteLastDigit = () => {
    setAmount(prev => prev.slice(0, -1));
  };

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

    // If it's income, show allocation modal
    if (type === "thu") {
      setShowAllocationModal(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      addExpense({
        amount: numAmount,
        type,
        category,
        description: description.trim() || undefined,
      });
      
      toast.success("✅ Giao dịch đã được lưu thành công!", {
        description: `Chi tiêu: ${numAmount.toLocaleString("vi-VN")} VND`,
        duration: 3000,
      });
      
      router.refresh();
      router.push("/");
    } catch (error: any) {
      toast.error("❌ Có lỗi khi lưu dữ liệu", {
        description: error.message,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAllocationConfirm = (allocations: any[]) => {
    setIsSubmitting(true);
    
    try {
      // Add the original income transaction
      addExpense({
        amount: parseFloat(amount),
        type: "thu",
        category,
        description: description.trim() || undefined,
      });

      // Add allocation transactions
      const categoryMap = {
        "Nhu cầu (50%)": "Nhu cầu",
        "Mong muốn (30%)": "Mong muốn", 
        "Tiết kiệm/Đầu tư (20%)": "Tiết kiệm",
        "Góp phần (10%)": "Góp phần"
      };

      allocations.forEach((alloc) => {
        if (alloc.amount > 0) {
          addExpense({
            amount: alloc.amount,
            type: "chi",
            category: categoryMap[alloc.name as keyof typeof categoryMap] || "Khác",
            description: `Phân bổ từ thu nhập: ${alloc.name}`,
          });
        }
      });

      toast.success("🎉 Phân bổ thu nhập thành công!", {
        description: `Đã tạo ${allocations.length + 1} giao dịch từ thu nhập ${parseFloat(amount).toLocaleString("vi-VN")} VND`,
        duration: 4000,
      });

      setShowAllocationModal(false);
      router.refresh();
      router.push("/");
    } catch (error: any) {
      toast.error("❌ Có lỗi khi phân bổ thu nhập", {
        description: error.message,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAllocationCancel = () => {
    setShowAllocationModal(false);
  };

  const calculatorButtons = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["0", ".", "⌫"]
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Premium Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-premium mb-4">
          <span className="text-white text-2xl font-bold">₫</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Ghi chi tiêu
        </h1>
        <p className="text-gray-600 font-medium">Quản lý tài chính thông minh và hiện đại</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Premium Amount Display */}
        <div className="card-premium p-8 animate-slide-up">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">₫</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Nhập số tiền</h2>
            </div>
            <p className="text-gray-600 font-medium">Nhập số tiền để xem phân bổ tự động</p>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 border border-white/50 shadow-inner">
                <div className="text-5xl md:text-6xl font-bold text-center">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {amount ? parseFloat(amount).toLocaleString("vi-VN") : "0"}
                  </span>
                  <span className="text-2xl text-gray-500 ml-3 font-semibold">VND</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Calculator */}
        <div className="card-premium p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">#</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Máy tính</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {calculatorButtons.flat().map((btn, index) => (
                <button
                  key={index}
                  type="button"
                  className="h-14 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xl font-semibold text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => {
                    if (btn === "⌫") {
                      deleteLastDigit();
                    } else {
                      appendToAmount(btn);
                    }
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={clearAmount}
                className="h-14 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                🗑️ Xóa hết
              </button>
              <button
                type="button"
                onClick={() => appendToAmount("000")}
                className="h-14 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                ➕ 000
              </button>
            </div>
          </div>
        </div>

        {/* Premium Transaction Type */}
        <div className="card-premium p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">💳</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Loại giao dịch</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setType("chi");
                setCategory("");
              }}
              className={`h-16 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                type === "chi"
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl">📤</span>
                <span>Chi tiêu</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setType("thu");
                setCategory("");
              }}
              className={`h-16 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                type === "thu"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl">📥</span>
                <span>Thu nhập</span>
              </div>
            </button>
          </div>
        </div>

        {/* Premium Category */}
        <div className="card-premium p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">📂</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Danh mục</h3>
          </div>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-14 text-base bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <SelectValue placeholder="Chọn danh mục phù hợp" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-premium">
              {CATEGORIES[type].map((cat) => (
                <SelectItem key={cat} value={cat} className="text-base py-3 hover:bg-gray-50 rounded-lg">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Auto Allocation Preview for Income */}
        {type === "thu" && amount && parseFloat(amount) > 0 && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-center text-green-800">
                💰 Phân bổ theo quy tắc 50/30/20/10
              </CardTitle>
              <p className="text-sm text-center text-green-600 mt-1">
                Phân bổ thông minh cho thu nhập của bạn
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="font-semibold text-green-800">Nhu cầu thiết yếu</span>
                      <p className="text-xs text-green-600">Ăn uống, nhà ở, di chuyển</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-700">
                      {Math.round(parseFloat(amount) * 0.5).toLocaleString("vi-VN")} VND
                    </div>
                    <div className="text-xs text-green-600">50%</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="font-semibold text-blue-800">Mong muốn</span>
                      <p className="text-xs text-blue-600">Giải trí, mua sắm, du lịch</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-700">
                      {Math.round(parseFloat(amount) * 0.3).toLocaleString("vi-VN")} VND
                    </div>
                    <div className="text-xs text-blue-600">30%</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-100 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <span className="font-semibold text-purple-800">Tiết kiệm & Đầu tư</span>
                      <p className="text-xs text-purple-600">Tương lai, khẩn cấp</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-700">
                      {Math.round(parseFloat(amount) * 0.2).toLocaleString("vi-VN")} VND
                    </div>
                    <div className="text-xs text-purple-600">20%</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div>
                      <span className="font-semibold text-orange-800">Góp phần & Từ thiện</span>
                      <p className="text-xs text-orange-600">Gia đình, cộng đồng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-700">
                      {Math.round(parseFloat(amount) * 0.1).toLocaleString("vi-VN")} VND
                    </div>
                    <div className="text-xs text-orange-600">10%</div>
                  </div>
                </div>
              </div>

              {/* Visual Progress Bars */}
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">Tỷ lệ phân bổ:</div>
                <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-500 flex-1" style={{width: '50%'}}></div>
                  <div className="bg-blue-500 flex-1" style={{width: '30%'}}></div>
                  <div className="bg-purple-500 flex-1" style={{width: '20%'}}></div>
                  <div className="bg-orange-500 flex-1" style={{width: '10%'}}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>50%</span>
                  <span>30%</span>
                  <span>20%</span>
                  <span>10%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">📝 Mô tả (tùy chọn)</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ví dụ: Ăn trưa tại quán cơm gần văn phòng..."
            className="min-h-[100px] text-base resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            className="h-14 md:h-12 text-base font-semibold"
            disabled={isSubmitting}
          >
            ❌ Hủy bỏ
          </Button>
          <Button
            type="submit"
            className="h-14 md:h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200"
            disabled={isSubmitting || !amount || !category}
          >
            {isSubmitting ? "⏳ Đang lưu..." : "✅ Lưu giao dịch"}
          </Button>
        </div>
      </form>

      {/* Quick Amount Buttons */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-center">
            ⚡ Số tiền thường dùng
          </CardTitle>
          <p className="text-sm text-center text-muted-foreground">
            Chọn nhanh số tiền phổ biến
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["10000", "20000", "50000", "100000", "200000", "500000"].map((quickAmount) => (
              <Button
                key={quickAmount}
                type="button"
                variant="outline"
                className="h-12 text-sm font-semibold hover:bg-primary/10 transition-colors"
                onClick={() => setAmount(quickAmount)}
              >
                {parseInt(quickAmount).toLocaleString("vi-VN")}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Income Allocation Modal */}
      <IncomeAllocationModal
        incomeAmount={parseFloat(amount) || 0}
        isOpen={showAllocationModal}
        onConfirm={handleAllocationConfirm}
        onCancel={handleAllocationCancel}
      />
    </div>
  );
}
