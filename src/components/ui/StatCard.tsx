import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { soloLevelingTheme } from '../../styles/soloLevelingTokens';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  color?: string;
  trend?: number;
  gradient?: string;
}

export function StatCard({ title, value, icon: Icon, subtitle, color = 'blue', trend, gradient }: StatCardProps) {
  const colorMap: Record<string, string> = {
    green: soloLevelingTheme.stats.agility,
    blue: soloLevelingTheme.stats.intelligence,
    orange: soloLevelingTheme.stats.endurance,
    purple: soloLevelingTheme.stats.luck,
    red: soloLevelingTheme.stats.strength,
    cyan: soloLevelingTheme.stats.wisdom,
  };

  const glowColor = colorMap[color] || soloLevelingTheme.glow.primary;
  const gradientStyle = gradient || `linear-gradient(135deg, ${glowColor}, ${glowColor}dd)`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${glowColor}40` }}
      transition={{ duration: 0.3 }}
      className="rounded-xl p-6 transition-all duration-300"
      style={{
        background: soloLevelingTheme.background.card,
        border: `1px solid ${soloLevelingTheme.border.default}`,
        boxShadow: soloLevelingTheme.shadow.card,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`text-sm font-medium mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div
          className="p-3 rounded-lg"
          style={{
            background: `${glowColor}20`,
            border: `1px solid ${glowColor}40`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: glowColor }} />
        </div>
      </div>
    </motion.div>
  );
}
