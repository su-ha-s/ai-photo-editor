import React, { useState } from 'react';
import { Download, ArrowLeftRight, Eye, RefreshCcw, X } from 'lucide-react';

interface ImageViewerProps {
  originalImage: string;
  editedImage: string | null;
  onReset: () => void;
  isProcessing: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ 
  originalImage, 
  editedImage, 
  onReset,
  isProcessing
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'original' | 'edited'>('edited');
  
  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${editedImage}`;
    link.download = `nano-banana-edit-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeImage = viewMode === 'original' || !editedImage 
    ? originalImage 
    : `data:image/png;base64,${editedImage}`;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto h-full pb-24">
      
      {/* Toolbar */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <X size={16} /> Clear
        </button>

        {editedImage && !isProcessing && (
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
             <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'original' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Original
            </button>
            <button
              onClick={() => setViewMode('edited')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'edited' ? 'bg-yellow-400 text-slate-900 shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Result
            </button>
          </div>
        )}

        {editedImage && !isProcessing && (
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
          >
            <Download size={16} /> Save
          </button>
        )}
        
        {(!editedImage || isProcessing) && <div className="w-16"></div> /* Spacer */}
      </div>

      {/* Image Container */}
      <div className="relative w-full flex-1 min-h-[400px] flex items-center justify-center bg-slate-800/30 rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl backdrop-blur-sm">
        
        {/* Main Image Display */}
        <img 
          src={activeImage} 
          alt="Active View" 
          className={`
            max-w-full max-h-[70vh] object-contain transition-opacity duration-500
            ${isProcessing ? 'opacity-50 blur-sm scale-95' : 'opacity-100 scale-100'}
          `}
        />

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 border-4 border-slate-600 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-yellow-400 font-medium animate-pulse text-lg">Generating Edit...</p>
            <p className="text-slate-400 text-sm mt-2">Powered by Nano Banana</p>
          </div>
        )}

        {/* Empty State / Prompt for Edit */}
        {!editedImage && !isProcessing && (
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <span className="inline-block px-4 py-2 bg-slate-900/80 backdrop-blur rounded-full text-slate-300 text-sm border border-slate-700 shadow-lg">
              Type a prompt below to start editing
            </span>
          </div>
        )}
      </div>

    </div>
  );
};
