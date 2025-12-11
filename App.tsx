import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { PromptBar } from './components/PromptBar';
import { ImageViewer } from './components/ImageViewer';
import { editImageWithGemini } from './services/geminiService';
import { Zap, AlertTriangle, Info } from 'lucide-react';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (base64: string, type: string) => {
    setOriginalImage(base64);
    setMimeType(type);
    setEditedImage(null);
    setError(null);
  };

  const handleEditSubmit = async (prompt: string) => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    // Use the edited image as source if available, allowing sequential edits
    // Note: To re-feed the edited image, we'd need to convert the raw base64 back to a data URL if using that logic.
    // However, the current API service expects a data URL OR handles raw base64 cleaning.
    // For simplicity and quality, we always edit the *currently displayed* image. 
    // If editedImage exists, use it as source. If not, use original.
    // Note: editedImage is stored as raw base64 (no header) in our state from the API response.
    // We need to prefix it for the API service if we reuse it, or the service needs to handle it.
    // Our service strips headers, so passing a raw base64 string works fine if it doesn't have a header.
    
    // Let's decide source:
    let sourceImage = originalImage;
    if (editedImage) {
      // It's raw base64 from the API response. 
      // The API service strips `data:image...` if present. 
      // If we pass raw base64, the regex won't match, and it will use it as is.
      // This allows sequential editing!
      sourceImage = editedImage; 
    }

    try {
      const resultBase64 = await editImageWithGemini(sourceImage, prompt, mimeType);
      setEditedImage(resultBase64);
    } catch (err: any) {
      setError(err.message || "Something went wrong during generation.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-yellow-400 selection:text-slate-900">
      
      {/* Header */}
      <header className="py-6 px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-xl shadow-lg shadow-yellow-500/20">
              <Zap className="text-slate-900" size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Nano Banana Editor</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          
          <div className="hidden sm:block">
            <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-yellow-400 transition-colors text-sm font-medium flex items-center gap-2">
              <Info size={16} /> About Model
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 w-full max-w-6xl mx-auto">
        
        {error && (
          <div className="w-full max-w-2xl mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-red-400 font-medium text-sm">Generation Error</h3>
              <p className="text-red-300/80 text-sm mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {!originalImage ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-8 max-w-lg">
              <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                Magic Photo Editing
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Upload a photo and simply tell <span className="text-yellow-400 font-medium">Nano Banana</span> what to change. 
                <br className="hidden sm:block"/>
                From removing objects to applying creative filters.
              </p>
            </div>
            <UploadZone onImageSelected={handleImageSelected} />
          </div>
        ) : (
          <div className="w-full flex-1 animate-in fade-in duration-500">
             <ImageViewer 
               originalImage={originalImage} 
               editedImage={editedImage} 
               onReset={handleReset}
               isProcessing={isProcessing}
             />
          </div>
        )}
      </main>

      {/* Sticky Footer Control */}
      {originalImage && (
        <PromptBar 
          onSubmit={handleEditSubmit} 
          isProcessing={isProcessing} 
        />
      )}
    </div>
  );
};

export default App;
