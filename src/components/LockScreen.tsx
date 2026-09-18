import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Moon, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface LockScreenProps {
  onUnlock: () => void;
}

const PASSCODE = "1729";

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleNumberClick = (num: string) => {
    if (code.length < 4) {
      const newCode = code + num;
      setCode(newCode);
      
      if (newCode.length === 4) {
        if (newCode === PASSCODE) {
          setIsUnlocking(true);
          setTimeout(onUnlock, 1500);
        } else {
          setError(true);
          setTimeout(() => {
            setCode("");
            setError(false);
          }, 1000);
        }
      }
    }
  };

  const handleDelete = () => {
    setCode(prev => prev.slice(0, -1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dreamy Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c2c] via-[#4a192c] to-[#121212] z-0" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0.1 + Math.random() * 0.3,
              scale: 0.5 + Math.random()
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0.6, 0.1],
            }}
            transition={{ 
              duration: 2 + Math.random() * 4, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute text-pink-200"
          >
            {i % 3 === 0 ? <Sparkles size={8} /> : i % 3 === 1 ? <Star size={4} fill="currentColor" /> : <div className="w-1 h-1 rounded-full bg-white opacity-50" />}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative z-20 flex flex-col items-center"
      >
        <motion.div
          animate={isUnlocking ? { scale: 1.2, opacity: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="flex justify-center gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={code.length > i ? { scale: [1, 1.2, 1], backgroundColor: "rgba(255, 255, 255, 0.9)" } : { backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                className="w-4 h-4 rounded-full border border-pink-200/40 backdrop-blur-md shadow-[0_0_20px_rgba(244,114,182,0.4)]"
              />
            ))}
          </div>
          
          <p className="text-pink-100/80 font-bold tracking-widest uppercase text-[10px] mb-2 font-sans">
            {error ? "that code feels unfamiliar 💭" : "your cozy world is waiting 🌙"}
          </p>
          <h2 className="text-white text-3xl font-black tracking-tight font-display drop-shadow-md">
            {isUnlocking ? "welcome back angel 🌸" : "enter your safe code ✨"}
          </h2>
        </motion.div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-6 p-8 rounded-[40px] bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ring-1 ring-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "back"].map((val, i) => {
            if (val === "") return <div key={i} />;
            if (val === "back") {
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  whileTap={{ scale: 0.9, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  onClick={handleDelete}
                  className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-pink-200/70 hover:text-pink-200 transition-colors z-10"
                >
                  <Moon size={20} />
                </motion.button>
              );
            }
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                whileTap={{ scale: 0.9, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                onClick={() => handleNumberClick(val.toString())}
                className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-display font-medium text-white shadow-lg backdrop-blur-md z-10"
              >
                {val}
              </motion.button>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-pink-200/40 flex items-center gap-2"
        >
          <Heart size={12} fill="currentColor" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] font-sans">only soft souls allowed</span>
        </motion.div>
      </motion.div>

      {/* Screen Effects */}
      <motion.div 
        animate={isUnlocking ? { opacity: 1 } : { opacity: 0 }}
        className="absolute inset-0 bg-white pointer-events-none z-50 mix-blend-overlay"
      />
    </motion.div>
  );
}
