import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Target, Shield, Zap, TrendingUp, Award, Flame, Star } from 'lucide-react';
import { soloLevelingTheme } from '../styles/soloLevelingTokens';

interface CombatStat {
  id: string;
  name: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function SoloLevelingCombat() {
  const [combatStats] = useState<CombatStat[]>([
    {
      id: 'striking',
      name: 'Striking',
      level: 3,
      currentXP: 450,
      xpToNextLevel: 600,
      icon: <Target className="w-6 h-6" />,
      color: soloLevelingTheme.stats.strength,
      description: 'Boxing, Muay Thai - Knockout Power'
    },
    {
      id: 'grappling',
      name: 'Grappling',
      level: 2,
      currentXP: 280,
      xpToNextLevel: 400,
      icon: <Shield className="w-6 h-6" />,
      color: soloLevelingTheme.stats.endurance,
      description: 'BJJ, Wrestling - Ground Control'
    },
    {
      id: 'weapons',
      name: 'Weapons',
      level: 2,
      currentXP: 320,
      xpToNextLevel: 400,
      icon: <Swords className="w-6 h-6" />,
      color: soloLevelingTheme.stats.agility,
      description: 'HEMA, Kali - Blade Mastery'
    },
    {
      id: 'conditioning',
      name: 'Conditioning',
      level: 4,
      currentXP: 720,
      xpToNextLevel: 800,
      icon: <Flame className="w-6 h-6" />,
      color: soloLevelingTheme.stats.wisdom,
      description: 'Endurance & Power'
    },
  ]);

  const [dailyQuests] = useState([
    { id: 1, name: 'Shadow Boxing', xp: 10, completed: true },
    { id: 2, name: 'Ground Shrimping', xp: 10, completed: true },
    { id: 3, name: 'Stick Flow Drill', xp: 10, completed: false },
    { id: 4, name: 'Heavy Bag Work', xp: 10, completed: false },
  ]);

  const [weeklyChallenge] = useState({
    name: 'Sparring Simulation',
    progress: 3,
    total: 7,
    xpReward: 50,
  });

  const totalLevel = combatStats.reduce((sum, stat) => sum + stat.level, 0);
  const averageLevel = (totalLevel / combatStats.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: soloLevelingTheme.gradient.card,
          border: `2px solid ${soloLevelingTheme.border.default}`,
          boxShadow: soloLevelingTheme.shadow.glowStrong,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Swords className="w-8 h-8 text-blue-400" />
                Combat Mastery
              </h2>
              <p className="text-slate-400">Level up your fighting skills</p>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-white mb-1">{totalLevel}</div>
              <div className="text-sm text-slate-400">Total Level</div>
              <div className="text-xs text-blue-400 mt-1">Avg: {averageLevel}</div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Overall Combat Level</span>
              <span className="text-blue-400 font-medium">Level {Math.floor(totalLevel / 4)}</span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: soloLevelingTheme.progress.barBg }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((totalLevel % 4) / 4) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, ${soloLevelingTheme.glow.primary}, ${soloLevelingTheme.glow.secondary})`,
                  boxShadow: `0 0 10px ${soloLevelingTheme.progress.glow}`,
                }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Combat Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combatStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: soloLevelingTheme.shadow.glowStrong }}
            className="rounded-xl p-6 cursor-pointer transition-all duration-300"
            style={{
              background: soloLevelingTheme.background.card,
              border: `1px solid ${soloLevelingTheme.border.default}`,
              boxShadow: soloLevelingTheme.shadow.card,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    background: `${stat.color}20`,
                    border: `1px solid ${stat.color}40`,
                  }}
                >
                  <div style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{stat.name}</h3>
                  <p className="text-xs text-slate-400">{stat.description}</p>
                </div>
              </div>

              <div className="text-right">
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: stat.color }}
                >
                  Lv. {stat.level}
                </div>
                <div className="text-xs text-slate-400">
                  {stat.currentXP}/{stat.xpToNextLevel} XP
                </div>
              </div>
            </div>

            {/* XP Bar */}
            <div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: soloLevelingTheme.progress.barBg }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.currentXP / stat.xpToNextLevel) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full rounded-full"
                  style={{
                    background: stat.color,
                    boxShadow: `0 0 8px ${stat.color}80`,
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {Math.round((stat.currentXP / stat.xpToNextLevel) * 100)}% to next level
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Daily Quests */}
      <div
        className="rounded-xl p-6"
        style={{
          background: soloLevelingTheme.background.card,
          border: `1px solid ${soloLevelingTheme.border.default}`,
          boxShadow: soloLevelingTheme.shadow.card,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{
              background: `${soloLevelingTheme.quest.daily}20`,
              border: `1px solid ${soloLevelingTheme.quest.daily}40`,
            }}
          >
            <Target className="w-5 h-5" style={{ color: soloLevelingTheme.quest.daily }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Daily Combat Quests</h3>
            <p className="text-sm text-slate-400">Complete to earn XP</p>
          </div>
        </div>

        <div className="space-y-3">
          {dailyQuests.map((quest) => (
            <motion.div
              key={quest.id}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between p-4 rounded-lg transition-all duration-200"
              style={{
                background: quest.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                border: `1px solid ${quest.completed ? soloLevelingTheme.quest.completed : soloLevelingTheme.border.default}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center border-2"
                  style={{
                    borderColor: quest.completed ? soloLevelingTheme.quest.completed : soloLevelingTheme.border.default,
                    background: quest.completed ? soloLevelingTheme.quest.completed : 'transparent',
                  }}
                >
                  {quest.completed && <Star className="w-4 h-4 text-white" />}
                </div>
                <span className={`font-medium ${quest.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                  {quest.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">+{quest.xp} XP</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Daily Progress</span>
            <span className="text-blue-400 font-bold">
              {dailyQuests.filter(q => q.completed).length}/{dailyQuests.length} Complete
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Challenge */}
      <div
        className="rounded-xl p-6"
        style={{
          background: soloLevelingTheme.gradient.blueGlow,
          border: `2px solid ${soloLevelingTheme.border.purple}`,
          boxShadow: soloLevelingTheme.shadow.purpleGlow,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-2 rounded-lg"
            style={{
              background: `${soloLevelingTheme.quest.weekly}30`,
              border: `1px solid ${soloLevelingTheme.quest.weekly}60`,
            }}
          >
            <Award className="w-5 h-5" style={{ color: soloLevelingTheme.quest.weekly }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{weeklyChallenge.name}</h3>
            <p className="text-sm text-slate-400">Weekly Combat Challenge</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Progress</span>
            <span className="text-purple-400 font-bold">
              {weeklyChallenge.progress}/{weeklyChallenge.total} Days
            </span>
          </div>

          <div
            className="h-4 rounded-full overflow-hidden"
            style={{ background: 'rgba(139, 92, 246, 0.1)' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(weeklyChallenge.progress / weeklyChallenge.total) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full relative"
              style={{
                background: `linear-gradient(90deg, ${soloLevelingTheme.glow.secondary}, ${soloLevelingTheme.glow.primary})`,
                boxShadow: `0 0 10px ${soloLevelingTheme.glow.secondary}80`,
              }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {Math.round((weeklyChallenge.progress / weeklyChallenge.total) * 100)}% Complete
            </span>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm">+{weeklyChallenge.xpReward} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Training Hours', value: '127', icon: <TrendingUp className="w-5 h-5" />, color: soloLevelingTheme.glow.cyan },
          { label: 'Quests Done', value: '342', icon: <Target className="w-5 h-5" />, color: soloLevelingTheme.glow.primary },
          { label: 'Streak Days', value: '15', icon: <Flame className="w-5 h-5" />, color: soloLevelingTheme.stats.strength },
          { label: 'Total XP', value: '2.1k', icon: <Star className="w-5 h-5" />, color: soloLevelingTheme.stats.luck },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg p-4 text-center"
            style={{
              background: soloLevelingTheme.background.card,
              border: `1px solid ${soloLevelingTheme.border.default}`,
              boxShadow: soloLevelingTheme.shadow.card,
            }}
          >
            <div className="flex justify-center mb-2" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
