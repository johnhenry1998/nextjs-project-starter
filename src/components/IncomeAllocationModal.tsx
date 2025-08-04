"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

interface Allocation {
  name: string;
  amount: number;
}

interface IncomeAllocationModalProps {
  incomeAmount: number;
  isOpen: boolean;
  onConfirm: (allocations: Allocation[]) => void;
  onCancel: () => void;
}

const defaultAllocations = [
  { name: "Nhu cầu (50%)", percentage: 0.5 },
  { name: "Mong muốn (30%)", percentage: 0.3 },
  { name: "Tiết kiệm/Đầu tư (20%)", percentage: 0.2 },
  { name: "Góp phần (10%)", percentage: 0.1 },
];

export default function IncomeAllocationModal({
  incomeAmount,
  isOpen,
  onConfirm,
  onCancel,
}: IncomeAllocationModalProps) {
  const [allocations, setAllocations] = useState<Allocation[]>(
    defaultAllocations.map((alloc) => ({
      name: alloc.name,
      amount: Math.round(incomeAmount * alloc.percentage),
    }))
  );

  const handleAmountChange = (index: number, value: string) => {
    const newAllocations = [...allocations];
    const parsed = parseInt(value.replace(/[^0-9]/g, ""), 10);
    newAllocations[index].amount = isNaN(parsed) ? 0 : parsed;
    setAllocations(newAllocations);
  };

  const handleConfirm = () => {
    onConfirm(allocations);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Phân bổ thu nhập theo quy tắc 50/30/20/10</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {allocations.map((alloc, index) => (
            <div key={index} className="flex items-center justify-between">
              <span>{alloc.name}</span>
              <input
                type="text"
                value={alloc.amount.toLocaleString("vi-VN")}
                onChange={(e) => handleAmountChange(index, e.target.value)}
                className="w-32 p-2 border rounded text-right"
              />
            </div>
          ))}
        </div>
        <DialogFooter className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirm}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
