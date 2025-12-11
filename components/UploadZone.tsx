import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, Camera } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (base64: string, mimeType: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Limit size if necessary (Gemini handles up to 20MB usually, but good to be safe on client)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Please upload an image under 10MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className="w-full max-w-xl mx-auto"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label 
        className={`
          flex flex-col items-center justify-center w-full h-64 sm:h-80 
          border-2 border-dashed rounded-3xl cursor-pointer 
          transition-all duration-300 ease-in-out touch-manipulation
          active:scale-[0.98]
          ${isDragging 
            ? 'border-yellow-400 bg-yellow-400/10' 
            : 'border-slate-600 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-500'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className={`
            p-4 rounded-full mb-4 
            ${isDragging ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700 text-slate-300'}
          `}>
            {isDragging ? <Upload size={32} /> : <Camera size={32} />}
          </div>
          <p className="mb-2 text-lg font-medium text-slate-200">
            {isDragging ? 'Drop it like it\'s hot!' : 'Tap to take photo or upload'}
          </p>
          <p className="text-sm text-slate-400">
            JPG, PNG, WebP (Max 10MB)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileInput}
        />
      </label>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400 text-sm">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};