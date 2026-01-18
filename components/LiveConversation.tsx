import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, LiveSession } from "@google/genai";
import { encode, decode, decodeAudioData } from '../utils/audioUtils';
import type { TranscriptEntry } from '../types';

const LiveConversation: React.FC = () => {
    // State management
    const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Refs for audio processing and session management
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const currentInputTranscriptionRef = useRef<string>('');
    const currentOutputTranscriptionRef = useRef<string>('');

    const API_KEY = process.env.API_KEY;

    const cleanup = useCallback(() => {
        console.log("Cleaning up resources...");

        // Stop media stream tracks
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;

        // Disconnect and close audio contexts
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;

        inputAudioContextRef.current?.close().catch(console.error);
        inputAudioContextRef.current = null;

        outputAudioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current = null;

        // Close the live session
        sessionPromiseRef.current?.then(session => {
            console.log("Closing session");
            session.close();
        }).catch(console.error);
        sessionPromiseRef.current = null;

        // Clear refs
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        currentInputTranscriptionRef.current = '';
        currentOutputTranscriptionRef.current = '';

    }, []);

    useEffect(() => {
        // This effect ensures cleanup is called when the component unmounts.
        return () => {
            cleanup();
        };
    }, [cleanup]);

    const stopConversation = () => {
        cleanup();
        setStatus('idle');
        setTranscript([]); // Optionally clear transcript on stop
    };
    
    const startConversation = async () => {
        if (status !== 'idle' && status !== 'error') return;

        setStatus('connecting');
        setErrorMessage('');
        setTranscript([]);

        try {
            if (!API_KEY) throw new Error("API_KEY environment variable not set");
            const ai = new GoogleGenAI({ apiKey: API_KEY });

            // Initialize audio contexts
            // FIX: Cast window to `any` to support `webkitAudioContext` for older browsers without TypeScript errors.
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            // FIX: Cast window to `any` to support `webkitAudioContext` for older browsers without TypeScript errors.
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: 'You are Arcana, a wise, empathetic, and modern esoteric guide. Your interpretations blend the timeless wisdom of the Tarot with spiritual insight. Your voice is insightful, empowering, and poetic. Keep your responses concise and conversational.',
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        console.log("Session opened.");
                        setStatus('active');
                        
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            
                            sessionPromiseRef.current?.then(session => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle transcription
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                        }
                        if (message.serverContent?.turnComplete) {
                            const fullInput = currentInputTranscriptionRef.current.trim();
                            const fullOutput = currentOutputTranscriptionRef.current.trim();
                            
                            setTranscript(prev => {
                                let newTranscript = [...prev];
                                if (fullInput) newTranscript.push({ speaker: 'user', text: fullInput });
                                if (fullOutput) newTranscript.push({ speaker: 'model', text: fullOutput });
                                return newTranscript;
                            });

                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                        }

                        // Handle audio playback
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const outputCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            
                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                            });
                            
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                         // Handle interruptions
                        if (message.serverContent?.interrupted) {
                            for (const source of sourcesRef.current.values()) {
                                source.stop();
                                sourcesRef.current.delete(source);
                            }
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error("Session error:", e);
                        setErrorMessage("A connection error occurred. Please try again.");
                        setStatus('error');
                        cleanup();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log("Session closed.");
                        if (status !== 'error') {
                            setStatus('idle');
                        }
                    },
                },
            });
        } catch (error) {
            console.error("Failed to start conversation:", error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            setErrorMessage(`Failed to start: ${message}`);
            setStatus('error');
            cleanup();
        }
    };
    
    const renderStatusIndicator = () => {
        switch (status) {
            case 'idle':
                return <p className="text-gray-500 dark:text-gray-400 text-center mt-4">Tap the microphone to start a live conversation with Arcana.</p>;
            case 'connecting':
                return <p className="text-gray-500 dark:text-gray-400 text-center mt-4">Connecting to the ether...</p>;
            case 'active':
                return <p className="text-green-500 font-semibold text-center mt-4">Listening...</p>;
            case 'error':
                 return <p className="text-red-500 text-center mt-4">{errorMessage}</p>;
            default:
                return null;
        }
    };
    
    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex flex-col items-center animate-fade-in h-[75vh]">
            <h2 className="font-serif-brand text-3xl text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Live Reading</h2>

            {/* Transcript Display */}
            <div className="w-full flex-grow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 overflow-y-auto shadow-inner">
                {transcript.length === 0 && status !== 'active' && (
                    <p className="text-gray-400 dark:text-gray-500 text-center my-auto">Your conversation will appear here.</p>
                )}
                <div className="space-y-4">
                    {transcript.map((entry, index) => (
                        <div key={index} className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <p className={`inline-block rounded-lg px-3 py-2 max-w-[80%] ${entry.speaker === 'user' ? 'bg-gray-800 dark:bg-gray-700 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'}`}>
                                {entry.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center">
                 <button 
                    onClick={status === 'active' ? stopConversation : startConversation}
                    disabled={status === 'connecting'}
                    className="flex items-center justify-center w-20 h-20 rounded-full text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
                    aria-label={status === 'active' ? 'Stop conversation' : 'Start conversation'}
                    style={{ backgroundColor: status === 'active' ? '#E53E3E' : '#2D3748' }} // red-600 : gray-800 (kept hardcoded as these are specific UI controls)
                >
                    {status === 'connecting' ? (
                        <div className="w-8 h-8 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            {status === 'active' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> // Close Icon
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /> // Mic Icon
                            )}
                        </svg>
                    )}
                </button>
                {renderStatusIndicator()}
            </div>
        </div>
    );
};

export default LiveConversation;
