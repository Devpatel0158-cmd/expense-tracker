import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Footer } from './components/Layout'; 
import { Login, SignUp, ResetPassword } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

import { useTheme } from './hooks/useTheme';
import { Button } from './components/FormElements';

import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ProtectedRoute } from './components/ProtectedRoute';
import { Link } from 'react-router-dom';

function App() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Router>
      <motion.div
        className={darkMode ? 'dark' : ''}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto py-8">
          <div className="flex justify-center mb-4">
            <h1 className="text-4xl font-bold text-white neon-text">Expense Tracker</h1>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <Link to="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up

                
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Login
              </Button>
            </Link>
            <Link to="/auth/reset-password">
              <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                Forgot Password
              </Button>
            </Link>
          </div>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div className="text-white text-center">Page Not Found</div>} />
          </Routes>
        </div>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? 'dark' : 'light'}
        />
      </motion.div>
    </Router>
  );
}

export default App;