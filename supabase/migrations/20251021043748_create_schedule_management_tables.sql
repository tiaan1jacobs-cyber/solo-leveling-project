/*
  # Life Transformation Schedule Management System - Complete Schema
  
  ## Overview
  Database schema for daily schedule management with full CRUD capabilities.
  
  ## Tables Created
  
  ### 1. schedule_templates
  Different schedule types (Class Days, Development Days, Intensive Days)
  - id (uuid, primary key)
  - name (text) - Template name
  - description (text) - Template description  
  - day_type (text) - Type identifier
  - created_at, updated_at (timestamptz)
  
  ### 2. time_blocks
  Individual scheduled activities
  - id (uuid, primary key)
  - template_id (uuid, foreign key)
  - start_time, end_time (time)
  - title (text)
  - activity_type (text)
  - order_index (integer)
  - color (text)
  
  ### 3. task_instructions
  Step-by-step instructions for activities
  - id (uuid, primary key)
  - time_block_id (uuid, foreign key)
  - instruction_text (text)
  - order_index (integer)
  - is_checklist_item (boolean)
  
  ### 4. resources
  Video links and tutorials
  - id (uuid, primary key)
  - title, url, description (text)
  - category (text)
  - time_block_id (uuid, nullable)
  
  ### 5. user_progress
  Daily completion tracking
  - id (uuid, primary key)
  - time_block_id (uuid)
  - completion_date (date)
  - notes (text)
  
  ### 6. checklist_progress
  Individual checklist completion
  - id (uuid, primary key)
  - instruction_id (uuid)
  - completion_date (date)
  - completed (boolean)
  
  ## Security
  - RLS enabled on all tables
  - Public access policies for demo mode
*/

CREATE TABLE IF NOT EXISTS schedule_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  day_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS time_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES schedule_templates(id) ON DELETE CASCADE,
  start_time time NOT NULL,
  end_time time NOT NULL,
  title text NOT NULL,
  activity_type text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time_block_id uuid REFERENCES time_blocks(id) ON DELETE CASCADE,
  instruction_text text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_checklist_item boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  category text NOT NULL,
  time_block_id uuid REFERENCES time_blocks(id) ON DELETE SET NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time_block_id uuid REFERENCES time_blocks(id) ON DELETE CASCADE,
  completion_date date NOT NULL DEFAULT CURRENT_DATE,
  completed_at timestamptz DEFAULT now(),
  notes text,
  UNIQUE(time_block_id, completion_date)
);

CREATE TABLE IF NOT EXISTS checklist_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_id uuid REFERENCES task_instructions(id) ON DELETE CASCADE,
  completion_date date NOT NULL DEFAULT CURRENT_DATE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(instruction_id, completion_date)
);

CREATE INDEX IF NOT EXISTS idx_time_blocks_template ON time_blocks(template_id);
CREATE INDEX IF NOT EXISTS idx_time_blocks_start_time ON time_blocks(start_time);
CREATE INDEX IF NOT EXISTS idx_task_instructions_time_block ON task_instructions(time_block_id);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(completion_date);
CREATE INDEX IF NOT EXISTS idx_checklist_progress_date ON checklist_progress(completion_date);

ALTER TABLE schedule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read schedule_templates"
  ON schedule_templates FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert schedule_templates"
  ON schedule_templates FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update schedule_templates"
  ON schedule_templates FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete schedule_templates"
  ON schedule_templates FOR DELETE TO public USING (true);

CREATE POLICY "Allow public read time_blocks"
  ON time_blocks FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert time_blocks"
  ON time_blocks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update time_blocks"
  ON time_blocks FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete time_blocks"
  ON time_blocks FOR DELETE TO public USING (true);

CREATE POLICY "Allow public read task_instructions"
  ON task_instructions FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert task_instructions"
  ON task_instructions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update task_instructions"
  ON task_instructions FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete task_instructions"
  ON task_instructions FOR DELETE TO public USING (true);

CREATE POLICY "Allow public read resources"
  ON resources FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert resources"
  ON resources FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update resources"
  ON resources FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete resources"
  ON resources FOR DELETE TO public USING (true);

CREATE POLICY "Allow public all user_progress"
  ON user_progress FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all checklist_progress"
  ON checklist_progress FOR ALL TO public USING (true) WITH CHECK (true);