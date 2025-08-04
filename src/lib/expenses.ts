export interface Expense {
  id: string;
  amount: number;
  type: "chi" | "thu";
  category: string;
  description?: string;
  createdAt: number;
}

const STORAGE_KEY = "expenses-data";

export function getExpenses(): Expense[] {
  try {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading expenses:", error);
    return [];
  }
}

export function addExpense(expenseData: Omit<Expense, "id" | "createdAt">) {
  try {
    if (typeof window === 'undefined') return;
    const expenses = getExpenses();
    const newExpense: Expense = { 
      ...expenseData, 
      id: Date.now().toString(),
      createdAt: Date.now() 
    };
    expenses.push(newExpense);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Error adding expense:", error);
    throw new Error("Lưu dữ liệu thất bại.");
  }
}

export function updateExpense(updatedExpense: Expense) {
  try {
    if (typeof window === 'undefined') return;
    const expenses = getExpenses();
    const index = expenses.findIndex(exp => exp.id === updatedExpense.id);
    if (index === -1) {
      throw new Error("Không tìm thấy giao dịch để cập nhật.");
    }
    expenses[index] = updatedExpense;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Cập nhật dữ liệu thất bại.");
  }
}

export function deleteExpense(id: string) {
  try {
    if (typeof window === 'undefined') return;
    const expenses = getExpenses();
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredExpenses));
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Xóa dữ liệu thất bại.");
  }
}

export const CATEGORIES = {
  chi: [
    "Ăn uống",
    "Mua sắm",
    "Hóa đơn",
    "Đi lại",
    "Giải trí",
    "Y tế",
    "Giáo dục",
    "Nhu cầu",
    "Mong muốn",
    "Tiết kiệm",
    "Góp phần",
    "Khác"
  ],
  thu: [
    "Lương",
    "Thưởng",
    "Đầu tư",
    "Bán hàng",
    "Khác"
  ]
};

export function getCurrentMonthExpenses(): Expense[] {
  const expenses = getExpenses();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.createdAt);
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear;
  });
}

export function calculateBalance(): number {
  const currentMonthExpenses = getCurrentMonthExpenses();
  return currentMonthExpenses.reduce((sum, expense) => {
    return expense.type === "thu" ? sum + expense.amount : sum - expense.amount;
  }, 0);
}

export function getCategoryTotals(): { name: string; value: number; color: string }[] {
  const currentMonthExpenses = getCurrentMonthExpenses();
  const expensesByCategory = currentMonthExpenses
    .filter(exp => exp.type === "chi")
    .reduce((acc: Record<string, number>, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"];
  
  return Object.entries(expensesByCategory).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length]
  }));
}
