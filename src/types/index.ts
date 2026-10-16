export interface TeacherCriteriaRating {
  teachingQuality: number; // Dars o'tish sifati va mahorati (1-5)
  clarity: number;         // Tushuntirishning sodda va ravonligi (1-5)
  fairness: number;        // Adolatlilik va xolis baholash (1-5)
  communication: number;   // O'quvchilarga xushmuomalalik va hurmat (1-5)
  engagement: number;      // Darsdagi interaktivlik va qiziqarlilik (1-5)
}

export interface Review {
  id: string;
  teacherId: string;
  studentName: string;
  studentGroup: string;
  isAnonymous: boolean;
  overallRating: number;
  criteria: TeacherCriteriaRating;
  comment: string;
  favoriteTopic?: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  shortName: string;
  subject: string;
  department: string;
  photoUrl: string;
  bio: string;
  room: string;
  phone: string;
  email: string;
  experienceYears: number;
  rating: number; // 1.0 - 5.0
  totalVotes: number;
  criteriaBreakdown: TeacherCriteriaRating;
  tags: string[];
}

export type DayOfWeek = 'Dushanba' | 'Seshanba' | 'Chorshanba' | 'Payshanba' | 'Juma' | 'Shanba';

export type LessonType = 'Maʼruza' | 'Amaliyot' | 'Laboratoriya' | 'Seminar';

export interface ScheduleItem {
  id: string;
  day: DayOfWeek;
  period: number; // 1, 2, 3, 4, 5
  time: string;   // masalan, "08:30 - 09:50"
  group: string;  // masalan, "101", "102", "201", "202"
  subject: string;
  teacherId: string;
  room: string;
  type: LessonType;
}

export interface BellScheduleItem {
  pair: number;
  startTime: string;
  endTime: string;
  breakDuration: string;
  title: string;
}

export interface StudentProfile {
  name: string;
  group: string;
  isAnonymous: boolean;
}
