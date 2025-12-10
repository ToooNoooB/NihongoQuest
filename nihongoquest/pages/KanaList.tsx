
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KanaData } from '../types';
import { storageService } from '../services/storageService';

const KanaList: React.FC = () => {
  const [kanaList, setKanaList] = useState<KanaData[]>([]);
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');

  useEffect(() => {
    storageService.getAllKana().then(setKanaList);
  }, []);

  const getFilteredKana = () => kanaList.filter(k => k.type === activeTab);

  // Helper to get Kana by precise romaji for ordering
  const getByRomaji = (romaji: string) => {
     return getFilteredKana().find(k => k.romaji === romaji);
  };

  // Standard Gojuon Rows
  const ROWS = [
    { label: "A", chars: ['a', 'i', 'u', 'e', 'o'] },
    { label: "Ka", chars: ['ka', 'ki', 'ku', 'ke', 'ko'] },
    { label: "Sa", chars: ['sa', 'shi', 'su', 'se', 'so'] },
    { label: "Ta", chars: ['ta', 'chi', 'tsu', 'te', 'to'] },
    { label: "Na", chars: ['na', 'ni', 'nu', 'ne', 'no'] },
    { label: "Ha", chars: ['ha', 'hi', 'fu', 'he', 'ho'] },
    { label: "Ma", chars: ['ma', 'mi', 'mu', 'me', 'mo'] },
    { label: "Ya", chars: ['ya', 'yu', 'yo'] },
    { label: "Ra", chars: ['ra', 'ri', 'ru', 're', 'ro'] },
    { label: "Wa", chars: ['wa', 'wo', 'n'] },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Kana Charts</h2>
           <p className="text-gray-500 dark:text-gray-400 mt-1">Master the Japanese alphabets: Hiragana and Katakana.</p>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="bg-white dark:bg-gray-800 p-1 rounded-xl inline-flex shadow-sm border border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setActiveTab('hiragana')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'hiragana' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Hiragana (ひらがな)
        </button>
        <button 
          onClick={() => setActiveTab('katakana')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'katakana' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Katakana (カタカナ)
        </button>
      </div>

      {/* Kana Grid Rows */}
      <div className="space-y-4">
          {ROWS.map((row) => (
            <div key={row.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-colors">
               <div className="flex flex-col md:flex-row md:items-center gap-4">
                   {/* Row Label */}
                   <div className="w-full md:w-16 flex md:flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 md:py-4">
                      <span className="font-bold text-gray-400 dark:text-gray-500 uppercase">{row.label}</span>
                   </div>

                   {/* Characters Row */}
                   <div className="flex-1 grid grid-cols-5 gap-2 sm:gap-4">
                      {row.chars.map((romaji) => {
                          const kana = getByRomaji(romaji);
                          if (!kana) return <div key={romaji} className="invisible"></div>;
                          
                          return (
                            <Link 
                                key={kana.id} 
                                to={`/kana/${kana.id}`}
                                className="group flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-200 cursor-pointer aspect-square"
                            >
                                <span className="text-3xl font-jp text-gray-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors font-bold">{kana.character}</span>
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mt-1">{kana.romaji}</span>
                            </Link>
                          );
                      })}
                   </div>
               </div>
            </div>
          ))}
          
          {kanaList.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Loading Kana...
            </div>
          )}
      </div>
    </div>
  );
};

export default KanaList;
