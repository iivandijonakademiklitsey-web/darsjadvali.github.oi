import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherAvatar } from './TeacherAvatar';
import { X, Upload, Link, Check, Image as ImageIcon, Camera } from 'lucide-react';

export const UploadPhotoModal: React.FC = () => {
  const {
    isPhotoModalOpen,
    setIsPhotoModalOpen,
    teacherForPhoto,
    updateTeacherPhoto,
  } = useApp();

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial state when modal opens
  React.useEffect(() => {
    if (teacherForPhoto) {
      setPreviewUrl(teacherForPhoto.photoUrl || '');
      setUrlInput(teacherForPhoto.photoUrl || '');
    }
  }, [teacherForPhoto]);

  if (!isPhotoModalOpen || !teacherForPhoto) return null;

  // Preset academic portrait choices
  const presetPhotos = [
    {
      title: 'Matematika & Aniq fanlar',
      url: '/src/assets/images/teacher_matematika_portret_1792153997294.jpg',
    },
    {
      title: 'Ingliz tili & Xorijiy tillar',
      url: '/src/assets/images/teacher_ingliz_tili_portret_1792153997456.jpg',
    },
    {
      title: 'Tarix & Davlat huquqi',
      url: '/src/assets/images/teacher_tarix_huquq_portret_1792153998286.jpg',
    },
    {
      title: 'Fizika & Axborot texnologiyalari',
      url: '/src/assets/images/teacher_fizika_portret_1792153998807.jpg',
    },
  ];

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Iltimos, faqat rasm faylini yuklang (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    updateTeacherPhoto(teacherForPhoto.id, previewUrl);
    setIsPhotoModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card max-w-lg w-full overflow-hidden border border-white/15 flex flex-col max-h-[90vh] bg-[#0b2a3a] shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="text-base font-bold text-white">O'qituvchi suratini yuklash</h3>
            <p className="text-xs text-[#6fe0cf] mt-0.5">{teacherForPhoto.fullName}</p>
          </div>
          <button
            onClick={() => setIsPhotoModalOpen(false)}
            className="p-1.5 rounded-xl text-[#9fc1c9] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Live Preview Area */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl glass-card border border-white/10">
            <div className="relative group">
              <TeacherAvatar
                photoUrl={previewUrl}
                name={teacherForPhoto.fullName}
                size="2xl"
                className="ring-4 ring-[#6fe0cf]/30"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-6 h-6 mb-1 text-[#6fe0cf]" />
                <span className="text-[11px] font-medium">Almashtirish</span>
              </button>
            </div>
            <div className="mt-3 text-center">
              <span className="text-sm font-semibold text-white">{teacherForPhoto.shortName}</span>
              <p className="text-xs text-[#9fc1c9]">{teacherForPhoto.subject}</p>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/10 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'upload' ? 'bg-[#6fe0cf] text-[#0b2a3a] shadow-sm font-bold' : 'text-[#9fc1c9] hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Fayldan yuklash
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'presets' ? 'bg-[#6fe0cf] text-[#0b2a3a] shadow-sm font-bold' : 'text-[#9fc1c9] hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Litsey namunalari
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'url' ? 'bg-[#6fe0cf] text-[#0b2a3a] shadow-sm font-bold' : 'text-[#9fc1c9] hover:text-white'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              URL havola
            </button>
          </div>

          {/* Tab 1: Upload from Device */}
          {activeTab === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#6fe0cf] bg-[#6fe0cf]/10'
                    : 'border-white/15 hover:border-[#6fe0cf]/40 bg-white/[0.02]'
                }`}
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#6fe0cf]/10 text-[#6fe0cf] flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-white">
                  Kompyuter yoki telefondan rasm tanlang
                </p>
                <p className="text-xs text-[#9fc1c9] mt-1">
                  yoki rasmni bu yerga sudrab olib keling (JPG, PNG, WEBP)
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-[#9fc1c9]">
                O'qituvchining fani yoki yo'nalishiga mos akademik portretni tanlang:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {presetPhotos.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewUrl(preset.url)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                      previewUrl === preset.url
                        ? 'border-[#6fe0cf] bg-[#6fe0cf]/15 ring-2 ring-[#6fe0cf]/30'
                        : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{preset.title}</p>
                      <p className="text-[10px] text-[#9fc1c9]">Akademik portret</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: URL input */}
          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#9fc1c9]">
                Rasmning to'g'ridan-to'g'ri internet havolasi (URL):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://misol.uz/rasm.jpg"
                  className="flex-1 px-3 py-2 text-xs border border-white/15 rounded-xl bg-[#081d29] text-white focus:outline-none focus:border-[#6fe0cf]"
                />
                <button
                  type="button"
                  onClick={() => setPreviewUrl(urlInput)}
                  className="px-3 py-2 text-xs font-bold bg-[#6fe0cf] text-[#0b2a3a] rounded-xl hover:bg-[#3fb7c4] transition-colors shrink-0"
                >
                  Ko'rish
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-[#9fc1c9] hover:text-white"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#0b2a3a]"
          >
            <Check className="w-4 h-4" />
            Suratni saqlash
          </button>
        </div>
      </div>
    </div>
  );
};
