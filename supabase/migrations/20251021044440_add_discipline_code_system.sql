/*
  # Discipline Code System - Rules, Violations, and Consequences
  
  ## Overview
  Complete discipline tracking system for 20 sacred rules with violation
  tracking, consequence management, and progress monitoring.
  
  ## New Tables
  
  ### 1. discipline_rules
  The 20 sacred rules with details
  - id (uuid, primary key)
  - rule_number (integer, 1-20)
  - title (text)
  - description (text)
  - reason (text)
  - category (text) - foundation, mental, character, excellence
  - severity (text) - minor, major
  - active (boolean)
  
  ### 2. rule_violations
  Track when rules are broken
  - id (uuid, primary key)
  - rule_id (uuid, foreign key)
  - violation_date (date)
  - offense_number (integer) - 1st, 2nd, 3rd offense
  - notes (text)
  - consequence_completed (boolean)
  - created_at (timestamptz)
  
  ### 3. consequences
  Predefined consequences for each rule/offense level
  - id (uuid, primary key)
  - rule_id (uuid, foreign key)
  - offense_number (integer)
  - consequence_text (text)
  - consequence_type (text) - physical, time, restriction
  
  ### 4. daily_rule_reviews
  Evening reflection on rule adherence
  - id (uuid, primary key)
  - review_date (date, unique)
  - perfect_day (boolean)
  - violations_count (integer)
  - most_challenging_rules (text)
  - triggers_identified (text)
  - improvement_notes (text)
  - created_at (timestamptz)
  
  ### 5. discipline_streaks
  Track perfect days and milestones
  - id (uuid, primary key)
  - current_streak (integer)
  - longest_streak (integer)
  - total_perfect_days (integer)
  - last_perfect_day (date)
  - updated_at (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Public access for demo mode
*/

CREATE TABLE IF NOT EXISTS discipline_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_number integer UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  reason text NOT NULL,
  category text NOT NULL,
  severity text DEFAULT 'minor',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS consequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES discipline_rules(id) ON DELETE CASCADE,
  offense_number integer NOT NULL,
  consequence_text text NOT NULL,
  consequence_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rule_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES discipline_rules(id) ON DELETE CASCADE,
  violation_date date NOT NULL DEFAULT CURRENT_DATE,
  offense_number integer NOT NULL DEFAULT 1,
  notes text,
  consequence_completed boolean DEFAULT false,
  consequence_completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_rule_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  perfect_day boolean DEFAULT false,
  violations_count integer DEFAULT 0,
  most_challenging_rules text,
  triggers_identified text,
  improvement_notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS discipline_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_perfect_days integer DEFAULT 0,
  last_perfect_day date,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rule_violations_date ON rule_violations(violation_date);
CREATE INDEX IF NOT EXISTS idx_rule_violations_rule ON rule_violations(rule_id);
CREATE INDEX IF NOT EXISTS idx_daily_reviews_date ON daily_rule_reviews(review_date);

ALTER TABLE discipline_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE consequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rule_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE discipline_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all discipline_rules"
  ON discipline_rules FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all consequences"
  ON consequences FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all rule_violations"
  ON rule_violations FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all daily_rule_reviews"
  ON daily_rule_reviews FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all discipline_streaks"
  ON discipline_streaks FOR ALL TO public USING (true) WITH CHECK (true);

INSERT INTO discipline_streaks (current_streak, longest_streak, total_perfect_days)
VALUES (0, 0, 0)
ON CONFLICT DO NOTHING;