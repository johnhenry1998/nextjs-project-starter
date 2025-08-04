"use client";

import { useState, useEffect } from "react";
import { Expense, getExpenses, getCurrentMonthExpenses, calculateBalance, getCategoryTotals } from "../lib/expenses";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState<Expense[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [categoryTotals, setCategoryTotals] = useState<{ name: string; value: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    try {
      const allExpenses = getExpenses();
      const monthExpenses = getCurrentMonthExpenses();
      const currentBalance = calculateBalance();
      const categories = getCategoryTotals();

      setExpenses(allExpenses);
      setCurrentMonthExpenses(monthExpenses);
      setBalance(currentBalance);
      setCategoryTotals(categories);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Listen for storage changes to refresh data when other tabs update
    const handleStorageChange = () => {
      refreshData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { 
    expenses, 
    currentMonthExpenses,
    balance,
    categoryTotals,
    error, 
    loading,
    refreshData 
  };
}
