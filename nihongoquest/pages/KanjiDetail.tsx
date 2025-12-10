
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, Edit3, Book, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { KanjiData } from '../types';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { audioService } from '../services/audioService';
import DrawingCanvas from '../components/DrawingCanvas';

const KanjiDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kanji, setKanji] = useState<KanjiData | undefined>();
  const [activeTab, setActiveTab] = useState<'study' | 'write'>('study');
  const [aiMnemonic, setAiMnemonic] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (id) {
      storageService.getKanjiById(id).then(setKanji);
    }
  }, [id]);

  const handleAiGenerate = async () => {
    if (!kanji) return;
    setLoadingAi(true);
    const result = await geminiService.generateMnemonic(kanji.kanji, kanji.meaning);
    setAiMnemonic(result);
    setLoadingAi(false);
  };

  const playSound = (text: string) => {
    audioService.speak(text);
  };

  if (!kanji) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-0">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
        <ArrowLeft size={18} /> Back to List
      </button>

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start transition-colors">
        {/* Static Kanji Display */}
        <div className="flex-shrink-0 w-40 h-40 bg-red-50 dark:bg-gray-700 rounded-3xl flex items-center justify-center border-4 border-red-100 dark:border-gray-600">
           <span className="text-8xl font-jp font-bold text-gray-800 dark:text-white">{kanji.kanji}</span>
        </div>
        
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
               <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Kanji {kanji.kanji}</h1>
               <button 
                  onClick={() => playSound(kanji.kanji)}
                  className="bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 p-2 rounded-full hover:bg-red-100 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Play sound"
               >
                 <Volume2 size={24} />
               </button>
               <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs font-bold tracking-wide self-start mt-2">{kanji.jlpt}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize">{kanji.meaning}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
             {/* Onyomi */}
             <div>
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs text-gray-400 dark:text-gray-400 uppercase font-bold tracking-wider">Onyomi</span>
                 <button 
                   onClick={(e) => { e.stopPropagation(); playSound(kanji.onyomi.join(', ')); }}
                   className="text-red-500 hover:bg-red-100 dark:hover:bg-gray-600 p-1.5 rounded-full transition-colors"
                   title="Play Onyomi"
                 >
                   <Volume2 size={16} />
                 </button>
               </div>
               <p className="font-jp text-lg text-red-600 dark:text-red-400 font-medium">{kanji.onyomi.join(', ')}</p>
             </div>

             {/* Kunyomi */}
             <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 dark:text-gray-400 uppercase font-bold tracking-wider">Kunyomi</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); playSound(kanji.kunyomi.join(', ')); }}
                    className="text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 p-1.5 rounded-full transition-colors"
                    title="Play Kunyomi"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
               <p className="font-jp text-lg text-gray-600 dark:text-gray-300 font-medium">{kanji.kunyomi.join(', ')}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('study')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'study' ? 'border-red-600 text-red-600 dark:text-red-400 dark:border-red-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Book size={18} /> Study Details
        </button>
        <button
          onClick={() => setActiveTab('write')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'write' ? 'border-red-600 text-red-600 dark:text-red-400 dark:border-red-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Edit3 size={18} /> Practice Writing
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px] transition-colors">
        {activeTab === 'study' ? (
          <div className="space-y-8">
            
            {/* Visual Mnemonic */}
            <section className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 overflow-hidden shadow-sm">
               <div className="flex flex-col md:flex-row">
                 <div className="md:w-1/2 p-6 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Sparkles size={20} className="text-amber-500" /> Visual Mnemonic
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed font-medium">{kanji.mnemonic}</p>
                    
                    {aiMnemonic && (
                      <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800 animate-in fade-in">
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">Gemini AI Alternative:</p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm italic">"{aiMnemonic}"</p>
                      </div>
                    )}

                    <button 
                      onClick={handleAiGenerate} 
                      disabled={loadingAi}
                      className="mt-4 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-900 underline flex items-center gap-1 self-start"
                    >
                      {loadingAi ? <Loader2 className="animate-spin" size={12} /> : "Ask AI for another hint"}
                    </button>
                 </div>
                 <div className="md:w-1/2 bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center p-6">
                    <img 
                      src={kanji.mnemonicImage} 
                      alt={`Visual mnemonic for ${kanji.kanji}`}
                      className="rounded-xl shadow-md border-4 border-white dark:border-gray-700 w-full max-w-[250px] object-cover hover:scale-105 transition-transform duration-300"
                    />
                 </div>
               </div>
            </section>

            {/* Example Sentences */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Book size={20} className="text-red-500" /> Example Sentences
              </h3>
              <div className="grid gap-4">
                {kanji.sentences.map((sentence, idx) => (
                  <div key={idx} className="bg-gray-50/50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-600 relative group hover:bg-white dark:hover:bg-gray-700 hover:shadow-md transition-all">
                    <button 
                      onClick={() => playSound(sentence.audioReading || sentence.text)}
                      className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-600 text-red-500 dark:text-red-400 rounded-full shadow-sm border border-gray-100 dark:border-gray-500 hover:bg-red-50 dark:hover:bg-gray-500 transition-colors"
                      title="Listen"
                    >
                       <Volume2 size={18} />
                    </button>
                    <p className="text-xl font-jp font-medium mb-1 text-gray-800 dark:text-gray-200 pr-12">{sentence.text}</p>
                    <p className="text-sm text-red-500 dark:text-red-400 mb-1">{sentence.romaji}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{sentence.translation}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Vocabulary */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Vocabulary (N5)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {kanji.examples.map((ex, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => playSound(ex.reading || ex.word)}
                    className="flex flex-col p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-gray-700 hover:border-red-100 dark:hover:border-gray-600 transition-colors text-left group bg-white dark:bg-gray-700/30 shadow-sm"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                       <p className="font-jp text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-red-700 dark:group-hover:text-red-400">{ex.word}</p>
                       <Volume2 size={14} className="text-gray-300 dark:text-gray-500 group-hover:text-red-500 transition-colors" />
                    </div>
                    {/* Added Reading (Hiragana) */}
                    <p className="text-sm font-jp text-gray-600 dark:text-gray-400 font-medium mb-0.5">{ex.reading}</p>
                    <p className="text-xs text-red-400 dark:text-red-300 font-medium mb-0.5">{ex.romaji}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{ex.meaning}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Practice Time</h3>
              <p className="text-gray-500 dark:text-gray-400">Practice writing the character freehand below.</p>
            </div>
            {/* REMOVED REFERENCE PATHS FOR PURE FREEHAND */}
            <DrawingCanvas 
              strokePaths={[]} 
              onComplete={(score) => alert(`Practice Complete! Keep practicing to improve.`)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default KanjiDetail;
