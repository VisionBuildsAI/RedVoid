import React from 'react';

interface Props {
  code: string;
  vulnerableLines?: string[];
}

const CodeViewer: React.FC<Props> = ({ code }) => {
  return (
    <div className="relative font-mono text-xs text-gray-400 leading-relaxed overflow-x-auto custom-scrollbar h-full">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-black/50 border-r border-gray-800 text-gray-700 text-right pr-2 pt-4 select-none">
        {code.split('\n').map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="pl-10 pt-4 pb-4">
        {code.split('\n').map((line, i) => {
          // Simple heuristic for marking lines red if they look dangerous (basic visual only)
          const isDanger = /eval\(|exec\(|innerHTML|query\s*\(|admin|password|token/i.test(line);
          return (
            <div key={i} className={`whitespace-pre px-2 ${isDanger ? 'bg-[#FF003C]/10 text-red-300 border-l-2 border-[#FF003C]' : ''}`}>
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodeViewer;