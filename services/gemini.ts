import { GoogleGenAI, Chat, LiveServerMessage, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION_TEMPLATE } from '../constants';
import { CaseScenario, Language } from '../types';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from './audioUtils';

// Do not cache the client globally to ensure fresh configuration
const createAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Text Chat Logic ---

export const startInterviewSession = async (
  selectedCase: CaseScenario,
  language: Language
): Promise<string> => {
  const ai = createAIClient();
  const modelId = 'gemini-3-flash-preview';

  const chatSession = ai.chats.create({
    model: modelId,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_TEMPLATE(selectedCase, language, false),
      temperature: 0.7,
    },
  });

  activeTextChatSession = chatSession;

  const result = await chatSession.sendMessage({ message: "Hello. Ready to start." });
  return result.text || "Hello, I am your interviewer today. Let's begin.";
};

let activeTextChatSession: Chat | null = null;

export const sendMessageToAI = async function* (message: string) {
  if (!activeTextChatSession) {
    throw new Error("Chat session not initialized.");
  }

  const resultStream = await activeTextChatSession.sendMessageStream({ message });

  for await (const chunk of resultStream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
};

// --- Live Voice Logic ---

interface LiveSessionConfig {
  scenario: CaseScenario;
  language: Language;
  onAudioData: (buffer: AudioBuffer) => void;
  onTranscription: (text: string, isUser: boolean, isFinal: boolean) => void;
  onClose: () => void;
}

export const connectLiveInterview = async (config: LiveSessionConfig) => {
  const ai = createAIClient();
  const modelId = 'gemini-2.5-flash-native-audio-preview-12-2025';
  
  const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  
  if (inputCtx.state === 'suspended') await inputCtx.resume();
  if (outputCtx.state === 'suspended') await outputCtx.resume();

  let nextStartTime = 0;
  const sources = new Set<AudioBufferSourceNode>();
  
  let stream: MediaStream | null = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    console.error("Failed to get user media", err);
    throw new Error("Microphone permission denied");
  }

  // PTT Logic: Only send if NOT muted
  let isMicMuted = true; 

  const sessionPromise = ai.live.connect({
    model: modelId,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_TEMPLATE(config.scenario, config.language, true),
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
      },
      inputAudioTranscription: {}, 
      outputAudioTranscription: {} 
    },
    callbacks: {
      onopen: () => {
        console.log("Live session connected");
        
        const source = inputCtx.createMediaStreamSource(stream!);
        const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
        
        scriptProcessor.onaudioprocess = (e) => {
          if (isMicMuted) return;

          const inputData = e.inputBuffer.getChannelData(0);
          const pcmBlob = createPcmBlob(inputData);
          
          sessionPromise.then(session => {
            try {
              session.sendRealtimeInput({ media: pcmBlob });
            } catch (err) {
               console.debug("Failed to send audio chunk", err);
            }
          }).catch(err => {
            console.error("Session not available for input", err);
          });
        };
        
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputCtx.destination);
      },
      
      onmessage: async (msg: LiveServerMessage) => {
        const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          try {
            const audioData = base64ToUint8Array(base64Audio);
            const audioBuffer = await decodeAudioData(audioData, outputCtx);
            
            nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
            const source = outputCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputCtx.destination);
            
            source.start(nextStartTime);
            nextStartTime += audioBuffer.duration;
            
            sources.add(source);
            source.addEventListener('ended', () => {
              sources.delete(source);
            });
            
            config.onAudioData(audioBuffer);
            
          } catch (e) {
            console.error("Error decoding audio", e);
          }
        }

        if (msg.serverContent?.outputTranscription?.text) {
          config.onTranscription(msg.serverContent.outputTranscription.text, false, false);
        }
        if (msg.serverContent?.inputTranscription?.text) {
          config.onTranscription(msg.serverContent.inputTranscription.text, true, false);
        }
        
        if (msg.serverContent?.interrupted) {
          for (const source of sources) {
            try { source.stop(); } catch (e) {}
            sources.delete(source);
          }
          sources.clear();
          nextStartTime = outputCtx.currentTime;
        }
        
        if (msg.serverContent?.turnComplete) {
           config.onTranscription("", false, true); 
        }
      },
      
      onclose: () => {
        console.log("Session closed");
        config.onClose();
      },
      
      onerror: (err) => {
        console.error("Session fatal error", err);
        config.onClose();
      }
    }
  });

  return {
    setMuted: (muted: boolean) => {
      isMicMuted = muted;
    },
    disconnect: async () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (inputCtx.state !== 'closed') {
        try { await inputCtx.close(); } catch (e) {}
      }
      if (outputCtx.state !== 'closed') {
        try { await outputCtx.close(); } catch (e) {}
      }
      
      try {
        const session = await sessionPromise;
        session.close(); 
      } catch (e) {}
    }
  };
};