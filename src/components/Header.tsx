import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Star,
  Calendar,
  Users,
  Clock,
  Vote,
  Maximize,
  Minimize,
  Menu,
  X,
  Home,
  UserCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsVoteModalOpen,
    currentStudent,
    setTeacherToVote,
    isFullscreen,
    toggleFullscreen,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenVote = () => {
    setTeacherToVote(null);
    setIsVoteModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b2a3a]/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Brand wordmark & Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6fe0cf] to-[#3fb7c4] flex items-center justify-center ring-2 ring-[#6fe0cf]/40 shadow-sm">
                <span className="font-heading text-[#0b2a3a] text-lg font-bold">AL</span>
              </div>
              <div>
                <span className="text-sm sm:text-base font-bold text-[#eaf4f6] tracking-tight group-hover:text-[#6fe0cf] transition-colors whitespace-nowrap block">
                  IIV Andijon Akademik Litseyi
                </span>
                <span className="text-[10px] text-[#9fc1c9] uppercase tracking-wider block">
                  Dars Jadvali & Reyting
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-[#9fc1c9]">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'home'
                  ? 'border-[#6fe0cf] text-[#6fe0cf] font-bold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              Bosh sahifa
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'schedule'
                  ? 'border-[#6fe0cf] text-[#6fe0cf] font-bold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Dars jadvali
            </button>

            <button
              onClick={() => setActiveTab('rating')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'rating'
                  ? 'border-[#6fe0cf] text-[#6fe0cf] font-bold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              O'qituvchilar reytingi
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'teachers'
                  ? 'border-[#6fe0cf] text-[#6fe0cf] font-bold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              O'qituvchilar suratlari
            </button>

            <button
              onClick={() => setActiveTab('bells')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'bells'
                  ? 'border-[#6fe0cf] text-[#6fe0cf] font-bold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              Qo'ng'iroqlar
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Fullscreen Button from bolt site */}
            <button
              onClick={toggleFullscreen}
              className={`w-9 h-9 rounded-xl glass-card flex items-center justify-center hover-glow transition-all ${
                isFullscreen
                  ? 'bg-[#6fe0cf] text-[#0b2a3a] ring-2 ring-[#6fe0cf]/50 font-bold'
                  : 'text-[#6fe0cf] hover:text-white'
              }`}
              title={isFullscreen ? "To'liq ekrandan chiqish (ESC)" : "To'liq ekran rejimiga o'tish"}
              aria-label={isFullscreen ? "To'liq ekrandan chiqish" : "To'liq ekran"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Vote CTA Button */}
            <button
              onClick={handleOpenVote}
              className="btn-primary flex items-center gap-1.5 text-xs sm:text-xs font-bold py-2 px-3.5 whitespace-nowrap"
            >
              <Vote className="w-3.5 h-3.5 text-[#0b2a3a]" />
              <span>Ovoz berish</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl glass-card text-[#9fc1c9] hover:text-white"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-white/10 flex flex-col gap-1">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left ${
                activeTab === 'home' ? 'bg-[#6fe0cf]/15 text-[#6fe0cf] font-bold' : 'text-[#9fc1c9] hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              Bosh sahifa (Jonli Tablo)
            </button>

            <button
              onClick={() => {
                setActiveTab('schedule');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left ${
                activeTab === 'schedule' ? 'bg-[#6fe0cf]/15 text-[#6fe0cf] font-bold' : 'text-[#9fc1c9] hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Dars jadvali
            </button>

            <button
              onClick={() => {
                setActiveTab('rating');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left ${
                activeTab === 'rating' ? 'bg-[#6fe0cf]/15 text-[#6fe0cf] font-bold' : 'text-[#9fc1c9] hover:bg-white/5'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400" />
              O'qituvchilar reytingi & Ovozlar
            </button>

            <button
              onClick={() => {
                setActiveTab('teachers');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left ${
                activeTab === 'teachers' ? 'bg-[#6fe0cf]/15 text-[#6fe0cf] font-bold' : 'text-[#9fc1c9] hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              O'qituvchilar suratlari va profillari
            </button>

            <button
              onClick={() => {
                setActiveTab('bells');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left ${
                activeTab === 'bells' ? 'bg-[#6fe0cf]/15 text-[#6fe0cf] font-bold' : 'text-[#9fc1c9] hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4" />
              Qo'ng'iroqlar jadvali
            </button>

            <button
              onClick={() => {
                toggleFullscreen();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left text-[#6fe0cf] hover:bg-white/5 border border-[#6fe0cf]/20 mt-1"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span>{isFullscreen ? "To'liq ekrandan chiqish" : "To'liq ekran rejimiga o'tish"}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
