export interface DailyBlock {
  id: string;
  time: string;
  endTime: string;
  activity: string;
  type: 'core' | 'training' | 'work' | 'da' | 'business' | 'class' | 'recovery';
  description?: string;
  isDA?: boolean;
}

export interface DaySchedule {
  day: string;
  type: 'class' | 'deep-work' | 'integration' | 'review';
  blocks: DailyBlock[];
}

export const coreBlocks: DailyBlock[] = [
  { id: 'wake', time: '06:30', endTime: '07:00', activity: 'WAKE UP', type: 'core', description: 'NO SNOOZE - Cold shower (3 min)' },
  { id: 'meditation', time: '07:00', endTime: '07:20', activity: 'MEDITATION', type: 'core', description: '20 minutes' },
  { id: 'breakfast', time: '07:20', endTime: '08:00', activity: 'BREAKFAST + FIREBLOOD', type: 'core' },
  { id: 'lunch', time: '12:00', endTime: '13:00', activity: 'LUNCH + CREATINE', type: 'core' },
  { id: 'tennis', time: '15:00', endTime: '17:30', activity: 'TENNIS PRACTICE', type: 'training', description: 'EVERY DAY - NO EXCEPTIONS' },
  { id: 'dinner', time: '17:30', endTime: '18:30', activity: 'DINNER', type: 'core', description: 'EVERY DAY' },
  { id: 'evening', time: '23:30', endTime: '24:00', activity: 'EVENING PROTOCOL', type: 'core', description: 'Reflection + Prep' },
  { id: 'sleep', time: '00:00', endTime: '06:30', activity: 'LIGHTS OUT', type: 'core', description: 'MIDNIGHT - NO PHONE' },
];

export const weeklySchedule: DaySchedule[] = [
  {
    day: 'Monday',
    type: 'deep-work',
    blocks: [
      ...coreBlocks,
      { id: 'mon-skill', time: '08:00', endTime: '08:45', activity: 'Morning Skill Work', type: 'training', description: '45 minutes' },
      { id: 'mon-work', time: '09:00', endTime: '12:00', activity: 'Deep Work Block', type: 'work' },
      { id: 'mon-work2', time: '13:00', endTime: '15:00', activity: 'Deep Work Block 2', type: 'work' },
      { id: 'mon-weapons1', time: '18:30', endTime: '19:00', activity: 'Weapons Training (HEMA/Kali)', type: 'training' },
      { id: 'mon-da', time: '19:00', endTime: '20:00', activity: 'DA JOB - AI BUSINESS', type: 'da', isDA: true, description: 'Use productively' },
      { id: 'mon-weapons2', time: '20:00', endTime: '21:30', activity: 'Weapons Training (HEMA/Kali)', type: 'training' },
      { id: 'mon-wind', time: '21:30', endTime: '23:30', activity: 'Evening Business + Wind Down', type: 'business' },
    ]
  },
  {
    day: 'Tuesday',
    type: 'class',
    blocks: [
      ...coreBlocks,
      { id: 'tue-skill', time: '08:00', endTime: '08:30', activity: 'Morning Skill Work', type: 'training' },
      { id: 'tue-class', time: '08:30', endTime: '12:00', activity: 'CLASSES', type: 'class', description: 'French, Entrepreneurship, Personal Finance' },
      { id: 'tue-work', time: '13:00', endTime: '15:00', activity: 'Academic Work', type: 'work' },
      { id: 'tue-striking', time: '18:30', endTime: '20:00', activity: 'Striking (Boxing/Muay Thai)', type: 'training' },
      { id: 'tue-da', time: '20:00', endTime: '21:00', activity: 'DA JOB - ACADEMIC WORK', type: 'da', isDA: true, description: 'Use productively' },
      { id: 'tue-wind', time: '21:00', endTime: '23:30', activity: 'Evening Study + Wind Down', type: 'work' },
    ]
  },
  {
    day: 'Wednesday',
    type: 'deep-work',
    blocks: [
      ...coreBlocks,
      { id: 'wed-skill', time: '08:00', endTime: '08:45', activity: 'Morning Skill Work', type: 'training' },
      { id: 'wed-work', time: '09:00', endTime: '12:00', activity: 'Deep Work Block', type: 'work' },
      { id: 'wed-work2', time: '13:00', endTime: '15:00', activity: 'Deep Work Block 2', type: 'work' },
      { id: 'wed-recovery', time: '18:30', endTime: '19:00', activity: 'Active Recovery', type: 'recovery', description: 'Light mobility work' },
      { id: 'wed-da', time: '19:00', endTime: '20:00', activity: 'DA JOB - AI BUSINESS', type: 'da', isDA: true, description: 'Use productively' },
      { id: 'wed-intel', time: '20:00', endTime: '22:00', activity: 'Intelligence Work', type: 'business', description: 'Research + Strategy' },
      { id: 'wed-wind', time: '22:00', endTime: '23:30', activity: 'Evening Wind Down', type: 'recovery' },
    ]
  },
  {
    day: 'Thursday',
    type: 'class',
    blocks: [
      ...coreBlocks,
      { id: 'thu-skill', time: '08:00', endTime: '08:30', activity: 'Morning Skill Work', type: 'training' },
      { id: 'thu-class', time: '08:30', endTime: '12:00', activity: 'CLASSES', type: 'class', description: 'French, Entrepreneurship, Personal Finance' },
      { id: 'thu-work', time: '13:00', endTime: '15:00', activity: 'Academic Work', type: 'work' },
      { id: 'thu-grappling', time: '18:30', endTime: '20:00', activity: 'Grappling (BJJ/Wrestling)', type: 'training' },
      { id: 'thu-da', time: '20:00', endTime: '21:00', activity: 'DA JOB - ACADEMIC WORK', type: 'da', isDA: true, description: 'Use productively' },
      { id: 'thu-wind', time: '21:00', endTime: '23:30', activity: 'Evening Study + Wind Down', type: 'work' },
    ]
  },
  {
    day: 'Friday',
    type: 'deep-work',
    blocks: [
      ...coreBlocks,
      { id: 'fri-skill', time: '08:00', endTime: '08:45', activity: 'Morning Skill Work', type: 'training' },
      { id: 'fri-work', time: '09:00', endTime: '10:00', activity: 'Business Work', type: 'business' },
      { id: 'fri-da', time: '10:00', endTime: '11:00', activity: 'DA JOB - BUSINESS WORK', type: 'da', isDA: true, description: 'Use productively' },
      { id: 'fri-work2', time: '11:00', endTime: '12:00', activity: 'Business Work', type: 'business' },
      { id: 'fri-work3', time: '13:00', endTime: '15:00', activity: 'Business Development', type: 'business' },
      { id: 'fri-prep', time: '18:30', endTime: '19:00', activity: 'Workout Prep', type: 'training' },
      { id: 'fri-da2', time: '19:00', endTime: '20:00', activity: 'DA JOB - LIGHT ADMIN', type: 'da', isDA: true, description: 'Use productively' },
      { id: 'fri-heavy', time: '20:00', endTime: '21:30', activity: 'Heavy Duty Workout (Mentzer)', type: 'training', description: 'Max intensity' },
      { id: 'fri-wind', time: '21:30', endTime: '23:30', activity: 'Recovery + Wind Down', type: 'recovery' },
    ]
  },
  {
    day: 'Saturday',
    type: 'integration',
    blocks: [
      ...coreBlocks,
      { id: 'sat-skill', time: '08:00', endTime: '09:00', activity: 'Morning Skill Work', type: 'training' },
      { id: 'sat-business', time: '09:00', endTime: '12:00', activity: 'Extended Business Block', type: 'business' },
      { id: 'sat-mma', time: '12:30', endTime: '15:00', activity: 'MMA INTEGRATION', type: 'training', description: 'Full sparring + drilling' },
      { id: 'sat-business2', time: '18:30', endTime: '21:00', activity: 'Business Strategy', type: 'business' },
      { id: 'sat-wind', time: '21:00', endTime: '23:30', activity: 'Planning + Wind Down', type: 'recovery' },
    ]
  },
  {
    day: 'Sunday',
    type: 'review',
    blocks: [
      ...coreBlocks,
      { id: 'sun-skill', time: '08:00', endTime: '09:00', activity: 'Morning Skill Work', type: 'training' },
      { id: 'sun-intel', time: '09:00', endTime: '12:00', activity: 'Intelligence & Research', type: 'business' },
      { id: 'sun-recovery', time: '13:00', endTime: '15:00', activity: 'Active Recovery', type: 'recovery', description: 'Mobility + light cardio' },
      { id: 'sun-review', time: '18:30', endTime: '20:30', activity: 'WEEKLY REVIEW', type: 'recovery', description: 'Analyze + Plan' },
      { id: 'sun-prep', time: '20:30', endTime: '23:30', activity: 'Week Prep + Wind Down', type: 'recovery' },
    ]
  },
];

export const dailyChecklist = [
  { id: 'wake', label: 'Wake 6:30 AM (NO SNOOZE)', critical: true },
  { id: 'cold', label: 'Cold shower (3 min)', critical: true },
  { id: 'meditation', label: 'Meditation (20 min)', critical: false },
  { id: 'skill', label: 'Morning skill work (45 min)', critical: false },
  { id: 'tennis', label: 'Tennis practice completed', critical: true },
  { id: 'hydration', label: 'Tennis hydration tracked', critical: false },
  { id: 'combat', label: 'Combat training completed', critical: true },
  { id: 'da', label: 'DA job worked productively', critical: true },
  { id: 'business', label: 'Business targets hit', critical: false },
  { id: 'reflection', label: 'Evening reflection', critical: false },
  { id: 'bed', label: 'Bed by 12 AM', critical: true },
  { id: 'noporn', label: 'No porn - ZERO TOLERANCE', critical: true },
];

export const combatSchedule = [
  { day: 'Monday', session1: '18:30-19:00', session2: '20:00-21:30', type: 'Weapons (HEMA/Kali)', note: 'Split around DA' },
  { day: 'Tuesday', session1: '18:30-20:00', type: 'Striking (Boxing/Muay Thai)', note: '' },
  { day: 'Wednesday', session1: '', type: 'REST/Active Recovery + Intelligence', note: 'Mobility work' },
  { day: 'Thursday', session1: '18:30-20:00', type: 'Grappling (BJJ/Wrestling)', note: '' },
  { day: 'Friday', session1: '20:00-21:30', type: 'Heavy Duty Workout (Mentzer)', note: 'After DA' },
  { day: 'Saturday', session1: '12:30-15:00', type: 'Full MMA Integration', note: 'Sparring + drilling' },
  { day: 'Sunday', session1: '', type: 'Active Recovery + Weekly Review', note: '' },
];

export const daSchedule = [
  { day: 'Monday', time: '19:00-20:00', task: 'AI Business work', label: 'Building empire on their dime' },
  { day: 'Tuesday', time: '20:00-21:00', task: 'Academic work', label: 'Productive study time' },
  { day: 'Wednesday', time: '19:00-20:00', task: 'AI Business work', label: 'Building empire on their dime' },
  { day: 'Thursday', time: '20:00-21:00', task: 'Academic work', label: 'Productive study time' },
  { day: 'Friday', time: '10:00-11:00', task: 'Business work', label: 'Morning productivity' },
  { day: 'Friday', time: '19:00-20:00', task: 'Light admin', label: 'Keep it minimal' },
];
