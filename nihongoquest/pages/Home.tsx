
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, Activity, ArrowRight } from 'lucide-react';
import { UserState } from '../types';
import { storageService } from '../services/storageService';

const Home: React.FC = () => {
  const [user, setUser] = useState<UserState | null>(null);
  const [learnedCount, setLearnedCount] = useState(0);

  useEffect(() => {
    setUser(storageService.getUser());
    const progress = storageService.getProgress();
    const count = Object.values(progress).filter(p => p.status !== 'new').length;
    setLearnedCount(count);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 dark:from-red-800 dark:to-red-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 font-jp text-9xl font-bold select-none text-white">
          日本語
        </div>
        <h1 className="text-3xl font-bold mb-2">Oha, {user.username}! 👋</h1>
        <p className="text-red-100 max-w-lg mb-6">
          Ready to continue your N5 journey? You have 5 kanji due for review today.
        </p>
        <Link to="/quiz" className="inline-flex items-center gap-2 bg-white text-red-700 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-sm">
          Start SRS Review <ArrowRight size={18} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
            <Flame size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Daily Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.dailyStreak} Days</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Kanji Learned</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{learnedCount} / 100</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl">
            <Star size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total XP</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.totalXp}</p>
          </div>
        </div>
      </div>

      {/* Recommended Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Next Set</h3>
             <span className="text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-md">Set 1</span>
           </div>
           <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Numbers, Nature, and People. The fundamentals of N5.</p>
           <Link to="/sets" className="w-full block text-center py-3 rounded-lg border border-gray-200 dark:border-gray-600 font-medium text-gray-600 dark:text-gray-300 hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 transition-colors">
             Continue Learning
           </Link>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold text-lg mb-2">Writing Practice</h3>
          <p className="text-gray-400 text-sm mb-6">Sharpen your stroke order accuracy.</p>
          <Link to="/kanji/k1" className="text-sm font-medium underline underline-offset-4 hover:text-red-300">
             Practice 'Sun' (日) &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
