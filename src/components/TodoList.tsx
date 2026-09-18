import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Heart, Sparkles, Bell, BellRing, Flame } from 'lucide-react';
import { cn } from '../lib/utils';

interface TodoListProps {
  user: any;
}

export default function TodoList({ user }: TodoListProps) {
  const [habits, setHabits] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const uid = user.uid;
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
    
    // Check notification permission
    if ("Notification" in window) {
      setRemindersEnabled(Notification.permission === "granted");
    }
  }, [user.uid]);

  const calculateStreak = () => {
    const uid = user.uid;
    let currentStreak = 0;
    const today = new Date();
    
    // Check backwards from yesterday
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
        } else {
          // If it's today and not all done, we don't break the streak yet, 
          // just don't count it. Use i > 0 to check if we should break.
          if (i > 0) break;
        }
      } else {
        if (i > 0) break;
      }
    }
    setStreak(currentStreak);
    
    // Update profile streak
    const profileKey = `tanz_profile_${uid}`;
    const profile = localStorage.getItem(profileKey);
    if (profile) {
      const p = JSON.parse(profile);
      const newProfile = { ...p, streak: currentStreak };
      localStorage.setItem(profileKey, JSON.stringify(newProfile));
    }
  };

  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habitKey = `tanz_habits_${user.uid}_${today}`;
    const newHabits = habits.map(h => 
      h.id === habitId ? { ...h, completed: !h.completed, updatedAt: new Date().toISOString() } : h
    );
    setHabits(newHabits);
    localStorage.setItem(habitKey, JSON.stringify(newHabits));
    
    // Recalculate streak if everything is done
    if (newHabits.every(h => h.completed)) {
      calculateStreak();
    }
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setRemindersEnabled(true);
      new Notification("Notifications Enabled! 🎀", {
        body: "We'll remind you to check your rituals daily.",
        icon: "/favicon.ico"
      });
    }
  };

  const resetHabits = () => {
    if (confirm("Reset rituals for today to the default list?")) {
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
      calculateStreak();
    }
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progress = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col gap-8 min-h-screen">
      <header className="flex flex-col gap-2 pt-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-4xl font-display font-black text-pink-500 tracking-tighter drop-shadow-sm">Your Rituals 🎀</h2>
              <button 
                onClick={resetHabits}
                className="p-1 px-3 rounded-full glass-button text-[9px] text-pink-500 font-bold uppercase tracking-wider"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-pink-400/80 font-bold uppercase tracking-widest italic font-sans">Consistency is your superpower</p>
              <button 
                onClick={requestNotificationPermission}
                className={cn(
                  "flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-full border transition-all shadow-sm",
                  remindersEnabled 
                    ? "bg-emerald-50/80 text-emerald-500 border-emerald-200/50 backdrop-blur-md" 
                    : "bg-white/50 text-pink-400 border-pink-200/50 backdrop-blur-md hover:bg-white/80"
                )}
              >
                {remindersEnabled ? <BellRing size={12} /> : <Bell size={12} />}
                {remindersEnabled ? "Reminders On" : "Set Reminder"}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {/* Streak Counter */}
             <div className="flex flex-col items-center glass-card px-4 py-2 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent"></div>
                <div className="flex items-center gap-1 text-orange-500 font-display font-black text-2xl italic tracking-tighter relative z-10 drop-shadow-sm">
                  <Flame size={20} className="animate-pulse" />
                  {streak}
                </div>
                <span className="text-[8px] uppercase font-black text-orange-400 tracking-widest -mt-1 relative z-10">Day Streak</span>
             </div>
          </div>
        </div>
      </header>

      <div className="bg-transparent">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <AnimatePresence initial={false}>
            {habits.map((habit, i) => (
              <motion.button
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.05 }}
                onClick={() => toggleHabit(habit.id)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "group relative flex flex-col items-center justify-center p-5 rounded-[32px] transition-all outline-none min-h-[150px] text-center gap-3 glass-card overflow-hidden",
                  habit.completed 
                    ? "bg-gradient-to-b from-pink-50/80 to-white/60 border-pink-200/60 opacity-80" 
                    : "hover:shadow-[0_8px_24px_rgba(244,114,182,0.2)] hover:border-pink-300/50"
                )}
              >
                {habit.completed && (
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-100/30 to-transparent pointer-events-none"></div>
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-[20px] flex items-center justify-center transition-all duration-300 shadow-inner z-10",
                  habit.completed 
                    ? "bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-pink-300/50" 
                    : "bg-white border border-gray-100 text-gray-300 group-hover:border-pink-200 group-hover:text-pink-400 group-hover:bg-pink-50/50"
                )}>
                  {habit.completed ? <CheckCircle2 size={26} className="drop-shadow-sm" /> : <Circle size={26} />}
                </div>
                
                <span className={cn(
                  "text-[12px] font-display font-bold tracking-tight leading-tight px-2 z-10",
                  habit.completed ? "text-pink-600/80 line-through" : "text-gray-700 group-hover:text-pink-600"
                )}>
                  {habit.name}
                </span>

                {habit.completed && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0, rotate: -45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="absolute top-3 right-3 text-pink-400"
                  >
                    <Sparkles size={14} className="drop-shadow-sm" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-purple-400 via-pink-400 to-pink-500 p-8 rounded-[40px] text-white flex items-center justify-between shadow-[0_10px_30px_rgba(236,72,153,0.3)] border border-pink-300/30 relative overflow-hidden"
      >
        <div className="absolute top-[-20%] right-[-10%] text-9xl opacity-10 filter blur-[2px]">💅</div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-60"></div>
        <div className="flex flex-col gap-1 relative z-10">
          <h4 className="font-display font-black text-2xl flex items-center gap-2 tracking-tight drop-shadow-md"> Keep it up! 🫂</h4>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-pink-50 opacity-90 drop-shadow-sm mt-1">Every small step is a giant leap for your glow</p>
        </div>
        <div className="text-5xl relative z-10 drop-shadow-lg">💅</div>
      </motion.div>
    </div>
  );
}

