import React from 'react';

interface TimeInputProps {
  totalTime: number;
  onTotalTimeChange: (newTime: number) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ totalTime, onTotalTimeChange }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-transparent mb-8">
      <h2 className="text-xl font-bold mb-5 text-gray-800">Total available time per week</h2>
      <div className="flex items-center">
        <input
          type="number"
          min="1"
          max="168"
          value={totalTime}
          onChange={(e) => onTotalTimeChange(Number(e.target.value))}
          className="w-24 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
        />
        <span className="ml-3 text-gray-600">hours</span>
        
        <div className="ml-6 flex items-center">
          <button
            onClick={() => onTotalTimeChange(Math.max(1, totalTime - 1))}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-l-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M5 12h14" />
            </svg>
          </button>
          <button
            onClick={() => onTotalTimeChange(Math.min(168, totalTime + 1))}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-r-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeInput;