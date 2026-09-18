import { motion } from 'motion/react';
import { Home, ListChecks, Calendar, Heart, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  activeTab: 'home' | 'todo' | 'logs';
  setActiveTab: (tab: 'home' | 'todo' | 'logs') => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Bloom' },
    { id: 'todo', icon: ListChecks, label: 'Rituals' },
    { id: 'logs', icon: Calendar, label: 'Archive' },
  ] as const;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-sm z-50">
      <div className="glass-card rounded-[32px] p-2.5 flex items-center justify-between shadow-[0_20px_40px_rgba(255,182,193,0.3)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center py-2.5 transition-all outline-none rounded-[24px]",
                isActive ? "text-pink-600" : "text-gray-400 hover:text-pink-400"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white shadow-sm border border-pink-100 rounded-[24px] z-0"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <Icon size={20} className={cn("transition-transform duration-300", isActive && "scale-110 drop-shadow-sm text-pink-500")} />
                <span className={cn("text-[9px] font-black uppercase tracking-widest leading-none font-display", isActive ? "text-pink-600" : "")}>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
