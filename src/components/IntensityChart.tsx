import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface IntensityChartProps {
  data: { date: string; intensity: number }[];
}

export const IntensityChart: React.FC<IntensityChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-600 font-mono text-xs">
        Aguardando dados...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00ff66" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#00ff66" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#26262b" />
        <XAxis dataKey="date" hide />
        <YAxis domain={[0, 10]} hide />
        <Tooltip 
          contentStyle={{ backgroundColor: '#151518', border: '1px solid #26262b', borderRadius: '12px' }}
          itemStyle={{ color: '#00ff66' }}
        />
        <Area 
          type="monotone" 
          dataKey="intensity" 
          stroke="#00ff66" 
          strokeWidth={3}
          fill="url(#neonGradient)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
