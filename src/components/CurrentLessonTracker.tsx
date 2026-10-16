import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DayOfWeek } from '../types';
import { TeacherAvatar } from './TeacherAvatar';
import { Clock, BookOpen, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const CurrentLessonTracker: React.FC = () => {
  const { schedules, bellSchedule, teachers, setSelectedTeacherForModal } = useApp();
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const now = new Date();
  const currentDayIndex = now.getDay(); // 0 Sunday, 1 Monday, ...
  const daysMap: Record<number, DayOfWeek> = {
    1: 'Dushanba',
    2: 'Seshanba',
    3: 'Chorshanba',
    4: 'Payshanba',
    5: 'Juma',
    6: 'Shanba',
  };

  const isRestDay = currentDayIndex === 0;
  const todayName: DayOfWeek = daysMap[currentDayIndex] || 'Dushanba';

  // Get current minutes since midnight
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Parse time "HH:MM" to minutes
  const parseMin = (str: string) => {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  };

  // Find active bell pair
  const activeBell = bellSchedule.find((bell) => {
    const s = parseMin(bell.startTime);
    const e = parseMin(bell.endTime);
    return currentMinutes >= s && currentMinutes <= e;
  });

  // Calculate percentage
  let percentPassed = 0;
  if (activeBell) {
    const s = parseMin(activeBell.startTime);
    const e = parseMin(activeBell.endTime);
    const total = e - s;
    const current = currentMinutes - s;
    percentPassed = Math.min(100, Math.max(0, (current / total) * 100));
  }

  // Find today's lessons
  const todayLessons = schedules.filter((s) => s.day === todayName);
  const activeLessons = activeBell
    ? todayLessons.filter((s) => s.period === activeBell.pair)
    : [];

  // Find next upcoming lesson
  const nextBell = bellSchedule.find((bell) => parseMin(bell.startTime) > currentMinutes);
  const nextLesson = nextBell
    ? todayLessons.find((s) => s.period === nextBell.pair)
    : null;

  return (
    <div className="glass-card p-6 sm:p-7 relative overflow-hidden border border-white/10 hover-glow transition-all">
      {/* Accent left bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#6fe0cf] to-[#3fb7c4]" />

      <div className="pl-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6fe0cf] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6fe0cf] animate-pulse" />
            Hozirgi Dars Holati
          </h3>
          <span className="text-[11px] text-[#9fc1c9] font-medium">
            {todayName}, {now.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}
          </span>
        </div>

        {isRestDay ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-xl font-heading font-bold text-[#eaf4f6]">
              Bugun dam olish kuni
            </p>
            <p className="text-xs text-[#9fc1c9]">
              Dushanbadan darslar jadval asosida boshlanadi.
            </p>
          </div>
        ) : activeBell && activeLessons.length > 0 ? (
          <div className="space-y-4">
            {activeLessons.slice(0, 1).map((lesson) => {
              const teacher = teachers.find((t) => t.id === lesson.teacherId);
              return (
                <div key={lesson.id} className="space-y-3">
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#6fe0cf] font-bold text-2xl tabular-nums">
                        {activeBell.pair}-para
                      </span>
                      <span className="text-xs text-[#9fc1c9] font-mono">
                        {activeBell.startTime} — {activeBell.endTime}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#6fe0cf]/15 text-[#6fe0cf] border border-[#6fe0cf]/20">
                      {lesson.group}-guruh
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-[#eaf4f6]">{lesson.subject}</h4>
                    <p className="text-xs text-[#9fc1c9] mt-0.5">
                      Auditoriya: <span className="text-white font-medium">{lesson.room}</span> · {lesson.type}
                    </p>
                  </div>

                  {teacher && (
                    <div
                      onClick={() => setSelectedTeacherForModal(teacher)}
                      className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors border border-white/5"
                    >
                      <TeacherAvatar photoUrl={teacher.photoUrl} name={teacher.fullName} size="sm" />
                      <div>
                        <p className="text-xs font-bold text-white hover:text-[#6fe0cf] transition-colors">
                          {teacher.fullName}
                        </p>
                        <p className="text-[11px] text-[#9fc1c9]">{teacher.subject}</p>
                      </div>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] text-[#9fc1c9] mb-1.5 font-mono">
                      <span>{Math.round(percentPassed)}% o'tdi</span>
                      <span>{Math.round(100 - percentPassed)}% qoldi</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6fe0cf] to-[#3fb7c4] transition-all duration-1000 shadow-sm"
                        style={{ width: `${percentPassed}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : nextLesson && nextBell ? (
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-[#9fc1c9]">
              <Clock className="w-4 h-4 text-[#6fe0cf]" />
              <span>Ayni vaqtda dars tanaffusida</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
              <span className="text-[11px] text-[#9fc1c9] block">Keyingi dars boshlanishi:</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#6fe0cf] font-mono">
                  {nextBell.startTime} ({nextBell.pair}-para)
                </span>
                <span className="text-xs font-semibold text-white">{nextLesson.subject}</span>
              </div>
              <p className="text-xs text-[#9fc1c9]">{nextLesson.group}-guruh · {nextLesson.room}</p>
            </div>
          </div>
        ) : (
          <div className="py-5 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#6fe0cf] mx-auto opacity-80" />
            <p className="text-sm font-medium text-[#eaf4f6]">Bugungi darslar yakunlangan</p>
            <p className="text-xs text-[#9fc1c9]">
              Ertangi darslar jadvalini ko'rish uchun "Dars jadvali" bo'limiga o'ting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
