import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Bell, Sparkles, Coffee } from 'lucide-react';

export const BellScheduleView: React.FC = () => {
  const { bellSchedule } = useApp();
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('uz-UZ', {
          timeZone: 'Asia/Tashkent',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if current time falls within a pair
  const isCurrentlyActive = (startTime: string, endTime: string) => {
    const now = new Date();
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const start = new Date();
    start.setHours(startH, startM, 0);

    const end = new Date();
    end.setHours(endH, endM, 0);

    return now >= start && now <= end;
  };

  return (
    <div className="space-y-6 pb-14 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6fe0cf] mb-1">
            <Clock className="w-4 h-4 text-[#6fe0cf]" />
            <span className="uppercase tracking-widest text-[11px]">Kunlik 4 Para Dars Rejimi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-[#eaf4f6] tracking-tight">
            Qo'ng'iroqlar Jadvali
          </h1>
          <p className="text-xs sm:text-sm text-[#9fc1c9] mt-1">
            Litseyda kuniga eng ko'pi bilan 4 para dars bo'lib, har bir para 80 daqiqa davom etadi.
          </p>
        </div>

        {/* Real-time Clock */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 glass-card border border-white/10 shadow-md self-start sm:self-auto">
          <Clock className="w-4 h-4 text-[#6fe0cf]" />
          <div>
            <span className="text-[10px] text-[#9fc1c9] block uppercase tracking-wider font-semibold">
              Hozirgi vaqt (Toshkent)
            </span>
            <span className="text-base font-bold font-mono tabular-nums text-[#6fe0cf]">
              {currentTimeStr}
            </span>
          </div>
        </div>
      </div>

      {/* Bell cards: Strictly 4 paras maximum */}
      <div className="space-y-4">
        {bellSchedule.map((item) => {
          const active = isCurrentlyActive(item.startTime, item.endTime);
          return (
            <div
              key={item.pair}
              className={`p-5 rounded-2xl glass-card transition-all ${
                active
                  ? 'border-[#6fe0cf] bg-[#6fe0cf]/10 shadow-lg ring-2 ring-[#6fe0cf]/30'
                  : 'border-white/10 hover-glow'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg ${
                      active
                        ? 'bg-[#6fe0cf] text-[#0b2a3a] shadow-sm'
                        : 'bg-white/[0.05] text-white border border-white/10'
                    }`}
                  >
                    {item.pair}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                      {active && (
                        <span className="text-[11px] font-bold text-[#0b2a3a] bg-[#6fe0cf] px-2.5 py-0.5 rounded-full">
                          ● Ayni vaqtda o'tilmoqda
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9fc1c9] mt-0.5">80 daqiqalik akademik mashg'ulot</p>
                  </div>
                </div>

                {/* Time range */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-[#9fc1c9] block">Dars vaqti</span>
                    <span className="text-base font-bold text-white font-mono tabular-nums">
                      {item.startTime} — {item.endTime}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#9fc1c9] block">Tanaffus</span>
                    <span className="text-xs font-semibold text-[#6fe0cf] bg-[#6fe0cf]/10 px-2.5 py-1 rounded-lg border border-[#6fe0cf]/20">
                      {item.breakDuration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notice */}
      <div className="p-4 rounded-2xl glass-card border-white/10 flex items-start gap-3">
        <Bell className="w-5 h-5 text-[#6fe0cf] shrink-0 mt-0.5" />
        <div className="text-xs text-[#9fc1c9] space-y-1">
          <p className="font-bold text-white">Akademik tartib-qoida:</p>
          <p className="leading-relaxed">
            Har bir guruh uchun bir kunda eng ko'pi bilan 4 para dars rejalashtiriladi. 2-paradan keyin 15 daqiqalik, 3-paradan so'ng esa tushlik va dam olish uchun 30 daqiqalik katta tanaffus belgilanadi.
          </p>
        </div>
      </div>
    </div>
  );
};
