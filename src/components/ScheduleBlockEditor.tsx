import { useState, useEffect } from 'react';
import { X, Save, Clock, Calendar, Tag, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ScheduleBlockEditorProps {
  dayOfWeek: string;
  block?: {
    id: string;
    block_id: string;
    time: string;
    end_time: string;
    activity: string;
    description?: string;
    type: string;
    is_da: boolean;
    order_index: number;
  };
  onClose: () => void;
  onSave: () => void;
}

export function ScheduleBlockEditor({ dayOfWeek, block, onClose, onSave }: ScheduleBlockEditorProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    block_id: block?.block_id || '',
    time: block?.time || '09:00',
    end_time: block?.end_time || '10:00',
    activity: block?.activity || '',
    description: block?.description || '',
    type: block?.type || 'core',
    is_da: block?.is_da || false,
    order_index: block?.order_index || 0
  });

  const blockTypes = [
    { value: 'core', label: 'Core Activity', color: 'bg-green-900/50 border-green-700' },
    { value: 'training', label: 'Training', color: 'bg-orange-900/50 border-orange-700' },
    { value: 'da', label: 'DA Job', color: 'bg-red-900/60 border-red-700' },
    { value: 'class', label: 'Class', color: 'bg-blue-900/50 border-blue-700' },
    { value: 'business', label: 'Business', color: 'bg-purple-900/50 border-purple-700' },
    { value: 'recovery', label: 'Recovery', color: 'bg-indigo-900/50 border-indigo-700' },
    { value: 'health', label: 'Health', color: 'bg-teal-900/50 border-teal-700' }
  ];

  const handleSave = async () => {
    // Validation
    if (!formData.block_id.trim()) {
      toast.error('Block ID is required');
      return;
    }
    if (!formData.activity.trim()) {
      toast.error('Activity is required');
      return;
    }
    if (formData.time >= formData.end_time) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      setSaving(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return;
      }

      const dataToSave = {
        user_id: user.id,
        day_of_week: dayOfWeek,
        block_id: formData.block_id.trim().toLowerCase().replace(/\s+/g, '_'),
        time: formData.time,
        end_time: formData.end_time,
        activity: formData.activity.trim(),
        description: formData.description.trim() || null,
        type: formData.type,
        is_da: formData.is_da,
        order_index: formData.order_index
      };

      if (block) {
        // Update existing block
        const { error } = await supabase
          .from('daily_schedule_blocks')
          .update(dataToSave)
          .eq('id', block.id);

        if (error) throw error;
        toast.success('Schedule block updated');
      } else {
        // Create new block
        const { error } = await supabase
          .from('daily_schedule_blocks')
          .insert(dataToSave);

        if (error) throw error;
        toast.success('Schedule block created');
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving schedule block:', error);
      toast.error(error.message || 'Failed to save schedule block');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-900 border-2 border-red-900 rounded-lg max-w-2xl w-full">
        <div className="border-b-2 border-red-900 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {block ? 'EDIT SCHEDULE BLOCK' : 'ADD SCHEDULE BLOCK'}
            </h2>
            <p className="text-gray-400 mt-1">
              {dayOfWeek}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Block ID */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
              <Tag className="w-4 h-4 text-red-400" />
              BLOCK ID
            </label>
            <input
              type="text"
              value={formData.block_id}
              onChange={(e) => setFormData({ ...formData, block_id: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., wake, meditation, breakfast"
              disabled={!!block}
            />
            <p className="text-gray-500 text-xs mt-1">
              {block ? 'Block ID cannot be changed' : 'Unique identifier (lowercase, no spaces)'}
            </p>
          </div>

          {/* Activity Name */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              ACTIVITY NAME
            </label>
            <input
              type="text"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., Wake Up & Core Declarations"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                <Clock className="w-4 h-4 text-red-400" />
                START TIME
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                <Clock className="w-4 h-4 text-red-400" />
                END TIME
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              DESCRIPTION (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Brief description of this time block..."
            />
          </div>

          {/* Block Type */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              BLOCK TYPE
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {blockTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* DA Job Flag */}
          <div className="flex items-start gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <input
              type="checkbox"
              id="is_da"
              checked={formData.is_da}
              onChange={(e) => setFormData({ ...formData, is_da: e.target.checked })}
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="is_da" className="text-white font-bold cursor-pointer">
                This is DA Job Time
              </label>
              <p className="text-gray-400 text-sm mt-1">
                Check this if this time block is for your DA job work
              </p>
            </div>
          </div>

          {/* Order Index */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              DISPLAY ORDER
            </label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="text-gray-500 text-xs mt-1">
              Lower numbers appear first (0 = first, 1 = second, etc.)
            </p>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-800 border-2 border-gray-700 rounded-lg">
            <p className="text-gray-400 text-xs font-bold mb-2">PREVIEW</p>
            <div className={`p-4 rounded-lg border-2 ${blockTypes.find(t => t.value === formData.type)?.color}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">
                  {formData.time} - {formData.end_time}
                </span>
                {formData.is_da && (
                  <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                    DA JOB
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-white">
                {formData.activity || 'Activity Name'}
              </div>
              {formData.description && (
                <div className="text-gray-300 text-sm mt-1">
                  {formData.description}
                </div>
              )}
            </div>
          </div>

          {/* Save Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-800">
            <button
              onClick={handleSave}
              disabled={saving || !formData.block_id || !formData.activity}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'SAVING...' : 'SAVE BLOCK'}
            </button>
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 border-2 border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-bold rounded-lg transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
