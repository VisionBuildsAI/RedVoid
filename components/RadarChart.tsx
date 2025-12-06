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
  // Normalize data to ensure the chart looks robust
  const data = [
    { subject: 'DEFENSE', value: defense, fullMark: 100 },
    { subject: 'EXPLOIT', value: exploit, fullMark: 100 },
    { subject: 'STEALTH', value: Math.max(45, 100 - exploit), fullMark: 100 },
    { subject: 'STABILITY', value: Math.max(40, defense * 0.8), fullMark: 100 },
    { subject: 'COMPLIANCE', value: defense > 75 ? 90 : 30, fullMark: 100 },
  ];

  // Custom tick renderer for bold, aggressive labels
  const renderCustomTick = ({ payload, x, y, textAnchor }: any) => {
    return (
      <Text
        x={x}
        y={y}
        textAnchor={textAnchor}
        verticalAnchor="middle"
        fontFamily="Orbitron"
        fontWeight="bold"
        fontSize={12}
        fill="#E5E7EB"
        letterSpacing="1px"
        style={{ textShadow: '0 0 5px rgba(0,0,0,0.8)' }}
      >
        {payload.value}
      </Text>
    );
  };

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative overflow-hidden bg-[#05070B] rounded-sm border border-gray-800/50 shadow-inner">
       
       {/* Ambient red pulsing glow behind the chart */}
       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#FF003C] opacity-[0.05] blur-[80px] rounded-full animate-pulse pointer-events-none"></div>

       {/* Decorative tactical corners */}
       <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FF003C]/20 pointer-events-none"></div>
       <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FF003C]/20 pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FF003C]/20 pointer-events-none"></div>
       <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#FF003C]/20 pointer-events-none"></div>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="53%" outerRadius="75%" data={data}>
          
          <defs>
            <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FF003C" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF003C" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* Tactical Grid */}
          <PolarGrid 
            stroke="#6B7280" 
            strokeOpacity={0.2} 
            gridType="polygon" 
            strokeWidth={1}
          />

          {/* Labels */}
          <PolarAngleAxis 
            dataKey="subject" 
            tick={renderCustomTick}
            tickSize={20}
          />

          {/* Invisible axis to scale correctly */}
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />

          {/* The Data Shape */}
          <Radar
            name="Threat Profile"
            dataKey="value"
            stroke="#FF003C"
            strokeWidth={3}
            fill="url(#radarFill)"
            fillOpacity={0.6}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
            filter="url(#redGlow)"
          />
          
          <Tooltip 
            cursor={false}
            contentStyle={{ 
              backgroundColor: 'rgba(5, 7, 11, 0.95)', 
              borderColor: '#FF003C', 
              color: '#fff', 
              fontFamily: 'Share Tech Mono',
              boxShadow: '0 0 15px rgba(255,0,60,0.2)',
              borderRadius: '0px',
              borderWidth: '1px',
              padding: '12px'
            }}
            itemStyle={{ color: '#FF003C', fontWeight: 'bold', fontSize: '14px' }}
            formatter={(value: number) => [`${value}/100`, 'RATING']}
            separator=" :: "
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomRadarChart;