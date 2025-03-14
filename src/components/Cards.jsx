import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../utils/format';

export function ExpenseCard({ expense, onEdit, onDelete }) {
  if (!expense) return null;
  return (
    <motion.div
      className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg shadow-lg mb-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
    >
      <div className="text-white text-xl font-bold neon-text">{formatCurrency(expense.amount || 0)}</div>
      <div className="text-gray-200">{expense.category || 'N/A'}</div>
      <div className="text-sm text-gray-300">{formatDate(expense.date || 'N/A')}</div>
      {expense.receipt && (
        <div className="mt-2">
          <a href={expense.receipt} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
            View Receipt
          </a>
        </div>
      )}
      <div className="mt-2 flex space-x-2">
        <motion.button
          onClick={onEdit}
          className="bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Edit
        </motion.button>
        <motion.button
          onClick={onDelete}
          className="bg-red-600 text-white px-2 py-1 rounded-full hover:bg-red-700 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Delete
        </motion.button>
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-pink-400 blur-lg opacity-50 animate-pulse" />
    </motion.div>
  );
}

export function BudgetCard({ budget, onEdit }) {
  if (!budget) return null;
  return (
    <motion.div
      className="bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-lg shadow-lg mb-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.05, rotate: -2 }}
    >
      <div className="text-white text-xl font-bold">{budget.category || 'N/A'}</div>
      <div className="text-gray-200">Budget: {formatCurrency(budget.amount || 0)}</div>
      <div className={budget.remaining < 0 ? 'text-red-300' : 'text-green-300'}>
        Remaining: {formatCurrency(budget.remaining !== undefined ? budget.remaining : 0)}
      </div>
      <motion.button
        onClick={onEdit}
        className="mt-2 bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Edit
      </motion.button>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-400 blur-lg opacity-50 animate-pulse" />
    </motion.div>
  );
}