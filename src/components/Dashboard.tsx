import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { cn } from '../lib/utils';

const MOTIVATIONAL_QUOTES = [
  "You are capable of amazing things. ✨",
  "Progress, not perfection. 🌸",
  "Be gentle with yourself. You're doing great. 🌿",
  "Small steps lead to big changes. 🚀",
  "Your potential is endless. 💖",
  "Choose joy today. ☀️",
  "You glow differently when you're happy. ✨"
];

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const [profile, setProfile] = useState<any>(null);
  const [log, setLog] = useState<any>(null);
  const [habits, setHabits] = useState<any[]>([]);
  const [quote, setQuote] = useState("");
  const [showQuote, setShowQuote] = useState(true);
  const [dailyMotivation] = useState(() => 
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  );

  const quotes = [
    "You are a work of art in progress. ✨",
    "Consistency is the best form of self-love. 💖",
    "Becoming the best version of yourself, one ritual at a time. 🌸",
    "You didn't come this far to only come this far. 💅",
    "Your future self will thank you for today's efforts. 🌿",
    "Small steps, big glow. 🌟",
    "You are worthy of the life you are working for. 🎀"
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const uid = user.uid;

    // Load Profile
    const profileKey = `tanz_profile_${uid}`;
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    // Load Log
    const logKey = `tanz_log_${uid}_${today}`;
    const savedLog = localStorage.getItem(logKey);
    if (savedLog) {
      setLog(JSON.parse(savedLog));
    } else {
      const initialLog = { steps: 0, water: 0, sleep: 0, userId: uid, date: today };
      setLog(initialLog);
      localStorage.setItem(logKey, JSON.stringify(initialLog));
    }

    // Load Habits
    const habitKey = `tanz_habits_${uid}_${today}`;
    const savedHabits = localStorage.getItem(habitKey);
    const defaultHabits = [
      { id: '1', name: 'Thyroid Tablet 💊', completed: false, date: today },
      { id: '2', name: '3L Water Intake 💧', completed: false, date: today },
      { id: '3', name: '7k Steps Goal 👟', completed: false, date: today },
      { id: '4', name: 'Physical Exercise 🧘', completed: false, date: today },
      { id: '6', name: 'Healthy Intake 🥑', completed: false, date: today },
      { id: '7', name: 'Skincare Routine ✨', completed: false, date: today },
      { id: '8', name: 'Haircare Daily 💆‍♀️', completed: false, date: today },
      { id: '9', name: '1 Fruit Daily 🍎', completed: false, date: today },
      { id: '10', name: 'Daily Reading 📖', completed: false, date: today },
      { id: '11', name: '7 Hrs Sleep 😴', completed: false, date: today },
      { id: '12', name: 'Forget Elai 💔', completed: false, date: today }
    ];

    if (savedHabits) {
      const parsed = JSON.parse(savedHabits);
      if (parsed.length !== 11) {
        setHabits(defaultHabits);
        localStorage.setItem(habitKey, JSON.stringify(defaultHabits));
      } else {
        setHabits(parsed);
      }
    } else {
      setHabits(defaultHabits);
      localStorage.setItem(habitKey, JSON.stringify(defaultHabits));
    }
    calculateStreak();
  }, [user?.uid]);

  const calculateStreak = () => {
    const uid = user.uid;
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const key = `tanz_habits_${uid}_${dateStr}`;
      const data = localStorage.getItem(key);
      
      if (data) {
        const h = JSON.parse(data);
        const allDone = h.length > 0 && h.every((item: any) => item.completed);
        if (allDone) {
          currentStreak++;
        } else if (i > 0) break;
      } else if (i > 0) break;
    }
    
    // Update profile streak
    const profileKey = `tanz_profile_${uid}`;
    const pStr = localStorage.getItem(profileKey);
    if (pStr) {
      const p = JSON.parse(pStr);
      if (p.streak !== currentStreak) {
        const newProfile = { ...p, streak: currentStreak };
        setProfile(newProfile);
        localStorage.setItem(profileKey, JSON.stringify(newProfile));
      }
    }
  };

  const updateMetric = (field: string, delta: number) => {
    const today = new Date().toISOString().split('T')[0];
    const logKey = `tanz_log_${user.uid}_${today}`;
    const newLog = { 
      ...log, 
      [field]: Math.max(0, (log[field] || 0) + delta),
      updatedAt: new Date().toISOString()
    };
    setLog(newLog);
    localStorage.setItem(logKey, JSON.stringify(newLog));
  };

  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habitKey = `tanz_habits_${user.uid}_${today}`;
    const newHabits = habits.map(h => 
      h.id === habitId ? { ...h, completed: !h.completed, updatedAt: new Date().toISOString() } : h
    );
    setHabits(newHabits);
    localStorage.setItem(habitKey, JSON.stringify(newHabits));
    if (newHabits.every(h => h.completed)) {
      calculateStreak();
    }
  };

  const resetHabits = () => {
    if (confirm("Reset rituals for today?")) {
      const today = new Date().toISOString().split('T')[0];
      const habitKey = `tanz_habits_${user.uid}_${today}`;
      const defaultHabits = [
        { id: '1', name: 'Thyroid Tablet 💊', completed: false, date: today },
        { id: '2', name: '3L Water Intake 💧', completed: false, date: today },
        { id: '3', name: '7k Steps Goal 👟', completed: false, date: today },
        { id: '4', name: 'Physical Exercise 🧘', completed: false, date: today },
        { id: '6', name: 'Healthy Intake 🥑', completed: false, date: today },
        { id: '7', name: 'Skincare Routine ✨', completed: false, date: today },
        { id: '8', name: 'Haircare Daily 💆‍♀️', completed: false, date: today },
        { id: '9', name: '1 Fruit Daily 🍎', completed: false, date: today },
        { id: '10', name: 'Daily Reading 📖', completed: false, date: today },
        { id: '11', name: '7 Hrs Sleep 😴', completed: false, date: today },
        { id: '12', name: 'Forget Elai 💔', completed: false, date: today }
      ];
      setHabits(defaultHabits);
      localStorage.setItem(habitKey, JSON.stringify(defaultHabits));
    }
  };

  const resetAllData = () => {
    if (confirm("Master Reset: This will clear all rituals, logs, and progress. Are you sure?")) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('tanz_')) localStorage.removeItem(key);
      });
      window.location.reload();
    }
  };

  const updateMood = (m: string) => {
    const profileKey = `tanz_profile_${user.uid}`;
    const newProfile = { ...profile, mood: m };
    setProfile(newProfile);
    localStorage.setItem(profileKey, JSON.stringify(newProfile));

    // Also update log for the chart
    const today = new Date().toISOString().split('T')[0];
    const logKey = `tanz_log_${user.uid}_${today}`;
    const newLog = { ...log, mood: m };
    setLog(newLog);
    localStorage.setItem(logKey, JSON.stringify(newLog));
  };

  const waterProgress = Math.min(100, Math.round(((log?.water || 0) / (profile?.waterTarget || 3000)) * 100));
  const stepProgress = Math.min(100, Math.round(((log?.steps || 0) / (profile?.stepTarget || 7000)) * 100));
  const averageProgress = Math.round((waterProgress + stepProgress) / 2);

  return (
    <div className="px-6 pt-12 pb-24 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-8 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent"></div>
            <span className="text-2xl relative z-10">✨</span>
          </div>
          <div>
            <h1 className="text-2xl font-display font-black text-pink-500 tracking-tight leading-none mb-1 drop-shadow-sm">TANZ 💖</h1>
            <p className="text-[10px] text-pink-400 font-bold uppercase tracking-[0.2em] leading-none">Your Daily Glow</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        >
          <button 
            onClick={resetAllData}
            className="glass-button px-4 py-2.5 rounded-2xl flex items-center gap-2 text-[10px] font-black text-pink-400 uppercase tracking-widest"
          >
            Reset All
          </button>
        </motion.div>
      </header>

      {/* Motivational Quote Pop-up */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="mb-6 relative z-20"
          >
            <div className="glass-card p-5 rounded-[28px] flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center text-pink-500 shadow-inner">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-pink-400 font-black uppercase tracking-widest leading-none mb-1.5">Inspiration</p>
                  <p className="text-sm font-semibold text-gray-700 italic leading-tight font-display">
                    "{dailyMotivation}"
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowQuote(false)}
                className="p-2 hover:bg-black/5 rounded-full transition-colors text-pink-300"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="grid grid-cols-2 gap-4 auto-rows-min">
        {/* Motivation Block - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="col-span-2 glass-panel p-6 rounded-[32px] flex flex-col gap-1 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700 text-6xl">🌸</div>
          <h2 className="text-3xl font-display font-black text-gray-800 leading-tight">Hello Beautiful</h2>
          <p className="text-pink-500 text-sm font-bold tracking-tight mt-1 z-10">
            "{quote}"
          </p>
        </motion.div>

        {/* Daily Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-5 rounded-[32px] flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -bottom-4 -right-4 text-6xl opacity-10">💧</div>
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-black drop-shadow-sm">Hydration</span>
          </div>
          <div className="flex items-end gap-1 z-10 my-1">
            <motion.span 
              key={log?.water}
              initial={{ scale: 1.2, color: '#60a5fa' }}
              animate={{ scale: 1, color: '#2563eb' }}
              className="text-3xl font-display font-black text-blue-600 leading-none drop-shadow-sm"
            >
              {log?.water || 0}
            </motion.span>
            <span className="text-[10px] text-blue-400 font-bold uppercase mb-1">ml</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
            onClick={() => updateMetric('water', 250)} 
            className="w-full bg-gradient-to-r from-blue-50 to-blue-100/50 py-2.5 rounded-2xl text-xs font-bold text-blue-500 shadow-sm border border-blue-200/50 z-10"
          >
            +250ml
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-5 rounded-[32px] flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -bottom-4 -right-4 text-6xl opacity-10">👟</div>
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-black drop-shadow-sm">Movement</span>
          </div>
          <div className="flex items-end gap-1 z-10 my-1">
            <motion.span 
              key={log?.steps}
              initial={{ scale: 1.2, color: '#34d399' }}
              animate={{ scale: 1, color: '#059669' }}
              className="text-3xl font-display font-black text-emerald-600 leading-none drop-shadow-sm"
            >
              {log?.steps || 0}
            </motion.span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase mb-1">steps</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
            onClick={() => updateMetric('steps', 500)} 
            className="w-full bg-gradient-to-r from-emerald-50 to-emerald-100/50 py-2.5 rounded-2xl text-xs font-bold text-emerald-500 shadow-sm border border-emerald-200/50 z-10"
          >
            +500 steps
          </motion.button>
        </motion.div>

        {/* Mood Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-5 rounded-[32px] flex flex-col justify-center gap-3"
        >
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-pink-400 font-extrabold text-center leading-none">Vibe Check</h3>
          <div className="grid grid-cols-2 gap-2 px-1">
            {['✨', '🌸', '🌿', '😴'].map(m => (
              <motion.button 
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                key={m}
                onClick={() => updateMood(m)}
                className={cn(
                  "text-2xl p-2 rounded-2xl transition-all border shadow-sm",
                  profile?.mood === m ? "bg-white border-pink-200 shadow-pink-100/50" : "bg-white/40 border-transparent hover:bg-white/60"
                )}
              >
                {m}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Self Care Streak */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-5 rounded-[32px] flex flex-col justify-center gap-2 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-transparent"></div>
          <h3 className="text-[10px] uppercase tracking-widest text-purple-400 font-black z-10 drop-shadow-sm">Wellness Streak</h3>
          <motion.div 
            key={profile?.streak}
            initial={{ scale: 1.5 }} animate={{ scale: 1 }}
            className="text-4xl font-display font-black text-purple-500 leading-none z-10 drop-shadow-sm"
          >
            {profile?.streak || 0} <span className="text-xs text-purple-300 italic font-sans font-bold">days</span>
          </motion.div>
          <p className="text-[8px] text-purple-400 font-bold uppercase tracking-widest italic z-10">Streak on fire!</p>
        </motion.div>

        {/* Daily Rituals - Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="col-span-2 glass-panel p-6 rounded-[32px]"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h3 className="text-[11px] uppercase tracking-widest text-pink-500 font-black drop-shadow-sm">Daily Rituals 🎀</h3>
              <button 
                onClick={resetHabits}
                className="text-[9px] text-pink-400 font-bold uppercase hover:bg-pink-100/50 px-2 py-0.5 rounded-full transition-colors border border-pink-200/50 bg-white/50"
              >
                Reset
              </button>
            </div>
            <span className="text-[11px] font-bold text-pink-400 italic px-3 py-1 bg-white/50 rounded-full border border-pink-100/50">
              {habits.filter(h => h.completed).length}/{habits.length} Done
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {habits.length > 0 ? habits.map((habit, i) => (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                whileTap={{ scale: 0.98 }}
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-[20px] transition-all border shadow-sm backdrop-blur-md",
                  habit.completed 
                    ? "bg-gradient-to-r from-pink-50 to-pink-50/50 border-pink-200/60 opacity-70" 
                    : "bg-white/60 border-white hover:border-pink-200 hover:shadow-pink-100/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    habit.completed ? "bg-gradient-to-br from-pink-400 to-pink-500 border-pink-400 shadow-inner" : "border-pink-200 bg-white/50"
                  )}>
                    {habit.completed && <CheckCircle2 size={14} className="text-white drop-shadow-sm" />}
                  </div>
                  <span className={cn("text-sm font-bold text-gray-700 font-display", habit.completed && "line-through text-pink-300/80")}>
                    {habit.name}
                  </span>
                </div>
                {!habit.completed && <Sparkles size={16} className="text-pink-300 animate-pulse" />}
              </motion.button>
            )) : (
              <p className="text-[10px] text-gray-400 text-center py-6 font-bold uppercase tracking-widest italic">No rituals added for today ✨</p>
            )}
          </div>
        </motion.div>

        {/* Wellness Tip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="col-span-2 bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 p-6 rounded-[32px] shadow-[0_8px_32px_0_rgba(236,72,153,0.3)] relative overflow-hidden text-white border border-pink-300/30"
        >
          <div className="absolute -right-6 -top-6 text-9xl opacity-20 filter blur-sm">💖</div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-60 pointer-events-none"></div>
          <h3 className="font-display font-black text-lg mb-1 leading-tight flex items-center gap-2 relative z-10 drop-shadow-md">
            A Note for You ✨
          </h3>
          <p className="text-pink-50 text-xs font-medium italic opacity-95 leading-relaxed relative z-10 drop-shadow-sm">
            "Your glow starts from within. Remember to take a deep breath and stay hydrated! I'm so proud of you. ✨"
          </p>
        </motion.div>
      </div>
    </div>
  );
}
