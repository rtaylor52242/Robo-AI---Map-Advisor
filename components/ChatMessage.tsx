import React from 'react';
import { Message, MessageAuthor, GroundingChunk } from '../types';
import { BotIcon } from './icons';

// A simple component to parse and render markdown-style links and newlines safely
const ParsedContent: React.FC<{ text: string }> = ({ text }) => {
  // Regex to find markdown links like [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = text.split(linkRegex);

  return (
    <>
      {parts.map((part, index) => {
        // Every 3rd part is the link text, and every 4th is the URL
        if (index % 3 === 1) {
          const url = parts[index + 1];
          return (
            <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
              {part}
            </a>
          );
        }
        if (index % 3 === 2) {
          // This is the URL part, so we skip it as it's already used in the link
          return null;
        }
        // Handle newlines in regular text parts
        return part.split('\n').map((line, i, arr) => (
          <React.Fragment key={`${index}-${i}`}>
            {line}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        ));
      })}
    </>
  );
};

const SourceLink: React.FC<{ title: string; uri: string; icon: 'web' | 'map'; }> = ({ title, uri, icon }) => {
    const commonClasses = "inline-block bg-gray-600/50 hover:bg-gray-500/50 text-gray-300 text-xs px-3 py-1 rounded-full truncate transition-colors";
    const iconChar = icon === 'map' ? '📍' : '🌐';
    
    return (
      <a
        href={uri}
        target="_blank"
        rel="noopener noreferrer"
        className={commonClasses}
        aria-label={`Open source for ${title} in a new tab`}
      >
        {iconChar} <span className="ml-1">{title}</span>
      </a>
    );
};

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.author === MessageAuthor.BOT;
  
  const renderSources = (sources: GroundingChunk[]) => {
    const allSources = sources.flatMap(chunk => {
        const items = [];
        if (chunk.web) items.push({ ...chunk.web, type: 'web' });
        if (chunk.maps) {
            items.push({ ...chunk.maps, type: 'map' });
            chunk.maps.placeAnswerSources?.reviewSnippets?.forEach(review => items.push({ ...review, type: 'map' }));
        }
        return items;
    });

    if (allSources.length === 0) return null;

    // Deduplicate sources by URI
    const uniqueSources = Array.from(new Map(allSources.map(item => [item.uri, item])).values());

    return (
        <div className="mt-3">
            <h4 className="text-xs text-gray-400 mb-2">Sources:</h4>
            <div className="flex flex-wrap gap-2">
                {uniqueSources.map((source, index) => (
                    <SourceLink key={index} title={source.title} uri={source.uri} icon={source.type as 'web' | 'map'} />
                ))}
            </div>
        </div>
    );
  };

  if (isBot) {
    return (
      <div className="flex items-start space-x-3 max-w-4xl mr-auto">
        <div className="bg-gray-700 rounded-full p-2 mt-1">
          <BotIcon />
        </div>
        <div className="flex-1 bg-gray-800 rounded-lg rounded-tl-none p-4">
          <div className="text-gray-200 prose prose-invert prose-sm max-w-none">
            <ParsedContent text={message.text} />
          </div>
          {message.sources && renderSources(message.sources)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="bg-cyan-700 rounded-lg rounded-br-none p-4 max-w-4xl">
        <p className="text-white">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;