import { useState, useEffect, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { ExpenseCard, BudgetCard } from '../components/Cards';
import { Input, Button, Modal } from '../components/FormElements';

import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import { formatCurrency } from '../utils/format';
import { useTheme } from '../hooks/useTheme';

export default function Dashboard() {
  const { expenses, budgets, addExpense, updateExpense, deleteExpense, addBudget, updateBudget, deleteBudget, loading, error } = useData();

  const { darkMode, toggleDarkMode } = useTheme();

  const [newExpense, setNewExpense] = useState({ amount: '', category: '', date: '', description: '', recurring: false });
  const [editExpense, setEditExpense] = useState(null);

  const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
  const [editBudget, setEditBudget] = useState(null);

  const [receiptFile, setReceiptFile] = useState(null);

  const [formError, setFormError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [budgetThreshold, setBudgetThreshold] = useState(0.8);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await addExpense(newExpense, receiptFile);
      setNewExpense({ amount: '', category: '', date: '', description: '', recurring: false });
      setReceiptFile(null);
      setFormError(null);
      toast.success('Expense added—sweet!', { position: 'top-right' });
    } catch (err) {
      setFormError('Couldn’t add expense. Sticking with dummy data.');
      toast.error('Expense didn’t save.', { position: 'top-right' });
    }
  };

  const handleEditExpense = async (e) => {
    e.preventDefault();
    try {
      await updateExpense(editExpense.id, editExpense, receiptFile);
      setEditExpense(null);
      setReceiptFile(null);
      toast.success('Expense updated—nice work!', { position: 'top-right' });
    } catch (err) {
      toast.error('Couldn’t update expense.', { position: 'top-right' });
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      await addBudget(newBudget);
      setNewBudget({ category: '', amount: '' });
      setFormError(null);
      toast.success('Budget added—good to go!', { position: 'top-right' });
    } catch (err) {
      setFormError('Budget didn’t save.');
      toast.error('Budget didn’t work.', { position: 'top-right' });
    }
  };

  const handleEditBudget = async (e) => {
    e.preventDefault();
    try {
      await updateBudget(editBudget.id, editBudget);
      setEditBudget(null);
      toast.success('Budget updated—looking good!', { position: 'top-right' });
    } catch (err) {
      toast.error('Budget update failed.', { position: 'top-right' });
    }
  };

  const totalSpent = useMemo(() => expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0), [expenses]);
  const totalBudget = useMemo(() => budgets.reduce((sum, bud) => sum + (bud.amount || 0), 0), [budgets]);
  const totalRemaining = useMemo(() => budgets.reduce((sum, bud) => sum + (bud.remaining || 0), 0), [budgets]);
  const recentTransactions = useMemo(() => [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesCategory = filterCategory ? expense.category.toLowerCase().includes(filterCategory.toLowerCase()) : true;
      const matchesDate = filterDate ? expense.date === filterDate : true;

      const matchesAmountMin = filterAmountMin ? expense.amount >= parseFloat(filterAmountMin) : true;
      const matchesAmountMax = filterAmountMax ? expense.amount <= parseFloat(filterAmountMax) : true;

      const matchesKeyword = filterKeyword ? expense.description.toLowerCase().includes(filterKeyword.toLowerCase()) : true;
      return matchesCategory && matchesDate && matchesAmountMin && matchesAmountMax && matchesKeyword;
    });
  }, [expenses, filterCategory, filterDate, filterAmountMin, filterAmountMax, filterKeyword]);

  useEffect(() => {
    budgets.forEach((budget) => {
      const spent = budget.amount - budget.remaining;
      if (spent > budget.amount * budgetThreshold) {
        toast.error(`Whoa, ${budget.category} budget is over ${budgetThreshold * 100}%!`, { position: 'top-right' });
      }
    });
  }, [budgets, budgetThreshold]);

  if (loading) return <div className="text-white text-center">Hang on, loading...</div>;

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black min-h-screen p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-white mb-4 text-center">Your Dashboard</h1>
      
      <div className="flex justify-end mb-6">
        <Button
          onClick={toggleDarkMode}
          className="bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          Toggle Dark Mode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-white">Spent So Far</h2>
          <p className="text-3xl text-red-400">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-white">Total Budget</h2>
          <p className="text-3xl text-blue-400">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-white">Left to Spend</h2>
          <p className={totalRemaining < 0 ? 'text-red-400 text-3xl' : 'text-green-400 text-3xl'}>{formatCurrency(totalRemaining)}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{editExpense ? 'Edit This Expense' : 'Add a New Expense'}</h2>
        <form onSubmit={editExpense ? handleEditExpense : handleAddExpense}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={editExpense ? editExpense.amount : newExpense.amount}
              onChange={(e) => editExpense ? setEditExpense({ ...editExpense, amount: e.target.value }) : setNewExpense({ ...newExpense, amount: e.target.value })}
              placeholder="How much?"
              type="number"
            />
            <Input
              value={editExpense ? editExpense.category : newExpense.category}
              onChange={(e) => editExpense ? setEditExpense({ ...editExpense, category: e.target.value }) : setNewExpense({ ...newExpense, category: e.target.value })}
              placeholder="What’s it for?"
            />
            <Input
              value={editExpense ? editExpense.date : newExpense.date}
              onChange={(e) => editExpense ? setEditExpense({ ...editExpense, date: e.target.value }) : setNewExpense({ ...newExpense, date: e.target.value })}
              placeholder="When?"
              type="date"
            />
            <Input
              value={editExpense ? editExpense.description : newExpense.description}
              onChange={(e) => editExpense ? setEditExpense({ ...editExpense, description: e.target.value }) : setNewExpense({ ...newExpense, description: e.target.value })}
              placeholder="What happened?"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={editExpense ? editExpense.recurring : newExpense.recurring}
                onChange={(e) => editExpense ? setEditExpense({ ...editExpense, recurring: e.target.checked }) : setNewExpense({ ...newExpense, recurring: e.target.checked })}
                className="mr-2"
              />
              <label className="text-white">Happens every month?</label>
            </div>
            <input
              type="file"
              onChange={(e) => setReceiptFile(e.target.files[0])}
              className="text-white"
              accept="image/*,application/pdf"
            />
          </div>
          {formError && <p className="text-red-500 mt-2">{formError}</p>}
          <Button type="submit" className="mt-4">{editExpense ? 'Save Changes' : 'Add It'}</Button>
          {editExpense && (
            <Button onClick={() => setEditExpense(null)} className="mt-4 ml-2 bg-gray-600 hover:bg-gray-700">Nevermind</Button>
          )}
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{editBudget ? 'Edit This Budget' : 'Set a New Budget'}</h2>
        <form onSubmit={editBudget ? handleEditBudget : handleAddBudget}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={editBudget ? editBudget.category : newBudget.category}
              onChange={(e) => editBudget ? setEditBudget({ ...editBudget, category: e.target.value }) : setNewBudget({ ...newBudget, category: e.target.value })}
              placeholder="What’s it for?"
            />
            <Input
              value={editBudget ? editBudget.amount : newBudget.amount}
              onChange={(e) => editBudget ? setEditBudget({ ...editBudget, amount: e.target.value }) : setNewBudget({ ...newBudget, amount: e.target.value })}
              placeholder="How much?"
              type="number"
            />
          </div>
          {formError && <p className="text-red-500 mt-2">{formError}</p>}
          <Button type="submit" className="mt-4">{editBudget ? 'Update It' : 'Set It'}</Button>
          {editBudget && (
            <Button onClick={() => setEditBudget(null)} className="mt-4 ml-2 bg-gray-600 hover:bg-gray-700">Cancel</Button>
          )}
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Narrow Down Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            placeholder="By category"
          />
          <Input
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            placeholder="By date"
            type="date"
          />
          <Input
            value={filterAmountMin}
            onChange={(e) => setFilterAmountMin(e.target.value)}
            placeholder="Min amount"
            type="number"
          />
          <Input
            value={filterAmountMax}
            onChange={(e) => setFilterAmountMax(e.target.value)}
            placeholder="Max amount"
            type="number"
          />
          <Input
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="Search description"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Your Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={() => setEditExpense(expense)}
              onDelete={() => deleteExpense(expense.id)}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Your Budgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={() => setEditBudget(budget)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Latest Transactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentTransactions.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={() => setEditExpense(expense)}
              onDelete={() => deleteExpense(expense.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}