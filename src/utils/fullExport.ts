import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface FullExportData {
  exportDate: string;
  version: string;
  scheduleTemplates: any[];
  timeBlocks: any[];
  taskInstructions: any[];
  resources: any[];
  userProgress: any[];
  checklistProgress: any[];
  disciplineRules: any[];
  consequences: any[];
  ruleViolations: any[];
  dailyRuleReviews: any[];
  disciplineStreaks: any[];
  dailyScheduleBlocks: any[];
  aiAdaptations: any[];
  patternDetections: any[];
  achievements: any[];
  notifications: any[];
  dailyAnalytics: any[];
}

export async function exportAllData(): Promise<FullExportData | null> {
  try {
    toast.loading('Exporting all data...');

    const exportData: FullExportData = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      scheduleTemplates: [],
      timeBlocks: [],
      taskInstructions: [],
      resources: [],
      userProgress: [],
      checklistProgress: [],
      disciplineRules: [],
      consequences: [],
      ruleViolations: [],
      dailyRuleReviews: [],
      disciplineStreaks: [],
      dailyScheduleBlocks: [],
      aiAdaptations: [],
      patternDetections: [],
      achievements: [],
      notifications: [],
      dailyAnalytics: [],
    };

    const tables = [
      'schedule_templates',
      'time_blocks',
      'task_instructions',
      'resources',
      'user_progress',
      'checklist_progress',
      'discipline_rules',
      'consequences',
      'rule_violations',
      'daily_rule_reviews',
      'discipline_streaks',
      'daily_schedule_blocks',
      'ai_adaptations',
      'pattern_detections',
      'achievements',
      'notifications',
      'daily_analytics',
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*');

        if (error) {
          console.warn(`Could not export ${table}:`, error);
          continue;
        }

        if (data) {
          (exportData as any)[table.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())] = data;
        }
      } catch (err) {
        console.warn(`Error exporting ${table}:`, err);
      }
    }

    toast.dismiss();
    toast.success('Data exported successfully!');
    return exportData;
  } catch (error) {
    toast.dismiss();
    toast.error('Failed to export data');
    console.error('Export error:', error);
    return null;
  }
}

export function downloadExport(data: FullExportData, filename?: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `solo-leveling-system-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importAllData(file: File): Promise<boolean> {
  try {
    toast.loading('Importing data...');

    const text = await file.text();
    const data: FullExportData = JSON.parse(text);

    if (!data.version || !data.exportDate) {
      toast.dismiss();
      toast.error('Invalid export file format');
      return false;
    }

    const tableMapping: { [key: string]: string } = {
      scheduleTemplates: 'schedule_templates',
      timeBlocks: 'time_blocks',
      taskInstructions: 'task_instructions',
      resources: 'resources',
      userProgress: 'user_progress',
      checklistProgress: 'checklist_progress',
      disciplineRules: 'discipline_rules',
      consequences: 'consequences',
      ruleViolations: 'rule_violations',
      dailyRuleReviews: 'daily_rule_reviews',
      disciplineStreaks: 'discipline_streaks',
      dailyScheduleBlocks: 'daily_schedule_blocks',
      aiAdaptations: 'ai_adaptations',
      patternDetections: 'pattern_detections',
      achievements: 'achievements',
      notifications: 'notifications',
      dailyAnalytics: 'daily_analytics',
    };

    for (const [key, tableName] of Object.entries(tableMapping)) {
      const tableData = (data as any)[key];

      if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
        continue;
      }

      try {
        const { error } = await supabase.from(tableName).upsert(tableData);

        if (error) {
          console.warn(`Could not import ${tableName}:`, error);
        }
      } catch (err) {
        console.warn(`Error importing ${tableName}:`, err);
      }
    }

    toast.dismiss();
    toast.success('Data imported successfully! Refreshing...');

    setTimeout(() => {
      window.location.reload();
    }, 1500);

    return true;
  } catch (error) {
    toast.dismiss();
    toast.error('Failed to import data');
    console.error('Import error:', error);
    return false;
  }
}
