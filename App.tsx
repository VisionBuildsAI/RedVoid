import React, { useState, useEffect, useRef } from 'react';
import { analyzeSecurity } from './services/gemini';
import { AnalysisResult } from './types';
import MetricCard from './components/MetricCard';
import CustomRadarChart from './components/RadarChart';
import AttackChain from './components/AttackChain';
import CodeViewer from './components/CodeViewer';
import CodeEditor from './components/CodeEditor';
import RemediationPanel from './components/RemediationPanel';

const App: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'ATTACK' | 'DEFENSE'>('ATTACK');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string, type: 'info' | 'warn' | 'crit' = 'info') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    const prefix = type === 'crit' ? '[CRIT]' : type === 'warn' ? '[WARN]' : '[INFO]';
    setLogs(prev => [...prev, `${prefix} ${timeStr} :: ${msg}`]);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    addLog('REDVOID KERNEL LOADED', 'info');
    addLog('WAITING FOR TARGET SOURCE...', 'info');
  }, []);

  const handleAnalyze = async () => {
    if (!inputCode.trim()) {
      addLog('INPUT STREAM EMPTY', 'warn');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLogs([]);
    setViewMode('ATTACK');
    
    addLog('INITIATING FORENSIC SCAN', 'crit');
    addLog('MAPPING VULNERABILITY MATRIX...', 'info');

    // Simulated scan logs
    const steps = [
      'ANALYZING SYNTAX TREE',
      'DETECTING INJECTION VECTORS',
      'SIMULATING PRIVILEGE ESCALATION',
      'CALCULATING BLAST RADIUS',
      'GENERATING ATTACK CHAIN'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        addLog(steps[stepIndex] + '...', 'info');
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 700);

    try {
      const data = await analyzeSecurity(inputCode);
      clearInterval(interval);
      setResult(data);
      addLog('SCAN COMPLETE. SYSTEM COMPROMISED.', 'crit');
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || 'SYSTEM FAILURE');
      addLog(`FATAL ERROR: ${err.message}`, 'crit');
    } finally {
      setLoading(false);
    }
  };

  const isCritical = result?.metrics.risk_rating === 'CRITICAL' || result?.metrics.risk_rating === 'High';

  return (
    <div className="min-h-screen bg-[#05070B] text-[#E5E7EB] font-rajdhani flex flex-col overflow-hidden relative selection:bg-[#FF003C] selection:text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-40 z-0"></div>
      <div className="scanline z-50"></div>
      <div className="crt fixed inset-0 pointer-events-none z-50"></div>

      {/* TOP COMMAND BAR */}
      <header className="h-14 border-b border-gray-800 bg-[#05070B]/95 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-40 shrink-0 shadow-[0_5px_20px_rgba(0,0,0,0.5)]">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#FF003C] relative flex items-center justify-center animate-pulse">
             <div className="w-4 h-4 bg-black"></div>
          </div>
          <h1 className="text-xl font-orbitron font-black tracking-widest text-white glitch-text">
            RED<span className="text-[#FF003C]">VOID</span>
          </h1>
        </div>

        {/* Center: System Status */}
        <div className="hidden md:flex items-center justify-center flex-1">
          {result && (
            <div className={`px-6 py-1 border ${isCritical ? 'border-[#FF003C] bg-[#FF003C]/10' : 'border-[#00F0FF] bg-[#00F0FF]/10'} backdrop-blur-sm`}>
              <span className={`font-share-tech font-bold text-base tracking-[0.2em] ${isCritical ? 'text-[#FF003C] animate-pulse-fast' : 'text-[#00F0FF]'}`}>
                SYSTEM STATUS: {result.metrics.system_status}
              </span>
            </div>
          )}
        </div>

        {/* Right: Threat Level */}
        <div className="flex items-center gap-6">
          <div className="text-right hidden lg:block">
            <div className="text-[9px] text-gray-500 font-bold tracking-widest">NET SECURITY</div>
            <div className={`text-xs font-bold ${isCritical ? 'text-[#FF003C]' : 'text-[#00F0FF]'}`}>
              {isCritical ? 'BREACH DETECTED' : 'ENCRYPTED'}
            </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[9px] text-gray-400 font-bold tracking-wider mb-1">THREAT LEVEL</span>
             <div className="flex gap-0.5">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`w-1.5 h-4 ${result && ['Low', 'Medium', 'High', 'Critical'].indexOf(result.metrics.risk_rating) + 2 >= i ? 'bg-[#FF003C] shadow-[0_0_5px_#FF003C]' : 'bg-gray-800'}`}></div>
               ))}
             </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* LEFT PANEL: SOURCE / CODE */}
        <div className="w-full lg:w-[35%] border-r border-gray-800 bg-[#05070B]/50 flex flex-col min-h-[300px] lg:h-full relative">
          <div className="p-3 border-b border-gray-800 bg-black/40 flex justify-between items-center shrink-0">
            <span className="font-orbitron text-xs text-[#FF003C] tracking-widest font-bold">SOURCE INPUT // VULNERABLE CODE</span>
          </div>
          
          <div className="flex-1 relative bg-black/30 p-0 overflow-hidden">
            {!result ? (
               <CodeEditor 
                 value={inputCode}
                 onChange={setInputCode}
               />
            ) : (
              <CodeViewer code={inputCode} />
            )}
          </div>

          <div className="p-0 border-t border-gray-800 shrink-0">
             <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`
                w-full py-4 font-orbitron font-bold text-sm tracking-[0.2em] uppercase transition-all
                ${loading 
                  ? 'bg-gray-900 text-gray-600 cursor-not-allowed' 
                  : 'bg-[#FF003C]/10 text-[#FF003C] hover:bg-[#FF003C] hover:text-black hover:shadow-[0_0_30px_#FF003C]'
                }
              `}
            >
              {loading ? 'RUNNING FORENSICS...' : 'RE-SCAN TARGET'}
            </button>
          </div>
        </div>

        {/* CENTER & RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          
          {!result && !loading && (
             <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                <div className="w-24 h-24 border border-gray-700 rounded-full flex items-center justify-center mb-6 animate-pulse">
                   <div className="w-20 h-20 border border-gray-800 rounded-full border-dashed animate-spin-slow"></div>
                </div>
                <h2 className="font-orbitron text-2xl tracking-[0.3em] text-gray-500">AWAITING TARGET DATA</h2>
                <p className="font-mono text-xs text-gray-600 mt-2">SECURE CONNECTION ESTABLISHED</p>
             </div>
          )}

          {result && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              
              {/* MIDDLE PANEL: ATTACK CHAIN / REMEDIATION */}
              <div className="flex-1 flex flex-col border-r border-gray-800 bg-[#05070B] overflow-hidden">
                <div className="p-3 border-b border-gray-800 bg-black/40 flex justify-between items-center shrink-0">
                  <div className="flex gap-4">
                     <button 
                       onClick={() => setViewMode('ATTACK')}
                       className={`text-xs font-bold tracking-widest px-2 py-1 ${viewMode === 'ATTACK' ? 'text-[#FF003C] border-b-2 border-[#FF003C]' : 'text-gray-600 hover:text-gray-400'}`}
                     >
                       ATTACK CHAIN
                     </button>
                     <button 
                       onClick={() => setViewMode('DEFENSE')}
                       className={`text-xs font-bold tracking-widest px-2 py-1 ${viewMode === 'DEFENSE' ? 'text-[#00F0FF] border-b-2 border-[#00F0FF]' : 'text-gray-600 hover:text-gray-400'}`}
                     >
                       REMEDIATION
                     </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
                  {viewMode === 'ATTACK' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h3 className="text-[#FF003C] font-orbitron text-sm tracking-widest mb-6 border-b border-[#FF003C]/30 pb-2">
                        HOW THE SYSTEM WAS DESTROYED
                      </h3>
                      <AttackChain steps={result.attack_chain} />
                      
                      {/* Live Logs pinned to bottom of this panel */}
                      <div className="mt-8 border border-gray-800 bg-black/50">
                        <div className="bg-gray-900/50 px-2 py-1 text-[10px] text-gray-500 font-mono border-b border-gray-800">
                           LIVE_ATTACK_LOGS
                        </div>
                        <div className="h-32 overflow-y-auto custom-scrollbar p-2 font-mono text-[10px] space-y-1">
                          {logs.map((log, i) => (
                             <div key={i} className={log.includes('[CRIT]') ? 'text-[#FF003C]' : 'text-[#00F0FF]/60'}>{log}</div>
                          ))}
                          <div ref={logsEndRef} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <h3 className="text-[#00F0FF] font-orbitron text-sm tracking-widest mb-6 border-b border-[#00F0FF]/30 pb-2">
                        SECURITY PATCH PROTOCOLS
                      </h3>
                      <RemediationPanel remediations={result.remediations} />
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL: INTELLIGENCE DASHBOARD */}
              <div className="w-full lg:w-[45%] bg-[#05070B]/80 flex flex-col overflow-y-auto custom-scrollbar border-l border-gray-800">
                <div className="p-3 border-b border-gray-800 bg-black/40">
                  <span className="font-orbitron text-xs text-white tracking-widest">INTELLIGENCE DASHBOARD</span>
                </div>
                
                <div className="p-4 space-y-4">
                  
                  {/* Radar Chart Section - Enlarged */}
                  <div className="relative h-[350px] bg-black/40 p-1 flex flex-col mb-2 border border-gray-800">
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
                       <div className="w-2 h-2 bg-[#FF003C] animate-pulse rounded-full shadow-[0_0_10px_#FF003C]"></div>
                       <span className="font-orbitron text-[10px] text-gray-300 font-bold tracking-[0.2em]">ACTIVE THREAT VECTOR</span>
                    </div>
                    <CustomRadarChart defense={result.metrics.defense_readiness} exploit={result.metrics.exploit_readiness} />
                  </div>

                  {/* Grid of Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard title="BLAST RADIUS" variant="danger" className="min-h-[120px]">
                       <div className="text-sm font-bold text-gray-200 leading-tight">
                         {result.metrics.blast_radius}
                       </div>
                    </MetricCard>
                    <MetricCard title="DATA BREACH %" variant="danger" className="min-h-[120px]">
                       <div className="text-4xl font-bold text-[#FF003C] animate-pulse">
                         {result.metrics.data_breach_probability}
                       </div>
                    </MetricCard>
                  </div>

                  <MetricCard title="FINANCIAL IMPACT" variant="warning" className="min-h-[120px]" glow>
                     <div className="text-lg text-white font-rajdhani font-semibold">
                       {result.metrics.financial_damage_estimate}
                     </div>
                  </MetricCard>

                  {/* Critical Issues List */}
                  <div className="border border-gray-800 bg-black/40 p-4">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[#FF003C] text-xs font-bold tracking-widest">CRITICAL ISSUES ({result.metrics.critical_issues_count})</span>
                    </div>
                    <ul className="space-y-2">
                       {result.vulnerabilities.map((v, i) => (
                         <li key={i} className="text-[11px] text-gray-400 font-mono border-l-2 border-[#FF003C] pl-2 hover:bg-[#FF003C]/10 cursor-default transition-colors py-1">
                            <div className="font-bold text-gray-300">{v.name}</div>
                            <div className="text-[9px] text-[#FF003C]">{v.attack_type}</div>
                         </li>
                       ))}
                    </ul>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Action Footer Overlay (Optional Toggle) */}
      {result && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
          <button 
            onClick={() => setViewMode('ATTACK')}
            className={`px-8 py-3 font-orbitron font-bold text-sm tracking-widest uppercase border backdrop-blur-md transition-all shadow-lg ${
              viewMode === 'ATTACK' 
              ? 'bg-[#FF003C] text-black border-[#FF003C] shadow-[0_0_20px_#FF003C]' 
              : 'bg-black/80 text-[#FF003C] border-[#FF003C] hover:bg-[#FF003C]/20'
            }`}
          >
            ATTACK MODE
          </button>
          <button 
            onClick={() => setViewMode('DEFENSE')}
            className={`px-8 py-3 font-orbitron font-bold text-sm tracking-widest uppercase border backdrop-blur-md transition-all shadow-lg ${
              viewMode === 'DEFENSE' 
              ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_20px_#00F0FF]' 
              : 'bg-black/80 text-[#00F0FF] border-[#00F0FF] hover:bg-[#00F0FF]/20'
            }`}
          >
            DEFENSE MODE
          </button>
        </div>
      )}
    </div>
  );
};

export default App;