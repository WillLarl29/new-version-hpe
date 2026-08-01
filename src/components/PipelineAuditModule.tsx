import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Globe, 
  Volume2, 
  Moon, 
  Sun, 
  Monitor, 
  Type, 
  ShieldCheck, 
  Trash2, 
  PhoneCall, 
  Info, 
  Cpu, 
  Check, 
  X,
  Eye,
  Shield,
  Building2,
  ExternalLink,
  Code2
} from 'lucide-react';
import profileHeroIllustration from '../assets/images/hablape_profile_hero_1785606847407.jpg';

export interface UserSettings {
  language: 'es' | 'en';
  theme: 'claro' | 'oscuro' | 'sistema';
  largeText: boolean;
  voiceReading: boolean;
  highContrast: boolean;
}

interface ProfileModuleProps {
  onClearHistory?: () => void;
  settings?: UserSettings;
  onUpdateSettings?: (newSettings: Partial<UserSettings>) => void;
}

export const PipelineAuditModule: React.FC<ProfileModuleProps> = ({
  onClearHistory,
  settings = {
    language: 'es',
    theme: 'claro',
    largeText: false,
    voiceReading: true,
    highContrast: false
  },
  onUpdateSettings
}) => {
  // User Preferences State
  const language = settings.language;
  const theme = settings.theme;
  const largeText = settings.largeText;
  const voiceReading = settings.voiceReading;
  const highContrast = settings.highContrast;

  const setLanguage = (lang: 'es' | 'en') => {
    if (onUpdateSettings) onUpdateSettings({ language: lang });
  };

  const setTheme = (t: 'claro' | 'oscuro' | 'sistema') => {
    if (onUpdateSettings) onUpdateSettings({ theme: t });
  };

  const setLargeText = (val: boolean) => {
    if (onUpdateSettings) onUpdateSettings({ largeText: val });
  };

  const setVoiceReading = (val: boolean) => {
    if (onUpdateSettings) onUpdateSettings({ voiceReading: val });
  };

  const setHighContrast = (val: boolean) => {
    if (onUpdateSettings) onUpdateSettings({ highContrast: val });
  };

  // Status & Modal States
  const [historyClearedMessage, setHistoryClearedMessage] = useState<boolean>(false);
  const [emergencyModal, setEmergencyModal] = useState<{ title: string; phone: string; desc: string; hours: string } | null>(null);

  const handleClearHistoryLocal = () => {
    if (onClearHistory) onClearHistory();
    setHistoryClearedMessage(true);
    setTimeout(() => setHistoryClearedMessage(false), 3000);
  };

  const emergencyContacts = [
    {
      title: 'Defensoría del Pueblo',
      phone: '0800-15170',
      dialNumber: '080015170',
      badge: 'Línea Gratuita',
      desc: 'Atención ante vulneraciones de derechos fundamentales por autoridades o efectivos policiales.',
      hours: 'Atención 24 horas, los 365 días del año.'
    },
    {
      title: 'PNP - Emergencias',
      phone: '105',
      dialNumber: '105',
      badge: 'Central PNP',
      desc: 'Central de la Policía Nacional del Perú para emergencias y auxilio inmediato.',
      hours: 'Atención 24/7 a nivel nacional.'
    },
    {
      title: 'Defensa Pública (MINJUSDH)',
      phone: '1884',
      dialNumber: '1884',
      badge: 'Orientación Legal',
      desc: 'Asistencia legal gratuita y asignación de defensor público si te encuentras retenido.',
      hours: 'Lunes a Viernes de 8:00 am a 5:00 pm (Urgencias 24h).'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* 1. HERO */}
      <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 md:p-9 shadow-xs overflow-hidden relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Text Content */}
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-[#0F4C81]/10 text-[#0F4C81] border border-[#0F4C81]/20 text-xs font-bold px-3 py-1 rounded-full">
              <User className="w-3.5 h-3.5 text-[#0F4C81]" />
              Centro Personal
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1E293B]">
              Mi Perfil
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-medium max-w-xl">
              Personaliza tu experiencia y administra tus preferencias.
            </p>
          </div>

          {/* Ilustración Pequeña (Ciudadano protegido por la ley) */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative rounded-[20px] overflow-hidden bg-slate-50 border border-slate-200/80 p-2 shadow-2xs w-full max-w-xs">
              <img 
                src={profileHeroIllustration} 
                alt="Ciudadano protegido HablaPE"
                referrerPolicy="no-referrer"
                className="w-full h-32 object-cover rounded-[14px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. PREFERENCIAS */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81] px-1 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Preferencias
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Idioma */}
          <div className="bg-white border border-slate-200/90 rounded-[22px] p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-blue-50 text-[#0F4C81] flex items-center justify-center border border-blue-100 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#1E293B]">Idioma</h3>
                <p className="text-xs text-slate-500 font-medium">Selecciona el idioma de las respuestas</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setLanguage('es')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                  language === 'es'
                    ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {language === 'es' && <Check className="w-3.5 h-3.5 text-white" />}
                <span>Español</span>
              </button>

              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                  language === 'en'
                    ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {language === 'en' && <Check className="w-3.5 h-3.5 text-white" />}
                <span>English</span>
              </button>
            </div>
          </div>

          {/* Card: Tema */}
          <div className="bg-white border border-slate-200/90 rounded-[22px] p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100 shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#1E293B]">Tema</h3>
                <p className="text-xs text-slate-500 font-medium">Apariencia visual de la aplicación</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {[
                { id: 'claro', label: 'Claro', icon: Sun },
                { id: 'oscuro', label: 'Oscuro', icon: Moon },
                { id: 'sistema', label: 'Sistema', icon: Monitor }
              ].map((t) => {
                const IconComp = t.icon;
                const isSelected = theme === t.id;

                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ACCESIBILIDAD */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81] px-1 flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#0F766E]" />
          Accesibilidad
        </h2>

        <div className="bg-white border border-slate-200/90 rounded-[22px] p-5 shadow-2xs space-y-4 divide-y divide-slate-100">
          {/* Switch 1: Texto grande */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center border border-sky-100">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-[#1E293B]">Texto grande</h3>
                <p className="text-[11px] text-slate-500 font-medium">Aumenta el tamaño tipográfico para facilitar la lectura</p>
              </div>
            </div>

            <button
              onClick={() => setLargeText(!largeText)}
              className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                largeText ? 'bg-[#0F4C81]' : 'bg-slate-200'
              }`}
              aria-label="Toggle texto grande"
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                largeText ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Switch 2: Lectura por voz */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-[#1E293B]">Lectura por voz</h3>
                <p className="text-[11px] text-slate-500 font-medium">Escucha las explicaciones legales en audio inteligible</p>
              </div>
            </div>

            <button
              onClick={() => setVoiceReading(!voiceReading)}
              className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                voiceReading ? 'bg-[#0F4C81]' : 'bg-slate-200'
              }`}
              aria-label="Toggle lectura por voz"
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                voiceReading ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Switch 3: Alto contraste */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center border border-indigo-100">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-[#1E293B]">Alto contraste</h3>
                <p className="text-[11px] text-slate-500 font-medium">Incrementa el contraste de elementos visuales para exteriores</p>
              </div>
            </div>

            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                highContrast ? 'bg-[#0F4C81]' : 'bg-slate-200'
              }`}
              aria-label="Toggle alto contraste"
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                highContrast ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. PRIVACIDAD */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81] px-1 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0F766E]" />
          Privacidad
        </h2>

        <div className="bg-white border border-slate-200/90 rounded-[22px] p-6 shadow-2xs space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-sm sm:text-base text-[#1E293B]">
                Privacidad y Protección Ciudadana
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Toda tu información permanece almacenada únicamente en este dispositivo. No compartimos consultas personales.
              </p>
            </div>
          </div>

          {historyClearedMessage && (
            <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-[#22C55E]" />
              <span>Historial local eliminado correctamente de este dispositivo.</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleClearHistoryLocal}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-slate-500" />
              <span>Eliminar historial local</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. EMERGENCIAS (Tres tarjetas grandes) */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F4C81] px-1 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-[#0F4C81]" />
          Líneas de Emergencia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.phone}
              className="bg-white border border-slate-200/90 rounded-[22px] p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-[14px] bg-blue-50 text-[#0F4C81] flex items-center justify-center border border-blue-100">
                  <PhoneCall className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-[#1E293B]">
                    {contact.title}
                  </h3>
                  <div className="text-2xl font-black text-[#0F4C81] font-mono mt-1">
                    {contact.phone}
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {contact.desc}
                </p>
              </div>

              {/* Botones: Llamar | Información */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${contact.dialNumber}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0F4C81] hover:bg-[#0D406E] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Llamar</span>
                </a>

                <button
                  onClick={() => setEmergencyModal({
                    title: contact.title,
                    phone: contact.phone,
                    desc: contact.desc,
                    hours: contact.hours
                  })}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>Información</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. ACERCA DE HABLAPE (Tarjeta Discreta al Final) */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80">
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-[20px] p-5 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-xs sm:text-sm text-[#1E293B] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0F4C81]" />
                Acerca de HablaPE
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Plataforma de orientación legal ciudadana ante controles de identidad
              </p>
            </div>

            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-white text-[#0F4C81] border border-slate-200 shadow-2xs w-fit">
              Versión MVP v1.0
            </span>
          </div>

          {/* Badges solicitados */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200/90 shadow-2xs">
              Build with Gemma
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200/90 shadow-2xs">
              Gemma 4
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200/90 shadow-2xs">
              Google AI Studio
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200/90 shadow-2xs">
              Google Cloud Run
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200/90 shadow-2xs">
              Repositorio Hackathon 2025
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Detail Modal */}
      {emergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#1E293B]">
                {emergencyModal.title}
              </h3>
              <button
                onClick={() => setEmergencyModal(null)}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-black text-[#0F4C81] font-mono">
                📞 {emergencyModal.phone}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {emergencyModal.desc}
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-700">
                🕒 {emergencyModal.hours}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEmergencyModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
              >
                Cerrar
              </button>
              <a
                href={`tel:${emergencyModal.phone.replace(/[^0-9]/g, '')}`}
                className="px-5 py-2 rounded-xl bg-[#0F4C81] hover:bg-[#0D406E] text-white font-extrabold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Llamar ahora</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
