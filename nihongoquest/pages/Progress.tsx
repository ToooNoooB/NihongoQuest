
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { storageService } from '../services/storageService';
import { UserProgress } from '../types';

const Progress: React.FC = () => {
  const [progressData, setProgressData] = useState<UserProgress[]>([]);

  useEffect(() => {
    const data = storageService.getProgress();
    setProgressData(Object.values(data));
  }, []);

  const stats = {
    mastered: progressData.filter(p => p.status === 'mastered').length,
    review: progressData.filter(p => p.status === 'review').length,
    learning: progressData.filter(p => p.status === 'learning').length,
    new: 100 - progressData.length // Assuming 100 total for N5 demo
  };

  const chartData = [
    { name: 'Mastered', value: stats.mastered, color: '#10b981' }, // green-500
    { name: 'Review Due', value: stats.review, color: '#f59e0b' }, // amber-500
    { name: 'Learning', value: stats.learning, color: '#dc2626' }, // red-600
    { name: 'Not Started', value: stats.new, color: '#e5e7eb' },   // gray-200
  ];

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Progress</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center transition-colors">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-6 w-full text-left">Mastery Distribution</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 flex-wrap justify-center mt-4">
             {chartData.map(d => (
               <div key={d.name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                 <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{d.name}: {d.value}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-4">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors">
             <div className="flex justify-between items-center mb-2">
               <span className="text-gray-500 dark:text-gray-400 font-medium">N5 Completion</span>
               <span className="text-red-600 dark:text-red-400 font-bold">{Math.round(((stats.mastered + stats.learning + stats.review)/100)*100)}%</span>
             </div>
             <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: `${((stats.mastered + stats.learning + stats.review)/100)*100}%` }}></div>
             </div>
           </div>

           <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Upcoming Reviews</h3>
              {progressData.filter(p => p.status === 'review').length === 0 ? (
                <p className="text-gray-400 text-sm">No reviews pending right now. Great job!</p>
              ) : (
                <ul className="space-y-3">
                  {progressData.filter(p => p.status === 'review').slice(0, 3).map(p => (
                    <li key={p.kanjiId} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Kanji ID: {p.kanjiId}</span>
                      <span className="text-amber-600 dark:text-amber-500">Due Now</span>
                    </li>
                  ))}
                </ul>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
