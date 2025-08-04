"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ExpenseChartProps {
  data: { name: string; value: number; color: string }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {data.value.toLocaleString("vi-VN")} VND
        </p>
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ data }: ExpenseChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <img
          src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a503f05b-433c-4846-b4a1-b1eb08f140db.png"
          alt="Placeholder image showing no expense data available in a clean minimalist style with neutral colors"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          className="mx-auto mb-4 rounded-lg"
        />
        <p className="text-muted-foreground">Chưa có dữ liệu chi tiêu trong tháng này</p>
        <p className="text-sm text-muted-foreground mt-2">
          Hãy thêm khoản chi tiêu đầu tiên của bạn!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Phân bổ chi tiêu theo danh mục
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Category breakdown */}
      <div className="mt-4 space-y-2">
        {data.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="font-medium">{category.name}</span>
            </div>
            <span className="text-sm font-semibold">
              {category.value.toLocaleString("vi-VN")} VND
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
