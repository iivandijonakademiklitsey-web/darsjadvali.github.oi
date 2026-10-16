import React from 'react';
import { useApp } from '../context/AppContext';
import { TeacherAvatar } from './TeacherAvatar';
import {
  X,
  Star,
  Camera,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  Vote,
  Award,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const TeacherProfileModal: React.FC = () => {
  const {
    selectedTeacherForModal,
    setSelectedTeacherForModal,
    setTeacherForPhoto,
    setIsPhotoModalOpen,
    setTeacherToVote,
    setIsVoteModalOpen,
    schedules,
    reviews,
  } = useApp();

  if (!selectedTeacherForModal) return null;

  const teacher = selectedTeacherForModal;

  // Filter reviews for this teacher
  const teacherReviews = reviews.filter((r) => r.teacherId === teacher.id);

  // Filter schedules for this teacher
  const teacherSchedule = schedules.filter((s) => s.teacherId === teacher.id);

  const handleOpenPhoto = () => {
    setTeacherForPhoto(teacher);
    setIsPhotoModalOpen(true);
  };

  const handleOpenVote = () => {
    setTeacherToVote(teacher);
    setIsVoteModalOpen(true);
  };

  const criteriaList = [
    { label: "Dars sifati & metodika", val: teacher.criteriaBreakdown.teachingQuality },
    { label: "Tushuntirish soddaligi", val: teacher.criteriaBreakdown.clarity },
    { label: "Adolatlilik & xolislik", val: teacher.criteriaBreakdown.fairness },
    { label: "Muloqot & hurmat", val: teacher.criteriaBreakdown.communication },
    { label: "Darsdagi qiziqarlilik", val: teacher.criteriaBreakdown.engagement },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card max-w-3xl w-full overflow-hidden border border-white/15 flex flex-col max-h-[92vh] bg-[#0b2a3a] shadow-2xl">
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6fe0cf]">
              O'qituvchi profili va dars yuklamasi
            </span>
          </div>
          <button
            onClick={() => setSelectedTeacherForModal(null)}
            className="p-1.5 rounded-xl text-[#9fc1c9] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Hero Block */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-white/10">
            <div className="relative group shrink-0">
              <TeacherAvatar
                photoUrl={teacher.photoUrl}
                name={teacher.fullName}
                size="2xl"
                className="ring-4 ring-[#6fe0cf]/30"
              />
              <button
                type="button"
                onClick={handleOpenPhoto}
                className="absolute inset-0 rounded-full bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Rasmni o'zgartirish"
              >
                <Camera className="w-6 h-6 mb-1 text-[#6fe0cf]" />
                <span className="text-[11px] font-medium">Rasm yuklash</span>
              </button>
              <button
                type="button"
                onClick={handleOpenPhoto}
                className="mt-2 w-full py-1.5 px-2 text-[11px] font-semibold text-[#6fe0cf] bg-[#6fe0cf]/10 hover:bg-[#6fe0cf]/20 rounded-xl border border-[#6fe0cf]/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                Rasm yuklash
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="text-xs text-[#6fe0cf] font-bold">{teacher.department}</span>
                <span className="text-white/20">·</span>
                <span className="text-xs text-[#9fc1c9]">{teacher.experienceYears} yillik tajriba</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">{teacher.fullName}</h2>
              <p className="text-sm font-semibold text-[#6fe0cf] mt-1">{teacher.subject}</p>

              <p className="text-xs text-[#9fc1c9] mt-3 leading-relaxed">{teacher.bio}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-[#9fc1c9]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#6fe0cf]" />
                  <span className="text-white font-medium">{teacher.room}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#6fe0cf]" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#6fe0cf]" />
                  <span>{teacher.email}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {teacher.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-[#9fc1c9] bg-white/[0.05] px-2.5 py-0.5 rounded-lg border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rating & Criteria Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl glass-card border border-white/10">
            {/* Overall Score */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mb-2">
                <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-3xl font-extrabold text-white tabular-nums">
                {teacher.rating.toFixed(2)}
              </span>
              <div className="flex items-center gap-1 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(teacher.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-[#9fc1c9] mt-1">
                Jami {teacher.totalVotes} ta o'quvchi ovozi
              </p>
              <button
                onClick={handleOpenVote}
                className="btn-primary mt-3 w-full py-2 px-3 text-xs font-bold text-[#0b2a3a] flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Vote className="w-3.5 h-3.5" />
                Ovoz berish
              </button>
            </div>

            {/* Criteria Progress Bars */}
            <div className="md:col-span-2 space-y-2.5 flex flex-col justify-center">
              <h4 className="text-xs font-bold text-[#9fc1c9] uppercase tracking-wide mb-1">
                Baholash mezonlari tafsiloti
              </h4>
              {criteriaList.map((item, idx) => {
                const percent = Math.min(100, (item.val / 5) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#9fc1c9]">{item.label}</span>
                      <span className="font-bold text-white tabular-nums">{item.val.toFixed(2)} / 5.0</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6fe0cf] to-[#3fb7c4] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher's Schedule Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6fe0cf]" />
                O'qituvchining haftalik dars jadvali
              </h3>
              <span className="text-xs text-[#9fc1c9]">{teacherSchedule.length} ta para</span>
            </div>

            {teacherSchedule.length === 0 ? (
              <p className="text-xs text-[#9fc1c9] italic p-4 glass-card text-center border-white/10">
                Ushbu o'qituvchiga hozircha para biriktirilmagan.
              </p>
            ) : (
              <div className="border border-white/10 rounded-xl overflow-hidden glass-card">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white/[0.04] text-[#9fc1c9] border-b border-white/10 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Kun</th>
                      <th className="py-2.5 px-3">Para & Vaqt</th>
                      <th className="py-2.5 px-3">Guruh</th>
                      <th className="py-2.5 px-3">Fan & Turi</th>
                      <th className="py-2.5 px-3">Auditoriya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {teacherSchedule.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-2 px-3 font-semibold text-white">{item.day}</td>
                        <td className="py-2 px-3 text-[#9fc1c9] tabular-nums font-mono">
                          {item.period}-para ({item.time})
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-bold text-[#6fe0cf] bg-[#6fe0cf]/10 px-2 py-0.5 rounded-lg border border-[#6fe0cf]/20 text-[11px]">
                            {item.group}-guruh
                          </span>
                        </td>
                        <td className="py-2 px-3 text-white">
                          <span className="font-medium">{item.subject}</span>{' '}
                          <span className="text-[10px] text-[#9fc1c9]">({item.type})</span>
                        </td>
                        <td className="py-2 px-3 text-[#9fc1c9]">{item.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Student Reviews */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#6fe0cf]" />
                O'quvchilar fikr-mulohazalari ({teacherReviews.length})
              </h3>
              <button
                onClick={handleOpenVote}
                className="text-xs font-semibold text-[#6fe0cf] hover:underline flex items-center gap-1"
              >
                Fikr qoldirish &rarr;
              </button>
            </div>

            {teacherReviews.length === 0 ? (
              <div className="p-6 text-center glass-card border border-dashed border-white/15 rounded-xl">
                <p className="text-xs text-[#9fc1c9]">
                  Hozircha sharhlar yo'q. Birinchi bo'lib ovozingiz va fikringizni qoldiring!
                </p>
                <button
                  onClick={handleOpenVote}
                  className="btn-secondary mt-3 text-xs font-semibold py-1.5 px-3.5 inline-block"
                >
                  Birinchi ovoz beruvchi bo'ling
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto p-1">
                {teacherReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{rev.studentName}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-[11px] text-[#9fc1c9]">{rev.studentGroup}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300 tabular-nums">
                          {rev.overallRating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#eaf4f6] leading-relaxed">"{rev.comment}"</p>

                    {rev.favoriteTopic && (
                      <p className="text-[11px] text-[#6fe0cf]">
                        Eng yoqqan dars/mavzu: <span className="text-white font-medium">{rev.favoriteTopic}</span>
                      </p>
                    )}

                    <span className="text-[10px] text-[#9fc1c9]/60 block">{rev.createdAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={handleOpenPhoto}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#6fe0cf] bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08]"
          >
            <Camera className="w-3.5 h-3.5" />
            O'qituvchi suratini yuklash
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedTeacherForModal(null)}
              className="px-4 py-2 text-xs font-medium text-[#9fc1c9] hover:text-white"
            >
              Yopish
            </button>
            <button
              type="button"
              onClick={handleOpenVote}
              className="btn-primary flex items-center gap-2 px-5 py-2 text-xs font-bold text-[#0b2a3a]"
            >
              <Vote className="w-4 h-4" />
              Ovoz berish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
