import React, { useState, useRef, useEffect } from 'react';
import { Message, CaseScenario } from '../types';
import { sendMessageToAI } from '../services/gemini';
import Button from './Button';

interface ChatScreenProps {
  initialMessage: string;
  scenario: CaseScenario;
  onEndSession: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ initialMessage, scenario, onEndSession }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: initialMessage, timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      let fullResponse = '';
      const responseMsgId = (Date.now() + 1).toString();
      
      // Add placeholder for streaming
      setMessages(prev => [...prev, {
        id: responseMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      const stream = sendMessageToAI(userMsg.text);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === responseMsgId ? { ...msg, text: fullResponse } : msg
        ));
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting to the server. Please check your API key or internet connection.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple formatter for line breaks and bold text in messages
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => 
          part.startsWith('**') && part.endsWith('**') ? 
            <strong key={j}>{part.slice(2, -2)}</strong> : part
        )}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h2 className="font-bold text-gray-800">{scenario.title}</h2>
          <span className="text-xs text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded">
            {scenario.category}
          </span>
        </div>
        <Button variant="danger" onClick={onEndSession} className="text-sm">
          End Interview
        </Button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm text-sm sm:text-base leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}
            >
              {formatText(msg.text)}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response here... (Shift+Enter for new line)"
            className="flex-1 resize-none border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[50px] max-h-[150px] overflow-y-auto"
            rows={1}
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputText.trim() || isTyping}
            className="self-end"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;