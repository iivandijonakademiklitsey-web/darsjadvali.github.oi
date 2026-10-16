import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherAvatar } from './TeacherAvatar';
import { GROUPS, GROUPS_1_KURS, GROUPS_2_KURS, DAYS_OF_WEEK } from '../data/initialData';
import { DayOfWeek, LessonType, ScheduleItem } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Printer,
  Search,
  BookOpen,
  Filter,
  User,
  Trash2,
  X,
  Check,
  Layers,
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const {
    schedules,
    teachers,
    addScheduleItem,
    deleteScheduleItem,
    setSelectedTeacherForModal,
    setTeacherToVote,
    setIsVoteModalOpen,
  } = useApp();

  const [selectedCourse, setSelectedCourse] = useState<'all' | '1-kurs' | '2-kurs'>('1-kurs');
  const [selectedGroup, setSelectedGroup] = useState<string>('1.1');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'Barchasi'>('Dushanba');
  const [teacherFilter, setTeacherFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New lesson form state
  const [newDay, setNewDay] = useState<DayOfWeek>('Dushanba');
  const [newPeriod, setNewPeriod] = useState<number>(1);
  const [newTime, setNewTime] = useState<string>('08:30 - 09:50');
  const [newGroup, setNewGroup] = useState<string>('1.1');
  const [newSubject, setNewSubject] = useState<string>('');
  const [newTeacherId, setNewTeacherId] = useState<string>('');
  const [newRoom, setNewRoom] = useState<string>('');
  const [newType, setNewType] = useState<LessonType>('Maʼruza');

  // Groups to show based on course
  const displayedGroups = useMemo(() => {
    if (selectedCourse === '1-kurs') return GROUPS_1_KURS;
    if (selectedCourse === '2-kurs') return GROUPS_2_KURS;
    return GROUPS;
  }, [selectedCourse]);

  // Filtered schedule
  const filteredSchedule = useMemo(() => {
    return schedules
      .filter((item) => {
        const matchGroup = selectedGroup === 'all' || item.group === selectedGroup;
        const matchDay = selectedDay === 'Barchasi' || item.day === selectedDay;
        const matchTeacher = teacherFilter === 'all' || item.teacherId === teacherFilter;
        const matchSearch =
          !searchQuery.trim() ||
          item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.group.toLowerCase().includes(searchQuery.toLowerCase());

        return matchGroup && matchDay && matchTeacher && matchSearch;
      })
      .sort((a, b) => a.period - b.period);
  }, [schedules, selectedGroup, selectedDay, teacherFilter, searchQuery]);

  // Today helper
  const getTodayDayName = (): DayOfWeek => {
    const days: DayOfWeek[] = ['Shanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const current = new Date().getDay();
    return days[current] || 'Dushanba';
  };

  const handlePeriodChange = (p: number) => {
    setNewPeriod(p);
    const times: Record<number, string> = {
      1: '08:30 - 09:50',
      2: '10:05 - 11:25',
      3: '11:40 - 13:00',
      4: '13:30 - 14:50',
    };
    setNewTime(times[p] || '08:30 - 09:50');
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newTeacherId || !newRoom.trim()) {
      alert("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    addScheduleItem({
      day: newDay,
      period: newPeriod,
      time: newTime,
      group: newGroup,
      subject: newSubject.trim(),
      teacherId: newTeacherId,
      room: newRoom.trim(),
      type: newType,
    });

    setIsAddModalOpen(false);
    setNewSubject('');
    setNewRoom('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6fe0cf] mb-1">
            <Calendar className="w-4 h-4 text-[#6fe0cf]" />
            <span className="uppercase tracking-widest text-[11px]">2026/2027 O'quv yili · Kuniga eng ko'pi bilan 4 para dars</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-[#eaf4f6] tracking-tight">
            Akademik Dars Jadvali
          </h1>
          <p className="text-xs sm:text-sm text-[#9fc1c9] mt-1">
            1-kurs (1.1–1.9) va 2-kurs (2.1–2.10) guruhlari uchun kunlik 4 para dars jadvali.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#eaf4f6] bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-colors"
          >
            <Printer className="w-4 h-4 text-[#9fc1c9]" />
            <span>Chop etish</span>
          </button>

          <button
            onClick={() => {
              if (teachers.length > 0 && !newTeacherId) {
                setNewTeacherId(teachers[0].id);
              }
              setIsAddModalOpen(true);
            }}
            className="btn-primary flex items-center gap-1.5 text-xs font-bold py-2 px-4 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#0b2a3a]" />
            <span>Para qo'shish</span>
          </button>
        </div>
      </div>

      {/* Course & Groups Selector Bar */}
      <div className="glass-card p-5 border-white/10 space-y-4 shadow-lg">
        {/* Course Segmented Control */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#6fe0cf]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#9fc1c9]">
              Bosqich (Kurs):
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] rounded-xl border border-white/10">
            <button
              onClick={() => {
                setSelectedCourse('1-kurs');
                setSelectedGroup('1.1');
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedCourse === '1-kurs'
                  ? 'bg-[#6fe0cf] text-[#0b2a3a] shadow-sm'
                  : 'text-[#9fc1c9] hover:text-white'
              }`}
            >
              1-kurs (1.1 — 1.9)
            </button>

            <button
              onClick={() => {
                setSelectedCourse('2-kurs');
                setSelectedGroup('2.1');
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedCourse === '2-kurs'
                  ? 'bg-[#6fe0cf] text-[#0b2a3a] shadow-sm'
                  : 'text-[#9fc1c9] hover:text-white'
              }`}
            >
              2-kurs (2.1 — 2.10)
            </button>

            <button
              onClick={() => {
                setSelectedCourse('all');
                setSelectedGroup('all');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedCourse === 'all'
                  ? 'bg-[#6fe0cf] text-[#0b2a3a] shadow-sm font-bold'
                  : 'text-[#9fc1c9] hover:text-white'
              }`}
            >
              Barcha guruhlar
            </button>
          </div>
        </div>

        {/* Groups selection tabs */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#9fc1c9] mb-2">
            Guruhni tanlang:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {displayedGroups.map((grp) => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  selectedGroup === grp
                    ? 'bg-[#6fe0cf] text-[#0b2a3a] shadow-md ring-2 ring-[#6fe0cf]/30'
                    : 'bg-white/[0.04] text-[#9fc1c9] hover:text-white hover:bg-white/[0.08] border border-white/5'
                }`}
              >
                {grp}-guruh
              </button>
            ))}
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap shrink-0 ${
                selectedGroup === 'all'
                  ? 'bg-[#6fe0cf] text-[#0b2a3a] shadow-md font-bold'
                  : 'bg-white/[0.04] text-[#9fc1c9] hover:text-white border border-white/5'
              }`}
            >
              Barchasi
            </button>
          </div>
        </div>

        {/* Days of week tabs */}
        <div className="pt-2 border-t border-white/10">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#9fc1c9] mb-2">
            Hafta kuni:
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {DAYS_OF_WEEK.map((day) => {
              const isToday = getTodayDayName() === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                    selectedDay === day
                      ? 'bg-white/[0.15] text-[#6fe0cf] font-bold border border-[#6fe0cf]/40 shadow-xs'
                      : 'bg-white/[0.03] border border-white/5 text-[#9fc1c9] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{day}</span>
                  {isToday && (
                    <span className="text-[10px] bg-[#6fe0cf] text-[#0b2a3a] px-1.5 py-0.2 rounded font-extrabold">
                      Bugun
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={() => setSelectedDay('Barchasi')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                selectedDay === 'Barchasi'
                  ? 'bg-white/[0.15] text-[#6fe0cf] font-bold border border-[#6fe0cf]/40'
                  : 'bg-white/[0.03] border border-white/5 text-[#9fc1c9] hover:text-white'
              }`}
            >
              To'liq hafta
            </button>
          </div>
        </div>

        {/* Teacher filter and Search bar */}
        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#9fc1c9] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Fan nomi yoki xona bo'yicha qidirish..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-[#9fc1c9]/60 focus:outline-none focus:border-[#6fe0cf]/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#9fc1c9] whitespace-nowrap">O'qituvchi:</span>
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-white/10 rounded-xl bg-[#0b2a3a] text-white focus:outline-none focus:border-[#6fe0cf]/40 max-w-[200px] truncate"
            >
              <option value="all">Barcha o'qituvchilar (50 nafar)</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.shortName} ({t.subject})
                </option>
              ))}
            </select>
          </div>

          <span className="text-[#9fc1c9] shrink-0 text-right">
            Topildi: <strong className="text-[#6fe0cf]">{filteredSchedule.length}</strong> ta para
          </span>
        </div>
      </div>

      {/* Schedule Items Grid / Cards */}
      {filteredSchedule.length === 0 ? (
        <div className="p-12 text-center glass-card border border-dashed border-white/15">
          <BookOpen className="w-12 h-12 text-[#9fc1c9]/40 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#eaf4f6]">Ushbu kunga darslar kiritilmagan</h3>
          <p className="text-xs text-[#9fc1c9] mt-1 max-w-sm mx-auto">
            Tanlangan guruh yoki hafta kuni uchun dars jadvali hozircha bo'sh. "Para qo'shish" tugmasi orqali yangi para kiritishingiz mumkin.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary mt-4 text-xs font-bold inline-flex items-center gap-1.5 py-2 px-4"
          >
            <Plus className="w-4 h-4 text-[#0b2a3a]" />
            Para kiritish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSchedule.map((item) => {
            const teacher = teachers.find((t) => t.id === item.teacherId);
            return (
              <div
                key={item.id}
                className="glass-card p-5 border-white/10 hover-glow transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Para raqami va Guruh */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6fe0cf] to-[#3fb7c4] text-[#0b2a3a] font-extrabold text-sm flex items-center justify-center shadow-sm">
                        {item.period}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {item.period}-para
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-[#9fc1c9] font-mono">
                          <Clock className="w-3 h-3 text-[#6fe0cf]" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#6fe0cf] bg-[#6fe0cf]/10 px-2.5 py-0.5 rounded-lg border border-[#6fe0cf]/20">
                        {item.group}-guruh
                      </span>
                      <button
                        onClick={() => deleteScheduleItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#9fc1c9] hover:text-rose-400 p-1 transition-opacity"
                        title="Parani jadvaldan o'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subject and Type */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-[#eaf4f6] line-clamp-2">{item.subject}</h3>
                      <span className="text-[10px] font-semibold text-[#9fc1c9] bg-white/[0.05] px-2 py-0.5 rounded-md border border-white/5 shrink-0">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#9fc1c9] mt-2">
                      <MapPin className="w-3.5 h-3.5 text-[#6fe0cf] shrink-0" />
                      <span className="text-white font-medium">{item.room}</span>
                      <span className="text-white/20">·</span>
                      <span>{item.day}</span>
                    </div>
                  </div>
                </div>

                {/* Teacher block with Avatar & click to profile */}
                {teacher && (
                  <div
                    onClick={() => setSelectedTeacherForModal(teacher)}
                    className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] -mx-2 px-2 py-1.5 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <TeacherAvatar photoUrl={teacher.photoUrl} name={teacher.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#eaf4f6] truncate group-hover:text-[#6fe0cf] transition-colors">
                          {teacher.shortName}
                        </p>
                        <p className="text-[10px] text-[#9fc1c9] truncate">{teacher.subject}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTeacherToVote(teacher);
                        setIsVoteModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-[#6fe0cf] hover:underline shrink-0 ml-2"
                    >
                      Ovoz berish &rarr;
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Lesson Modal (1 to 4 paras only!) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card max-w-lg w-full overflow-hidden border border-white/15 flex flex-col bg-[#0b2a3a]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-base font-bold text-white">Dars jadvaliga yangi para qo'shish</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#9fc1c9] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#9fc1c9] mb-1">Guruh</label>
                  <select
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                  >
                    <optgroup label="1-kurs (1.1 — 1.9)">
                      {GROUPS_1_KURS.map((g) => (
                        <option key={g} value={g}>
                          {g}-guruh
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="2-kurs (2.1 — 2.10)">
                      {GROUPS_2_KURS.map((g) => (
                        <option key={g} value={g}>
                          {g}-guruh
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9fc1c9] mb-1">Hafta kuni</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Para selector: Exactly 1 to 4 paras maximum! */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                    Para raqami (Kuniga ko'pi bilan 4 para)
                  </label>
                  <select
                    value={newPeriod}
                    onChange={(e) => handlePeriodChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                  >
                    <option value={1}>1-para (08:30 - 09:50)</option>
                    <option value={2}>2-para (10:05 - 11:25)</option>
                    <option value={3}>3-para (11:40 - 13:00)</option>
                    <option value={4}>4-para (13:30 - 14:50)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9fc1c9] mb-1">Dars turi</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as LessonType)}
                    className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                  >
                    <option value="Maʼruza">Maʼruza</option>
                    <option value="Amaliyot">Amaliyot</option>
                    <option value="Laboratoriya">Laboratoriya</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fc1c9] mb-1">Fan nomi</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Masalan: Oliy matematika, Fizika, Kriminalistika"
                  className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-white/[0.05] text-white focus:outline-none focus:border-[#6fe0cf]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fc1c9] mb-1">O'qituvchi</label>
                <select
                  value={newTeacherId}
                  onChange={(e) => setNewTeacherId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                >
                  <option value="">O'qituvchini tanlang (50 nafar)</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fc1c9] mb-1">Auditoriya / Xona</label>
                <input
                  type="text"
                  required
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="Masalan: 204-auditoriya, 215-laboratoriya"
                  className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-white/[0.05] text-white focus:outline-none focus:border-[#6fe0cf]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#9fc1c9] hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-[#0b2a3a]"
                >
                  <Check className="w-4 h-4" />
                  Jadvalga saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
