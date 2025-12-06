import React, { useRef, useState } from 'react';

interface Props {
  code: string;
  vulnerableLines?: string[];
}

const CodeViewer: React.FC<Props> = ({ code }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const lines = code.split('\n');

  return (
    <div className="flex h-full font-mono text-xs bg-black/30 border border-gray-800 relative group">
       {/* Line Numbers Column */}
       <div className="w-12 flex-shrink-0 bg-[#05070B] border-r border-gray-800 text-gray-600 text-right pr-3 pt-4 select-none overflow-hidden leading-5">
          <div style={{ transform: `translateY(-${scrollTop}px)` }}>
            {lines.map((_, i) => (
              <div key={i} className="h-5">{i + 1}</div>
            ))}
          </div>
       </div>

       {/* Code Content Column */}
       <div 
         className="flex-1 overflow-auto custom-scrollbar pt-4 pl-4 leading-5"
         onScroll={handleScroll}
         ref={contentRef}
       >
          {lines.map((line, i) => {
            const isDanger = /eval\(|exec\(|innerHTML|query\s*\(|admin|password|token|secret|key/i.test(line);
            const isComment = line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('#') || line.trim().startsWith('=') || line.trim().startsWith('-');
            const isHeader = line.includes('FILE:') || line.includes('===');

            let textColor = 'text-gray-300';
            if (isDanger) textColor = 'text-red-300';
            else if (isHeader) textColor = 'text-[#00F0FF] font-bold';
            else if (isComment) textColor = 'text-gray-500';

            return (
              <div key={i} className={`h-5 whitespace-pre ${isDanger ? 'bg-[#FF003C]/10' : ''} ${textColor}`}>
                {line || ' '}
              </div>
            );
          })}
          {/* Extra space at bottom to allow scrolling past last line */}
          <div className="h-20"></div>
       </div>
       
       <div className="absolute top-0 right-0 p-2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest bg-black/90 px-2 py-1 border border-gray-800">READ_ONLY</span>
       </div>
    </div>
  );
};

export default CodeViewer;