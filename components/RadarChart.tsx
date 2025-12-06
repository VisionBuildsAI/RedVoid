import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Text
} from 'recharts';

interface Props {
  defense: number;
  exploit: number;
}

const CustomRadarChart: React.FC<Props> = ({ defense, exploit }) => {
  const safeDefense = defense || 10;
  const safeExploit = exploit || 10;

  const data = [
    { subject: 'DEFENSE', value: safeDefense, fullMark: 100 },
    { subject: 'EXPLOIT', value: safeExploit, fullMark: 100 },
    { subject: 'STEALTH', value: Math.max(30, 100 - safeExploit), fullMark: 100 },
    { subject: 'STABILITY', value: Math.max(40, safeDefense * 0.8), fullMark: 100 },
    { subject: 'COMPLIANCE', value: safeDefense > 75 ? 90 : 20, fullMark: 100 },
  ];

  const renderCustomTick = ({ payload, x, y, textAnchor }: any) => {
    return (
      <Text
        x={x}
        y={y}
        textAnchor={textAnchor}
        verticalAnchor="middle"
        fontFamily="Orbitron"
        fontWeight="700"
        fontSize={10}
        fill="#6B7280"
        className="uppercase tracking-widest"
      >
        {payload.value}
      </Text>
    );
  };

  return (
    <div className="w-full h-full min-h-[300px] relative flex items-center justify-center bg-[#05070B] overflow-hidden">
       {/* Simple Ambient Glow */}
       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#FF003C] opacity-[0.05] blur-[50px] rounded-full pointer-events-none"></div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#333" strokeOpacity={0.4} />
          <PolarAngleAxis dataKey="subject" tick={renderCustomTick} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Threat Vector"
            dataKey="value"
            stroke="#FF003C"
            strokeWidth={2}
            fill="#FF003C"
            fillOpacity={0.2}
            isAnimationActive={true}
          />
          <Tooltip 
            cursor={false}
            contentStyle={{ 
              backgroundColor: '#05070B', 
              borderColor: '#FF003C', 
              color: '#fff', 
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '8px'
            }}
            itemStyle={{ color: '#FF003C' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomRadarChart;