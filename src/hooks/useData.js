import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const mockExpenses = [
  { id: 1, amount: 50, category: 'Food', date: '2025-03-13', description: 'Lunch', receipt: null, recurring: false },
  { id: 2, amount: 30, category: 'Transport', date: '2025-03-13', description: 'Bus fare', receipt: null, recurring: false },
];

const mockBudgets = [
  { id: 1, category: 'Food', amount: 200, remaining: 150 },
  { id: 2, category: 'Transport', amount: 100, remaining: 70 },
];

export const useData = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [expenseRes, budgetRes] = await Promise.all([api.get('/expenses'), api.get('/budgets')]);
      setExpenses(expenseRes.data || []);
      setBudgets(budgetRes.data || []);
    } catch (err) {
      console.error('Data fetch failed:', err);
      setError('Failed to fetch data. Using mock data instead.');
      setExpenses(mockExpenses);
      setBudgets(mockBudgets);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData, receiptFile = null) => {
    try {
      const formData = new FormData();
      formData.append('amount', expenseData.amount);
      formData.append('category', expenseData.category);
      formData.append('date', expenseData.date);
      formData.append('description', expenseData.description);
      formData.append('recurring', expenseData.recurring);
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }

      const response = await api.post('/expenses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExpenses([...expenses, response.data]);
    } catch (err) {
      const newExpense = {
        id: Date.now(),
        ...expenseData,
        receipt: receiptFile ? URL.createObjectURL(receiptFile) : null,
      };
      setExpenses([...expenses, newExpense]);
      throw new Error('Backend not available. Added to mock data.');
    }
  };

  const updateExpense = async (id, expenseData, receiptFile = null) => {
    try {
      const formData = new FormData();
      formData.append('amount', expenseData.amount);
      formData.append('category', expenseData.category);
      formData.append('date', expenseData.date);
      formData.append('description', expenseData.description);
      formData.append('recurring', expenseData.recurring);
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }


      const response = await api.put(`/expenses/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExpenses(expenses.map((exp) => (exp.id === id ? response.data : exp)));
    } catch (err) {
      const updatedExpense = {
        id,
        ...expenseData,
        receipt: receiptFile ? URL.createObjectURL(receiptFile) : expenseData.receipt,
      };

      setExpenses(expenses.map((exp) => (exp.id === id ? updatedExpense : exp)));
      throw new Error('Backend not available. Updated in mock data.');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (err) {
      setExpenses(expenses.filter((exp) => exp.id !== id));
      throw new Error('Backend not available. Deleted from mock data.');
    }
  };

  const addBudget = async (budgetData) => {
    try {
      const response = await api.post('/budgets', budgetData);
      setBudgets([...budgets, response.data]);
    } catch (err) {
      const newBudget = { id: Date.now(), ...budgetData, remaining: budgetData.amount };

      setBudgets([...budgets, newBudget]);
      throw new Error('Backend not available. Added to mock data.');
    }
  };

  const updateBudget = async (id, budgetData) => {
    try {
      const response = await api.put(`/budgets/${id}`, budgetData);
      setBudgets(budgets.map((bud) => (bud.id === id ? response.data : bud)));
    } catch (err) {
      setBudgets(budgets.map((bud) => (bud.id === id ? { ...bud, ...budgetData } : bud)));
      throw new Error('Backend not available. Updated in mock data.');
    }
  };

  const deleteBudget = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      setBudgets(budgets.filter((bud) => bud.id !== id));
    } catch (err) {
      setBudgets(budgets.filter((bud) => bud.id !== id));
      throw new Error('Backend not available. Deleted from mock data.');
    }
  };

  useEffect(() => {
    const checkRecurringExpenses = () => {
      expenses.forEach((expense) => {
        if (expense.recurring) {
          const expenseDate = new Date(expense.date);
          const now = new Date();
          const diffDays = Math.floor((now - expenseDate) / (1000 * 60 * 60 * 24));
          if (diffDays > 0 && diffDays % 1 === 0) {
            toast.info(`Reminder: Recurring expense "${expense.description}" of $${expense.amount} is due!`, {
              position: 'top-right',
            });
          }
        }
      });
    };

    checkRecurringExpenses();
    const interval = setInterval(checkRecurringExpenses, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [expenses]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    expenses,
    budgets,
    loading,
    error,

    addExpense,
    updateExpense,
    deleteExpense,
    addBudget,
    updateBudget,
    deleteBudget,
    refresh: fetchData,
  };
};