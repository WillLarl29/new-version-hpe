import React from 'react';
import { 
  MessageSquareText, 
  BookOpen, 
  ShieldCheck, 
  Bookmark, 
  User, 
  Scale, 
  X,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen
}) => {
  // Navigation items mapped strictly to section color themes
  // 🏠 Inicio -> Turquesa (#15B6A6)
  // 📚 Biblioteca / Normativa -> Azul petróleo (#0F3D56)
  // 🛡 Practicar -> Verde (#2EB67D)
  // ⭐ Mi Biblioteca -> Celeste (#D8F3F5 / #0F3D56)
  // 👤 Perfil -> Gris azulado (#64748B)
  const navItems = [
    {
      id: 'query' as NavigationTab,
      label: 'Inicio',
      sublabel: 'Consulta de Intervención',
      icon: MessageSquareText,
      badge: 'Multimodal',
      colorClass: 'text-[#15B6A6]',
      bgActive: 'bg-[#15B6A6]/10 text-[#15B6A6] border-[#15B6A6]/30',
      badgeActive: 'bg-[#15B6A6]/20 text-[#15B6A6] border-[#15B6A6]/30'
    },
    {
      id: 'corpus' as NavigationTab,
      label: 'Normativa',
      sublabel: 'Leyes y D.S. 012-2025-IN',
      icon: BookOpen,
      badge: 'Oficial',
      colorClass: 'text-[#0F3D56]',
      bgActive: 'bg-[#0F3D56]/15 text-white border-[#0F3D56]/40',
      badgeActive: 'bg-[#0F3D56]/30 text-sky-200 border-[#0F3D56]/40'
    },
    {
      id: 'scenarios' as NavigationTab,
      label: 'Practicar',
      sublabel: 'Simulador de Derechos',
      icon: ShieldCheck,
      badge: 'Interactivo',
      colorClass: 'text-[#2EB67D]',
      bgActive: 'bg-[#2EB67D]/15 text-[#2EB67D] border-[#2EB67D]/30',
      badgeActive: 'bg-[#2EB67D]/20 text-[#2EB67D] border-[#2EB67D]/30'
    },
    {
      id: 'history' as NavigationTab,
      label: 'Mi Biblioteca',
      sublabel: 'Consultas y guardados',
      icon: Bookmark,
      badge: 'Personal',
      colorClass: 'text-[#0F3D56]',
      bgActive: 'bg-[#D8F3F5]/20 text-sky-200 border-[#D8F3F5]/40',
      badgeActive: 'bg-[#D8F3F5]/25 text-sky-200 border-[#D8F3F5]/40'
    },
    {
      id: 'pipeline_audit' as NavigationTab,
      label: 'Perfil',
      sublabel: 'Preferencias y emergencias',
      icon: User,
      badge: 'Gemma 4',
      colorClass: 'text-[#64748B]',
      bgActive: 'bg-[#64748B]/20 text-slate-200 border-[#64748B]/40',
      badgeActive: 'bg-[#64748B]/30 text-slate-300 border-[#64748B]/40'
    }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 bg-[#091D28] text-slate-100 flex flex-col border-r border-slate-800/80 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[16px] bg-[#0F3D56] text-[#15B6A6] flex items-center justify-center border border-[#15B6A6]/30 shadow-md">
              <Scale className="w-5 h-5 text-[#15B6A6]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">HablaPE</span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#15B6A6]/15 text-[#15B6A6] border border-[#15B6A6]/30">
                  Perú
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Asistente Legal Ciudadano</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mx-4 my-3 p-3.5 rounded-[18px] bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2EB67D] animate-pulse shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-slate-200">Normativa Peruana 2025</div>
            <div className="text-slate-400 text-[11px] flex items-center gap-1 pt-0.5">
              <FileCheck2 className="w-3.5 h-3.5 text-[#2EB67D]" /> D.S. N° 012-2025-IN
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-[16px] text-left transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? item.bgActive + ' font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-900/80 hover:text-white border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? item.colorClass : 'text-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? item.badgeActive 
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.sublabel}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 bg-[#06151E] text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-400">Base Legal Oficial:</span>
            <span className="font-mono text-[#15B6A6] font-bold">CPP 205 + DS 012</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
            Información respaldada en el marco legal del Estado Peruano.
          </p>
        </div>
      </aside>
    </>
  );
};
