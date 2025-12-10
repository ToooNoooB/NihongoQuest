
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KanjiData } from '../types';
import { storageService } from '../services/storageService';
import { Lock } from 'lucide-react';

const KanjiList: React.FC = () => {
  const [kanjiList, setKanjiList] = useState<KanjiData[]>([]);

  useEffect(() => {
    storageService.getAllKanji().then(setKanjiList);
  }, []);

  // Group by set
  const sets = kanjiList.reduce((acc, kanji) => {
    if (!acc[kanji.set]) acc[kanji.set] = [];
    acc[kanji.set].push(kanji);
    return acc;
  }, {} as Record<number, KanjiData[]>);

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Kanji Sets</h2>
           <p className="text-gray-500 dark:text-gray-400 mt-1">Master 10 characters at a time.</p>
        </div>
      </div>

      {Object.entries(sets).map(([setNum, items]: [string, KanjiData[]]) => (
        <div key={setNum} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 flex justify-between items-center">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white">Set {setNum}</h3>
             <span className="text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full">
               {items.length} Characters
             </span>
          </div>
          
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {items.map((kanji) => (
              <Link 
                key={kanji.id} 
                to={`/kanji/${kanji.id}`}
                className="group flex flex-col items-center p-4 rounded-xl border-2 border-transparent hover:border-red-100 dark:hover:border-gray-600 hover:bg-red-50/30 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 group-hover:scale-110 transition-transform mb-3">
                   <span className="text-3xl font-jp text-gray-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">{kanji.kanji}</span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm">{kanji.meaning.split(',')[0]}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{kanji.onyomi[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanjiList;
