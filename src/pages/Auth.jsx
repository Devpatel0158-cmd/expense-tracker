import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input, Button } from '../components/FormElements';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('You’re in—nice!', { position: 'top-right' });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login didn’t work. Check your info.', { position: 'top-right' });
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-gray-800 dark:to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Log In</h2>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          type="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          type="password"
        />
        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
          Get In
        </Button>
      </form>
    </motion.div>
  );
}

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password’s too short—needs 6 characters.', { position: 'top-right' });
      return;
    }
    try {
      await signup(email, password, name);
      toast.success('Signed up—welcome aboard!', { position: 'top-right' });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Sign-up didn’t work. Check your details.', { position: 'top-right' });
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-pink-900 dark:from-gray-800 dark:to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          type="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Pick a password"
          type="password"
        />
        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
          Join Up
        </Button>
      </form>
    </motion.div>
  );
}

export function ResetPassword() {
  const [email, setEmail] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      toast.success('Check your email for the reset link!', { position: 'top-right' });
    } catch (error) {
      toast.error('Reset didn’t work. Check your email.', { position: 'top-right' });
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-teal-900 dark:from-gray-800 dark:to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Reset Password</h2>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          type="email"
        />
        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
          Send Reset Link
        </Button>
      </form>
    </motion.div>
  );
}