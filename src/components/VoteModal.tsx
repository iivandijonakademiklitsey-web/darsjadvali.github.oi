import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherAvatar } from './TeacherAvatar';
import { Teacher, TeacherCriteriaRating } from '../types';
import { GROUPS_1_KURS, GROUPS_2_KURS } from '../data/initialData';
import { X, Star, Heart, CheckCircle2, MessageSquare, Award } from 'lucide-react';

export const VoteModal: React.FC = () => {
  const {
    isVoteModalOpen,
    setIsVoteModalOpen,
    teacherToVote,
    setTeacherToVote,
    teachers,
    submitReview,
    currentStudent,
    setCurrentStudent,
  } = useApp();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [studentGroup, setStudentGroup] = useState<string>('1.1');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [favoriteTopic, setFavoriteTopic] = useState<string>('');

  const [criteria, setCriteria] = useState<TeacherCriteriaRating>({
    teachingQuality: 5,
    clarity: 5,
    fairness: 5,
    communication: 5,
    engagement: 5,
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (teacherToVote) {
      setSelectedTeacherId(teacherToVote.id);
    } else if (teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [teacherToVote, teachers]);

  useEffect(() => {
    if (currentStudent) {
      setStudentName(currentStudent.name || '');
      setStudentGroup(currentStudent.group || '1.1');
      setIsAnonymous(currentStudent.isAnonymous || false);
    }
  }, [currentStudent]);

  if (!isVoteModalOpen) return null;

  const currentTeacher = teachers.find((t) => t.id === selectedTeacherId);

  const setCriterionValue = (key: keyof TeacherCriteriaRating, val: number) => {
    setCriteria((prev) => ({ ...prev, [key]: val }));
  };

  const calculateOverall = () => {
    const sum =
      criteria.teachingQuality +
      criteria.clarity +
      criteria.fairness +
      criteria.communication +
      criteria.engagement;
    return (sum / 5).toFixed(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeacher) return;

    const finalName = isAnonymous
      ? `Anonim o'quvchi (${studentGroup}-guruh)`
      : studentName.trim() || `${studentGroup}-guruh o'quvchisi`;

    // Save profile for subsequent votes
    setCurrentStudent({
      name: isAnonymous ? '' : studentName.trim(),
      group: studentGroup,
      isAnonymous,
    });

    submitReview({
      teacherId: currentTeacher.id,
      studentName: finalName,
      studentGroup: `${studentGroup}-guruh`,
      isAnonymous,
      overallRating: parseFloat(calculateOverall()),
      criteria,
      comment: comment.trim() || 'Darslar juda sifatli va tushunarli o‘tmoqda. Rahmat!',
      favoriteTopic: favoriteTopic.trim() || undefined,
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsVoteModalOpen(false);
      // Reset form
      setComment('');
      setFavoriteTopic('');
    }, 1800);
  };

  const criteriaLabels = [
    {
      key: 'teachingQuality' as const,
      label: 'Dars sifati va metodikasi',
      desc: 'Mavzularni chuqur tushuntirish va dars rejasiga to‘liq rioya qilish',
    },
    {
      key: 'clarity' as const,
      label: 'Tushuntirishning ravonligi va soddaligi',
      desc: 'Qiyin tushunchalarni oson, sodda va hayotiy misollar bilan yetkazib berish',
    },
    {
      key: 'fairness' as const,
      label: 'Adolatlilik va xolis baholash',
      desc: 'Barcha o‘quvchilarga birdek xolis va adolatli munosabatda bo‘lish',
    },
    {
      key: 'communication' as const,
      label: 'O‘quvchilarga hurmat va muloqot madaniyati',
      desc: 'Savollarga xushmuomalalik bilan javob berish, tinglay olish',
    },
    {
      key: 'engagement' as const,
      label: 'Darsdagi qiziqarlilik va faollik',
      desc: 'Qiziqarli keyslar, interaktiv topshiriqlar va darsning maroqli o‘tishi',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card max-w-2xl w-full overflow-hidden border border-white/15 flex flex-col max-h-[92vh] bg-[#0b2a3a] shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6fe0cf] text-[#0b2a3a] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ustozga Ovoz Berish & Baholash</h3>
              <p className="text-xs text-[#9fc1c9]">O'quvchilar mustaqil va xolis ovoz berish tizimi</p>
            </div>
          </div>
          <button
            onClick={() => setIsVoteModalOpen(false)}
            className="p-1.5 rounded-xl text-[#9fc1c9] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#6fe0cf]/20 text-[#6fe0cf] flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold font-heading text-white">Ovozingiz muvaffaqiyatli qabul qilindi!</h4>
            <p className="text-sm text-[#9fc1c9] max-w-md">
              {currentTeacher?.fullName} uchun bergan ovozingiz litsey reytingida hisoblandi. O‘qituvchilarga bergan e’tiboringiz uchun tashakkur!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
            {/* 1. Teacher Selector: all 50 teachers */}
            <div>
              <label className="block text-xs font-bold text-[#9fc1c9] uppercase tracking-wide mb-2">
                O'qituvchini tanlang (50 nafar o'qituvchi)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1.5 border border-white/10 rounded-xl bg-black/20">
                {teachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    type="button"
                    onClick={() => setSelectedTeacherId(teacher.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                      selectedTeacherId === teacher.id
                        ? 'bg-[#6fe0cf] text-[#0b2a3a] shadow-md font-bold'
                        : 'bg-white/[0.03] text-white hover:bg-white/[0.07] border border-white/5'
                    }`}
                  >
                    <TeacherAvatar photoUrl={teacher.photoUrl} name={teacher.fullName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs truncate">{teacher.shortName}</p>
                      <p
                        className={`text-[10px] truncate ${
                          selectedTeacherId === teacher.id ? 'text-[#0b2a3a]/80 font-normal' : 'text-[#9fc1c9]'
                        }`}
                      >
                        {teacher.subject}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Teacher Showcase */}
            {currentTeacher && (
              <div className="flex items-center justify-between p-3.5 glass-card border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <TeacherAvatar photoUrl={currentTeacher.photoUrl} name={currentTeacher.fullName} size="md" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{currentTeacher.fullName}</h4>
                    <p className="text-xs text-[#6fe0cf]">{currentTeacher.subject} · {currentTeacher.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-300">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{calculateOverall()}</span>
                  </div>
                  <span className="text-[10px] text-[#9fc1c9]">Sizning bahongiz</span>
                </div>
              </div>
            )}

            {/* 2. Student Info with 1.1-1.9 and 2.1-2.10 */}
            <div className="p-4 rounded-xl glass-card border border-white/10 space-y-3">
              <span className="text-xs font-bold text-[#9fc1c9] uppercase tracking-wide block">
                O'quvchi ma'lumotlari
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                    Ism-familiyangiz
                  </label>
                  <input
                    type="text"
                    disabled={isAnonymous}
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={isAnonymous ? "Anonim qoldirilgan" : "Masalan: Azizbek Rahimov"}
                    className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white disabled:opacity-40 focus:outline-none focus:border-[#6fe0cf]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                    Guruhingiz (1.1–1.9 yoki 2.1–2.10)
                  </label>
                  <select
                    value={studentGroup}
                    onChange={(e) => setStudentGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                  >
                    <optgroup label="1-kurs guruhlari">
                      {GROUPS_1_KURS.map((g) => (
                        <option key={g} value={g}>
                          {g}-guruh
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="2-kurs guruhlari">
                      {GROUPS_2_KURS.map((g) => (
                        <option key={g} value={g}>
                          {g}-guruh
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-[#6fe0cf] focus:ring-[#6fe0cf] w-4 h-4 bg-transparent border-white/20"
                />
                <span className="text-xs text-[#eaf4f6] font-medium">
                  Anonim baholash (ismim ko'rinmasin, faqat guruhim qayd etilsin)
                </span>
              </label>
            </div>

            {/* 3. Five Star Criteria */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9fc1c9] uppercase tracking-wide">
                  Baholash mezonlari (1 dan 5 gacha yulduz)
                </span>
                <span className="text-xs font-semibold text-[#6fe0cf]">
                  Umumiy ball: {calculateOverall()} / 5.0
                </span>
              </div>

              <div className="space-y-2.5">
                {criteriaLabels.map(({ key, label, desc }) => {
                  const currentValue = criteria[key];
                  return (
                    <div
                      key={key}
                      className="p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="max-w-md">
                        <p className="text-xs font-semibold text-white">{label}</p>
                        <p className="text-[10px] text-[#9fc1c9] mt-0.5">{desc}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setCriterionValue(key, starVal)}
                            className="p-1 hover:scale-125 transition-transform"
                            title={`${starVal} yulduz`}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                starVal <= currentValue
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-white/20 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-1.5 text-xs font-bold text-white w-5 text-right tabular-nums">
                          {currentValue}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Student Comment & Feedback */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                  Ustoz haqida samimiy izoh yoki fikr-mulohazangiz:
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Darslarning qaysi jihati sizga ko'proq ma'qul? Ustozga minnatdorchiligingiz..."
                  className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white placeholder:text-[#9fc1c9]/50 focus:outline-none focus:border-[#6fe0cf]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                  Eng yoqqan mavzu yoki dars mashg'uloti (ixtiyoriy):
                </label>
                <input
                  type="text"
                  value={favoriteTopic}
                  onChange={(e) => setFavoriteTopic(e.target.value)}
                  placeholder="Masalan: Logarifmik tenglamalar yoki IELTS Speaking darsi"
                  className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white placeholder:text-[#9fc1c9]/50 focus:outline-none focus:border-[#6fe0cf]"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsVoteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#9fc1c9] hover:text-white"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-[#0b2a3a]"
              >
                <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                Ovozni tasdiqlash va yuborish
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
