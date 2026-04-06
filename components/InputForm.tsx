import React, { useState } from 'react';
import { SongLanguage, SongMood, SongOccasion, SongSpeed, SongRequest } from '../types';
import { LANGUAGES, MOODS, OCCASIONS, SPEEDS, PLACEHOLDER_SITUATIONS } from '../constants';

interface InputFormProps {
  onSubmit: (data: SongRequest) => void;
  isLoading: boolean;
}

const LANGUAGE_TOOLTIPS: Record<SongLanguage, string> = {
  [SongLanguage.English]: "Versatile styles including Pop, Rock, and Jazz. Ideal for global storytelling and modern themes.",
  [SongLanguage.Hindi]: "Expressive and poetic. Perfect for Bollywood romance, Sufi soul, or emotional depth (Dard).",
  [SongLanguage.Tamil]: "Rich in rhythm and sentiment. Ranges from high-energy Kuthu beats to deep, soulful melodies.",
  [SongLanguage.Sanskrit]: "Ancient, spiritual, and resonant. Best for mantras, meditation, hymns, and epic themes.",
  [SongLanguage.Maithili]: "Sweet and traditional. Often associated with folk tales, wedding songs (Lagni), and devotion.",
  [SongLanguage.Bengali]: "Artistic and intellectual. Famous for Rabindra Sangeet, Baul folk, and revolutionary poetry."
};

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [situation, setSituation] = useState('');
  const [mood, setMood] = useState<SongMood>(SongMood.Happy);
  const [occasion, setOccasion] = useState<SongOccasion>(SongOccasion.None);
  const [speed, setSpeed] = useState<SongSpeed>(SongSpeed.Medium);
  const [language, setLanguage] = useState<SongLanguage>(SongLanguage.English);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;
    onSubmit({ situation, mood, occasion, speed, language });
  };

  const randomPlaceholder = PLACEHOLDER_SITUATIONS[Math.floor(Math.random() * PLACEHOLDER_SITUATIONS.length)];

  return (
    <div className="w-full bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Situation Input */}
        <div className="space-y-2">
          <label htmlFor="situation" className="block text-sm font-medium text-slate-300 uppercase tracking-wider">
            What's the situation?
          </label>
          <textarea
            id="situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder={`e.g., "${randomPlaceholder}"`}
            rows={4}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-slate-500 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mood Select */}
          <div className="space-y-2">
            <label htmlFor="mood" className="block text-sm font-medium text-slate-300 uppercase tracking-wider">
              Mood
            </label>
            <div className="relative">
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value as SongMood)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 pr-10 focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Speed Select */}
          <div className="space-y-2">
            <label htmlFor="speed" className="block text-sm font-medium text-slate-300 uppercase tracking-wider">
              Speed
            </label>
            <div className="relative">
              <select
                id="speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value as SongSpeed)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 pr-10 focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
              >
                {SPEEDS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Occasion Select */}
          <div className="space-y-2">
            <label htmlFor="occasion" className="block text-sm font-medium text-slate-300 uppercase tracking-wider">
              Occasion
            </label>
            <div className="relative">
              <select
                id="occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as SongOccasion)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 pr-10 focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
              >
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Language Select */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="language" className="block text-sm font-medium text-slate-300 uppercase tracking-wider">
                Language
              </label>
              <div className="relative group cursor-help">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 md:left-1/2 md:-translate-x-1/2 mb-2 w-56 p-3 bg-slate-900/95 border border-slate-600 rounded-lg shadow-xl text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 backdrop-blur-sm">
                   <p className="font-semibold text-purple-300 mb-1">{language} Style:</p>
                   <p className="leading-relaxed">{LANGUAGE_TOOLTIPS[language]}</p>
                   {/* Tooltip Arrow */}
                   <div className="absolute top-full right-4 md:left-1/2 md:-translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-600"></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as SongLanguage)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 pr-10 focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !situation.trim()}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            isLoading || !situation.trim()
              ? 'bg-slate-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/25'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Composing...
            </span>
          ) : (
            'Generate Lyrics'
          )}
        </button>
      </form>
    </div>
  );
};