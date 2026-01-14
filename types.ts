export enum CaseCategory {
  SIZE = 'Market Sizing',
  ENTRY = 'Market Entry',
  LAUNCH = 'Product Launch',
  MA = 'M&A'
}

export enum Language {
  ENGLISH = 'English',
  CHINESE = 'Chinese'
}

export enum InterviewMode {
  TEXT = 'Text Chat',
  VOICE = 'Voice Interview'
}

export interface CaseScenario {
  id: string;
  title: string;
  category: CaseCategory;
  description: string;
  context: string; // The full case packet: prompt, data, and guide
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isSessionActive: boolean;
}