import { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChecklistItem {
  id: string;
  item_text: string;
  order_index: number;
  is_critical: boolean;
  completed?: boolean;
}

interface Instruction {
  id: string;
  title: string;
  description: string | null;
  declarations: string[];
  order_index: number;
  checklist_items: ChecklistItem[];
}

interface EnhancedTaskModalProps {
  dayOfWeek: string;
  blockId: string;
  activity: string;
  time: string;
  endTime: string;
  onClose: () => void;
}

export function EnhancedTaskModal({
  dayOfWeek,
  blockId,
  activity,
  time,
  endTime,
  onClose
}: EnhancedTaskModalProps) {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [blockCompleted, setBlockCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInstructions();
    loadProgress();
  }, [dayOfWeek, blockId]);

  const loadInstructions = async () => {
    try {
      const { data: instructionsData, error: instructionsError } = await supabase
        .from('schedule_instructions')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .eq('block_id', blockId)
        .order('order_index');

      if (instructionsError) throw instructionsError;

      if (instructionsData && instructionsData.length > 0) {
        const instructionIds = instructionsData.map(i => i.id);

        const { data: checklistData, error: checklistError } = await supabase
          .from('instruction_checklist_items')
          .select('*')
          .in('instruction_id', instructionIds)
          .order('order_index');

        if (checklistError) throw checklistError;

        const today = new Date().toISOString().split('T')[0];
        const { data: progressData } = await supabase
          .from('user_checklist_progress')
          .select('checklist_item_id, completed')
          .eq('completion_date', today);

        const progressMap = new Map(
          progressData?.map(p => [p.checklist_item_id, p.completed]) || []
        );

        const enrichedInstructions = instructionsData.map(inst => ({
          ...inst,
          checklist_items: (checklistData || [])
            .filter(item => item.instruction_id === inst.id)
            .map(item => ({
              ...item,
              completed: progressMap.get(item.id) || false
            }))
        }));

        setInstructions(enrichedInstructions);
      }
    } catch (error) {
      console.error('Error loading instructions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('user_block_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('day_of_week', dayOfWeek)
        .eq('block_id', blockId)
        .eq('completion_date', today)
        .maybeSingle();

      if (data) {
        setBlockCompleted(data.completed);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const toggleChecklistItem = async (itemId: string, currentState: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const newState = !currentState;

      const { error } = await supabase
        .from('user_checklist_progress')
        .upsert({
          user_id: user.id,
          checklist_item_id: itemId,
          completion_date: today,
          completed: newState,
          completed_at: newState ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,checklist_item_id,completion_date'
        });

      if (error) throw error;

      setInstructions(prev => prev.map(inst => ({
        ...inst,
        checklist_items: inst.checklist_items.map(item =>
          item.id === itemId ? { ...item, completed: newState } : item
        )
      })));
    } catch (error) {
      console.error('Error toggling checklist item:', error);
    }
  };

  const toggleBlockCompletion = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const newState = !blockCompleted;

      const { error } = await supabase
        .from('user_block_progress')
        .upsert({
          user_id: user.id,
          day_of_week: dayOfWeek,
          block_id: blockId,
          completion_date: today,
          completed: newState,
          completed_at: newState ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,day_of_week,block_id,completion_date'
        });

      if (error) throw error;
      setBlockCompleted(newState);
    } catch (error) {
      console.error('Error toggling block completion:', error);
    } finally {
      setSaving(false);
    }
  };

  const allItemsCompleted = instructions.every(inst =>
    inst.checklist_items.every(item => item.completed)
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-red-600 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-red-900/50">
        <div className="bg-gradient-to-r from-red-900/70 to-gray-800/70 p-6 border-b-2 border-red-600">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{activity}</h2>
              <div className="flex items-center gap-4 text-gray-100">
                <span className="text-lg font-semibold">{time} - {endTime}</span>
                <span className="px-3 py-1 bg-red-600 border border-red-400 rounded text-white text-sm font-bold">
                  {dayOfWeek}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-200 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 bg-gray-800" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="text-gray-100 mt-4 text-lg">Loading instructions...</p>
            </div>
          ) : instructions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-100 text-lg">No detailed instructions available for this block yet.</p>
              <p className="text-gray-300 text-base mt-2">Check back soon for step-by-step guidance.</p>
            </div>
          ) : (
            <>
              {instructions.map((instruction) => (
                <div key={instruction.id} className="space-y-4">
                  <div className="bg-gray-700 border-2 border-gray-600 rounded-lg p-5 shadow-lg">
                    <h3 className="text-2xl font-bold text-white mb-3">{instruction.title}</h3>
                    {instruction.description && (
                      <p className="text-gray-100 text-base mb-4">{instruction.description}</p>
                    )}

                    {instruction.declarations && instruction.declarations.length > 0 && (
                      <div className="bg-red-900/60 border-2 border-red-600 rounded-lg p-5 mb-4 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                          <Flame className="w-6 h-6 text-red-300" />
                          <h4 className="text-xl font-bold text-red-100">DECLARATIONS</h4>
                        </div>
                        <ul className="space-y-3">
                          {instruction.declarations.map((declaration, idx) => (
                            <li key={idx} className="text-red-100 text-base pl-4 border-l-4 border-red-400 leading-relaxed">
                              {declaration}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {instruction.checklist_items && instruction.checklist_items.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-base font-bold text-gray-100 uppercase tracking-wider mb-3">
                          Steps to Complete
                        </h4>
                        {instruction.checklist_items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => toggleChecklistItem(item.id, item.completed || false)}
                            className={`w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                              item.completed
                                ? 'bg-green-900/50 border-green-600'
                                : item.is_critical
                                ? 'bg-red-900/30 border-red-700 hover:bg-red-900/50'
                                : 'bg-gray-600 border-gray-500 hover:bg-gray-500'
                            }`}
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Circle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                                item.is_critical ? 'text-red-400' : 'text-gray-300'
                              }`} />
                            )}
                            <div className="flex-1">
                              <p className={`text-base leading-relaxed ${
                                item.completed ? 'text-gray-400 line-through' : 'text-white'
                              }`}>
                                {item.item_text}
                              </p>
                              {item.is_critical && !item.completed && (
                                <span className="inline-block mt-2 px-2 py-1 bg-red-700 border border-red-500 rounded text-red-100 text-xs font-bold">
                                  CRITICAL
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="bg-gray-800 border-t-2 border-red-600 p-6">
          <button
            onClick={toggleBlockCompletion}
            disabled={saving || (!allItemsCompleted && instructions.length > 0)}
            className={`w-full py-4 rounded-lg font-bold text-xl transition-all ${
              blockCompleted
                ? 'bg-green-700 border-2 border-green-500 text-white hover:bg-green-600'
                : allItemsCompleted || instructions.length === 0
                ? 'bg-red-700 border-2 border-red-500 text-white hover:bg-red-600'
                : 'bg-gray-600 border-2 border-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {saving ? (
              'SAVING...'
            ) : blockCompleted ? (
              '✓ COMPLETED - CLICK TO UNDO'
            ) : instructions.length === 0 ? (
              'MARK AS COMPLETE'
            ) : allItemsCompleted ? (
              'MARK BLOCK AS COMPLETE'
            ) : (
              'COMPLETE ALL STEPS FIRST'
            )}
          </button>
          {!allItemsCompleted && instructions.length > 0 && (
            <p className="text-center text-gray-200 text-base mt-3">
              Complete all steps above to mark this block as done
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
