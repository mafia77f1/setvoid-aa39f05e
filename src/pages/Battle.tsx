import { useState } from 'react';
import { motion } from 'framer-motion'; // مكتبة للحركات الجبارة

const SoloLevelingSystem = () => {
  const [bossHP, setBossHP] = useState(85000);
  
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative">
      {/* تأثير الخلفية: ضباب أزرق خفيف يوحي بالغموض */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>

      {/* 1. التنبيه العلوي (System Message) */}
      <div className="absolute top-10 left-0 w-full flex justify-center z-50">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-l-4 border-blue-500 bg-blue-900/20 px-6 py-2 skew-x-[-20deg] backdrop-blur-md"
        >
          <p className="text-blue-400 font-black italic tracking-widest text-sm uppercase skew-x-[20deg]">
            Quest: Defeat the Snow Spider
          </p>
        </motion.div>
      </div>

      {/* 2. منطقة القتال (The Arena) */}
      <div className="relative h-[50vh] flex flex-col items-center justify-center">
        {/* شريط الـ HP الخاص بالزعيم بستايل حاد */}
        <div className="w-[80%] max-w-xl mb-10">
          <div className="flex justify-between items-end mb-1 px-2">
            <span className="text-[10px] font-bold text-silver/50 tracking-[0.3em]">BOSS VITALITY</span>
            <span className="text-blue-400 font-mono text-sm tracking-widest">85%</span>
          </div>
          <div className="h-2 bg-zinc-900 border border-blue-500/30 relative overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-700 to-blue-400"
              initial={{ width: "100%" }}
              animate={{ width: "85%" }}
            />
          </div>
        </div>

        {/* صور الوحش واللاعب (أماكن افتراضية) */}
        <div className="flex justify-between items-end w-full max-w-4xl px-10">
           <img src="/BoosSnowSpider.png" className="w-64 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" alt="Boss" />
           <img src="/UserPersonality.png" className="w-40 filter brightness-125" alt="Player" />
        </div>
      </div>

      {/* 3. لوحة التحكم السفلية (The System Interface) */}
      <div className="absolute bottom-0 w-full p-6 space-y-4">
        {/* أزرار المهارات (مثل الصورة لكن بستايل سولو ليفلينج) */}
        <div className="flex justify-center gap-6">
          {['Skill 1', 'Skill 2', 'Skill 3'].map((skill, index) => (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              key={index}
              className="w-16 h-16 border-2 border-blue-500/50 bg-blue-950/40 rounded-lg flex items-center justify-center relative group"
            >
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <span className="text-[10px] font-black uppercase tracking-tighter italic text-blue-200">Active</span>
            </motion.button>
          ))}
        </div>

        {/* لوحة المعلومات (Stats Box) */}
        <div className="grid grid-cols-3 gap-2 max-w-3xl mx-auto">
          {['Strength', 'Agility', 'Sense'].map((stat) => (
            <div key={stat} className="bg-zinc-900/80 border border-white/5 p-3 clip-path-sharp flex justify-between items-center group cursor-pointer hover:border-blue-500 transition-colors">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-blue-400">{stat}</span>
              <span className="text-sm font-black italic text-white">42</span>
            </div>
          ))}
        </div>
      </div>

      {/* تنسيقات CSS مخصصة */}
      <style>{`
        .clip-path-sharp {
          clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
        }
      `}</style>
    </div>
  );
};

export default SoloLevelingSystem;
