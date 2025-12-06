import React from 'react';
import { ProjectFile } from '../types';

interface Props {
  files: ProjectFile[];
  activeFileIndex: number;
  onSelectFile: (index: number) => void;
  onAddFile: () => void;
  disabled: boolean;
}

const FileTabs: React.FC<Props> = ({ files, activeFileIndex, onSelectFile, onAddFile, disabled }) => {
  return (
    <div className="flex items-center bg-[#05070B] border-b border-gray-800 overflow-x-auto custom-scrollbar">
      {files.map((file, index) => (
        <button
          key={index}
          onClick={() => onSelectFile(index)}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold tracking-wider border-r border-gray-800 transition-all min-w-[120px]
            ${activeFileIndex === index 
              ? 'bg-[#FF003C]/10 text-[#FF003C] border-b-2 border-b-[#FF003C]' 
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border-b-2 border-b-transparent'
            }
          `}
        >
           <span className={`${activeFileIndex === index ? 'opacity-100' : 'opacity-50'}`}>
             {file.language === 'python' ? '🐍' : file.language === 'javascript' ? '⚡' : file.language === 'c' ? '⚙️' : '📄'}
           </span>
           {file.name}
        </button>
      ))}
      <button 
        onClick={onAddFile}
        disabled={disabled}
        className="px-4 text-gray-600 hover:text-[#00F0FF] transition-colors font-bold text-lg"
        title="Add New File"
      >
        +
      </button>
    </div>
  );
};

export default FileTabs;