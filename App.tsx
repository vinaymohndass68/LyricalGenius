import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { LyricsCard } from './components/LyricsCard';
import { generateSongLyrics } from './services/geminiService';
import { GeneratedSong, SongRequest } from './types';

function App() {
  const [song, setSong] = useState<GeneratedSong | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (request: SongRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateSongLyrics(request);
      setSong(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong while composing your song.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSong(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center justify-start min-h-screen">
        
        {/* Header */}
        <header className="text-center mb-12 max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🎼</span>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              LyricalGenius
            </h1>
          </div>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
            Turn your life moments into music. Describe a situation, pick a vibe, and let AI write the hit song of your life.
          </p>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-2xl transition-all duration-500 ease-in-out">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {!song ? (
            <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
          ) : (
            <LyricsCard song={song} onReset={handleReset} />
          )}
        </main>

        <footer className="mt-20 text-slate-600 text-sm">
           &copy; {new Date().getFullYear()} LyricalGenius. Powered by Google Gemini.
        </footer>
      </div>
    </div>
  );
}

export default App;