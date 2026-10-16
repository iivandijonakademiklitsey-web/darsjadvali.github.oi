import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CurrentLessonTracker } from './CurrentLessonTracker';
import { WorldClock } from './WorldClock';
import { TeacherAvatar } from './TeacherAvatar';
import { Teacher } from '../types';
import {
  Calendar,
  Clock,
  Star,
  Vote,
  Camera,
  ChevronRight,
  Shield,
  Sparkles,
  Award,
  Users,
  BookOpen,
  ArrowUp,
  Pause,
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    teachers,
    setActiveTab,
    setIsVoteModalOpen,
    setTeacherToVote,
    setSelectedTeacherForModal,
    setTeacherForPhoto,
    setIsPhotoModalOpen,
  } = useApp();

  const [tashkentTime, setTashkentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTashkentTime(
        now.toLocaleTimeString('uz-UZ', {
          timeZone: 'Asia/Tashkent',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setCurrentDateStr(
        now.toLocaleDateString('uz-UZ', {
          timeZone: 'Asia/Tashkent',
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Top 3 rated teachers
  const topTeachers = [...teachers].sort((a, b) => b.rating - a.rating).slice(0, 3);

  // Use all 50 teachers duplicated for seamless continuous vertical scrolling
  const displayedTeachers = teachers.length > 0 ? teachers : [];
  const loopedTeachers = [...displayedTeachers, ...displayedTeachers];

  const handleOpenVote = (t: Teacher) => {
    setTeacherToVote(t);
    setIsVoteModalOpen(true);
  };

  const handleOpenPhoto = (t: Teacher) => {
    setTeacherForPhoto(t);
    setIsPhotoModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-14 relative z-10">
      {/* Central Hero Block */}
      <div className="text-center pt-2 sm:pt-4 max-w-3xl mx-auto space-y-3">
        <p className="text-[#6fe0cf] text-xs font-bold uppercase tracking-[0.3em]">
          Onlayn Dars Jadvali & O'qituvchilar Reytingi
        </p>

        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-[#eaf4f6] tracking-tight leading-tight">
          IIV Andijon Akademik Litseyi
        </h1>

        {/* Big Live Digital Clock (Uzbekistan Time Only) */}
        <div className="py-2">
          <div className="inline-block px-7 py-2.5 rounded-2xl glass-card border border-white/10 shadow-2xl">
            <span className="font-mono text-3xl sm:text-5xl font-light tabular-nums tracking-wider text-[#eaf4f6] drop-shadow-[0_0_24px_rgba(95,208,192,0.4)]">
              {tashkentTime}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#9fc1c9] capitalize">
          {currentDateStr} (O'zbekiston yagona davlat vaqti)
        </p>

        {/* Action CTAs: Exactly preserved button positions and styles */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={() => setActiveTab('schedule')}
            className="btn-primary flex items-center gap-2 text-xs sm:text-sm font-bold"
          >
            <Calendar className="w-4 h-4" />
            Dars jadvalini ochish
          </button>

          <button
            onClick={() => {
              setTeacherToVote(null);
              setIsVoteModalOpen(true);
            }}
            className="btn-secondary flex items-center gap-2 text-xs sm:text-sm font-semibold hover-glow"
          >
            <Vote className="w-4 h-4 text-amber-300" />
            Ustozga ovoz berish
          </button>

          <button
            onClick={() => setActiveTab('rating')}
            className="btn-secondary flex items-center gap-2 text-xs sm:text-sm font-semibold hover-glow"
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            O'qituvchilar reytingi
          </button>
        </div>
      </div>

      {/* 3-Column Core Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-6 items-start">
        {/* Left Column: Continuous Upward Scrolling Teacher Roster */}
        <div className="order-2 lg:order-1 glass-card p-5 sm:p-6 border border-white/10 hover-glow transition-all space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#6fe0cf]" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9fc1c9]">
                O'qituvchilar
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#6fe0cf] flex items-center gap-1 font-mono">
                <ArrowUp className="w-3 h-3 animate-bounce" />
                Aylanuvchi
              </span>
              <button
                onClick={() => setActiveTab('teachers')}
                className="text-[11px] text-[#6fe0cf] hover:underline flex items-center"
              >
                Barchasi &rarr;
              </button>
            </div>
          </div>

          {/* Upward Scrolling Container with pause on hover */}
          <div
            className="relative h-[480px] overflow-hidden rounded-xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Top Fade Gradient Scrim */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#0b2a3a] via-[#0b2a3a]/80 to-transparent z-10" />

            {/* Scrolling list */}
            <div
              className="animate-vertical-scroll space-y-3 will-change-transform"
              style={{
                animationDuration: `${Math.max(35, displayedTeachers.length * 2.2)}s`,
              }}
            >
              {loopedTeachers.map((teacher, index) => (
                <div
                  key={`${teacher.id}-${index}`}
                  onClick={() => setSelectedTeacherForModal(teacher)}
                  className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 cursor-pointer transition-all space-y-2 group shadow-sm hover:border-[#6fe0cf]/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative group/avatar">
                      <TeacherAvatar
                        photoUrl={teacher.photoUrl}
                        name={teacher.fullName}
                        size="sm"
                        className="ring-1 ring-[#6fe0cf]/30"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPhoto(teacher);
                        }}
                        className="absolute -bottom-1 -right-1 bg-[#0b2a3a] text-[#6fe0cf] p-1 rounded-full border border-white/20 hover:scale-110 transition-transform shadow"
                        title="Rasm yuklash"
                      >
                        <Camera className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white group-hover:text-[#6fe0cf] truncate transition-colors">
                        {teacher.shortName}
                      </p>
                      <p className="text-[10px] text-[#9fc1c9] truncate">{teacher.subject}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 bg-black/30 px-1.5 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-amber-300 tabular-nums">
                        {teacher.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-[#9fc1c9]">
                    <span className="truncate max-w-[130px]">{teacher.room}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenVote(teacher);
                      }}
                      className="text-[#6fe0cf] hover:underline font-bold"
                    >
                      Ovoz berish &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Fade Gradient Scrim */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0b2a3a] via-[#0b2a3a]/80 to-transparent z-10" />
          </div>

          <p className="text-[10px] text-[#9fc1c9]/70 text-center">
            {isHovered ? 'To‘xtatildi (ovoz berish yoki profilni ochish mumkin)' : 'Ustiga olib borsangiz aylanish to‘xtaydi'}
          </p>

          <button
            onClick={() => setActiveTab('teachers')}
            className="w-full py-2 text-xs font-semibold text-[#6fe0cf] bg-[#6fe0cf]/10 hover:bg-[#6fe0cf]/20 rounded-xl transition-colors border border-[#6fe0cf]/20 text-center"
          >
            O'qituvchilar suratlari va ro'yxati (50 nafar)
          </button>
        </div>

        {/* Center Column: Hozirgi dars holati tracking */}
        <div className="order-1 lg:order-2 space-y-6">
          <CurrentLessonTracker />

          {/* Top Rated Teachers Showcase Banner */}
          <div className="glass-card p-6 border border-white/10 hover-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9fc1c9]">
                  Litsey O'quvchilari E'tirofi
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('rating')}
                className="text-xs text-[#6fe0cf] font-semibold hover:underline"
              >
                Reyting jadvali &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topTeachers.map((teacher, idx) => (
                <div
                  key={teacher.id}
                  onClick={() => setSelectedTeacherForModal(teacher)}
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 cursor-pointer transition-all flex flex-col items-center text-center space-y-2"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {idx === 0 ? '🥇 1-o‘rin' : idx === 1 ? '🥈 2-o‘rin' : '🥉 3-o‘rin'}
                  </span>

                  <TeacherAvatar photoUrl={teacher.photoUrl} name={teacher.fullName} size="md" />

                  <div>
                    <p className="text-xs font-bold text-white hover:text-[#6fe0cf] transition-colors truncate max-w-[130px]">
                      {teacher.shortName}
                    </p>
                    <p className="text-[10px] text-[#9fc1c9] truncate max-w-[130px]">
                      {teacher.subject}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white tabular-nums">
                      {teacher.rating.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: O'zbekiston Vaqti (Faqat O'zbekiston vaqti) */}
        <div className="order-3">
          <WorldClock />
        </div>
      </div>
    </div>
  );
};
