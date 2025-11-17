import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ScheduleInstructionEditorProps {
  dayOfWeek: string;
  blockId: string;
  onClose: () => void;
  onSave: () => void;
}

export function ScheduleInstructionEditor({ dayOfWeek, blockId, onClose, onSave }: ScheduleInstructionEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [instruction, setInstruction] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [declarations, setDeclarations] = useState<string[]>([]);
  const [checklistItems, setChecklistItems] = useState<Array<{ text: string; is_critical: boolean }>>([]);

  useEffect(() => {
    loadInstruction();
  }, [dayOfWeek, blockId]);

  const loadInstruction = async () => {
    try {
      setLoading(true);

      const { data: instructionData, error: instError } = await supabase
        .from('schedule_instructions')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .eq('block_id', blockId)
        .maybeSingle();

      if (instError) throw instError;

      if (instructionData) {
        setInstruction(instructionData);
        setTitle(instructionData.title || '');
        setDescription(instructionData.description || '');
        setDeclarations(instructionData.declarations || []);

        const { data: itemsData, error: itemsError } = await supabase
          .from('instruction_checklist_items')
          .select('*')
          .eq('instruction_id', instructionData.id)
          .order('order_index');

        if (itemsError) throw itemsError;

        if (itemsData) {
          setChecklistItems(itemsData.map(item => ({
            text: item.item_text,
            is_critical: item.is_critical
          })));
        }
      }
    } catch (error) {
      console.error('Error loading instruction:', error);
      toast.error('Failed to load instruction');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (instruction) {
        // Update existing instruction
        const { error: updateError } = await supabase
          .from('schedule_instructions')
          .update({
            title,
            description,
            declarations
          })
          .eq('id', instruction.id);

        if (updateError) throw updateError;

        // Delete old checklist items
        const { error: deleteError } = await supabase
          .from('instruction_checklist_items')
          .delete()
          .eq('instruction_id', instruction.id);

        if (deleteError) throw deleteError;

        // Insert new checklist items
        if (checklistItems.length > 0) {
          const itemsToInsert = checklistItems.map((item, index) => ({
            instruction_id: instruction.id,
            item_text: item.text,
            order_index: index,
            is_critical: item.is_critical
          }));

          const { error: insertError } = await supabase
            .from('instruction_checklist_items')
            .insert(itemsToInsert);

          if (insertError) throw insertError;
        }

        toast.success('Instruction updated successfully');
      } else {
        // Create new instruction
        const { data: newInstruction, error: createError } = await supabase
          .from('schedule_instructions')
          .insert({
            day_of_week: dayOfWeek,
            block_id: blockId,
            title,
            description,
            declarations,
            order_index: 0
          })
          .select()
          .single();

        if (createError) throw createError;

        // Insert checklist items
        if (checklistItems.length > 0 && newInstruction) {
          const itemsToInsert = checklistItems.map((item, index) => ({
            instruction_id: newInstruction.id,
            item_text: item.text,
            order_index: index,
            is_critical: item.is_critical
          }));

          const { error: insertError } = await supabase
            .from('instruction_checklist_items')
            .insert(itemsToInsert);

          if (insertError) throw insertError;
        }

        toast.success('Instruction created successfully');
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving instruction:', error);
      toast.error('Failed to save instruction');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-6 rounded-lg">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-900 border-2 border-red-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b-2 border-red-900 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {instruction ? 'Edit Instructions' : 'Create Instructions'}
            </h2>
            <p className="text-gray-400 mt-1">
              {dayOfWeek} - {blockId}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., WAKE UP & CORE DECLARATIONS"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Brief description of this task..."
            />
          </div>

          {/* Declarations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-white">
                DECLARATIONS TO SAY OUT LOUD
              </label>
              <button
                onClick={() => setDeclarations([...declarations, ''])}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 font-bold"
              >
                <Plus className="w-4 h-4" />
                Add Declaration
              </button>
            </div>
            <div className="space-y-2">
              {declarations.map((decl, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-3">{index + 1}.</span>
                  <input
                    type="text"
                    value={decl}
                    onChange={(e) => {
                      const newDecl = [...declarations];
                      newDecl[index] = e.target.value;
                      setDeclarations(newDecl);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder='e.g., "I AM a warrior in complete control"'
                  />
                  <button
                    onClick={() => setDeclarations(declarations.filter((_, i) => i !== index))}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-white">
                CHECKLIST ITEMS
              </label>
              <button
                onClick={() => setChecklistItems([...checklistItems, { text: '', is_critical: false }])}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 font-bold"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
            <div className="space-y-2">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-3">{index + 1}.</span>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => {
                        const newItems = [...checklistItems];
                        newItems[index].text = e.target.value;
                        setChecklistItems(newItems);
                      }}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      placeholder="Checklist item..."
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={item.is_critical}
                        onChange={(e) => {
                          const newItems = [...checklistItems];
                          newItems[index].is_critical = e.target.checked;
                          setChecklistItems(newItems);
                        }}
                        className="rounded"
                      />
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      Mark as CRITICAL
                    </label>
                  </div>
                  <button
                    onClick={() => setChecklistItems(checklistItems.filter((_, i) => i !== index))}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-gray-800">
            <button
              onClick={handleSave}
              disabled={saving || !title}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
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
