import React, { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const CodeEditor: React.FC<Props> = ({ value, onChange, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = () => {
    if (textareaRef.current) {
      setScrollTop(textareaRef.current.scrollTop);
    }
  };

  const lineCount = value.split('\n').length;
  // Generate line numbers based exactly on the content length
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="relative w-full h-full flex bg-black/30 font-mono text-xs overflow-hidden border border-gray-800 focus-within:border-[#FF003C]/50 transition-colors group">
      
      {/* Line Numbers */}
      <div 
        className="w-12 bg-[#05070B] border-r border-gray-800 text-gray-600 text-right pr-3 pt-4 select-none overflow-hidden leading-5 shrink-0"
      >
        <div style={{ transform: `translateY(-${scrollTop}px)` }}>
          {lines.map(line => (
            <div key={line} className="h-5">{line}</div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        disabled={disabled}
        spellCheck={false}
        placeholder="// PASTE TARGET SOURCE CODE HERE..."
        className={`
          flex-1 bg-transparent text-gray-300 p-4 leading-5 h-full w-full resize-none focus:outline-none 
          custom-scrollbar caret-[#FF003C] selection:bg-[#FF003C]/30 whitespace-pre
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />

      {/* Status Bar */}
      <div className="absolute bottom-0 right-0 bg-[#05070B] border-t border-l border-gray-800 px-2 py-1 text-[9px] text-gray-500 font-bold tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        LINES: {lineCount} // MODE: {disabled ? 'LOCKED' : 'INSERT'}
      </div>
    </div>
  );
};

export default CodeEditor;