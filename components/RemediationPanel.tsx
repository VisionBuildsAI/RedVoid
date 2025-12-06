import React from 'react';
import { Remediation } from '../types';

interface Props {
  remediations: Remediation[];
}

const RemediationPanel: React.FC<Props> = ({ remediations }) => {
  return (
    <div className="space-y-4">
      {remediations.map((rem, index) => (
        <div key={index} className="border border-[#00F0FF]/30 bg-[#00F0FF]/5 p-4 relative group hover:border-[#00F0FF] transition-all">
          <div className="absolute top-0 right-0 p-1">
             <div className="text-[#00F0FF] text-[10px] font-bold tracking-widest opacity-50">PATCH_ID_{index + 4000}</div>
          </div>
          <h4 className="text-[#00F0FF] font-bold text-sm mb-2 flex items-center gap-2">
            <span className="text-lg">🛡</span> {rem.issue}
          </h4>
          <p className="text-gray-300 text-xs mb-3">{rem.fix}</p>
          <div className="bg-black border border-gray-800 p-2 relative">
             <div className="absolute top-0 left-0 bg-[#00F0FF] text-black text-[9px] font-bold px-1">SECURE_CODE</div>
             <pre className="font-mono text-[10px] text-green-400 overflow-x-auto pt-4">
               {rem.code_snippet}
             </pre>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RemediationPanel;