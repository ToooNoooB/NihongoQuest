import React, { useRef, useEffect, useState } from 'react';
import { RefreshCcw, CheckCircle } from 'lucide-react';

interface DrawingCanvasProps {
  strokePaths: string[]; // For reference
  onComplete?: (score: number) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ strokePaths, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [showReference, setShowReference] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      // High DPI support
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#450a0a'; // red-950 (Dark Red)
        setContext(ctx);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context || !canvasRef.current) return;
    setIsDrawing(true);
    setShowReference(false); // Hide reference while drawing to test memory
    
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if(context) context.closePath();
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setShowReference(true);
    }
  };

  // Mock scoring function (In production, this would use vector matching)
  const handleSubmit = () => {
    // Random score for demo since we can't implement complex vector math in one file
    const mockScore = Math.floor(Math.random() * 30) + 70; 
    if (onComplete) onComplete(mockScore);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative border-4 border-red-100 rounded-2xl overflow-hidden bg-white shadow-inner">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)', backgroundSize: '150px 150px' }}>
             <div className="absolute inset-0 border-dashed border-red-300 border-t-0 border-l-0 border-r-0 border-b-0" style={{ borderTopWidth: '1px', borderLeftWidth: '1px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%' }}></div>
        </div>

        {/* Reference Overlay (Ghost) */}
        {showReference && (
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
             {strokePaths.map((path, i) => (
                <path key={i} d={path} fill="none" stroke="black" strokeWidth="8" strokeLinecap="round" />
             ))}
          </svg>
        )}

        <canvas
          ref={canvasRef}
          className="w-[300px] h-[300px] touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="flex gap-4">
        <button onClick={clearCanvas} className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          <RefreshCcw size={18} /> Reset
        </button>
        <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium">
          <CheckCircle size={18} /> Check
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;