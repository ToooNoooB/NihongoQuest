
import React, { useState, useEffect } from 'react';
import { KanjiData } from '../types';
import { storageService } from '../services/storageService';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const Quiz: React.FC = () => {
  const [items, setItems] = useState<KanjiData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load kanji and shuffle
    storageService.getAllKanji().then((data) => {
      // In a real app, filter by "Review Due" in SRS
      const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 5); 
      setItems(shuffled);
      generateOptions(shuffled[0], data);
    });
  }, []);

  const generateOptions = (correct: KanjiData, all: KanjiData[]) => {
    const distractors = all
      .filter(k => k.id !== correct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(k => k.meaning);
    
    const opts = [...distractors, correct.meaning].sort(() => 0.5 - Math.random());
    setOptions(opts);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    const currentKanji = items[currentIndex];
    const correct = currentKanji.meaning === answer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) setScore(s => s + 1);

    // Update SRS
    storageService.updateSRS(currentKanji.id, correct);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= items.length) {
      setFinished(true);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setShowResult(false);
      setSelectedAnswer(null);
      // Need full list to generate distractors, here we re-fetch briefly or cache 'all'
      storageService.getAllKanji().then(all => generateOptions(items[nextIdx], all));
    }
  };

  if (items.length === 0) return <div className="p-8">Loading Quiz...</div>;

  if (finished) {
    return (
      <div className="max-w-md mx-auto text-center py-12 pb-20 md:pb-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 dark:text-yellow-400">
             <span className="text-4xl">🏆</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You got {score} out of {items.length} correct.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Start Another Session
          </button>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="max-w-xl mx-auto py-8 pb-20 md:pb-8">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-red-600 transition-all duration-300"
          style={{ width: `${((currentIndex) / items.length) * 100}%` }}
        ></div>
      </div>

      <div className="text-center mb-8">
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">What is the meaning of this Kanji?</p>
        <div className="w-40 h-40 bg-white dark:bg-gray-800 border-2 border-red-50 dark:border-gray-700 rounded-3xl flex items-center justify-center mx-auto shadow-sm transition-colors">
           <span className="text-7xl font-jp text-gray-800 dark:text-white">{currentItem.kanji}</span>
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option, idx) => {
          let stateStyles = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-red-400 text-gray-700 dark:text-gray-200";
          if (showResult) {
            if (option === currentItem.meaning) {
              stateStyles = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
            } else if (option === selectedAnswer) {
              stateStyles = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
            } else {
              stateStyles = "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              disabled={showResult}
              onClick={() => handleAnswer(option)}
              className={`w-full p-4 rounded-xl border-2 font-semibold text-left transition-all ${stateStyles}`}
            >
              <div className="flex items-center justify-between">
                {option}
                {showResult && option === currentItem.meaning && <CheckCircle size={20} className="text-green-600 dark:text-green-400" />}
                {showResult && option === selectedAnswer && option !== currentItem.meaning && <XCircle size={20} className="text-red-600 dark:text-red-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-8 flex justify-end animate-in fade-in slide-in-from-bottom-4">
          <button 
            onClick={nextQuestion}
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-gray-200 transition-colors"
          >
            {currentIndex === items.length - 1 ? "Finish" : "Next"} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
