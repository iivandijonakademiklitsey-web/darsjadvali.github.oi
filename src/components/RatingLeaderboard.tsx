import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherAvatar } from './TeacherAvatar';
import { Teacher } from '../types';
import { DEPARTMENTS } from '../data/initialData';
import {
  Trophy,
  Star,
  Award,
  Vote,
  Camera,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  MessageSquare,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const RatingLeaderboard: React.FC = () => {
  const {
    teachers,
    reviews,
    setSelectedTeacherForModal,
    setTeacherToVote,
    setIsVoteModalOpen,
    setTeacherForPhoto,
    setIsPhotoModalOpen,
  } = useApp();

  const [selectedDepartment, setSelectedDepartment] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'votes' | 'name'>('rating');

  // Filter and sort teachers
  const filteredAndSortedTeachers = useMemo(() => {
    return teachers
      .filter((t) => {
        const matchesDept =
          selectedDepartment === 'Barchasi' || t.department === selectedDepartment;
        const matchesQuery =
          t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'votes') {
          return b.totalVotes - a.totalVotes;
        }
        return a.fullName.localeCompare(b.fullName);
      });
  }, [teachers, selectedDepartment, searchQuery, sortBy]);

  // Overall Top 3 for the Podium
  const topThree = useMemo(() => {
    return [...teachers].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [teachers]);

  const handleVote = (teacher: Teacher, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTeacherToVote(teacher);
    setIsVoteModalOpen(true);
  };

  const handlePhotoUpload = (teacher: Teacher, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTeacherForPhoto(teacher);
    setIsPhotoModalOpen(true);
  };

  const handleOpenDetails = (teacher: Teacher) => {
    setSelectedTeacherForModal(teacher);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6fe0cf] mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="uppercase tracking-widest text-[11px]">Akademik Litsey Baholash Tizimi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-[#eaf4f6] tracking-tight">
            O'qituvchilar Reytingi & Talabalar Ovozi
          </h1>
          <p className="text-xs sm:text-sm text-[#9fc1c9] mt-1 max-w-2xl">
            O'quvchilar tomonidan berilgan mustaqil ovozlar asosida shakllangan shaffof reyting.
            Ustozingizga ovoz bering va o'qituvchilar suratlarini yuklang!
          </p>
        </div>

        <button
          onClick={() => {
            setTeacherToVote(null);
            setIsVoteModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 self-start md:self-auto"
        >
          <Vote className="w-4 h-4 text-[#0b2a3a]" />
          Ustozlarga ovoz berish
        </button>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9fc1c9] flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Eng Yuqori Ovozga Ega Bo'lgan 3 Nafor Ustoz
          </h2>
          <span className="text-xs text-[#6fe0cf]">Litsey e'tirofi</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((teacher, index) => {
            const placeColors = [
              {
                border: 'border-amber-400/50',
                badgeBg: 'bg-amber-400 text-[#0b2a3a]',
                medal: '🥇 1-O‘rin',
                ring: 'ring-amber-400',
              },
              {
                border: 'border-slate-300/40',
                badgeBg: 'bg-slate-200 text-[#0b2a3a]',
                medal: '🥈 2-O‘rin',
                ring: 'ring-slate-300',
              },
              {
                border: 'border-amber-600/40',
                badgeBg: 'bg-amber-600/80 text-white',
                medal: '🥉 3-O‘rin',
                ring: 'ring-amber-500',
              },
            ][index];

            return (
              <div
                key={teacher.id}
                onClick={() => handleOpenDetails(teacher)}
                className={`relative rounded-2xl glass-card border ${placeColors.border} p-6 hover-glow transition-all cursor-pointer flex flex-col justify-between`}
              >
                {/* Place tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${placeColors.badgeBg} shadow-sm`}>
                    {placeColors.medal}
                  </span>
                  <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white tabular-nums">
                      {teacher.rating.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Avatar with photo button */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative group/avatar mb-3">
                    <TeacherAvatar
                      photoUrl={teacher.photoUrl}
                      name={teacher.fullName}
                      size="xl"
                      className={`ring-4 ${placeColors.ring}`}
                    />
                    <button
                      type="button"
                      onClick={(e) => handlePhotoUpload(teacher, e)}
                      className="absolute inset-0 rounded-full bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                      title="Rasmni almashtirish"
                    >
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span className="text-[10px] font-medium">Rasm yuklash</span>
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-[#eaf4f6] group-hover:text-[#6fe0cf] transition-colors">
                    {teacher.fullName}
                  </h3>
                  <p className="text-xs font-semibold text-[#6fe0cf] mt-0.5">{teacher.subject}</p>
                  <p className="text-[11px] text-[#9fc1c9] mt-1">{teacher.department}</p>
                </div>

                {/* Micro criteria indicators */}
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-[#9fc1c9]">
                  <div className="flex justify-between">
                    <span>Dars sifati:</span>
                    <span className="font-semibold text-white tabular-nums">
                      {teacher.criteriaBreakdown.teachingQuality.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tushuntirish:</span>
                    <span className="font-semibold text-white tabular-nums">
                      {teacher.criteriaBreakdown.clarity.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ovozlar soni:</span>
                    <span className="font-semibold text-[#6fe0cf] tabular-nums">
                      {teacher.totalVotes} ta ovoz
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleVote(teacher, e)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-[#0b2a3a] bg-[#6fe0cf] hover:bg-[#3fb7c4] rounded-xl transition-colors shadow-sm"
                  >
                    <Vote className="w-3.5 h-3.5" />
                    Ovoz berish
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handlePhotoUpload(teacher, e)}
                    className="p-2 text-[#9fc1c9] hover:text-[#6fe0cf] rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
                    title="O'qituvchi suratini yuklash"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 pt-2">
        {/* Department Interactive Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors shrink-0 ${
                selectedDepartment === dept
                  ? 'bg-[#6fe0cf] text-[#0b2a3a] font-bold shadow-sm'
                  : 'glass-card border-white/10 text-[#9fc1c9] hover:text-white hover:border-[#6fe0cf]/30'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search and Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-card p-3 border-white/10">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9fc1c9] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O'qituvchi ismi yoki fan bo'yicha qidirish..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-[#9fc1c9]/60 focus:outline-none focus:border-[#6fe0cf]/40"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#9fc1c9] whitespace-nowrap">Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs border border-white/10 rounded-xl bg-[#0b2a3a] text-white focus:outline-none focus:border-[#6fe0cf]/40"
            >
              <option value="rating">Eng yuqori reyting</option>
              <option value="votes">Eng ko'p ovoz olgan</option>
              <option value="name">Alifbo bo'yicha</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complete Leaderboard Table */}
      <div className="glass-card border-white/10 overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="text-sm font-bold text-[#eaf4f6]">
              O'qituvchilar reytingi to'liq jadvali
            </h3>
            <p className="text-xs text-[#9fc1c9] mt-0.5">
              Jami {filteredAndSortedTeachers.length} nafar pedagog
            </p>
          </div>
          <span className="text-xs text-[#9fc1c9]">
            Qatorni bosing — to'liq profil ochiladi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/[0.03] text-[#9fc1c9] border-b border-white/10 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">O'qituvchi & Surat</th>
                <th className="py-3 px-4">Kafedra & Fan</th>
                <th className="py-3 px-4 text-center">Reyting</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">Dars sifati</th>
                <th className="py-3 px-4 text-center hidden lg:table-cell">Tushuntirish</th>
                <th className="py-3 px-4 text-center">Jami ovozlar</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAndSortedTeachers.map((teacher, index) => {
                const rank = index + 1;
                return (
                  <tr
                    key={teacher.id}
                    onClick={() => handleOpenDetails(teacher)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 text-center font-bold text-white tabular-nums">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                    </td>

                    {/* Teacher with Avatar & photo upload prompt */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative group/mini">
                          <TeacherAvatar
                            photoUrl={teacher.photoUrl}
                            name={teacher.fullName}
                            size="md"
                          />
                          <button
                            type="button"
                            onClick={(e) => handlePhotoUpload(teacher, e)}
                            className="absolute -bottom-1 -right-1 bg-[#0b2a3a] text-[#6fe0cf] p-1 rounded-full border border-white/20 hover:scale-110 transition-transform"
                            title="Suratni o'zgartirish"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        </div>
                        <div>
                          <p className="font-bold text-[#eaf4f6] group-hover:text-[#6fe0cf] transition-colors">
                            {teacher.fullName}
                          </p>
                          <p className="text-[11px] text-[#9fc1c9]">{teacher.room}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department & Subject */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#eaf4f6]">{teacher.subject}</p>
                      <p className="text-[11px] text-[#9fc1c9]">{teacher.department}</p>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-amber-300 tabular-nums">
                          {teacher.rating.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Detailed criteria */}
                    <td className="py-3 px-4 text-center hidden md:table-cell tabular-nums font-semibold text-[#eaf4f6]">
                      {teacher.criteriaBreakdown.teachingQuality.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center hidden lg:table-cell tabular-nums font-semibold text-[#eaf4f6]">
                      {teacher.criteriaBreakdown.clarity.toFixed(2)}
                    </td>

                    {/* Total Votes */}
                    <td className="py-3 px-4 text-center tabular-nums text-[#9fc1c9] font-medium">
                      {teacher.totalVotes} ta
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleVote(teacher, e)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#0b2a3a] bg-[#6fe0cf] hover:bg-[#3fb7c4] rounded-lg shadow-sm transition-colors"
                        >
                          <Vote className="w-3 h-3" />
                          <span>Ovoz berish</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handlePhotoUpload(teacher, e)}
                          className="p-1.5 text-[#9fc1c9] hover:text-[#6fe0cf] hover:bg-white/[0.08] rounded-lg border border-white/10"
                          title="O'qituvchi suratini yuklash"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Student Reviews ticker */}
      <div className="glass-card p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9fc1c9]">
              O'quvchilar tomonidan qoldirilgan so'nggi fikrlar
            </h3>
          </div>
          <span className="text-xs text-[#6fe0cf]">Xolis va ochiq fikrlar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.slice(0, 3).map((rev) => {
            const targetTeacher = teachers.find((t) => t.id === rev.teacherId);
            return (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300 tabular-nums">
                      {rev.overallRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9fc1c9]">{rev.createdAt}</span>
                </div>

                <p className="text-xs text-[#eaf4f6] line-clamp-3 leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-[#9fc1c9] truncate font-medium">{rev.studentName}</span>
                  <span className="text-[#6fe0cf] font-semibold truncate ml-2">
                    Ustoz: {targetTeacher?.shortName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
