/*
  # Add Editable Schedule Blocks Table
  
  1. New Tables
    - `daily_schedule_blocks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `day_of_week` (text) - Monday through Sunday
      - `block_id` (text) - unique identifier for the block
      - `time` (text) - start time (HH:MM format)
      - `end_time` (text) - end time (HH:MM format)
      - `activity` (text) - what the block is for
      - `description` (text, nullable) - optional description
      - `type` (text) - block type (core, training, da, class, etc.)
      - `is_da` (boolean) - whether this is DA job time
      - `order_index` (integer) - display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `daily_schedule_blocks` table
    - Add policies for authenticated users to manage their own blocks
*/

-- Create daily_schedule_blocks table
CREATE TABLE IF NOT EXISTS daily_schedule_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_of_week text NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  block_id text NOT NULL,
  time text NOT NULL,
  end_time text NOT NULL,
  activity text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'core' CHECK (type IN ('core', 'training', 'da', 'class', 'business', 'recovery', 'health')),
  is_da boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_user_day 
  ON daily_schedule_blocks(user_id, day_of_week);

-- Enable RLS
ALTER TABLE daily_schedule_blocks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own schedule blocks
CREATE POLICY "Users can view own schedule blocks"
  ON daily_schedule_blocks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own schedule blocks
CREATE POLICY "Users can insert own schedule blocks"
  ON daily_schedule_blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own schedule blocks
CREATE POLICY "Users can update own schedule blocks"
  ON daily_schedule_blocks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own schedule blocks
CREATE POLICY "Users can delete own schedule blocks"
  ON daily_schedule_blocks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_schedule_blocks_updated_at'
  ) THEN
    CREATE TRIGGER update_schedule_blocks_updated_at
      BEFORE UPDATE ON daily_schedule_blocks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
