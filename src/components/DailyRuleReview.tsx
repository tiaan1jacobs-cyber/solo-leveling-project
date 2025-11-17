import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, X, Save } from 'lucide-react';

export function DailyRuleReview({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    perfectDay: false,
    violationsCount: 0,
    mostChallenging: '',
    triggers: '',
    improvementNotes: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTodayReview();
  }, []);

  const loadTodayReview = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_rule_reviews')
      .select('*')
      .eq('review_date', today)
      .maybeSingle();

    if (data) {
      setFormData({
        perfectDay: data.perfect_day,
        violationsCount: data.violations_count,
        mostChallenging: data.most_challenging_rules || '',
        triggers: data.triggers_identified || '',
        improvementNotes: data.improvement_notes || ''
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      await supabase
        .from('daily_rule_reviews')
        .upsert({
          review_date: today,
          perfect_day: formData.perfectDay,
          violations_count: formData.violationsCount,
          most_challenging_rules: formData.mostChallenging,
          triggers_identified: formData.triggers,
          improvement_notes: formData.improvementNotes
        });

      if (formData.perfectDay) {
        const { data: streakData } = await supabase
          .from('discipline_streaks')
          .select('*')
          .single();

        if (streakData) {
          const newCurrent = streakData.current_streak + 1;
          const newLongest = Math.max(newCurrent, streakData.longest_streak);
          const newTotal = streakData.total_perfect_days + 1;

          await supabase
            .from('discipline_streaks')
            .update({
              current_streak: newCurrent,
              longest_streak: newLongest,
              total_perfect_days: newTotal,
              last_perfect_day: today,
              updated_at: new Date().toISOString()
            })
            .eq('id', streakData.id);
        }
      }

      alert('Daily review saved! Keep up the excellent work.');
      onClose();
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Failed to save review. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Daily Rule Review</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Evening reflection on your discipline today</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-medium mb-3">
              Take a moment to honestly reflect on today's adherence to the 20 Sacred Rules.
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Did you follow all 20 rules today?</li>
              <li>Which rules were most challenging?</li>
              <li>What violations occurred and were consequences implemented?</li>
              <li>What triggers led to any violations?</li>
              <li>How can you strengthen your discipline tomorrow?</li>
            </ul>
          </div>

          <div>
            <label className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg cursor-pointer hover:bg-green-100">
              <input
                type="checkbox"
                checked={formData.perfectDay}
                onChange={(e) => setFormData({ ...formData, perfectDay: e.target.checked })}
                className="w-5 h-5"
              />
              <div>
                <div className="font-bold text-green-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Perfect Day - I followed all 20 rules today
                </div>
                <div className="text-sm text-green-700 mt-1">
                  No violations, all commitments met with excellence
                </div>
              </div>
            </label>
          </div>

          {!formData.perfectDay && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Violations Today
              </label>
              <input
                type="number"
                min="0"
                value={formData.violationsCount}
                onChange={(e) => setFormData({ ...formData, violationsCount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Most Challenging Rules Today
            </label>
            <textarea
              value={formData.mostChallenging}
              onChange={(e) => setFormData({ ...formData, mostChallenging: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Which rules were hardest to follow? Why?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Triggers Identified
            </label>
            <textarea
              value={formData.triggers}
              onChange={(e) => setFormData({ ...formData, triggers: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="What situations, emotions, or circumstances led to challenges or violations?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tomorrow's Improvement Plan
            </label>
            <textarea
              value={formData.improvementNotes}
              onChange={(e) => setFormData({ ...formData, improvementNotes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="How will you strengthen your discipline tomorrow? What specific actions will you take?"
            />
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-orange-900 mb-2">The Warrior's Commitment:</p>
            <p className="text-sm text-orange-800 italic">
              "I am building an extraordinary life through extraordinary discipline. Every rule I follow makes me stronger.
              Every consequence I accept makes me wiser. I do not make excuses. I do not accept mediocrity. I do not quit."
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Review'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
