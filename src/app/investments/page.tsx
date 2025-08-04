"use client";

import React, { useState } from "react";

export default function InvestmentsPage() {
  const [goldQuantity, setGoldQuantity] = useState("");
  const [goldPrice, setGoldPrice] = useState("");
  const [stockTicker, setStockTicker] = useState("");
  const [stockPrice, setStockPrice] = useState("");

  // Placeholder for profit/loss calculation
  const calculateGoldValue = () => {
    const quantity = parseFloat(goldQuantity);
    const price = parseFloat(goldPrice);
    if (isNaN(quantity) || isNaN(price)) return 0;
    return quantity * price;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Quản lý Đầu tư</h1>

      <section className="card-premium p-6 space-y-4">
        <h2 className="text-xl font-semibold">Vàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Số lượng (lượng)</label>
            <input
              type="number"
              value={goldQuantity}
              onChange={(e) => setGoldQuantity(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập số lượng vàng"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Giá vàng (VND/lượng)</label>
            <input
              type="number"
              value={goldPrice}
              onChange={(e) => setGoldPrice(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập giá vàng hiện tại"
            />
          </div>
          <div className="flex flex-col justify-end">
            <p className="font-semibold">
              Giá trị hiện tại: {calculateGoldValue().toLocaleString("vi-VN")} VND
            </p>
          </div>
        </div>
      </section>

      <section className="card-premium p-6 space-y-4">
        <h2 className="text-xl font-semibold">Cổ phiếu (tùy chọn)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Mã cổ phiếu</label>
            <input
              type="text"
              value={stockTicker}
              onChange={(e) => setStockTicker(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập mã cổ phiếu"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Giá cổ phiếu (VND)</label>
            <input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập giá cổ phiếu hiện tại"
            />
          </div>
          <div className="flex flex-col justify-end">
            <p className="font-semibold">
              Giá trị hiện tại: {parseFloat(stockPrice).toLocaleString("vi-VN") || 0} VND
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <img
          src="https://placehold.co/800x400?text=Elegant+investment+performance+graph+with+subtle+gradients"
          alt="Elegant investment performance graph with subtle gradients and soft shadows"
          className="w-full rounded-lg shadow-lg"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </section>
    </div>
  );
}
