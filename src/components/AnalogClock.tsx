import React, { useState, useEffect, useRef } from 'react';

interface AnalogClockProps {
  size?: number;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ size = 170 }) => {
  const [time, setTime] = useState(new Date());
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = hours * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  const center = size / 2;
  const hourLen = size * 0.25;
  const minLen = size * 0.33;
  const secLen = size * 0.38;

  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);

  const hourX = center + hourLen * Math.cos(toRad(hourAngle));
  const hourY = center + hourLen * Math.sin(toRad(hourAngle));

  const minX = center + minLen * Math.cos(toRad(minuteAngle));
  const minY = center + minLen * Math.sin(toRad(minuteAngle));

  const secX = center + secLen * Math.cos(toRad(secondAngle));
  const secY = center + secLen * Math.sin(toRad(secondAngle));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="filter drop-shadow-md">
      <defs>
        <radialGradient id="clock-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(111, 224, 207, 0.12)" />
          <stop offset="100%" stopColor="rgba(11, 42, 58, 0.7)" />
        </radialGradient>
        <linearGradient id="hand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6fe0cf" />
          <stop offset="100%" stopColor="#3fb7c4" />
        </linearGradient>
      </defs>

      {/* Outer Dial */}
      <circle
        cx={center}
        cy={center}
        r={size / 2 - 2}
        fill="url(#clock-bg)"
        stroke="rgba(95, 208, 192, 0.25)"
        strokeWidth="1.5"
      />

      {/* 12 Hour Ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const rad = toRad(i * 30);
        const isMajor = i % 3 === 0;
        const rOuter = size / 2 - 5;
        const rInner = isMajor ? size / 2 - 13 : size / 2 - 9;
        const x1 = center + rOuter * Math.cos(rad);
        const y1 = center + rOuter * Math.sin(rad);
        const x2 = center + rInner * Math.cos(rad);
        const y2 = center + rInner * Math.sin(rad);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isMajor ? 'rgba(95, 208, 192, 0.75)' : 'rgba(159, 193, 201, 0.3)'}
            strokeWidth={isMajor ? 2 : 1}
          />
        );
      })}

      {/* Hour Hand */}
      <line
        x1={center}
        y1={center}
        x2={hourX}
        y2={hourY}
        stroke="#eaf4f6"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Minute Hand */}
      <line
        x1={center}
        y1={center}
        x2={minX}
        y2={minY}
        stroke="#6fe0cf"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Second Hand */}
      <line
        x1={center}
        y1={center}
        x2={secX}
        y2={secY}
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Center Pivot Pin */}
      <circle cx={center} cy={center} r="4" fill="#6fe0cf" stroke="#0b2a3a" strokeWidth="1.5" />
    </svg>
  );
};
