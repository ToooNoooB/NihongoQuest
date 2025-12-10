
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { UserState } from '../types';
import { Camera, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AVATARS = ['🦊', '🐱', '🐶', '🐼', '🐨', '🐯', '🐸', '🐙', '🌸', '🍣', '🍡', '🎎'];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserState | null>(null);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const u = storageService.getUser();
    if (u) {
        setUser(u);
        setUsername(u.username);
        setSelectedAvatar(u.avatar || '👤');
    }
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    await storageService.updateProfile(user.id, { username, avatar: selectedAvatar });
    // Update local state
    const updated = storageService.getUser();
    setUser(updated);
    setIsLoading(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    storageService.logout();
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Customize your learning identity.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
         <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-5xl border-4 border-white dark:border-gray-700 shadow-lg mb-4">
                {selectedAvatar}
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Choose Avatar</p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {AVATARS.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => setSelectedAvatar(emoji)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                            selectedAvatar === emoji 
                            ? 'bg-red-100 border-2 border-red-500 scale-110' 
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
         </div>

         <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-red-500 outline-none"
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                    type="text"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>
         </div>

         {message && (
             <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-center rounded-xl text-sm font-bold">
                 {message}
             </div>
         )}

         <div className="mt-8 flex flex-col md:flex-row gap-4">
             <button 
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
             >
                 <Save size={18} /> {isLoading ? 'Saving...' : 'Save Changes'}
             </button>
             
             <button 
                onClick={handleLogout}
                className="md:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
             >
                 <LogOut size={18} /> Sign Out
             </button>
         </div>
      </div>
    </div>
  );
};

export default Profile;
