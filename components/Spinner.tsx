import React from 'react';

const Spinner: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
  </div>
);

export default Spinner;