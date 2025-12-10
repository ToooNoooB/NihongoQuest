
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, ArrowLeft, Book, Eye, EyeOff } from 'lucide-react';
import { KanaData } from '../types';
import { storageService } from '../services/storageService';
import { audioService } from '../services/audioService';

const KanaDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kana, setKana] = useState<KanaData | undefined>();
  const [revealedSentences, setRevealedSentences] = useState<number[]>([]);

  useEffect(() => {
    if (id) {
      storageService.getKanaById(id).then(setKana);
    }
  }, [id]);

  const playSound = (text: string) => {
    audioService.speak(text);
  };

  const toggleSentence = (idx: number) => {
    setRevealedSentences(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  if (!kana) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 md:pb-0">
      <button onClick={() => navigate('/kana')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
        <ArrowLeft size={18} /> Back to {kana.type === 'hiragana' ? 'Hiragana' : 'Katakana'}
      </button>

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <span className="text-9xl font-jp font-bold text-gray-900 dark:text-white">{kana.character}</span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-4 mb-2">
               <h1 className="text-8xl font-jp font-bold text-gray-900 dark:text-white">{kana.character}</h1>
               <button 
                  onClick={() => playSound(kana.character)}
                  className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors shadow-sm"
                  aria-label="Play sound"
               >
                 <Volume2 size={32} />
               </button>
            </div>
            <p className="text-2xl font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">{kana.romaji}</p>
        </div>
      </div>

      {/* Vocabulary Section */}
      <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Book size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vocabulary ({kana.examples.length})</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {kana.examples.map((ex, idx) => (
              <button 
                key={idx} 
                onClick={() => playSound(ex.reading || ex.word)}
                className="flex flex-col p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all text-left group"
              >
                <div className="flex justify-between items-start w-full mb-2">
                    <span className="font-jp text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ex.word}</span>
                    <Volume2 size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500" />
                </div>
                <div className="text-sm text-gray-500">
                    <span className="font-jp block text-gray-400 dark:text-gray-500 mb-0.5">{ex.reading}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-300">{ex.meaning}</span>
                </div>
              </button>
            ))}
          </div>
      </section>

      {/* Practice Sentences Section */}
      <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <Book size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reading Practice ({kana.sentences.length})</h3>
          </div>

          <div className="space-y-4">
            {kana.sentences.map((sentence, idx) => {
              const isRevealed = revealedSentences.includes(idx);
              return (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-colors">
                   <div className="p-5 flex items-center justify-between gap-4">
                      <div className="flex-1">
                         <p className="text-xl font-jp font-medium text-gray-800 dark:text-gray-200">{sentence.text}</p>
                      </div>
                      <button 
                        onClick={() => playSound(sentence.audioReading || sentence.text)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0"
                      >
                         <Volume2 size={24} />
                      </button>
                   </div>

                   {/* Toggle Answer Area */}
                   <div className={`border-t border-gray-100 dark:border-gray-700 transition-all duration-300 ${isRevealed ? 'bg-gray-50 dark:bg-gray-700/30' : 'bg-gray-50/50 dark:bg-gray-800'}`}>
                      {isRevealed ? (
                        <div className="p-4 animate-in fade-in slide-in-from-top-2">
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                              <div className="flex-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Romaji</p>
                                <p className="font-medium text-red-500 dark:text-red-400">{sentence.romaji}</p>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Meaning</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{sentence.translation}</p>
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="p-2 flex justify-center">
                           <button 
                             onClick={() => toggleSentence(idx)}
                             className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-4 py-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700 transition-colors"
                           >
                             <Eye size={16} /> Show Answer
                           </button>
                        </div>
                      )}
                      
                      {isRevealed && (
                         <div className="px-4 pb-2 flex justify-center">
                            <button 
                             onClick={() => toggleSentence(idx)}
                             className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-4 py-1 rounded-full transition-colors"
                           >
                             <EyeOff size={14} /> Hide Answer
                           </button>
                         </div>
                      )}
                   </div>
                </div>
              );
            })}
          </div>
      </section>
    </div>
  );
};

export default KanaDetail;
