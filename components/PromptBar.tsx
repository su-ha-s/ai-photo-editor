import React, { useState, useEffect } from 'react';
import { Wand2, Loader2, Send } from 'lucide-react';

interface PromptBarProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
  placeholder?: string;
}

export const PromptBar: React.FC<PromptBarProps> = ({ 
  onSubmit, 
  isProcessing, 
  placeholder = "Describe your edit (e.g., 'Make it look like a sketch', 'Add a hat')" 
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSubmit(input.trim());
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 z-50">
      <div className="max-w-3xl mx-auto w-full">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center w-full"
        >
          <div className="absolute left-3 text-yellow-400">
            {isProcessing ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Wand2 size={20} />
            )}
          </div>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder={isProcessing ? "Nano Banana is thinking..." : placeholder}
            className={`
              w-full py-3.5 pl-10 pr-12 
              bg-slate-800 border border-slate-600 
              text-slate-100 placeholder-slate-400 
              rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-black/20
              transition-all duration-200
            `}
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className={`
              absolute right-2 p-1.5 rounded-xl
              transition-colors duration-200
              ${!input.trim() || isProcessing 
                ? 'text-slate-500 cursor-not-allowed' 
                : 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 shadow-md'
              }
            `}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
