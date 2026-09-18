import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import TodoList from './components/TodoList';
import { WellnessLog } from './components/WellnessLog';
import Navbar from './components/Navbar';
import LockScreen from './components/LockScreen';
import { Sparkles } from 'lucide-react';

// Use a consistent ID for guest storage
const GUEST_ID = 'local_princess';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'todo' | 'logs'>('home');
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    // Check session storage for unlock state
    const unlocked = sessionStorage.getItem('tanz_unlocked') === 'true';
    if (unlocked) setIsLocked(false);

    // Simulate auto-login as guest
    const guestUser = {
      uid: GUEST_ID,
      displayName: 'Princess',
    };
    setUser(guestUser);

    const profileKey = `tanz_profile_${GUEST_ID}`;
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      const initialProfile = {
        uid: GUEST_ID,
        displayName: 'Princess',
        mood: '✨',
        waterTarget: 3000,
        stepTarget: 7000,
        streak: 12,
        lastLogin: new Date().toISOString(),
      };
      setProfile(initialProfile);
      localStorage.setItem(profileKey, JSON.stringify(initialProfile));
    }
    setLoading(false);
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem('tanz_unlocked', 'true');
    setIsLocked(false);
  };

  useEffect(() => {
    if (!user) return;
    
    // Simple Daily Reminder Logic
    const checkRitualsAndRemind = () => {
      if (Notification.permission !== 'granted') return;

      const today = new Date().toISOString().split('T')[0];
      const key = `tanz_habits_${user.uid}_${today}`;
      const data = localStorage.getItem(key);
      
      if (data) {
        const habits = JSON.parse(data);
        if (habits.length > 0 && !habits.every((h: any) => h.completed)) {
          new Notification("Daily Ritual Reminder 🎀", {
            body: "Your rituals are waiting for you! Let's glow together. ✨",
            icon: "/favicon.ico"
          });
        }
      }
    };

    const timeout = setTimeout(checkRitualsAndRemind, 5000);
    return () => clearTimeout(timeout);
  }, [user]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-mesh">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Sparkles className="text-pink-400 fill-pink-400" size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh text-gray-800 pb-24 overflow-x-hidden relative font-sans">
      <AnimatePresence mode="wait">
        {isLocked ? (
          <LockScreen key="lock" onUnlock={handleUnlock} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full relative min-h-screen flex flex-col"
          >
            {/* Floating Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              <motion.div 
                animate={{ y: [0, -20, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 text-4xl opacity-20 filter blur-[1px]"
              >✨</motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-32 right-10 text-4xl opacity-20 filter blur-[1px]"
              >🌿</motion.div>
              <motion.div 
                animate={{ y: [0, -15, 0], x: [0, 10, 0] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-1/2 left-5 text-2xl opacity-20 filter blur-[1px]"
              >🌸</motion.div>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10"
                >
                  {activeTab === 'home' && <Dashboard user={user} />}
                  {activeTab === 'todo' && <TodoList user={user} />}
                  {activeTab === 'logs' && <WellnessLog user={user} profile={profile} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <footer className="relative z-10 py-8 text-center pb-32">
              <p className="text-[10px] font-black text-pink-400/60 uppercase tracking-[0.3em] flex items-center justify-center gap-2 drop-shadow-sm">
                made with love for my love <span className="text-pink-400 animate-pulse">♥</span> Elxi
              </p>
            </footer>

            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkle Burst Effect */}
      <AnimatePresence>
        {showFlash && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 1.5, 
                  x: Math.cos(i * 30 * Math.PI / 180) * 200, 
                  y: Math.sin(i * 30 * Math.PI / 180) * 200 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute"
              >
                <Sparkles className="text-pink-300 fill-pink-300" size={32} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
