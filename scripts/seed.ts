import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { scheduleTemplates, timeBlocks, taskInstructions, resources } from '../src/data/scheduleData';
import { disciplineRules } from '../src/data/disciplineRules';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedScheduleData() {
  console.log('📅 Seeding schedule templates...');

  const templateMap = new Map<string, string>();

  for (const template of scheduleTemplates) {
    const { data, error } = await supabase
      .from('schedule_templates')
      .upsert({
        id: template.id,
        name: template.name,
        description: template.description,
        day_type: template.dayType
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error(`Error seeding template ${template.name}:`, error);
    } else {
      templateMap.set(template.id, data.id);
      console.log(`  ✓ ${template.name}`);
    }
  }

  console.log('⏰ Seeding time blocks...');

  const blockMap = new Map<string, string>();

  for (const block of timeBlocks) {
    const { data, error } = await supabase
      .from('time_blocks')
      .upsert({
        id: block.id,
        template_id: block.templateId,
        start_time: block.startTime,
        end_time: block.endTime,
        title: block.title,
        activity_type: block.activityType,
        order_index: block.orderIndex,
        color: block.color
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error(`Error seeding block ${block.title}:`, error);
    } else {
      blockMap.set(block.id, data.id);
    }
  }

  console.log(`  ✓ ${timeBlocks.length} time blocks seeded`);

  console.log('📝 Seeding task instructions...');

  for (const instruction of taskInstructions) {
    const { error } = await supabase
      .from('task_instructions')
      .upsert({
        id: instruction.id,
        time_block_id: instruction.timeBlockId,
        instruction_text: instruction.instructionText,
        order_index: instruction.orderIndex,
        is_checklist_item: instruction.isChecklistItem
      }, { onConflict: 'id' });

    if (error) {
      console.error('Error seeding instruction:', error);
    }
  }

  console.log(`  ✓ ${taskInstructions.length} instructions seeded`);

  console.log('📚 Seeding resources...');

  for (const resource of resources) {
    const { error } = await supabase
      .from('resources')
      .upsert({
        id: resource.id,
        title: resource.title,
        url: resource.url,
        category: resource.category,
        time_block_id: resource.timeBlockId,
        description: resource.description
      }, { onConflict: 'id' });

    if (error) {
      console.error(`Error seeding resource ${resource.title}:`, error);
    }
  }

  console.log(`  ✓ ${resources.length} resources seeded`);
}

async function seedDisciplineRules() {
  console.log('🛡️  Seeding discipline rules...');

  for (const rule of disciplineRules) {
    const { data: ruleData, error: ruleError } = await supabase
      .from('discipline_rules')
      .upsert({
        rule_number: rule.number,
        title: rule.title,
        description: rule.description,
        category: rule.category,
        severity: rule.severity,
        reasoning: rule.reasoning
      }, { onConflict: 'rule_number' })
      .select()
      .single();

    if (ruleError) {
      console.error(`Error seeding rule ${rule.number}:`, ruleError);
      continue;
    }

    // Seed consequences for this rule
    for (let i = 0; i < rule.consequences.length; i++) {
      const { error: conseqError } = await supabase
        .from('consequences')
        .upsert({
          rule_id: ruleData.id,
          offense_number: i + 1,
          consequence: rule.consequences[i]
        }, { onConflict: 'rule_id,offense_number' });

      if (conseqError) {
        console.error(`Error seeding consequence:`, conseqError);
      }
    }

    console.log(`  ✓ Rule ${rule.number}: ${rule.title}`);
  }
}

async function seedAchievements() {
  console.log('🏆 Seeding achievements...');

  const achievements = [
    {
      id: '1',
      title: '5-Day Perfect Streak',
      description: 'Complete all tasks perfectly for 5 consecutive days',
      category: 'streak',
      xp_reward: 500,
      icon: '🔥',
      requirement_value: 5
    },
    {
      id: '2',
      title: '90% Week Champion',
      description: 'Maintain 90%+ completion rate for a full week',
      category: 'completion',
      xp_reward: 750,
      icon: '⭐',
      requirement_value: 90
    },
    {
      id: '3',
      title: 'Discipline Warrior',
      description: 'Follow all 20 discipline rules for 7 days',
      category: 'discipline',
      xp_reward: 1000,
      icon: '🛡️',
      requirement_value: 7
    },
    {
      id: '4',
      title: 'Early Bird',
      description: 'Complete morning routine before 7am for 10 days',
      category: 'completion',
      xp_reward: 400,
      icon: '🌅',
      requirement_value: 10
    },
    {
      id: '5',
      title: 'Combat Master',
      description: 'Complete 30 combat training sessions',
      category: 'completion',
      xp_reward: 800,
      icon: '⚔️',
      requirement_value: 30
    },
    {
      id: '6',
      title: 'Mental Fortress',
      description: 'Complete 50 meditation sessions',
      category: 'completion',
      xp_reward: 600,
      icon: '🧘',
      requirement_value: 50
    },
    {
      id: '7',
      title: 'Comeback King',
      description: 'Recover from a 70% week to 95% the next week',
      category: 'improvement',
      xp_reward: 1200,
      icon: '👑',
      requirement_value: 25
    },
    {
      id: '8',
      title: 'Month of Excellence',
      description: 'Maintain 85%+ completion for 30 days',
      category: 'completion',
      xp_reward: 2000,
      icon: '💎',
      requirement_value: 30
    }
  ];

  for (const achievement of achievements) {
    const { error } = await supabase
      .from('achievements')
      .upsert(achievement, { onConflict: 'id' });

    if (error) {
      console.error(`Error seeding achievement ${achievement.title}:`, error);
    } else {
      console.log(`  ✓ ${achievement.title}`);
    }
  }
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    await seedScheduleData();
    console.log('');

    await seedDisciplineRules();
    console.log('');

    await seedAchievements();
    console.log('');

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();
