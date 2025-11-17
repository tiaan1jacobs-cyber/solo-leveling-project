/*
  # Enhanced Schedule System with Instructions and Progress Tracking

  1. New Tables
    - `schedule_instructions`
      - Stores step-by-step instructions for each time block
      - Includes declarations/affirmations for each block
      - Links to daily_schedule_blocks table by day_of_week and block_id
    
    - `user_block_progress`
      - Tracks which time blocks users have completed
      - Date-based progress tracking
      - Includes completion timestamps and notes
    
    - `instruction_checklist_items`
      - Individual checklist items within each instruction
      - Track completion of specific steps
      - Links to schedule_instructions table
    
    - `user_checklist_progress`
      - Tracks completion of individual checklist items
      - Per-user, per-date tracking

  2. Security
    - Enable RLS on all new tables
    - Users can only read/write their own progress data
    - Instructions are readable by all authenticated users
*/

-- Schedule Instructions Table
CREATE TABLE IF NOT EXISTS schedule_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL,
  block_id text NOT NULL,
  title text NOT NULL,
  description text,
  declarations text[], -- Array of affirmation strings
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Block Progress Table
CREATE TABLE IF NOT EXISTS user_block_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_of_week text NOT NULL,
  block_id text NOT NULL,
  completion_date date NOT NULL DEFAULT CURRENT_DATE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, day_of_week, block_id, completion_date)
);

-- Instruction Checklist Items Table
CREATE TABLE IF NOT EXISTS instruction_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_id uuid REFERENCES schedule_instructions(id) ON DELETE CASCADE NOT NULL,
  item_text text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_critical boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User Checklist Progress Table
CREATE TABLE IF NOT EXISTS user_checklist_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checklist_item_id uuid REFERENCES instruction_checklist_items(id) ON DELETE CASCADE NOT NULL,
  completion_date date NOT NULL DEFAULT CURRENT_DATE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, checklist_item_id, completion_date)
);

-- Enable RLS
ALTER TABLE schedule_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_block_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE instruction_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklist_progress ENABLE ROW LEVEL SECURITY;

-- Policies for schedule_instructions (readable by all authenticated users)
CREATE POLICY "Authenticated users can read schedule instructions"
  ON schedule_instructions FOR SELECT
  TO authenticated
  USING (true);

-- Policies for instruction_checklist_items (readable by all authenticated users)
CREATE POLICY "Authenticated users can read checklist items"
  ON instruction_checklist_items FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_block_progress
CREATE POLICY "Users can read own block progress"
  ON user_block_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own block progress"
  ON user_block_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own block progress"
  ON user_block_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own block progress"
  ON user_block_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_checklist_progress
CREATE POLICY "Users can read own checklist progress"
  ON user_checklist_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklist progress"
  ON user_checklist_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklist progress"
  ON user_checklist_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklist progress"
  ON user_checklist_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_schedule_instructions_block ON schedule_instructions(day_of_week, block_id);
CREATE INDEX IF NOT EXISTS idx_user_block_progress_user_date ON user_block_progress(user_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_instruction_checklist_instruction_id ON instruction_checklist_items(instruction_id);
CREATE INDEX IF NOT EXISTS idx_user_checklist_progress_user_date ON user_checklist_progress(user_id, completion_date);
