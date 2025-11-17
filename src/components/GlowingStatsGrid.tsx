import {
  Sword,
  Target,
  Flame,
  Shield,
  Zap,
  TrendingUp
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import { soloLevelingTheme } from "../styles/soloLevelingTokens";

export function GlowingStatsGrid() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Sword className="h-4 w-4" />}
        title="Combat Training System"
        description="Transform your daily routine into a leveling experience with HEMA, Kali, and weapons mastery training"
        gradient="from-red-500/20 to-orange-500/20"
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Target className="h-4 w-4" />}
        title="Daily Quest Tracking"
        description="Complete missions from morning declarations to evening reflection. Every task earns XP and builds your warrior discipline"
        gradient="from-blue-500/20 to-cyan-500/20"
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Flame className="h-4 w-4" />}
        title="AI Business Warfare"
        description="Deep work blocks for building your AI automation empire. Transform hustle into systematic domination"
        gradient="from-yellow-500/20 to-orange-500/20"
      />
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Shield className="h-4 w-4" />}
        title="Iron Discipline Code"
        description="7 Core 'I AM' declarations. Mental mantras. Physical affirmations. Build an unbreakable mindset"
        gradient="from-purple-500/20 to-pink-500/20"
      />
      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<TrendingUp className="h-4 w-4" />}
        title="Solo Leveling Progress"
        description="Real-time XP tracking, streak counter, and analytics. Watch yourself level up day by day"
        gradient="from-green-500/20 to-emerald-500/20"
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  gradient?: string;
}

const GridItem = ({ area, icon, title, description, gradient }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] p-2 md:rounded-[1.5rem] md:p-3"
        style={{
          borderColor: soloLevelingTheme.border.default,
        }}
      >
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div
          className={cn(
            "relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] p-6 shadow-sm",
            gradient && `bg-gradient-to-br ${gradient}`
          )}
          style={{
            backgroundColor: soloLevelingTheme.background.card,
            borderColor: soloLevelingTheme.border.default,
            boxShadow: soloLevelingTheme.shadow.glow,
          }}
        >
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div
              className="w-fit rounded-lg border-[0.75px] p-2 bg-blue-100 border-blue-300"
              style={{ color: '#3b82f6' }}
            >
              {icon}
            </div>
            <div className="space-y-3">
              <h3
                className="pt-0.5 text-xl leading-[1.375rem] font-bold tracking-tight md:text-2xl md:leading-[1.875rem] text-balance"
                style={{ color: '#3b82f6', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                {title}
              </h3>
              <h2
                className="text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] font-medium"
                style={{ color: '#60a5fa', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                {description}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#60a5fa', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            <Zap className="w-3 h-3" />
            <span>Level Up System Active</span>
          </div>
        </div>
      </div>
    </li>
  );
};
