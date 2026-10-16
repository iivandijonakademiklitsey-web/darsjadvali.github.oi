import React, { useState, useEffect } from 'react';
import { AnalogClock } from './AnalogClock';
import { Clock, MapPin, Calendar, CheckCircle, Shield } from 'lucide-react';

export const WorldClock: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const uzbekistanTimeStr = now.toLocaleTimeString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const uzbekistanDateStr = now.toLocaleDateString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Uzbekistan administrative regions sharing single national time
  const uzbekistanRegions = [
    { city: 'Andijon (Litsey)', desc: 'Asosiy o‘quv binosi' },
    { city: 'Toshkent', desc: 'Poytaxt vaqti (UTC+5)' },
    { city: 'Samarqand', desc: 'O‘zbekiston yagona vaqti' },
    { city: 'Farg‘ona', desc: 'Vodiy hududi' },
    { city: 'Buxoro', desc: 'O‘zbekiston yagona vaqti' },
  ];

  return (
    <div className="glass-card p-6 sm:p-7 border border-white/10 hover-glow transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#6fe0cf]" />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9fc1c9]">
            O'zbekiston Vaqti
          </h3>
        </div>
        <span className="text-[10px] font-bold text-[#0b2a3a] bg-[#6fe0cf] px-2 py-0.5 rounded-md">
          UTC+5 (Toshkent)
        </span>
      </div>

      {/* Analog Clock centered */}
      <div className="flex flex-col items-center justify-center mb-5">
        <AnalogClock size={165} />
        <div className="mt-3 text-center">
          <span className="font-mono text-2xl font-bold tracking-wider text-white tabular-nums drop-shadow-[0_0_15px_rgba(95,208,192,0.4)]">
            {uzbekistanTimeStr}
          </span>
          <p className="text-[11px] text-[#9fc1c9] capitalize mt-0.5">{uzbekistanDateStr}</p>
        </div>
      </div>

      {/* Uzbekistan Regions List (all synchronized with Uzbekistan National Time) */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="text-[10px] uppercase font-bold tracking-wider text-[#9fc1c9] mb-1">
          O'zbekiston Yagona Davlat Vaqti:
        </div>

        {uzbekistanRegions.map((item, idx) => {
          const isAndijan = idx === 0;
          return (
            <div
              key={item.city}
              className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition-all ${
                isAndijan
                  ? 'bg-[#6fe0cf]/15 border border-[#6fe0cf]/30 shadow-xs'
                  : 'bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className={`w-3.5 h-3.5 ${isAndijan ? 'text-[#6fe0cf]' : 'text-[#9fc1c9]'}`} />
                <div>
                  <span className={`text-xs block ${isAndijan ? 'text-[#6fe0cf] font-bold' : 'text-white'}`}>
                    {item.city}
                  </span>
                  <span className="text-[9px] text-[#9fc1c9] block">{item.desc}</span>
                </div>
              </div>

              <span className={`font-mono tabular-nums text-xs ${isAndijan ? 'text-[#6fe0cf] font-bold' : 'text-white'}`}>
                {uzbekistanTimeStr}
              </span>
            </div>
          );
        })}
      </div>

      {/* Schedule note */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#9fc1c9]">
        <CheckCircle className="w-3.5 h-3.5 text-[#6fe0cf] shrink-0" />
        <span>Barcha paralar Toshkent vaqti bo‘yicha o‘tkaziladi.</span>
      </div>
    </div>
  );
};
