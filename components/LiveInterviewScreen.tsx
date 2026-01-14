import React, { useEffect, useState, useRef } from 'react';
import { CaseScenario, Language } from '../types';
import { connectLiveInterview } from '../services/gemini';
import Button from './Button';

interface LiveInterviewScreenProps {
  scenario: CaseScenario;
  language: Language;
  onEndSession: () => void;
}

interface TranscriptItem {
  id: string;
  text: string;
  isUser: boolean;
  isFinal: boolean;
}

const LiveInterviewScreen: React.FC<LiveInterviewScreenProps> = ({ scenario, language, onEndSession }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('connecting');
  const [isWaitingForFirstResponse, setIsWaitingForFirstResponse] = useState(true);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  
  // PTT State: false = Idle/Listening, true = User Speaking
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const connectionRef = useRef<{ disconnect: () => Promise<void>; setMuted: (m: boolean) => void; } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const startSession = async () => {
      try {
        const connection = await connectLiveInterview({
          scenario,
          language,
          onAudioData: (buffer) => {
            if (isMounted) {
              setIsWaitingForFirstResponse(false);
            }
          },
          onTranscription: (text, isUser, isFinal) => {
            if (!isMounted) return;
            setTranscripts(prev => {
              const last = prev[prev.length - 1];
              if (last && last.isUser === isUser && !last.isFinal) {
                const newItems = [...prev];
                newItems[prev.length - 1] = {
                  ...last,
                  text: last.text + text, 
                  isFinal: isFinal
                };
                return newItems;
              } else {
                return [...prev, {
                  id: Date.now().toString() + Math.random(),
                  text,
                  isUser,
                  isFinal
                }];
              }
            });
          },
          onClose: () => {
            if (isMounted) setStatus('disconnected');
          }
        });

        if (!isMounted) {
          connection.disconnect();
          return;
        }

        connectionRef.current = connection;
        setStatus('connected');
        
        setTimeout(() => {
            if (isMounted) setIsWaitingForFirstResponse(false);
        }, 3000); 

        connection.setMuted(true);
        
      } catch (err) {
        console.error("Failed to start live session", err);
        if (isMounted) setStatus('error');
      }
    };

    startSession();

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        connectionRef.current.disconnect();
      }
    };
  }, [scenario, language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleToggleMic = () => {
    if (!connectionRef.current || status !== 'connected') return;

    if (isWaitingForFirstResponse) setIsWaitingForFirstResponse(false);

    if (isUserSpeaking) {
      setIsUserSpeaking(false);
      connectionRef.current.setMuted(true); 
      showToast("已发送作答");
    } else {
      setIsUserSpeaking(true);
      connectionRef.current.setMuted(false); 
    }
  };

  const handleEndCall = () => {
    showToast("面试结束，正在退出...");
    setTimeout(() => {
        onEndSession();
    }, 1000);
  };

  let statusText = '';
  let statusColorClass = '';
  let pulseColorClass = '';

  if (status === 'connecting') {
    statusText = '正在建立连线...';
    statusColorClass = 'bg-yellow-500';
    pulseColorClass = 'bg-yellow-500/20';
  } else if (status === 'connected') {
    if (isWaitingForFirstResponse) {
      statusText = '面试官正在准备 Case...';
      statusColorClass = 'bg-amber-500 animate-pulse';
      pulseColorClass = 'bg-amber-500/20';
    } else if (isUserSpeaking) {
      statusText = '正在面试中'; 
      statusColorClass = 'bg-red-500 animate-pulse';
      pulseColorClass = 'bg-red-500/20';
    } else {
      statusText = '面试进行中';
      statusColorClass = 'bg-emerald-500';
      pulseColorClass = 'bg-emerald-600/20';
    }
  } else if (status === 'error') {
    statusText = '连线失败';
    statusColorClass = 'bg-red-500';
    pulseColorClass = 'bg-red-500/20';
  } else {
    statusText = '已断开连线';
    statusColorClass = 'bg-gray-500';
    pulseColorClass = 'bg-slate-800';
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-full shadow-lg z-50 animate-fade-in-up text-sm font-medium">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-bold text-lg">{scenario.title}</h2>
            <span className="text-xs text-slate-400 uppercase tracking-wide">
               BCG Pre-talk • {language}
            </span>
          </div>
        </div>
        <Button variant="danger" onClick={handleEndCall} className="text-sm py-1 px-3">
          退出面试
        </Button>
      </header>

      {/* Main Visual Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        {/* Status Indicator */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700 shadow-md">
          <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${statusColorClass}`}></div>
          <span className="text-sm font-medium text-slate-300 transition-all duration-300">
            {statusText}
          </span>
        </div>

        {/* Central Visualizer */}
        <div className="relative mb-8">
            <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 bg-slate-800`}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${pulseColorClass} ${
                    (isUserSpeaking || (status === 'connected' && !isWaitingForFirstResponse && !isUserSpeaking)) ? 'animate-pulse' : ''
                }`}>
                     {isWaitingForFirstResponse && status === 'connected' ? (
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-amber-400 animate-spin">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                       </svg>
                     ) : isUserSpeaking ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                        </svg>
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-16 h-16 transition-colors duration-300 ${status === 'connected' ? 'text-emerald-400' : 'text-slate-500'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                     )}
                </div>
            </div>
            
             {status === 'connected' && !isWaitingForFirstResponse && !isUserSpeaking && (
                 <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-pulse"></div>
             )}
             {isUserSpeaking && (
                  <div className="absolute inset-0 rounded-full border border-red-500/30 animate-[ping_1.5s_ease-out_infinite]"></div>
             )}
        </div>

        {/* Live Transcript */}
        <div className="w-full max-w-2xl h-48 bg-black/20 rounded-xl p-4 overflow-y-auto backdrop-blur-sm border border-white/5 scrollbar-hide" ref={scrollRef}>
            {transcripts.length === 0 && (
                <div className="text-slate-500 text-center mt-10 italic flex flex-col items-center gap-2">
                   {status === 'connecting' ? '正在连接面试官...' : '点击下方按钮开始作答...'}
                </div>
            )}
            {transcripts.map((t, i) => (
                <div key={t.id || i} className={`mb-3 ${t.isUser ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-3 py-1.5 rounded-lg text-sm ${
                        t.isUser ? 'bg-slate-700 text-slate-200' : 'bg-emerald-900/50 text-emerald-100'
                    }`}>
                        {t.text}
                    </span>
                </div>
            ))}
        </div>
      </div>

      {/* Footer Controls - PTT Style */}
      <div className="bg-slate-800 p-6 flex flex-col justify-center items-center border-t border-slate-700 relative z-20">
        <button 
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-lg border-4 ${
                isUserSpeaking 
                ? 'bg-red-500 border-red-700 hover:bg-red-600 shadow-red-900/50' 
                : 'bg-emerald-600 border-emerald-800 hover:bg-emerald-700 shadow-emerald-900/50'
            }`}
            onClick={handleToggleMic}
            disabled={status !== 'connected'}
        >
             {isUserSpeaking ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
             ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
             )}
        </button>
        <div className="mt-3 text-sm font-semibold text-slate-200 tracking-wide">
            {isUserSpeaking ? "结束面试" : "点击开始作答"}
        </div>
      </div>
    </div>
  );
};

export default LiveInterviewScreen;