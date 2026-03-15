import React from 'react';

interface RiskGaugeProps {
  score: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  const constrainedScore = Math.min(Math.max(score, 5), 95);
  const rotation = (constrainedScore / 100) * 180 - 90;

  const getRiskDetails = () => {
    if (score < 30) return { color: '#10b981', label: 'Conservative', desc: 'Capital Preservation' };
    if (score < 55) return { color: '#3b82f6', label: 'Balanced', desc: 'Moderate Growth' };
    if (score < 75) return { color: '#f59e0b', label: 'Aggressive', desc: 'High Volatility' };
    return { color: '#ef4444', label: 'Speculative', desc: 'Extreme Risk' };
  };

  const { color, desc } = getRiskDetails();

  return (
    <div className="relative flex flex-col items-center">
      <svg width="220" height="140" viewBox="0 0 200 120" className="drop-shadow-2xl">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          className="text-slate-200 dark:text-white/5"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (constrainedScore / 100) * 251.2}
          style={{ transition: 'all 1s ease-out' }}
        />
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '100px 100px', transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <line x1="100" y1="100" x2="100" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-slate-800 dark:text-white" />
          <circle cx="100" cy="100" r="8" fill="currentColor" className="text-slate-800 dark:text-white" />
        </g>
      </svg>

      <div className="absolute bottom-0 flex flex-col items-center text-center">
        <span className="text-4xl font-black tracking-tighter" style={{ color }}>{Math.round(score)}</span>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{desc}</p>
      </div>
    </div>
  );
};

export default RiskGauge;