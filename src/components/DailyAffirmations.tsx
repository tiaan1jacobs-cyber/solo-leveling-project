import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Flame,
  Zap,
  Shield,
  Target,
  Brain,
  Heart,
  TrendingUp,
  CheckCircle2,
  Circle,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soloLevelingTheme } from '../styles/soloLevelingTokens';

interface Affirmation {
  id: string;
  text: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  completed: boolean;
}

interface AffirmationCategory {
  name: string;
  time: string;
  icon: React.ReactNode;
  color: string;
  affirmations: string[];
}

export default function DailyAffirmations() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  const affirmationCategories: AffirmationCategory[] = [
    {
      name: 'Core Identity',
      time: '6:30 AM - Wake Up',
      icon: <Sparkles className="w-5 h-5" />,
      color: soloLevelingTheme.glow.primary,
      affirmations: [
        'I AM a warrior in complete control of my mind and body',
        'I AM disciplined beyond what others think is possible',
        'I AM building an empire while others sleep',
        'I AM earning $5,000 per month through my AI business',
        'I AM a Templar - discipline is my worship',
        'I AM unstoppable in my pursuit of mastery',
        'I AM the man who keeps every promise to himself',
      ]
    },
    {
      name: 'Mental Fortress',
      time: 'Cold Shower',
      icon: <Shield className="w-5 h-5" />,
      color: soloLevelingTheme.stats.intelligence,
      affirmations: [
        'I AM mastering discomfort',
        'I AM forging unbreakable willpower',
        'I AM in complete control',
        'I AM strengthening my mind with every second',
      ]
    },
    {
      name: 'Business Warrior',
      time: '8:30 AM - Work Block',
      icon: <TrendingUp className="w-5 h-5" />,
      color: soloLevelingTheme.stats.luck,
      affirmations: [
        'I AM building a $5,000/month business',
        'I AM providing massive value to my clients',
        'I AM solving real problems with AI automation',
        'I AM a closer who turns leads into revenue',
        'I AM relentless in pursuit of my financial goals',
        'I AM earning while others are wishing',
      ]
    },
    {
      name: 'Combat Mastery',
      time: '6:30 PM - Training',
      icon: <Target className="w-5 h-5" />,
      color: soloLevelingTheme.stats.strength,
      affirmations: [
        'I AM learning the way of the blade',
        'I AM respecting ancient warrior arts',
        'I AM developing precision and flow',
        'I AM dangerous and disciplined',
        'I AM developing knockout power',
        'I AM a striker who commands respect',
      ]
    },
    {
      name: 'Mental Discipline',
      time: '7:00 AM - Meditation',
      icon: <Brain className="w-5 h-5" />,
      color: soloLevelingTheme.stats.wisdom,
      affirmations: [
        'I AM present and focused',
        'I AM the observer of my thoughts, not controlled by them',
        'I AM building neural pathways of discipline',
        'I AM creating my reality through daily action',
        'I AM aligned with my highest purpose',
        'I AM executing my mission with precision',
      ]
    },
    {
      name: 'Physical Excellence',
      time: 'Meals',
      icon: <Flame className="w-5 h-5" />,
      color: soloLevelingTheme.stats.endurance,
      affirmations: [
        'I AM fueling a champion\'s body',
        'I AM optimizing every system for peak performance',
        'I AM treating my body as a weapon that must be maintained',
        'I AM building strength with every meal',
        'I AM recovering like an elite athlete',
      ]
    },
  ];

  const [completedAffirmations, setCompletedAffirmations] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>(affirmationCategories[0].name);

  const totalAffirmations = affirmationCategories.reduce((sum, cat) => sum + cat.affirmations.length, 0);
  const completedCount = completedAffirmations.size;
  const completionPercentage = Math.round((completedCount / totalAffirmations) * 100);

  const toggleAffirmation = (categoryName: string, affirmationText: string) => {
    const key = `${categoryName}-${affirmationText}`;
    const newCompleted = new Set(completedAffirmations);

    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
      if (soundEnabled) {
        // Play success sound (optional)
      }
    }

    setCompletedAffirmations(newCompleted);
  };

  const isAffirmationCompleted = (categoryName: string, affirmationText: string) => {
    return completedAffirmations.has(`${categoryName}-${affirmationText}`);
  };

  const getCategoryCompletion = (category: AffirmationCategory) => {
    const completed = category.affirmations.filter(aff =>
      isAffirmationCompleted(category.name, aff)
    ).length;
    return { completed, total: category.affirmations.length };
  };

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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                Daily Affirmations
              </h2>
              <p className="text-slate-400">"I AM" declarations for systematic identity transformation</p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-3 rounded-xl transition-all"
                style={{
                  background: soundEnabled ? soloLevelingTheme.glow.primary + '20' : soloLevelingTheme.background.card,
                  border: `1px solid ${soundEnabled ? soloLevelingTheme.glow.primary : soloLevelingTheme.border.default}`,
                }}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-blue-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAutoPlay(!autoPlay)}
                className="px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                style={{
                  background: autoPlay ? soloLevelingTheme.gradient.button : soloLevelingTheme.background.card,
                  border: `1px solid ${autoPlay ? soloLevelingTheme.glow.primary : soloLevelingTheme.border.default}`,
                }}
              >
                <Play className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  {autoPlay ? 'Auto-Play ON' : 'Auto-Play OFF'}
                </span>
              </motion.button>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Today's Progress</span>
              <span className="text-purple-400 font-bold">
                {completedCount}/{totalAffirmations} Affirmations ({completionPercentage}%)
              </span>
            </div>
            <div
              className="h-4 rounded-full overflow-hidden"
              style={{ background: soloLevelingTheme.progress.barBg }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, ${soloLevelingTheme.glow.secondary}, ${soloLevelingTheme.glow.primary})`,
                  boxShadow: `0 0 15px ${soloLevelingTheme.glow.secondary}80`,
                }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>

          {/* XP Display */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold">
              +{completedCount * 5} XP Earned Today
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {affirmationCategories.map((category) => {
          const { completed, total } = getCategoryCompletion(category);
          const isActive = activeCategory === category.name;

          return (
            <motion.button
              key={category.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCategory(category.name)}
              className="px-4 py-3 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 min-w-fit"
              style={{
                background: isActive ? category.color + '20' : soloLevelingTheme.background.card,
                border: `1px solid ${isActive ? category.color : soloLevelingTheme.border.default}`,
                boxShadow: isActive ? `0 0 15px ${category.color}40` : 'none',
              }}
            >
              <div style={{ color: category.color }}>
                {category.icon}
              </div>
              <div className="text-left">
                <div className="text-white font-medium text-sm">{category.name}</div>
                <div className="text-xs" style={{ color: category.color }}>
                  {completed}/{total}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Affirmations Display */}
      <AnimatePresence mode="wait">
        {affirmationCategories
          .filter(cat => cat.name === activeCategory)
          .map((category) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Header */}
              <div
                className="rounded-xl p-6 mb-4"
                style={{
                  background: soloLevelingTheme.background.card,
                  border: `1px solid ${category.color}40`,
                  boxShadow: `0 0 20px ${category.color}20`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        background: category.color + '20',
                        border: `1px solid ${category.color}40`,
                      }}
                    >
                      <div style={{ color: category.color }}>
                        {category.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                      <p className="text-sm text-slate-400">{category.time}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: category.color }}>
                      {getCategoryCompletion(category).completed}/{getCategoryCompletion(category).total}
                    </div>
                    <div className="text-xs text-slate-400">Completed</div>
                  </div>
                </div>
              </div>

              {/* Affirmations List */}
              <div className="space-y-3">
                {category.affirmations.map((affirmation, index) => {
                  const isCompleted = isAffirmationCompleted(category.name, affirmation);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4, scale: 1.01 }}
                      onClick={() => toggleAffirmation(category.name, affirmation)}
                      className="rounded-xl p-6 cursor-pointer transition-all duration-300"
                      style={{
                        background: isCompleted
                          ? `${category.color}15`
                          : soloLevelingTheme.background.card,
                        border: `1px solid ${isCompleted ? category.color + '60' : soloLevelingTheme.border.default}`,
                        boxShadow: isCompleted
                          ? `0 0 20px ${category.color}30`
                          : soloLevelingTheme.shadow.card,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          {isCompleted ? (
                            <CheckCircle2
                              className="w-8 h-8"
                              style={{ color: category.color }}
                            />
                          ) : (
                            <Circle
                              className="w-8 h-8"
                              style={{ color: soloLevelingTheme.border.default }}
                            />
                          )}
                        </motion.div>

                        <div className="flex-1">
                          <p
                            className={`text-lg font-medium transition-all ${
                              isCompleted ? 'text-white' : 'text-slate-300'
                            }`}
                            style={isCompleted ? {
                              textShadow: `0 0 10px ${category.color}60`
                            } : {}}
                          >
                            {affirmation}
                          </p>
                        </div>

                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1"
                          >
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-bold text-sm">+5 XP</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Category Complete Message */}
              {getCategoryCompletion(category).completed === getCategoryCompletion(category).total && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 rounded-xl p-6 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}20, ${category.color}10)`,
                    border: `2px solid ${category.color}`,
                    boxShadow: `0 0 30px ${category.color}50`,
                  }}
                >
                  <Heart className="w-12 h-12 mx-auto mb-3" style={{ color: category.color }} />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.name} Complete!
                  </h3>
                  <p className="text-slate-300 mb-3">
                    You've declared all {category.name.toLowerCase()} affirmations for today
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-lg">
                      +{category.affirmations.length * 5} XP Earned
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* All Complete Celebration */}
      {completedCount === totalAffirmations && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${soloLevelingTheme.glow.primary}20, ${soloLevelingTheme.glow.secondary}20)`,
            border: `3px solid ${soloLevelingTheme.glow.primary}`,
            boxShadow: soloLevelingTheme.shadow.glowStrong,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse" />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-4 relative"
          >
            <Sparkles className="w-20 h-20 text-yellow-400" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-3">
            🎉 ALL AFFIRMATIONS COMPLETE! 🎉
          </h2>
          <p className="text-xl text-purple-400 mb-4">
            You've declared your identity {totalAffirmations} times today
          </p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <span className="text-4xl font-bold text-yellow-400">
              +{totalAffirmations * 5} XP
            </span>
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Your neural pathways are being rewired. Your identity is shifting.
            Every declaration brings you closer to the man you're becoming.
          </p>
        </motion.div>
      )}

      {/* Quick Tips */}
      <div
        className="rounded-xl p-6"
        style={{
          background: soloLevelingTheme.background.card,
          border: `1px solid ${soloLevelingTheme.border.default}`,
        }}
      >
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          How to Use Affirmations
        </h3>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span><strong className="text-white">Say them OUT LOUD:</strong> Silent reading doesn't work. Your brain needs to hear your voice.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span><strong className="text-white">Mean every word:</strong> Don't just recite. Feel the truth of what you're declaring.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span><strong className="text-white">Multiple times daily:</strong> Repetition creates neural pathways. Say them at designated times.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span><strong className="text-white">Track completion:</strong> Click each affirmation after saying it. Build the habit.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
