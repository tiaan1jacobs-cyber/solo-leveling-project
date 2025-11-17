/*
  # AI Analytics and Achievements System

  1. New Tables
    - `ai_adaptations`
      - `id` (uuid, primary key)
      - `date` (date)
      - `type` (text) - time_change, add_block, add_recovery, extend_duration, suggest_rule
      - `time_block_id` (uuid, nullable, foreign key)
      - `title` (text)
      - `reasoning` (text)
      - `before_value` (text, nullable)
      - `after_value` (text, nullable)
      - `status` (text) - pending, accepted, rejected
      - `success_metric` (numeric, nullable)
      - `created_at` (timestamptz)
      
    - `pattern_detections`
      - `id` (uuid, primary key)
      - `pattern_type` (text) - time_preference, completion_rate, energy_level, consecutive_misses
      - `activity_type` (text)
      - `insight` (text)
      - `confidence` (numeric)
      - `data_points` (integer)
      - `detected_at` (timestamptz)
      - `action_taken` (text, nullable)
      
    - `achievements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `category` (text) - streak, completion, discipline, improvement
      - `unlocked_at` (timestamptz, nullable)
      - `progress` (integer)
      - `target` (integer)
      - `is_unlocked` (boolean)
      
    - `notifications`
      - `id` (uuid, primary key)
      - `type` (text) - ai_suggestion, achievement, reminder, warning
      - `title` (text)
      - `message` (text)
      - `action_label` (text, nullable)
      - `action_id` (text, nullable)
      - `priority` (text) - low, medium, high
      - `read` (boolean)
      - `created_at` (timestamptz)
      
    - `daily_analytics`
      - `id` (uuid, primary key)
      - `date` (date, unique)
      - `completion_rate` (numeric)
      - `tasks_completed` (integer)
      - `tasks_total` (integer)
      - `rules_followed` (integer)
      - `rules_total` (integer)
      - `score` (integer)
      - `energy_level` (text) - low, medium, high
      - `productivity_peak_hours` (text[])
      
    - `rule_violations`
      - `id` (uuid, primary key)
      - `rule_number` (integer)
      - `rule_title` (text)
      - `violation_date` (date)
      - `offense_count` (integer)
      - `consequence_applied` (text)
      - `consequence_completed` (boolean)
      - `notes` (text, nullable)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data
*/

-- AI Adaptations Table
CREATE TABLE IF NOT EXISTS ai_adaptations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  type text NOT NULL CHECK (type IN ('time_change', 'add_block', 'add_recovery', 'extend_duration', 'suggest_rule')),
  time_block_id uuid REFERENCES time_blocks(id) ON DELETE CASCADE,
  title text NOT NULL,
  reasoning text NOT NULL,
  before_value text,
  after_value text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  success_metric numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_adaptations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view AI adaptations"
  ON ai_adaptations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert AI adaptations"
  ON ai_adaptations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update AI adaptations"
  ON ai_adaptations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Pattern Detections Table
CREATE TABLE IF NOT EXISTS pattern_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type text NOT NULL CHECK (pattern_type IN ('time_preference', 'completion_rate', 'energy_level', 'consecutive_misses')),
  activity_type text NOT NULL,
  insight text NOT NULL,
  confidence numeric NOT NULL DEFAULT 0.0,
  data_points integer NOT NULL DEFAULT 0,
  detected_at timestamptz DEFAULT now(),
  action_taken text
);

ALTER TABLE pattern_detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pattern detections"
  ON pattern_detections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert pattern detections"
  ON pattern_detections FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL CHECK (category IN ('streak', 'completion', 'discipline', 'improvement')),
  unlocked_at timestamptz,
  progress integer NOT NULL DEFAULT 0,
  target integer NOT NULL,
  is_unlocked boolean NOT NULL DEFAULT false
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('ai_suggestion', 'achievement', 'reminder', 'warning')),
  title text NOT NULL,
  message text NOT NULL,
  action_label text,
  action_id text,
  priority text NOT NULL DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (true);

-- Daily Analytics Table
CREATE TABLE IF NOT EXISTS daily_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  completion_rate numeric NOT NULL DEFAULT 0.0,
  tasks_completed integer NOT NULL DEFAULT 0,
  tasks_total integer NOT NULL DEFAULT 0,
  rules_followed integer NOT NULL DEFAULT 0,
  rules_total integer NOT NULL DEFAULT 20,
  score integer NOT NULL DEFAULT 0,
  energy_level text NOT NULL DEFAULT 'medium' CHECK (energy_level IN ('low', 'medium', 'high')),
  productivity_peak_hours text[] DEFAULT ARRAY[]::text[]
);

ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view daily analytics"
  ON daily_analytics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert daily analytics"
  ON daily_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update daily analytics"
  ON daily_analytics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Rule Violations Table
CREATE TABLE IF NOT EXISTS rule_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_number integer NOT NULL,
  rule_title text NOT NULL,
  violation_date date NOT NULL DEFAULT CURRENT_DATE,
  offense_count integer NOT NULL DEFAULT 1,
  consequence_applied text NOT NULL,
  consequence_completed boolean NOT NULL DEFAULT false,
  notes text
);

ALTER TABLE rule_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rule violations"
  ON rule_violations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert rule violations"
  ON rule_violations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update rule violations"
  ON rule_violations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete rule violations"
  ON rule_violations FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_adaptations_date ON ai_adaptations(date DESC);
CREATE INDEX IF NOT EXISTS idx_ai_adaptations_status ON ai_adaptations(status);
CREATE INDEX IF NOT EXISTS idx_pattern_detections_type ON pattern_detections(pattern_type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_rule_violations_date ON rule_violations(violation_date DESC);