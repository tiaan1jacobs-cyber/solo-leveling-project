/*
  # Add Daily Schedule Blocks Table

  ## Overview
  This migration adds a table to store custom daily schedule blocks with full edit capabilities.

  ## New Tables
  
  ### daily_schedule_blocks
  Stores individual schedule blocks for each day of the week
  - id (uuid, primary key)
  - day_of_week (text) - Monday through Sunday
  - block_id (text) - Unique identifier for the block (e.g., 'wake', 'meditation')
  - time (text) - Start time (HH:MM format)
  - end_time (text) - End time (HH:MM format)
  - activity (text) - Activity name
  - type (text) - Block type (affirmations, training, work, etc.)
  - description (text) - Optional description
  - affirmation_category (text) - Optional affirmation category
  - combat_type (text) - Optional combat type
  - xp_reward (integer) - XP points for completion
  - checklist (jsonb) - Array of checklist items
  - notes (jsonb) - Array of important notes
  - created_at, updated_at (timestamptz)

  ## Security
  - RLS enabled
  - Public access for demo mode
*/

CREATE TABLE IF NOT EXISTS daily_schedule_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL,
  block_id text NOT NULL,
  time text NOT NULL,
  end_time text NOT NULL,
  activity text NOT NULL,
  type text NOT NULL,
  description text,
  affirmation_category text,
  combat_type text,
  xp_reward integer DEFAULT 0,
  checklist jsonb DEFAULT '[]'::jsonb,
  notes jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(day_of_week, block_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_schedule_day ON daily_schedule_blocks(day_of_week);
CREATE INDEX IF NOT EXISTS idx_daily_schedule_block ON daily_schedule_blocks(block_id);

ALTER TABLE daily_schedule_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read daily_schedule_blocks"
  ON daily_schedule_blocks FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert daily_schedule_blocks"
  ON daily_schedule_blocks FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update daily_schedule_blocks"
  ON daily_schedule_blocks FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete daily_schedule_blocks"
  ON daily_schedule_blocks FOR DELETE TO public USING (true);
