import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import WelcomeScreen from './components/WelcomeScreen';
import ChatScreen from './components/ChatScreen';
import LiveInterviewScreen from './components/LiveInterviewScreen';
import { CaseScenario, Language, InterviewMode } from './types';
import { startInterviewSession } from './services/gemini';

enum Screen {
  WELCOME,
  LOADING,
  CHAT_TEXT,
  CHAT_VOICE
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.WELCOME);
  const [activeScenario, setActiveScenario] = useState<CaseScenario | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<Language>(Language.CHINESE);
  const [initialMessage, setInitialMessage] = useState<string>('');

  const handleStartInterview = async (scenario: CaseScenario, lang: Language, mode: InterviewMode) => {
    setActiveScenario(scenario);
    setActiveLanguage(lang);

    if (mode === InterviewMode.VOICE) {
      // For voice, we jump straight to the component which handles connection
      setCurrentScreen(Screen.CHAT_VOICE);
    } else {
      // For text, we pre-load the opening message
      setCurrentScreen(Screen.LOADING);
      try {
        const introMsg = await startInterviewSession(scenario, lang);
        setInitialMessage(introMsg);
        setCurrentScreen(Screen.CHAT_TEXT);
      } catch (error) {
        console.error("Failed to start session:", error);
        alert("Failed to initialize the AI interviewer. Please check your API key configuration.");
        setCurrentScreen(Screen.WELCOME);
      }
    }
  };

  const handleEndSession = () => {
    // Removed confirm dialog to ensure instant and reliable navigation
    setActiveScenario(null);
    setInitialMessage('');
    setCurrentScreen(Screen.WELCOME);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {currentScreen === Screen.WELCOME && (
        <WelcomeScreen onStart={handleStartInterview} />
      )}

      {currentScreen === Screen.LOADING && (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin"></div>
          <h3 className="text-xl font-medium text-gray-700">Preparing Case Materials...</h3>
          <p className="text-gray-500 text-sm">Reviewing "{activeScenario?.title}"</p>
        </div>
      )}

      {currentScreen === Screen.CHAT_TEXT && activeScenario && (
        <ChatScreen 
          initialMessage={initialMessage} 
          scenario={activeScenario} 
          onEndSession={handleEndSession}
        />
      )}

      {currentScreen === Screen.CHAT_VOICE && activeScenario && (
        <LiveInterviewScreen 
          scenario={activeScenario}
          language={activeLanguage}
          onEndSession={handleEndSession}
        />
      )}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;