import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          className="flex items-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <img src="/react.svg" alt="Logo" className="h-10 w-10 mr-2" />
          <Link to="/" className="text-2xl font-extrabold text-white neon-text">EXPENSE TRACKER</Link>
        </motion.div>
        <div className="space-x-4">
          <Link to="/dashboard" className="text-white hover:text-yellow-300 transition">Dashboard</Link>
          {user ? (
            <>
              <Link to="/profile" className="text-white hover:text-yellow-300 transition">Profile</Link>
              <button onClick={handleLogout} className="text-white hover:text-yellow-300 transition">Logout</button>
            </>
          ) : (
            <Link to="/auth/login" className="text-white hover:text-yellow-300 transition">Login</Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export function Footer() {
  return (
    <motion.footer
      className="bg-gradient-to-r from-gray-900 to-black p-4 text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <p className="text-sm">Expense Tracker 2025</p>
    </motion.footer>
  );
}