import { ScheduleTemplate, TimeBlock, TaskInstruction, Resource } from '../types';

export const scheduleTemplates: ScheduleTemplate[] = [
  {
    id: 'template-dev',
    name: 'Development Days',
    description: 'Monday, Wednesday, Friday - Focus on AI business and training',
    dayType: 'development'
  },
  {
    id: 'template-class',
    name: 'Class Days',
    description: 'Tuesday, Thursday - French, Entrepreneurship, Personal Finance',
    dayType: 'class'
  },
  {
    id: 'template-intensive',
    name: 'Intensive Days',
    description: 'Saturday, Sunday - Combat training and development',
    dayType: 'intensive'
  }
];

export const timeBlocks: TimeBlock[] = [
  {
    id: 'block-1',
    templateId: 'template-dev',
    startTime: '05:30',
    endTime: '05:45',
    title: 'Morning Awakening & Bruce Lee Routine',
    activityType: 'health',
    orderIndex: 1,
    color: '#10B981'
  },
  {
    id: 'block-2',
    templateId: 'template-dev',
    startTime: '05:45',
    endTime: '06:45',
    title: 'Meditation & Spiritual Practice',
    activityType: 'meditation',
    orderIndex: 2,
    color: '#8B5CF6'
  },
  {
    id: 'block-3',
    templateId: 'template-dev',
    startTime: '06:45',
    endTime: '07:45',
    title: 'AI Automation Business Work',
    activityType: 'business',
    orderIndex: 3,
    color: '#3B82F6'
  },
  {
    id: 'block-4',
    templateId: 'template-dev',
    startTime: '07:45',
    endTime: '08:30',
    title: 'Academic Work',
    activityType: 'academic',
    orderIndex: 4,
    color: '#F59E0B'
  },
  {
    id: 'block-5',
    templateId: 'template-dev',
    startTime: '08:30',
    endTime: '09:00',
    title: 'Breakfast & Preparation',
    activityType: 'personal',
    orderIndex: 5,
    color: '#EC4899'
  },
  {
    id: 'block-6',
    templateId: 'template-dev',
    startTime: '09:00',
    endTime: '12:00',
    title: 'Deep Work - AI Business Development',
    activityType: 'business',
    orderIndex: 6,
    color: '#3B82F6'
  },
  {
    id: 'block-7',
    templateId: 'template-dev',
    startTime: '12:00',
    endTime: '13:00',
    title: 'Lunch & Recovery',
    activityType: 'personal',
    orderIndex: 7,
    color: '#EC4899'
  },
  {
    id: 'block-8',
    templateId: 'template-dev',
    startTime: '13:00',
    endTime: '15:00',
    title: 'Client Calls & Proposal Development',
    activityType: 'business',
    orderIndex: 8,
    color: '#3B82F6'
  },
  {
    id: 'block-9',
    templateId: 'template-dev',
    startTime: '15:00',
    endTime: '17:30',
    title: 'Tennis Training',
    activityType: 'training',
    orderIndex: 9,
    color: '#EF4444'
  },
  {
    id: 'block-10',
    templateId: 'template-dev',
    startTime: '17:30',
    endTime: '18:30',
    title: 'Mike Mentzer Heavy Duty Workout',
    activityType: 'training',
    orderIndex: 10,
    color: '#EF4444'
  },
  {
    id: 'block-11',
    templateId: 'template-dev',
    startTime: '18:30',
    endTime: '19:30',
    title: 'Dinner & Family Time',
    activityType: 'personal',
    orderIndex: 11,
    color: '#EC4899'
  },
  {
    id: 'block-12',
    templateId: 'template-dev',
    startTime: '19:30',
    endTime: '21:00',
    title: 'Evening Business Work & Planning',
    activityType: 'business',
    orderIndex: 12,
    color: '#3B82F6'
  },
  {
    id: 'block-13',
    templateId: 'template-dev',
    startTime: '21:00',
    endTime: '22:00',
    title: 'Wind Down & Recovery',
    activityType: 'personal',
    orderIndex: 13,
    color: '#EC4899'
  }
];

export const taskInstructions: TaskInstruction[] = [
  {
    id: 'inst-1-1',
    timeBlockId: 'block-1',
    instructionText: 'Full-body stretch: 5 times, hold 3 seconds',
    orderIndex: 1,
    isChecklistItem: true
  },
  {
    id: 'inst-1-2',
    timeBlockId: 'block-1',
    instructionText: 'Arch back: 5 times (push hips toward ceiling)',
    orderIndex: 2,
    isChecklistItem: true
  },
  {
    id: 'inst-1-3',
    timeBlockId: 'block-1',
    instructionText: 'Leg tensing: 12 times, 3 seconds tensing, 2 seconds rest',
    orderIndex: 3,
    isChecklistItem: true
  },
  {
    id: 'inst-1-4',
    timeBlockId: 'block-1',
    instructionText: 'Abdominal tensing: 10 times, 3 seconds tensing, 2 seconds rest',
    orderIndex: 4,
    isChecklistItem: true
  },
  {
    id: 'inst-1-5',
    timeBlockId: 'block-1',
    instructionText: 'Sit-up, touch toes: 5 times',
    orderIndex: 5,
    isChecklistItem: true
  },
  {
    id: 'inst-1-6',
    timeBlockId: 'block-1',
    instructionText: 'Knee-chest pull: 5 times each leg',
    orderIndex: 6,
    isChecklistItem: true
  },
  {
    id: 'inst-1-7',
    timeBlockId: 'block-1',
    instructionText: 'Cold shower (2 minutes)',
    orderIndex: 7,
    isChecklistItem: true
  },
  {
    id: 'inst-1-8',
    timeBlockId: 'block-1',
    instructionText: 'Hydrate (16 oz water)',
    orderIndex: 8,
    isChecklistItem: true
  },
  {
    id: 'inst-2-1',
    timeBlockId: 'block-2',
    instructionText: 'Set up meditation space (quiet, comfortable position)',
    orderIndex: 1,
    isChecklistItem: true
  },
  {
    id: 'inst-2-2',
    timeBlockId: 'block-2',
    instructionText: '20-minute breath awareness meditation - Focus on breath through nostrils',
    orderIndex: 2,
    isChecklistItem: true
  },
  {
    id: 'inst-2-3',
    timeBlockId: 'block-2',
    instructionText: 'When mind wanders, gently return to breath',
    orderIndex: 3,
    isChecklistItem: false
  },
  {
    id: 'inst-2-4',
    timeBlockId: 'block-2',
    instructionText: 'Use 4-7-8 technique if needed (inhale 4, hold 7, exhale 8)',
    orderIndex: 4,
    isChecklistItem: false
  },
  {
    id: 'inst-2-5',
    timeBlockId: 'block-2',
    instructionText: '10-minute spiritual study/reading',
    orderIndex: 5,
    isChecklistItem: true
  },
  {
    id: 'inst-2-6',
    timeBlockId: 'block-2',
    instructionText: '5-minute intention setting for the day',
    orderIndex: 6,
    isChecklistItem: true
  },
  {
    id: 'inst-3-1',
    timeBlockId: 'block-3',
    instructionText: 'Check and respond to client emails (15 min)',
    orderIndex: 1,
    isChecklistItem: true
  },
  {
    id: 'inst-3-2',
    timeBlockId: 'block-3',
    instructionText: 'Lead generation with Apollo.io - Search for target businesses (20 min)',
    orderIndex: 2,
    isChecklistItem: true
  },
  {
    id: 'inst-3-3',
    timeBlockId: 'block-3',
    instructionText: 'Add 20-30 prospects to pipeline',
    orderIndex: 3,
    isChecklistItem: true
  },
  {
    id: 'inst-3-4',
    timeBlockId: 'block-3',
    instructionText: 'Personalize connection messages',
    orderIndex: 4,
    isChecklistItem: true
  },
  {
    id: 'inst-3-5',
    timeBlockId: 'block-3',
    instructionText: 'Follow up on proposals (15 min)',
    orderIndex: 5,
    isChecklistItem: true
  },
  {
    id: 'inst-3-6',
    timeBlockId: 'block-3',
    instructionText: 'Update CRM with yesterday\'s activities (10 min)',
    orderIndex: 6,
    isChecklistItem: true
  },
  {
    id: 'inst-9-1',
    timeBlockId: 'block-9',
    instructionText: 'Warm-up: Dynamic stretching and light cardio (10 min)',
    orderIndex: 1,
    isChecklistItem: true
  },
  {
    id: 'inst-9-2',
    timeBlockId: 'block-9',
    instructionText: 'Figure 8 forehand drill (20 min)',
    orderIndex: 2,
    isChecklistItem: true
  },
  {
    id: 'inst-9-3',
    timeBlockId: 'block-9',
    instructionText: 'Backhand development drills (20 min)',
    orderIndex: 3,
    isChecklistItem: true
  },
  {
    id: 'inst-9-4',
    timeBlockId: 'block-9',
    instructionText: 'Serve practice (30 min)',
    orderIndex: 4,
    isChecklistItem: true
  },
  {
    id: 'inst-9-5',
    timeBlockId: 'block-9',
    instructionText: 'Match simulation or point play (30 min)',
    orderIndex: 5,
    isChecklistItem: true
  },
  {
    id: 'inst-9-6',
    timeBlockId: 'block-9',
    instructionText: 'Cool down and stretching (10 min)',
    orderIndex: 6,
    isChecklistItem: true
  },
  {
    id: 'inst-10-1',
    timeBlockId: 'block-10',
    instructionText: 'Warm-up: Light cardio and joint mobility (5 min)',
    orderIndex: 1,
    isChecklistItem: true
  },
  {
    id: 'inst-10-2',
    timeBlockId: 'block-10',
    instructionText: 'Pre-exhaustion superset: Isolation exercise to failure',
    orderIndex: 2,
    isChecklistItem: true
  },
  {
    id: 'inst-10-3',
    timeBlockId: 'block-10',
    instructionText: 'Compound exercise immediately after to failure',
    orderIndex: 3,
    isChecklistItem: true
  },
  {
    id: 'inst-10-4',
    timeBlockId: 'block-10',
    instructionText: 'Rest 3-5 minutes between supersets',
    orderIndex: 4,
    isChecklistItem: false
  },
  {
    id: 'inst-10-5',
    timeBlockId: 'block-10',
    instructionText: 'Complete 2-3 supersets total',
    orderIndex: 5,
    isChecklistItem: true
  },
  {
    id: 'inst-10-6',
    timeBlockId: 'block-10',
    instructionText: 'Cool down and stretching (5 min)',
    orderIndex: 6,
    isChecklistItem: true
  }
];

export const resources: Resource[] = [
  {
    id: 'res-1',
    title: 'UCLA Guided Breathing Meditation',
    url: 'https://ggia.berkeley.edu/practice/mindful_breathing',
    category: 'meditation',
    timeBlockId: 'block-2',
    description: 'Comprehensive guide to mindful breathing techniques'
  },
  {
    id: 'res-2',
    title: '4-7-8 Breathing Technique',
    url: 'https://www.calm.com/blog/breath-meditation',
    category: 'meditation',
    timeBlockId: 'block-2',
    description: 'Dr. Weil\'s relaxation breathing technique'
  },
  {
    id: 'res-3',
    title: 'Five Minute Breathing Meditation',
    url: 'https://www.mindful.org/a-five-minute-breathing-meditation/',
    category: 'meditation',
    timeBlockId: 'block-2',
    description: 'Quick meditation practice for busy mornings'
  },
  {
    id: 'res-4',
    title: 'Mike Mentzer Workout Videos',
    url: 'https://www.mikementzerheavyduty.com/mike-mentzer-workout-video.html',
    category: 'training',
    timeBlockId: 'block-10',
    description: 'Official Heavy Duty training videos and demonstrations'
  },
  {
    id: 'res-5',
    title: 'StrengthLog Mike Mentzer Routine',
    url: 'https://www.strengthlog.com/mike-mentzer-workout-routine/',
    category: 'training',
    timeBlockId: 'block-10',
    description: 'Detailed breakdown of Mentzer\'s training philosophy'
  },
  {
    id: 'res-6',
    title: 'The Barbell - Mike Mentzer Workout',
    url: 'https://thebarbell.com/mike-mentzer-workout/',
    category: 'training',
    timeBlockId: 'block-10',
    description: 'Complete guide to Heavy Duty principles'
  },
  {
    id: 'res-7',
    title: 'IMG Academy Tennis Forehand Drills',
    url: 'https://www.imgacademy.com/news/3-tennis-drills-hit-better-forehand',
    category: 'training',
    timeBlockId: 'block-9',
    description: 'Professional drills to improve your forehand'
  },
  {
    id: 'res-8',
    title: 'TennisDrills.tv',
    url: 'https://tennisdrills.tv/',
    category: 'training',
    timeBlockId: 'block-9',
    description: 'Comprehensive video library of tennis drills'
  },
  {
    id: 'res-9',
    title: '10 Wall Drills for Tennis',
    url: 'https://abispearstennis.com/blog/10-wall-drills-you-can-do-on-your-own-to-improve-your-tennis-game/',
    category: 'training',
    timeBlockId: 'block-9',
    description: 'Solo practice drills you can do anywhere'
  },
  {
    id: 'res-10',
    title: 'Tony Jeffries Boxing Training',
    url: 'https://www.tonyjeffries.com/watch/',
    category: 'training',
    description: 'Olympic bronze medalist\'s boxing tutorials'
  },
  {
    id: 'res-11',
    title: 'FightCamp Boxing Workouts',
    url: 'https://blog.joinfightcamp.com/training/five-5-at-home-boxing-workouts-for-beginners-videos/',
    category: 'training',
    description: 'At-home boxing workouts for all levels'
  },
  {
    id: 'res-12',
    title: 'Work Train Fight Videos',
    url: 'https://www.worktrainfight.com/videos/',
    category: 'training',
    description: 'Professional boxing and MMA training content'
  }
];
