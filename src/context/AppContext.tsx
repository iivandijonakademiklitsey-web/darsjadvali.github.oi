import React, { createContext, useContext, useState, useEffect } from 'react';
import { Teacher, Review, ScheduleItem, BellScheduleItem, StudentProfile } from '../types';
import { INITIAL_TEACHERS, INITIAL_REVIEWS, INITIAL_SCHEDULE, BELL_SCHEDULE } from '../data/initialData';

interface AppContextType {
  teachers: Teacher[];
  reviews: Review[];
  schedules: ScheduleItem[];
  bellSchedule: BellScheduleItem[];
  currentStudent: StudentProfile;
  setCurrentStudent: (profile: StudentProfile) => void;
  updateTeacherPhoto: (teacherId: string, photoUrl: string) => void;
  submitReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => void;
  addTeacher: (teacherData: Omit<Teacher, 'id' | 'rating' | 'totalVotes' | 'criteriaBreakdown'>) => void;
  updateTeacher: (teacherId: string, data: Partial<Teacher>) => void;
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  deleteScheduleItem: (id: string) => void;
  activeTab: 'home' | 'rating' | 'schedule' | 'teachers' | 'bells';
  setActiveTab: (tab: 'home' | 'rating' | 'schedule' | 'teachers' | 'bells') => void;
  selectedTeacherForModal: Teacher | null;
  setSelectedTeacherForModal: (teacher: Teacher | null) => void;
  isVoteModalOpen: boolean;
  setIsVoteModalOpen: (open: boolean) => void;
  teacherToVote: Teacher | null;
  setTeacherToVote: (teacher: Teacher | null) => void;
  isPhotoModalOpen: boolean;
  setIsPhotoModalOpen: (open: boolean) => void;
  teacherForPhoto: Teacher | null;
  setTeacherForPhoto: (teacher: Teacher | null) => void;
  notification: { message: string; type: 'success' | 'info' } | null;
  showNotification: (message: string, type?: 'success' | 'info') => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  TEACHERS: 'aal_teachers_v3',
  REVIEWS: 'aal_reviews_v3',
  SCHEDULES: 'aal_schedules_v3',
  STUDENT: 'aal_student_profile_v3',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TEACHERS);
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SCHEDULES);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    } catch {
      return INITIAL_SCHEDULE;
    }
  });

  const [currentStudent, setCurrentStudentState] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.STUDENT);
      return saved ? JSON.parse(saved) : { name: '', group: '1.1', isAnonymous: false };
    } catch {
      return { name: '', group: '1.1', isAnonymous: false };
    }
  });

  const [activeTab, setActiveTab] = useState<'home' | 'rating' | 'schedule' | 'teachers' | 'bells'>('home');
  const [selectedTeacherForModal, setSelectedTeacherForModal] = useState<Teacher | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [teacherToVote, setTeacherToVote] = useState<Teacher | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [teacherForPhoto, setTeacherForPhoto] = useState<Teacher | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const doc = document as any;
    const docEl = document.documentElement as any;

    const isNativeFs = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    if (!isFullscreen) {
      // Enter Fullscreen: try native, and set state
      setIsFullscreen(true);
      showNotification("To'liq ekran rejimi yoqildi (Chiqish uchun ESC yoki tugmani bosing)", 'info');

      try {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
      } catch {
        // Native failed (e.g. iframe policy); CSS pseudo-fullscreen handles it smoothly!
      }
    } else {
      // Exit Fullscreen
      setIsFullscreen(false);
      showNotification("To'liq ekrandan chiqildi", 'info');

      try {
        if (isNativeFs) {
          if (doc.exitFullscreen) {
            doc.exitFullscreen().catch(() => {});
          } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
          } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
          } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
          }
        }
      } catch {
        // Ignored
      }
    }
  };

  // Sync with native fullscreen changes and ESC key
  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as any;
      const isNativeFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      if (!isNativeFs && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        showNotification("To'liq ekrandan chiqildi", 'info');
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    } catch (e) {
      console.error('Failed to save teachers to localStorage', e);
    }
  }, [teachers]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews to localStorage', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    } catch (e) {
      console.error('Failed to save schedules to localStorage', e);
    }
  }, [schedules]);

  const setCurrentStudent = (profile: StudentProfile) => {
    setCurrentStudentState(profile);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.STUDENT, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  };

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const updateTeacherPhoto = (teacherId: string, photoUrl: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          return { ...t, photoUrl };
        }
        return t;
      })
    );

    // Also update if selected in modal
    if (selectedTeacherForModal && selectedTeacherForModal.id === teacherId) {
      setSelectedTeacherForModal((prev) => (prev ? { ...prev, photoUrl } : null));
    }

    showNotification("O'qituvchi surati muvaffaqiyatli saqlandi!", 'success');
  };

  const submitReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Hozirgina'
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate teacher ratings
    const teacherReviews = updatedReviews.filter((r) => r.teacherId === reviewData.teacherId);
    const totalVotes = (teacherReviews.length || 1) + 40; // baseline community weighting

    // Calculate averages
    let sumTeaching = 0;
    let sumClarity = 0;
    let sumFairness = 0;
    let sumComm = 0;
    let sumEng = 0;

    teacherReviews.forEach((r) => {
      sumTeaching += r.criteria.teachingQuality;
      sumClarity += r.criteria.clarity;
      sumFairness += r.criteria.fairness;
      sumComm += r.criteria.communication;
      sumEng += r.criteria.engagement;
    });

    const count = teacherReviews.length;
    const avgTeaching = Number((sumTeaching / count).toFixed(2));
    const avgClarity = Number((sumClarity / count).toFixed(2));
    const avgFairness = Number((sumFairness / count).toFixed(2));
    const avgComm = Number((sumComm / count).toFixed(2));
    const avgEng = Number((sumEng / count).toFixed(2));

    const overallAvg = Number(((avgTeaching + avgClarity + avgFairness + avgComm + avgEng) / 5).toFixed(2));

    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === reviewData.teacherId) {
          const updated = {
            ...t,
            rating: overallAvg,
            totalVotes: t.totalVotes + 1,
            criteriaBreakdown: {
              teachingQuality: avgTeaching,
              clarity: avgClarity,
              fairness: avgFairness,
              communication: avgComm,
              engagement: avgEng
            }
          };
          if (selectedTeacherForModal && selectedTeacherForModal.id === t.id) {
            setSelectedTeacherForModal(updated);
          }
          return updated;
        }
        return t;
      })
    );

    showNotification("Ovozingiz va samimiy fikringiz qabul qilindi! Rahmat!", 'success');
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'rating' | 'totalVotes' | 'criteriaBreakdown'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `t-${Date.now()}`,
      rating: 5.0,
      totalVotes: 1,
      criteriaBreakdown: {
        teachingQuality: 5.0,
        clarity: 5.0,
        fairness: 5.0,
        communication: 5.0,
        engagement: 5.0,
      }
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    showNotification("Yangi o'qituvchi muvaffaqiyatli qo'shildi!", 'success');
  };

  const updateTeacher = (teacherId: string, data: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, ...data } : t))
    );
    showNotification("O'qituvchi ma'lumotlari yangilandi!", 'info');
  };

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: `s-${Date.now()}`
    };
    setSchedules((prev) => [...prev, newItem]);
    showNotification("Dars jadvalga qo'shildi!", 'success');
  };

  const deleteScheduleItem = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    showNotification("Dars jadvaldan o'chirildi", 'info');
  };

  return (
    <AppContext.Provider
      value={{
        teachers,
        reviews,
        schedules,
        bellSchedule: BELL_SCHEDULE,
        currentStudent,
        setCurrentStudent,
        updateTeacherPhoto,
        submitReview,
        addTeacher,
        updateTeacher,
        addScheduleItem,
        deleteScheduleItem,
        activeTab,
        setActiveTab,
        selectedTeacherForModal,
        setSelectedTeacherForModal,
        isVoteModalOpen,
        setIsVoteModalOpen,
        teacherToVote,
        setTeacherToVote,
        isPhotoModalOpen,
        setIsPhotoModalOpen,
        teacherForPhoto,
        setTeacherForPhoto,
        notification,
        showNotification,
        isFullscreen,
        toggleFullscreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
