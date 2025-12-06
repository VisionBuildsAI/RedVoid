import React from 'react';

interface MetricCardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'danger' | 'warning' | 'info' | 'default';
  className?: string;
  glow?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, children, variant = 'default', className = '', glow = false }) => {
  let borderColor = 'border-gray-800';
  let titleColor = 'text-gray-500';
  let glowClass = '';

  if (variant === 'danger') {
    borderColor = 'border-[#FF003C]';
    titleColor = 'text-[#FF003C]';
    if (glow) glowClass = 'shadow-[0_0_20px_rgba(255,0,60,0.1)]';
  } else if (variant === 'warning') {
    borderColor = 'border-[#FF9F00]';
    titleColor = 'text-[#FF9F00]';
    if (glow) glowClass = 'shadow-[0_0_20px_rgba(255,159,0,0.1)]';
  } else if (variant === 'info') {
    borderColor = 'border-[#00F0FF]';
    titleColor = 'text-[#00F0FF]';
    if (glow) glowClass = 'shadow-[0_0_20px_rgba(0,240,255,0.1)]';
  }

  return (
    <div className={`glass-panel p-5 flex flex-col h-full min-h-[160px] relative transition-all duration-300 ${borderColor} border-l-2 ${glowClass} ${className}`}>
      {/* Decorative corners */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20"></div>
      
      <h3 className={`font-orbitron text-xs tracking-[0.2em] font-bold uppercase mb-3 ${titleColor} flex items-center gap-2 shrink-0`}>
        {variant === 'danger' && <span className="w-1.5 h-1.5 bg-[#FF003C] rounded-full animate-pulse"></span>}
        {title}
      </h3>
      
      <div className="flex-1 flex flex-col justify-center whitespace-pre-wrap break-words">
        {children}
      </div>
    </div>
  );
};

export default MetricCard;