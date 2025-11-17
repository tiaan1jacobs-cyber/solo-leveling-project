export interface ScheduleTemplate {
  id: string;
  name: string;
  description: string;
  dayType: 'class' | 'development' | 'intensive';
}

export interface TimeBlock {
  id: string;
  templateId: string;
  startTime: string;
  endTime: string;
  title: string;
  activityType: 'meditation' | 'training' | 'business' | 'academic' | 'personal' | 'health';
  orderIndex: number;
  color: string;
}

export interface TaskInstruction {
  id: string;
  timeBlockId: string;
  instructionText: string;
  orderIndex: number;
  isChecklistItem: boolean;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  category: string;
  timeBlockId?: string;
  description: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  timeBlockId: string;
  completionDate: string;
  completedAt: string;
  notes?: string;
}

export interface ChecklistProgress {
  id: string;
  userId: string;
  instructionId: string;
  completionDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  activeTemplateId: string;
}

export interface WeeklyScore {
  academicExcellence: number;
  athleticPerformance: number;
  aiBusiness: number;
  physicalTraining: number;
  personalDevelopment: number;
  disciplineHabits: number;
}

export interface AIAdaptation {
  id: string;
  date: string;
  type: 'time_change' | 'add_block' | 'add_recovery' | 'extend_duration' | 'suggest_rule';
  timeBlockId?: string;
  title: string;
  reasoning: string;
  beforeValue?: string;
  afterValue?: string;
  status: 'pending' | 'accepted' | 'rejected';
  successMetric?: number;
  createdAt: string;
}

export interface PatternDetection {
  id: string;
  patternType: 'time_preference' | 'completion_rate' | 'energy_level' | 'consecutive_misses';
  activityType: string;
  insight: string;
  confidence: number;
  dataPoints: number;
  detectedAt: string;
  actionTaken?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'completion' | 'discipline' | 'improvement';
  unlockedAt?: string;
  progress: number;
  target: number;
  isUnlocked: boolean;
}

export interface Notification {
  id: string;
  type: 'ai_suggestion' | 'achievement' | 'reminder' | 'warning';
  title: string;
  message: string;
  actionLabel?: string;
  actionId?: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
}

export interface DailyAnalytics {
  date: string;
  completionRate: number;
  tasksCompleted: number;
  tasksTotal: number;
  rulesFollowed: number;
  rulesTotal: number;
  score: number;
  energyLevel: 'low' | 'medium' | 'high';
  productivityPeakHours: string[];
}

export interface RuleViolation {
  id: string;
  ruleNumber: number;
  ruleTitle: string;
  violationDate: string;
  offenseCount: number;
  consequenceApplied: string;
  consequenceCompleted: boolean;
  notes?: string;
}

export interface OptimizationScore {
  overall: number;
  categories: {
    timeAllocation: number;
    energyAlignment: number;
    goalProgress: number;
    consistency: number;
    recovery: number;
  };
  suggestions: string[];
}
