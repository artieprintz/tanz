import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Droplets, Zap, Moon, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface WellnessLogProps {
  user: any;
  profile: any;
}

export const WellnessLog: React.FC<WellnessLogProps> = ({ user }) => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    // Generate recent 30-day log history from local storage
    const uid = user.uid;
    const history = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const logKey = `tanz_log_${uid}_${dateStr}`;
      const savedLog = localStorage.getItem(logKey);
      if (savedLog) {
        history.push({ id: logKey, ...JSON.parse(savedLog) });
      }
    }
    setLogs(history.reverse()); // Reverse to show chronological order for chart
  }, [user?.uid]);

  const chartData = logs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: log.mood === '✨' ? 4 : log.mood === '🌸' ? 3 : log.mood === '🌿' ? 2 : log.mood === '😴' ? 1 : null
  })).filter(d => d.mood !== null);

  return (
    <div className="px-6 pt-12 pb-24 overflow-y-auto h-full scrollbar-hide max-w-2xl mx-auto">
      <header className="mb-10 text-center">
        <div className="relative inline-block">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-24 h-24 glass-card rounded-[32px] shadow-[0_8px_32px_rgba(244,114,182,0.2)] flex items-center justify-center p-4 relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent"></div>
             <Calendar size={48} className="text-pink-500 relative z-10 drop-shadow-sm" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 text-4xl drop-shadow-md"
          >💖</motion.div>
        </div>
        <h3 className="text-3xl font-display font-black text-gray-800 mt-8 tracking-tight leading-none drop-shadow-sm">Your Bloom Archive</h3>
        <p className="text-[10px] text-pink-400 font-bold italic mt-3 uppercase tracking-[0.2em]">"Watching you shine, one day at a time"</p>
      </header>

      {/* Mood Trend Chart */}
      {chartData.length > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="glass-panel p-6 rounded-[32px] mb-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100/30 to-transparent pointer-events-none"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-[11px] font-black text-pink-500 uppercase tracking-[0.2em] flex items-center gap-2 drop-shadow-sm">
              <TrendingUp size={16} /> Mood Tracker
            </h3>
            <span className="text-[10px] font-bold text-gray-400 italic px-3 py-1 bg-white/50 rounded-full border border-pink-100/50">Last 7 Days</span>
          </div>
          <div className="h-[180px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(244,114,182,0.2)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af', fontFamily: 'Inter' }}
                  dy={10}
                />
                <YAxis hide domain={[1, 4]} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.8)', 
                    boxShadow: '0 8px 32px -4px rgba(244,114,182,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(12px)',
                    fontSize: '11px',
                    fontWeight: 800,
                    fontFamily: 'Inter',
                    color: '#ec4899'
                  }}
                  itemStyle={{ color: '#ec4899' }}
                  formatter={(value: any) => [
                    value === 4 ? '✨ Radiant' : value === 3 ? '🌸 Peaceful' : value === 2 ? '🌿 Natural' : '😴 Restive',
                    'Vibe'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="url(#colorMood)" 
                  strokeWidth={4} 
                  dot={{ fill: '#ec4899', r: 5, strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#db2777' }}
                />
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 px-2 relative z-10">
            {['😴', '🌿', '🌸', '✨'].map((emoji, i) => (
              <span key={i} className="text-xl filter drop-shadow-sm hover:scale-125 transition-transform">{emoji}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick History Cards */}
      <div className="space-y-4 mb-10">
        <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest px-2 mb-4 font-display">Recent Logs</h3>
        {logs.length > 0 ? logs.map((log, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.02, x: 4 }}
            key={log.id} 
            className="glass-card rounded-[32px] p-6 flex items-center justify-between group cursor-default"
          >
            <div>
              <p className="text-sm font-display font-black text-gray-800 group-hover:text-pink-600 transition-colors">
                {new Date(log.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 bg-blue-50/50 px-2 py-1 rounded-lg border border-blue-100/50">
                  <Droplets size={14} /> {log.water}ml
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 bg-emerald-50/50 px-2 py-1 rounded-lg border border-emerald-100/50">
                  <Zap size={14} /> {log.steps}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-500 bg-purple-50/50 px-2 py-1 rounded-lg border border-purple-100/50">
                  <Moon size={14} /> {log.sleep || 0}h
                </div>
              </div>
            </div>
            <div className="text-4xl drop-shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{log.mood || '✨'}</div>
          </motion.div>
        )) : (
          <div className="text-center py-10 opacity-60 glass-card rounded-[32px] p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-sans text-pink-400">No logs found ✨</p>
          </div>
        )}
      </div>

    </div>
  );
};
