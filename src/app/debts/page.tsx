"use client";

import React, { useState } from "react";

interface Debt {
  id: string;
  amount: number;
  interestRate: number; // annual interest rate in %
  dueDate: string; // ISO date string
}

function calculateMonthlyRepayment(amount: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return amount / months;
  return (
    (amount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -months))
  );
}

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [months, setMonths] = useState("12");

  const addDebt = () => {
    if (!amount || !interestRate || !dueDate || !months) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const newDebt: Debt = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate),
      dueDate,
    };
    setDebts([...debts, newDebt]);
    setAmount("");
    setInterestRate("");
    setDueDate("");
    setMonths("12");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Quản lý Nợ</h1>

      <section className="card-premium p-6 space-y-4">
        <h2 className="text-xl font-semibold">Thêm khoản nợ mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="number"
            placeholder="Số tiền (VND)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Lãi suất hàng năm (%)"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            placeholder="Ngày đáo hạn"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Số tháng trả"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={addDebt}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition"
        >
          Thêm nợ
        </button>
      </section>

      <section className="card-premium p-6 space-y-4">
        <h2 className="text-xl font-semibold">Danh sách nợ</h2>
        {debts.length === 0 ? (
          <p>Chưa có khoản nợ nào.</p>
        ) : (
          <div className="space-y-4">
            {debts.map((debt) => {
              const monthlyRepayment = calculateMonthlyRepayment(
                debt.amount,
                debt.interestRate,
                parseInt(months)
              );
              return (
                <div
                  key={debt.id}
                  className="p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-red-700">
                        Số tiền: {debt.amount.toLocaleString("vi-VN")} VND
                      </p>
                      <p>Lãi suất: {debt.interestRate}%/năm</p>
                      <p>Ngày đáo hạn: {new Date(debt.dueDate).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-700">
                        Trả hàng tháng: {monthlyRepayment.toFixed(0).toString().toLocaleString("vi-VN")} VND
                      </p>
                      <p>Số tháng trả: {months}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
