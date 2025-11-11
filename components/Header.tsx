import React from 'react';

const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0-6V4m0 6h6m-6 0H3m6 0l6 3m-6-3l-6-3m6 3l6-3" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center space-x-3">
        <MapIcon/>
        <div>
            <h1 className="text-xl font-bold text-white">Robo AI - Map Advisor</h1>
            <p className="text-xs text-gray-400">Powered by Gemini, Google Maps & Search</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
