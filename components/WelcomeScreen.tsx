import React, { useState } from 'react';
import { CASE_LIBRARY } from '../constants';
import { CaseScenario, Language, CaseCategory, InterviewMode } from '../types';
import Button from './Button';

interface WelcomeScreenProps {
  onStart: (scenario: CaseScenario, lang: Language, mode: InterviewMode) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(Language.CHINESE);
  const [mode, setMode] = useState<InterviewMode>(InterviewMode.TEXT);

  const categories = Object.values(CaseCategory);

  const handleStart = () => {
    const scenario = CASE_LIBRARY.find(c => c.id === selectedCaseId);
    if (scenario) {
      onStart(scenario, language, mode);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">BCG Pre-talk AI Coach</h1>
        <p className="text-gray-600">Select a case scenario to begin your mock interview.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        
        {/* Controls Panel */}
        <div className="md:col-span-3 grid md:grid-cols-2 gap-6">
            {/* Language Selection */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Interview Language</h2>
            <div className="flex gap-3">
                <button
                onClick={() => setLanguage(Language.CHINESE)}
                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    language === Language.CHINESE 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
                >
                中文 (Chinese)
                </button>
                <button
                onClick={() => setLanguage(Language.ENGLISH)}
                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    language === Language.ENGLISH 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
                >
                English
                </button>
            </div>
            </div>

            {/* Mode Selection */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Interaction Mode</h2>
            <div className="flex gap-3">
                <button
                onClick={() => setMode(InterviewMode.TEXT)}
                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    mode === InterviewMode.TEXT 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
                >
                <span className="block text-lg">💬</span> Text Chat
                </button>
                <button
                onClick={() => setMode(InterviewMode.VOICE)}
                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    mode === InterviewMode.VOICE 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
                >
                <span className="block text-lg">🎙️</span> Voice Live
                </button>
            </div>
            </div>
        </div>

        {/* Case Selection */}
        <div className="md:col-span-3 space-y-6">
          {categories.map((cat) => (
            <div key={cat} className="space-y-3">
              <h3 className="text-md font-bold text-gray-700 uppercase tracking-wider text-xs ml-1">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CASE_LIBRARY.filter(c => c.category === cat).map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedCaseId(scenario.id)}
                    className={`text-left p-4 rounded-xl border transition-all hover:shadow-md ${
                      selectedCaseId === scenario.id
                        ? 'border-emerald-600 ring-1 ring-emerald-600 bg-white'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{scenario.title}</div>
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">{scenario.description}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 flex justify-center z-10">
        <Button 
          onClick={handleStart} 
          disabled={!selectedCaseId}
          className="w-full max-w-md shadow-lg text-lg py-3"
        >
          {mode === InterviewMode.VOICE ? 'Start Live Voice Interview' : 'Start Text Interview'}
        </Button>
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default WelcomeScreen;