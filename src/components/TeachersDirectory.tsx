import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherAvatar } from './TeacherAvatar';
import { Teacher } from '../types';
import { DEPARTMENTS } from '../data/initialData';
import {
  Users,
  Search,
  Plus,
  Camera,
  Star,
  Vote,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  X,
  Check,
  Upload,
} from 'lucide-react';

export const TeachersDirectory: React.FC = () => {
  const {
    teachers,
    setSelectedTeacherForModal,
    setTeacherForPhoto,
    setIsPhotoModalOpen,
    setTeacherToVote,
    setIsVoteModalOpen,
    addTeacher,
  } = useApp();

  const [selectedDept, setSelectedDept] = useState('Barchasi');
  const [search, setSearch] = useState('');
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);

  // New teacher form state
  const [newFullName, setNewFullName] = useState('');
  const [newShortName, setNewShortName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDepartment, setNewDepartment] = useState(DEPARTMENTS[1]);
  const [newBio, setNewBio] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newExperience, setNewExperience] = useState(5);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchDept = selectedDept === 'Barchasi' || t.department === selectedDept;
      const matchQuery =
        t.fullName.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.room.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchQuery;
    });
  }, [teachers, selectedDept, search]);

  const handleOpenPhoto = (teacher: Teacher, e: React.MouseEvent) => {
    e.stopPropagation();
    setTeacherForPhoto(teacher);
    setIsPhotoModalOpen(true);
  };

  const handleOpenVote = (teacher: Teacher, e: React.MouseEvent) => {
    e.stopPropagation();
    setTeacherToVote(teacher);
    setIsVoteModalOpen(true);
  };

  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newSubject.trim()) {
      alert("Iltimos, ism va fanni to'ldiring");
      return;
    }

    addTeacher({
      fullName: newFullName.trim(),
      shortName: newShortName.trim() || newFullName.trim().split(' ').slice(0, 2).join(' '),
      subject: newSubject.trim(),
      department: newDepartment,
      photoUrl: newPhotoUrl.trim(),
      bio: newBio.trim() || "Litseyning tajribali va fidoyi o'qituvchisi.",
      room: newRoom.trim() || "200-auditoriya",
      phone: newPhone.trim() || "+998 (90) 000-00-00",
      email: newEmail.trim() || "ustoz@litsey.uz",
      experienceYears: Number(newExperience) || 1,
      tags: ["O'qituvchi", newDepartment.split(' ')[0]],
    });

    setIsAddTeacherOpen(false);
    // Reset
    setNewFullName('');
    setNewShortName('');
    setNewSubject('');
    setNewBio('');
    setNewRoom('');
    setNewPhone('');
    setNewEmail('');
    setNewPhotoUrl('');
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6fe0cf] mb-1">
            <Users className="w-4 h-4 text-[#6fe0cf]" />
            <span className="uppercase tracking-widest text-[11px]">Litsey Pedagogik Jamoasi (50 nafar o'qituvchi)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-[#eaf4f6] tracking-tight">
            O'qituvchilar Ro'yxati & Suratlari
          </h1>
          <p className="text-xs sm:text-sm text-[#9fc1c9] mt-1">
            Barcha 50 nafar o'qituvchilar profillari. Har bir ustoz kartochkasida uning rasmini yuklash yoki almashtirish imkoniyati mavjud.
          </p>
        </div>

        <button
          onClick={() => setIsAddTeacherOpen(true)}
          className="btn-primary flex items-center gap-2 text-xs font-bold whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi o'qituvchi qo'shish
        </button>
      </div>

      {/* Filter and Search */}
      <div className="space-y-3">
        {/* Department Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors shrink-0 ${
                selectedDept === dept
                  ? 'bg-[#6fe0cf] text-[#0b2a3a] font-bold shadow-sm'
                  : 'glass-card border-white/10 text-[#9fc1c9] hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#9fc1c9] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="O'qituvchi ismi, fan yoki xona bo'yicha qidirish (50 nafar)..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-white/10 rounded-xl bg-white/[0.04] text-white placeholder:text-[#9fc1c9]/60 focus:outline-none focus:border-[#6fe0cf]"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            onClick={() => setSelectedTeacherForModal(teacher)}
            className="glass-card p-5 border-white/10 hover-glow transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              {/* Photo & Upload Button */}
              <div className="flex items-start justify-between mb-4">
                <div className="relative group/avatar">
                  <TeacherAvatar
                    photoUrl={teacher.photoUrl}
                    name={teacher.fullName}
                    size="lg"
                    className="ring-2 ring-white/10"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleOpenPhoto(teacher, e)}
                    className="absolute inset-0 rounded-full bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                    title="Rasm yuklash / almashtirish"
                  >
                    <Camera className="w-4 h-4 text-[#6fe0cf]" />
                    <span className="text-[9px] mt-0.5 font-medium">Rasm</span>
                  </button>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300 tabular-nums">
                      {teacher.rating.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#9fc1c9] mt-1">{teacher.totalVotes} ta ovoz</p>
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#6fe0cf] transition-colors leading-snug">
                  {teacher.fullName}
                </h3>
                <p className="text-xs font-semibold text-[#6fe0cf] mt-0.5">{teacher.subject}</p>
                <p className="text-[11px] text-[#9fc1c9] mt-1">{teacher.department}</p>

                <div className="flex items-center gap-1.5 text-xs text-[#9fc1c9] mt-3">
                  <MapPin className="w-3.5 h-3.5 text-[#6fe0cf] shrink-0" />
                  <span className="truncate text-white/90">{teacher.room}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={(e) => handleOpenPhoto(teacher, e)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-[#6fe0cf] bg-[#6fe0cf]/10 hover:bg-[#6fe0cf]/20 rounded-xl border border-[#6fe0cf]/20 transition-colors"
                title="O'qituvchining suratini yuklash"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Rasm qo'yish</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleOpenVote(teacher, e)}
                className="btn-primary flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-[#0b2a3a]"
              >
                <Vote className="w-3.5 h-3.5" />
                <span>Ovoz berish</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card max-w-lg w-full overflow-hidden border border-white/15 flex flex-col max-h-[90vh] bg-[#0b2a3a] shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-base font-bold text-white">Yangi o'qituvchi qo'shish</h3>
              <button
                onClick={() => setIsAddTeacherOpen(false)}
                className="p-1 rounded-xl text-[#9fc1c9] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacherSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                  To'liq F.I.Sh (Familiya Ism Sharif)
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Masalan: Umarov Rustam Shokirovich"
                  className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                    Qisqa nomi
                  </label>
                  <input
                    type="text"
                    value={newShortName}
                    onChange={(e) => setNewShortName(e.target.value)}
                    placeholder="Masalan: R. Sh. Umarov"
                    className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                    O'qitadigan fani
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Masalan: Biologiya va genetika"
                    className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fc1c9] mb-1">Kafedra</label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                >
                  {DEPARTMENTS.filter((d) => d !== 'Barchasi').map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                  Surat havolasi (yoki keyinroq yuklash mumkin)
                </label>
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://... yoki saqlagach 'Rasm qo'yish' tugmasini bosing"
                  className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                    Auditoriya / Xona
                  </label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="206-auditoriya"
                    className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                    Ish tajribasi (yil)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newExperience}
                    onChange={(e) => setNewExperience(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fc1c9] mb-1">
                  Qisqacha ma'lumot (Biografiya / Unvon)
                </label>
                <textarea
                  rows={2}
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="Ma'lumoti, ilmiy darajasi va yutuqlari..."
                  className="w-full px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#9fc1c9] hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-[#0b2a3a]"
                >
                  <Check className="w-4 h-4" />
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
