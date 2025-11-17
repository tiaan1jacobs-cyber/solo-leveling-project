import { supabase } from '../lib/supabase';

export interface ExportData {
  version: string;
  exportDate: string;
  userId: string;
  data: {
    scheduleBlocks?: any[];
    progress?: any[];
    achievements?: any[];
    violations?: any[];
    customSettings?: any;
  };
}

/**
 * Export all user data to JSON
 */
export async function exportUserData(userId: string): Promise<ExportData> {
  const today = new Date().toISOString();

  // Fetch all user data
  const [
    { data: scheduleBlocks },
    { data: progress },
    { data: achievements },
    { data: violations },
  ] = await Promise.all([
    supabase
      .from('daily_schedule_blocks')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('rule_violations')
      .select('*')
      .eq('user_id', userId),
  ]);

  const exportData: ExportData = {
    version: '1.0.0',
    exportDate: today,
    userId,
    data: {
      scheduleBlocks: scheduleBlocks || [],
      progress: progress || [],
      achievements: achievements || [],
      violations: violations || [],
    },
  };

  return exportData;
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: ExportData, filename: string = 'solo-leveling-export.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 */
export async function importUserData(
  file: File,
  userId: string,
  options: { merge?: boolean } = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    const text = await file.text();
    const importData: ExportData = JSON.parse(text);

    // Validate import data
    if (!importData.version || !importData.data) {
      return { success: false, error: 'Invalid import file format' };
    }

    // If not merging, clear existing data
    if (!options.merge) {
      await Promise.all([
        supabase.from('daily_schedule_blocks').delete().eq('user_id', userId),
        supabase.from('user_progress').delete().eq('user_id', userId),
      ]);
    }

    // Import schedule blocks
    if (importData.data.scheduleBlocks && importData.data.scheduleBlocks.length > 0) {
      const blocks = importData.data.scheduleBlocks.map((block) => ({
        ...block,
        user_id: userId, // Override with current user ID
        id: undefined, // Let database generate new IDs
      }));

      await supabase.from('daily_schedule_blocks').insert(blocks);
    }

    // Import progress
    if (importData.data.progress && importData.data.progress.length > 0) {
      const progressData = importData.data.progress.map((p) => ({
        ...p,
        user_id: userId,
        id: undefined,
      }));

      await supabase.from('user_progress').insert(progressData);
    }

    return { success: true };
  } catch (error) {
    console.error('Import error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Export data and trigger download
 */
export async function exportAndDownload(userId: string) {
  const data = await exportUserData(userId);
  const filename = `solo-leveling-${new Date().toISOString().split('T')[0]}.json`;
  downloadJSON(data, filename);
}
