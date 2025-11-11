import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Message, MessageAuthor, Coordinates } from './types';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-message',
      author: MessageAuthor.BOT,
      text: "Hello! I'm Robo AI, your map advisor. Ask me about places, or any general question. I'll use Google Maps and Search to find the best information for you.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (geoError) => {
        setError("Could not get your location. Map-related queries may be less accurate. Please enable location services in your browser.");
        console.error("Geolocation error:", geoError);
      }
    );
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      author: MessageAuthor.USER,
      text: inputText,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      if (!chatSession.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        chatSession.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
              tools: [{googleSearch: {}}, {googleMaps: {}}],
              toolConfig: coordinates ? {
                retrievalConfig: {
                  latLng: {
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                  }
                }
              } : undefined,
            },
        });
      }
      
      const response = await chatSession.current.sendMessage({ message: inputText });

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        author: MessageAuthor.BOT,
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error("Gemini API error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Sorry, I ran into an issue: ${errorMessage}`);
      const botErrorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        author: MessageAuthor.BOT,
        text: `Sorry, I couldn't get a response. Please try again. Error: ${errorMessage}`,
      };
      setMessages(prev => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, coordinates]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <Header />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
            <div className="flex justify-start items-center space-x-3">
                 <div className="p-3 rounded-full bg-gray-700 animate-pulse"></div>
                 <div className="p-3 rounded-full bg-gray-700 animate-pulse delay-200"></div>
                 <div className="p-3 rounded-full bg-gray-700 animate-pulse delay-400"></div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="px-4 pb-2 text-red-400 text-sm text-center">
            {error}
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;