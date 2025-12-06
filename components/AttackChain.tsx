import React, { useEffect, useState } from 'react';
import { AttackStep } from '../types';

interface Props {
  steps: AttackStep[];
}

const AttackChain: React.FC<Props> = ({ steps }) => {
  const [visibleStep, setVisibleStep] = useState(-1);

  useEffect(() => {
    setVisibleStep(-1);
    // Animate steps appearing one by one
    steps.forEach((_, index) => {
      setTimeout(() => {
        setVisibleStep(index);
      }, index * 800 + 500);
    });
  }, [steps]);

  return (
    <div className="w-full font-mono text-sm relative space-y-4">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>
      
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`relative pl-10 transition-all duration-500 transform ${
            index <= visibleStep ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
        >
          {/* Node */}
          <div className={`absolute left-[11px] top-1 w-3 h-3 rounded-full border-2 z-10 bg-[#05070B] ${
            index <= visibleStep ? 'border-[#FF003C] shadow-[0_0_10px_#FF003C]' : 'border-gray-700'
          }`}></div>

          {/* Content Card */}
          <div className={`bg-[#05070B]/80 border-l border-[#FF003C] p-3 shadow-lg ${
            index === visibleStep ? 'border-[#FF003C] bg-[#FF003C]/5' : 'border-gray-800'
          }`}>
             <div className="flex justify-between items-start mb-1">
               <span className="text-[#FF003C] text-[10px] font-bold tracking-widest">STEP {step.step}</span>
               <span className="text-[#00F0FF] text-[10px] font-bold uppercase tracking-widest border border-[#00F0FF]/30 px-1 bg-[#00F0FF]/10">{step.gain || 'ACCESS'}</span>
             </div>
             <p className="text-gray-300 font-bold leading-tight">{step.description}</p>
             {step.vulnerable_line && (
               <div className="mt-2 text-[10px] text-gray-500 font-mono bg-black/50 p-1 border border-gray-800 truncate">
                 CODE: <span className="text-red-400">{step.vulnerable_line}</span>
               </div>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttackChain;