import { subDays, format } from 'date-fns';
import { AIAdaptation, PatternDetection, Achievement, DailyAnalytics, RuleViolation } from '../types';

const today = new Date();

export const mockAIAdaptations: AIAdaptation[] = [
  {
    id: 'adapt-1',
    date: format(subDays(today, 3), 'yyyy-MM-dd'),
    type: 'time_change',
    timeBlockId: 'block-9',
    title: 'Tennis Training Time Optimized',
    reasoning: 'Analysis shows 90% better completion rate when tennis is scheduled at 4pm vs 6pm. Moving to align with your peak energy window.',
    beforeValue: '18:00 - 20:30',
    afterValue: '16:00 - 18:30',
    status: 'accepted',
    successMetric: 0.95,
    createdAt: new Date(subDays(today, 3)).toISOString()
  },
  {
    id: 'adapt-2',
    date: format(subDays(today, 2), 'yyyy-MM-dd'),
    type: 'add_recovery',
    title: 'Recovery Block Added After Intensive Training',
    reasoning: 'Heavy workout days show improved next-day performance with dedicated 30-minute recovery and stretching session.',
    afterValue: '19:00 - 19:30 Recovery & Stretching',
    status: 'accepted',
    successMetric: 0.88,
    createdAt: new Date(subDays(today, 2)).toISOString()
  },
  {
    id: 'adapt-3',
    date: format(today, 'yyyy-MM-dd'),
    type: 'extend_duration',
    timeBlockId: 'block-2',
    title: 'Extended Meditation Duration',
    reasoning: 'You missed meditation 2x this week. Extending to 30 minutes and adding evening session may improve consistency and mental clarity.',
    beforeValue: '20 minutes',
    afterValue: '30 minutes',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'adapt-4',
    date: format(today, 'yyyy-MM-dd'),
    type: 'suggest_rule',
    title: 'New Rule: 10-Min Meditation After Missed Sessions',
    reasoning: 'Pattern detected: when meditation is skipped, productivity drops 15% the next day. Immediate make-up session recommended.',
    afterValue: 'If meditation missed, complete 10-minute session before bed',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

export const mockPatternDetections: PatternDetection[] = [
  {
    id: 'pattern-1',
    patternType: 'time_preference',
    activityType: 'tennis',
    insight: 'Tennis training completion rate is 90% higher when scheduled at 4pm compared to 6pm',
    confidence: 0.92,
    dataPoints: 15,
    detectedAt: new Date(subDays(today, 4)).toISOString(),
    actionTaken: 'Moved tennis training to 4pm'
  },
  {
    id: 'pattern-2',
    patternType: 'completion_rate',
    activityType: 'business',
    insight: 'Business tasks most productive between 9-11am with 95% completion rate',
    confidence: 0.88,
    dataPoints: 20,
    detectedAt: new Date(subDays(today, 6)).toISOString(),
    actionTaken: 'Prioritized deep work during morning hours'
  },
  {
    id: 'pattern-3',
    patternType: 'energy_level',
    activityType: 'meditation',
    insight: 'Meditation consistency drops 40% on days with less than 7 hours sleep',
    confidence: 0.85,
    dataPoints: 12,
    detectedAt: new Date(subDays(today, 5)).toISOString()
  },
  {
    id: 'pattern-4',
    patternType: 'consecutive_misses',
    activityType: 'meditation',
    insight: 'Meditation missed 3 times this week - consider adding accountability or reminder system',
    confidence: 1.0,
    dataPoints: 3,
    detectedAt: new Date(subDays(today, 1)).toISOString(),
    actionTaken: 'Suggested extended meditation duration'
  },
  {
    id: 'pattern-5',
    patternType: 'energy_level',
    activityType: 'general',
    insight: 'Monday mornings show 25% lower energy - consider lighter workout or extra recovery time',
    confidence: 0.79,
    dataPoints: 8,
    detectedAt: new Date(subDays(today, 3)).toISOString()
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: '5-Day Perfect Streak',
    description: 'Complete all scheduled activities for 5 consecutive days',
    icon: 'flame',
    category: 'streak',
    unlockedAt: new Date(subDays(today, 1)).toISOString(),
    progress: 5,
    target: 5,
    isUnlocked: true
  },
  {
    id: 'ach-2',
    title: '7-Day Warrior',
    description: 'Maintain perfect schedule completion for 7 days straight',
    icon: 'trophy',
    category: 'streak',
    progress: 5,
    target: 7,
    isUnlocked: false
  },
  {
    id: 'ach-3',
    title: '90% Week Champion',
    description: 'Achieve 90% or higher completion rate for an entire week',
    icon: 'award',
    category: 'completion',
    unlockedAt: new Date(subDays(today, 2)).toISOString(),
    progress: 1,
    target: 1,
    isUnlocked: true
  },
  {
    id: 'ach-4',
    title: 'Discipline Master',
    description: 'Follow all 20 rules for 7 consecutive days',
    icon: 'shield',
    category: 'discipline',
    progress: 3,
    target: 7,
    isUnlocked: false
  },
  {
    id: 'ach-5',
    title: 'Early Riser',
    description: 'Wake up at 5:30 AM without snoozing for 14 days',
    icon: 'sunrise',
    category: 'discipline',
    progress: 9,
    target: 14,
    isUnlocked: false
  },
  {
    id: 'ach-6',
    title: 'Business Builder',
    description: 'Complete all business tasks for 10 consecutive days',
    icon: 'briefcase',
    category: 'completion',
    unlockedAt: new Date(subDays(today, 0)).toISOString(),
    progress: 10,
    target: 10,
    isUnlocked: true
  },
  {
    id: 'ach-7',
    title: 'Fitness Fanatic',
    description: 'Complete every workout for 30 days',
    icon: 'dumbbell',
    category: 'completion',
    progress: 22,
    target: 30,
    isUnlocked: false
  },
  {
    id: 'ach-8',
    title: 'Productivity Boost',
    description: 'Improve weekly completion rate by 15%',
    icon: 'trending-up',
    category: 'improvement',
    unlockedAt: new Date(subDays(today, 4)).toISOString(),
    progress: 15,
    target: 15,
    isUnlocked: true
  }
];

export const mockDailyAnalytics: DailyAnalytics[] = [
  {
    date: format(subDays(today, 6), 'yyyy-MM-dd'),
    completionRate: 0.85,
    tasksCompleted: 11,
    tasksTotal: 13,
    rulesFollowed: 20,
    rulesTotal: 20,
    score: 240,
    energyLevel: 'high',
    productivityPeakHours: ['09:00', '10:00', '11:00']
  },
  {
    date: format(subDays(today, 5), 'yyyy-MM-dd'),
    completionRate: 0.77,
    tasksCompleted: 10,
    tasksTotal: 13,
    rulesFollowed: 19,
    rulesTotal: 20,
    score: 225,
    energyLevel: 'medium',
    productivityPeakHours: ['09:00', '10:00', '14:00']
  },
  {
    date: format(subDays(today, 4), 'yyyy-MM-dd'),
    completionRate: 0.92,
    tasksCompleted: 12,
    tasksTotal: 13,
    rulesFollowed: 20,
    rulesTotal: 20,
    score: 270,
    energyLevel: 'high',
    productivityPeakHours: ['09:00', '10:00', '11:00', '16:00']
  },
  {
    date: format(subDays(today, 3), 'yyyy-MM-dd'),
    completionRate: 0.69,
    tasksCompleted: 9,
    tasksTotal: 13,
    rulesFollowed: 18,
    rulesTotal: 20,
    score: 195,
    energyLevel: 'medium',
    productivityPeakHours: ['10:00', '14:00']
  },
  {
    date: format(subDays(today, 2), 'yyyy-MM-dd'),
    completionRate: 0.92,
    tasksCompleted: 12,
    tasksTotal: 13,
    rulesFollowed: 20,
    rulesTotal: 20,
    score: 275,
    energyLevel: 'high',
    productivityPeakHours: ['09:00', '10:00', '11:00', '16:00']
  },
  {
    date: format(subDays(today, 1), 'yyyy-MM-dd'),
    completionRate: 1.0,
    tasksCompleted: 13,
    tasksTotal: 13,
    rulesFollowed: 20,
    rulesTotal: 20,
    score: 300,
    energyLevel: 'high',
    productivityPeakHours: ['09:00', '10:00', '11:00', '14:00', '16:00']
  },
  {
    date: format(today, 'yyyy-MM-dd'),
    completionRate: 0.62,
    tasksCompleted: 8,
    tasksTotal: 13,
    rulesFollowed: 20,
    rulesTotal: 20,
    score: 180,
    energyLevel: 'high',
    productivityPeakHours: ['09:00', '10:00']
  }
];

export const mockRuleViolations: RuleViolation[] = [
  {
    id: 'viol-1',
    ruleNumber: 2,
    ruleTitle: 'NO DOOMSCROLLING OR MINDLESS INTERNET USE',
    violationDate: format(subDays(today, 5), 'yyyy-MM-dd'),
    offenseCount: 1,
    consequenceApplied: '30 burpees + delete the app for 24 hours',
    consequenceCompleted: true,
    notes: 'Caught scrolling Instagram during lunch break'
  },
  {
    id: 'viol-2',
    ruleNumber: 10,
    ruleTitle: 'NO SKIPPING MEDITATION OR SPIRITUAL PRACTICE',
    violationDate: format(subDays(today, 4), 'yyyy-MM-dd'),
    offenseCount: 1,
    consequenceApplied: 'Double meditation time tomorrow + evening reflection',
    consequenceCompleted: true,
    notes: 'Overslept and rushed morning routine'
  },
  {
    id: 'viol-3',
    ruleNumber: 10,
    ruleTitle: 'NO SKIPPING MEDITATION OR SPIRITUAL PRACTICE',
    violationDate: format(subDays(today, 3), 'yyyy-MM-dd'),
    offenseCount: 2,
    consequenceApplied: 'Week of 30-minute meditations + spiritual reading',
    consequenceCompleted: false,
    notes: 'Second missed meditation this week - AI suggested extended duration'
  }
];

export const motivationalQuotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  }
];

export function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

export function calculateWeeklyAverage(analytics: DailyAnalytics[]) {
  if (analytics.length === 0) return 0;
  const sum = analytics.reduce((acc, day) => acc + day.completionRate, 0);
  return Math.round((sum / analytics.length) * 100);
}

export function calculateOptimizationScore(
  analytics: DailyAnalytics[],
  patterns: PatternDetection[],
  adaptations: AIAdaptation[]
): number {
  const baseScore = calculateWeeklyAverage(analytics);
  const patternBonus = Math.min(patterns.length * 2, 10);
  const adaptationBonus = adaptations.filter(a => a.status === 'accepted').length * 3;

  return Math.min(baseScore + patternBonus + adaptationBonus, 100);
}
