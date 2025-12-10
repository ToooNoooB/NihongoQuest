import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

interface StrokeOrderProps {
  paths: string[];
}

const StrokeOrder: React.FC<StrokeOrderProps> = ({ paths }) => {
  const [animating, setAnimating] = useState(false);
  const [key, setKey] = useState(0); // Key to force re-render for animation restart

  const handlePlay = () => {
    setKey(prev => prev + 1);
    setAnimating(true);
    // Rough estimate of animation duration (2s per stroke in CSS)
    setTimeout(() => setAnimating(false), paths.length * 1000); 
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-[180px] h-[180px] bg-red-50 border-4 border-red-200 rounded-xl relative mb-4">
         {/* Grid lines */}
         <div className="absolute top-1/2 w-full h-px bg-red-200 -translate-y-1/2"></div>
         <div className="absolute left-1/2 h-full w-px bg-red-200 -translate-x-1/2"></div>

        <svg viewBox="0 0 100 100" className="w-full h-full p-4" key={key}>
          {paths.map((d, i) => (
            <React.Fragment key={i}>
              {/* Background Grey Stroke */}
              <path d={d} stroke="#e5e7eb" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* Animated Black Stroke */}
              <path 
                d={d} 
                stroke="#1f2937" 
                strokeWidth="8" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={animating ? "stroke-path" : ""}
                style={{ 
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: '0.8s',
                    opacity: animating ? 1 : 1
                }}
              />
              {/* Number Label */}
              {!animating && (
                  <text 
                    x={d.split(' ')[0].replace('M', '').split(',')[0]} 
                    y={d.split(' ')[0].replace('M', '').split(',')[1]} 
                    className="text-[6px] fill-red-500 font-bold"
                    dx="-5" dy="-5"
                  >
                    {i + 1}
                  </text>
              )}
            </React.Fragment>
          ))}
        </svg>
      </div>
      
      <button 
        onClick={handlePlay}
        disabled={animating}
        className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-4 py-2 rounded-full hover:bg-red-100 disabled:opacity-50 transition-colors"
      >
        <Play size={16} className={animating ? "opacity-50" : ""} />
        {animating ? 'Animating...' : 'Animate Strokes'}
      </button>
    </div>
  );
};

export default StrokeOrder;