import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-100 to-purple-100 py-6 px-4 sm:px-6 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/PrioritizerLogo.png" 
            alt="Prioritizer Logo" 
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">TimePriority</h1>
            <p className="text-gray-600 text-sm">Optimize your time allocation</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;