import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const wakeUpInstructions = {
  day_of_week: 'Monday',
  block_id: 'wake',
  title: 'WAKE UP & CORE DECLARATIONS',
  description: 'Start your day with immediate action and powerful declarations',
  declarations: [
    'I AM a warrior in complete control of my mind and body',
    'I AM disciplined beyond what others think is possible',
    'I AM building an empire while others sleep',
    'I AM earning $5,000 per month through my AI business',
    'I AM a Templar - discipline is my worship',
    'I AM unstoppable in my pursuit of mastery',
    'I AM the man who keeps every promise to himself'
  ],
  order_index: 0
};

const wakeUpChecklistItems = [
  { item_text: 'Alarm goes off at 6:30 AM - sit up IMMEDIATELY', order_index: 0, is_critical: true },
  { item_text: 'Stand up within 5 seconds (no lying in bed)', order_index: 1, is_critical: true },
  { item_text: 'Walk to the middle of your room', order_index: 2, is_critical: false },
  { item_text: 'Stand straight, shoulders back, prepare for declarations', order_index: 3, is_critical: false },
  { item_text: 'Say each declaration once with conviction (speak LOUDLY)', order_index: 4, is_critical: true },
  { item_text: 'Go directly to bathroom (no phone, no sitting)', order_index: 5, is_critical: true },
  { item_text: 'Turn water to COLDEST setting', order_index: 6, is_critical: true },
  { item_text: 'Get in immediately - no testing water first', order_index: 7, is_critical: true },
  { item_text: 'Stand under cold water for full 3 minutes', order_index: 8, is_critical: true },
  { item_text: 'While in cold water - say mantras 3 times total', order_index: 9, is_critical: false },
  { item_text: 'Exit after 3 minutes and dry off quickly', order_index: 10, is_critical: false },
  { item_text: 'Stand in front of mirror for cognitive anchor practice', order_index: 11, is_critical: false },
  { item_text: 'Deep breath: 4 seconds in, 6 seconds out', order_index: 12, is_critical: false },
  { item_text: 'Say: "Update: data received"', order_index: 13, is_critical: false },
  { item_text: 'Reset posture: shoulders back, chin level, chest open', order_index: 14, is_critical: false },
  { item_text: 'Drink 500mL of water within 60 seconds', order_index: 15, is_critical: true },
  { item_text: 'Get dressed in workout/comfortable clothes', order_index: 16, is_critical: false },
  { item_text: 'Make your bed (no excuses)', order_index: 17, is_critical: true }
];

const meditationInstructions = {
  day_of_week: 'Monday',
  block_id: 'meditation',
  title: 'MEDITATION & MENTAL TRAINING',
  description: '20 minutes of focused meditation to set your mental state for the day',
  declarations: [
    'I AM the observer of my thoughts, not controlled by them',
    'I AM building neural pathways of discipline',
    'I AM creating my reality through daily action',
    'I AM aligned with my highest purpose',
    'I AM executing my mission with precision'
  ],
  order_index: 0
};

const meditationChecklistItems = [
  { item_text: 'Find quiet space where you won\'t be disturbed', order_index: 0, is_critical: true },
  { item_text: 'Sit cross-legged on floor OR in chair with feet flat', order_index: 1, is_critical: false },
  { item_text: 'Back straight, hands on knees or in lap', order_index: 2, is_critical: false },
  { item_text: 'Set timer for 20 minutes on your phone', order_index: 3, is_critical: true },
  { item_text: 'Close your eyes', order_index: 4, is_critical: true },
  { item_text: 'Minutes 1-5: Focus on breathing (count: 4 in, 6 out)', order_index: 5, is_critical: false },
  { item_text: 'When mind wanders, notice it and return to breath', order_index: 6, is_critical: false },
  { item_text: 'Minutes 6-10: Cycle through mantras (repeat each 2-3 times)', order_index: 7, is_critical: false },
  { item_text: 'Minutes 11-15: Visualize executing today\'s schedule perfectly', order_index: 8, is_critical: false },
  { item_text: 'See yourself at tennis practice, focused and strong', order_index: 9, is_critical: false },
  { item_text: 'See yourself completing combat training', order_index: 10, is_critical: false },
  { item_text: 'Minutes 16-20: Final mantras and breath awareness', order_index: 11, is_critical: false },
  { item_text: 'Slowly open eyes', order_index: 12, is_critical: false },
  { item_text: 'Take 3 deep breaths', order_index: 13, is_critical: false },
  { item_text: 'Stand up deliberately - ready for breakfast', order_index: 14, is_critical: false }
];

async function seedInstructions() {
  console.log('Starting to seed schedule instructions...');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  for (const day of daysOfWeek) {
    console.log(`\nSeeding instructions for ${day}...`);

    const wakeInstruction = { ...wakeUpInstructions, day_of_week: day };
    const { data: wakeData, error: wakeError } = await supabase
      .from('schedule_instructions')
      .upsert(wakeInstruction, { onConflict: 'id' })
      .select()
      .single();

    if (wakeError) {
      console.error(`Error inserting wake instruction for ${day}:`, wakeError);
      continue;
    }

    console.log(`✓ Created wake instruction for ${day}`);

    const wakeChecklistWithInstructionId = wakeUpChecklistItems.map(item => ({
      ...item,
      instruction_id: wakeData.id
    }));

    const { error: checklistError } = await supabase
      .from('instruction_checklist_items')
      .upsert(wakeChecklistWithInstructionId, { onConflict: 'id' });

    if (checklistError) {
      console.error(`Error inserting checklist items for ${day}:`, checklistError);
    } else {
      console.log(`✓ Created ${wakeUpChecklistItems.length} checklist items for ${day} wake block`);
    }

    const meditationInstruction = { ...meditationInstructions, day_of_week: day };
    const { data: meditationData, error: meditationError } = await supabase
      .from('schedule_instructions')
      .upsert(meditationInstruction, { onConflict: 'id' })
      .select()
      .single();

    if (meditationError) {
      console.error(`Error inserting meditation instruction for ${day}:`, meditationError);
      continue;
    }

    console.log(`✓ Created meditation instruction for ${day}`);

    const meditationChecklistWithInstructionId = meditationChecklistItems.map(item => ({
      ...item,
      instruction_id: meditationData.id
    }));

    const { error: meditationChecklistError } = await supabase
      .from('instruction_checklist_items')
      .upsert(meditationChecklistWithInstructionId, { onConflict: 'id' });

    if (meditationChecklistError) {
      console.error(`Error inserting meditation checklist items for ${day}:`, meditationChecklistError);
    } else {
      console.log(`✓ Created ${meditationChecklistItems.length} checklist items for ${day} meditation block`);
    }
  }

  console.log('\n✅ Seeding complete!');
}

seedInstructions().catch(console.error);
