
import React, { useEffect, useState } from 'react';
import { Search, Volume2, ChevronDown, ChevronUp, Book, Info } from 'lucide-react';
import { VocabularyItem } from '../types';
import { storageService } from '../services/storageService';
import { audioService } from '../services/audioService';

const VocabularyList: React.FC = () => {
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    storageService.getAllVocabulary().then(setVocabList);
  }, []);

  const categories = ['All', ...Array.from(new Set(vocabList.map(v => v.category)))];

  const filteredList = vocabList.filter(item => {
    const matchesSearch = 
      item.word.includes(searchTerm) || 
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.romaji.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const playSound = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.speak(text);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Vocabulary Dictionary</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Essential N5 words with deep-dive usage examples and audio.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search words, meanings, or romaji..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900 focus:border-red-400 outline-none transition-all"
          />
        </div>
        <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filteredList.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No vocabulary found matching your criteria.</div>
        ) : (
          filteredList.map((item) => (
            <div 
              key={item.id} 
              onClick={() => toggleExpand(item.id)}
              className={`bg-white dark:bg-gray-800 rounded-xl border transition-all cursor-pointer overflow-hidden ${
                expandedId === item.id 
                  ? 'border-red-200 dark:border-red-800 shadow-md ring-1 ring-red-100 dark:ring-red-900/30' 
                  : 'border-gray-100 dark:border-gray-700 hover:border-red-100 dark:hover:border-red-900/50 hover:shadow-sm'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-2xl font-jp transition-colors ${
                    expandedId === item.id ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {item.word[0]}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                       <h3 className="text-xl font-bold text-gray-900 dark:text-white font-jp">{item.word}</h3>
                       <span className="text-sm text-gray-500 dark:text-gray-400 font-jp">({item.reading})</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.meaning}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded uppercase">
                    {item.category}
                  </span>
                  <button 
                    onClick={(e) => playSound(e, item.reading || item.word)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="Play Pronunciation"
                  >
                    <Volume2 size={20} />
                  </button>
                  {expandedId === item.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === item.id && (
                <div className="px-4 pb-4 md:px-6 md:pb-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20 animate-in slide-in-from-top-2">
                  <div className="grid lg:grid-cols-2 gap-6 mt-4">
                    
                    {/* Left: Usage Points */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Info size={14} /> Usage & Context
                      </h4>
                      <ul className="space-y-2">
                        {item.usagePoints.map((point, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right: Examples */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                       <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                         <Book size={14} /> Example Sentences (5)
                       </h4>
                       <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {item.examples.map((ex, idx) => (
                            <div key={idx} className="relative pl-3 border-l-2 border-red-100 dark:border-red-900 hover:border-red-300 dark:hover:border-red-600 transition-colors py-1 group">
                                <button 
                                   onClick={(e) => playSound(e, ex.audioReading || ex.text)}
                                   className="absolute top-0 right-0 p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                   title="Listen"
                                >
                                   <Volume2 size={16} />
                                </button>
                                <p className="text-lg font-jp font-medium text-gray-800 dark:text-gray-200 pr-8">{ex.text}</p>
                                <div className="flex flex-col sm:flex-row sm:gap-4 mt-1">
                                  <p className="text-xs text-red-500 dark:text-red-400 font-medium">{ex.romaji}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">{ex.translation}</p>
                                </div>
                            </div>
                          ))}
                       </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VocabularyList;
