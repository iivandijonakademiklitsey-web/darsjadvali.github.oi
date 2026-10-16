import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { RatingLeaderboard } from './components/RatingLeaderboard';
import { ScheduleView } from './components/ScheduleView';
import { TeachersDirectory } from './components/TeachersDirectory';
import { BellScheduleView } from './components/BellScheduleView';
import { VoteModal } from './components/VoteModal';
import { UploadPhotoModal } from './components/UploadPhotoModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { OceanSunsetBackground } from './components/OceanSunsetBackground';
import {
  Shield,
  Star,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  Info,
  Heart,
  Home,
  Minimize,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    notification,
    setIsVoteModalOpen,
    setTeacherToVote,
    isFullscreen,
    toggleFullscreen,
  } = useApp();

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#0b2a3a] text-[#eaf4f6] relative ${
        isFullscreen ? 'fixed inset-0 z-40 w-screen h-screen overflow-y-auto' : ''
      }`}
    >
      {/* TV Sunset Ocean Animated Background */}
      <OceanSunsetBackground />

      {/* Floating Exit Fullscreen helper badge when active */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-3 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-[#081d29]/95 backdrop-blur-md text-[#6fe0cf] hover:text-white rounded-xl text-xs font-semibold border border-[#6fe0cf]/50 shadow-2xl transition-all hover:scale-105"
          title="To'liq ekrandan chiqish (ESC)"
        >
          <Minimize className="w-3.5 h-3.5" />
          <span>To'liq ekrandan chiqish (ESC)</span>
        </button>
      )}

      {/* Top Bar */}
      <Header />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#081d29] text-white text-xs font-semibold rounded-xl shadow-2xl border border-[#6fe0cf]/30 animate-in slide-in-from-bottom-4 duration-300">
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-[#6fe0cf] shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Subtle Lyceum Marquee Banner */}
      <div className="bg-[#081f2b]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#9fc1c9]">
            <span className="font-bold text-[#6fe0cf]">O'zbekiston Respublikasi IIV</span>
            <span className="text-white/20">/</span>
            <span>Andijon Akademik Litseyi Axborot Tizimi</span>
          </div>

          <div className="flex items-center gap-4 text-[#9fc1c9]">
            <span className="hidden sm:inline">O'quvchilar mustaqil ovoz berish portali</span>
            <button
              onClick={() => {
                setTeacherToVote(null);
                setIsVoteModalOpen(true);
              }}
              className="text-[#6fe0cf] hover:text-white font-bold flex items-center gap-1.5 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              Ustozingizga ovoz bering
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'schedule' && <ScheduleView />}
        {activeTab === 'rating' && <RatingLeaderboard />}
        {activeTab === 'teachers' && <TeachersDirectory />}
        {activeTab === 'bells' && <BellScheduleView />}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-[#071923] text-[#9fc1c9] text-xs border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6fe0cf] to-[#3fb7c4] text-[#0b2a3a] flex items-center justify-center font-bold text-sm font-heading shadow-sm">
                AL
              </div>
              <div>
                <p className="font-bold text-white text-sm">IIV Andijon Akademik Litseyi</p>
                <p className="text-[#9fc1c9] text-[11px]">
                  Onlayn dars jadvali & O'qituvchilar reytingi platformasi
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-[#9fc1c9]">
              <button
                onClick={() => setActiveTab('home')}
                className="hover:text-[#6fe0cf] transition-colors"
              >
                Bosh sahifa
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className="hover:text-[#6fe0cf] transition-colors"
              >
                Dars jadvali
              </button>
              <button
                onClick={() => setActiveTab('rating')}
                className="hover:text-[#6fe0cf] transition-colors"
              >
                Ustozlar reytingi
              </button>
              <button
                onClick={() => setActiveTab('teachers')}
                className="hover:text-[#6fe0cf] transition-colors"
              >
                O'qituvchilar suratlari
              </button>
              <button
                onClick={() => setActiveTab('bells')}
                className="hover:text-[#6fe0cf] transition-colors"
              >
                Qo'ng'iroqlar
              </button>
            </div>

            <div className="text-[#9fc1c9] text-center md:text-right text-[11px]">
              &copy; 2026 IIV Andijon Akademik Litseyi. Barcha huquqlar himoyalangan.
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VoteModal />
      <UploadPhotoModal />
      <TeacherProfileModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
