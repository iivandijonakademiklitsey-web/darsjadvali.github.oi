import React, { useState } from 'react';
import { User, GraduationCap } from 'lucide-react';

interface TeacherAvatarProps {
  photoUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBadge?: boolean;
  department?: string;
}

const sizeClasses = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-xl',
  '2xl': 'w-32 h-32 text-2xl',
};

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  photoUrl,
  name,
  size = 'md',
  className = '',
  showBadge = false,
  department = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // Get initials: e.g. "Qodirov Alisher" -> "AQ"
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'OQ';
  };

  const initials = getInitials(name);

  // Deterministic soft academic gradient based on name
  const getGradient = (str: string) => {
    const gradients = [
      'from-blue-600 to-indigo-800',
      'from-emerald-600 to-teal-800',
      'from-slate-700 to-slate-900',
      'from-sky-600 to-blue-800',
      'from-indigo-600 to-purple-800',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {photoUrl && !hasError ? (
        <img
          src={photoUrl}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`${sizeClasses[size]} rounded-full object-cover shadow-sm border-2 border-white ring-1 ring-slate-200`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getGradient(
            name
          )} text-white flex items-center justify-center font-semibold shadow-sm border-2 border-white ring-1 ring-slate-200 select-none`}
        >
          {initials}
        </div>
      )}

      {showBadge && (
        <div
          className="absolute -bottom-1 -right-1 bg-white text-blue-700 p-1 rounded-full shadow-md border border-slate-100"
          title={department || "O'qituvchi"}
        >
          <GraduationCap className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};
