import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Input, Button } from '../components/FormElements';

import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profilePic || '');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    if (password) formData.append('password', password);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      const response = await api.put('/user', formData);
      setProfilePicUrl(response.data.profilePic);
      toast.success('Profile updated—nice one!', { position: 'top-right' });
    } catch (error) {
      toast.error('Something went wrong. Try again.', { position: 'top-right' });
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-900 to-blue-900 dark:from-gray-800 dark:to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleUpdateProfile} className="bg-gray-800 p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Your Profile</h2>
        {profilePicUrl && (
          <div className="mb-4 flex justify-center">
            <img src={profilePicUrl} alt="Your pic" className="w-24 h-24 rounded-full object-cover" />
          </div>
        )}
        <Input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Your name"
          type="text"
        />
        <Input
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Your email"
          type="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          type="password"
        />
        <motion.input
          type="file"
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg cursor-pointer"
          whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}
        />
        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
          Save Changes
        </Button>
        <Button
          onClick={logout}
          className="w-full mt-4 bg-red-600 hover:bg-red-700"
        >
          Log Out
        </Button>
      </form>
    </motion.div>
  );
}