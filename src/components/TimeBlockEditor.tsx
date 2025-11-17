import { useState, useEffect } from 'react';
import { TimeBlock } from '../types';
import { supabase } from '../lib/supabase';
import { X, Plus, Trash2, Save } from 'lucide-react';

interface TimeBlockEditorProps {
  block: TimeBlock | null;
  templateId: string;
  onClose: () => void;
  onSave: () => void;
}

export function TimeBlockEditor({ block, templateId, onClose, onSave }: TimeBlockEditorProps) {
  const [formData, setFormData] = useState<{
    title: string;
    startTime: string;
    endTime: string;
    activityType: 'meditation' | 'training' | 'business' | 'academic' | 'personal' | 'health';
    color: string;
    orderIndex: number;
  }>({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    activityType: 'personal',
    color: '#3B82F6',
    orderIndex: 0
  });

  const [instructions, setInstructions] = useState<Array<{ text: string; isChecklist: boolean }>>([]);
  const [resources, setResources] = useState<Array<{ title: string; url: string; description: string }>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (block) {
      setFormData({
        title: block.title,
        startTime: block.startTime,
        endTime: block.endTime,
        activityType: block.activityType,
        color: block.color,
        orderIndex: block.orderIndex
      });
      loadBlockDetails();
    }
  }, [block]);

  const loadBlockDetails = async () => {
    if (!block) return;

    const { data: instructionsData } = await supabase
      .from('task_instructions')
      .select('*')
      .eq('time_block_id', block.id)
      .order('order_index');

    const { data: resourcesData } = await supabase
      .from('resources')
      .select('*')
      .eq('time_block_id', block.id);

    if (instructionsData) {
      setInstructions(instructionsData.map(i => ({
        text: i.instruction_text,
        isChecklist: i.is_checklist_item
      })));
    }

    if (resourcesData) {
      setResources(resourcesData.map(r => ({
        title: r.title,
        url: r.url,
        description: r.description || ''
      })));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (block) {
        await supabase
          .from('time_blocks')
          .update({
            title: formData.title,
            start_time: formData.startTime,
            end_time: formData.endTime,
            activity_type: formData.activityType,
            color: formData.color,
            order_index: formData.orderIndex
          })
          .eq('id', block.id);

        await supabase
          .from('task_instructions')
          .delete()
          .eq('time_block_id', block.id);

        for (let i = 0; i < instructions.length; i++) {
          await supabase
            .from('task_instructions')
            .insert({
              time_block_id: block.id,
              instruction_text: instructions[i].text,
              is_checklist_item: instructions[i].isChecklist,
              order_index: i
            });
        }

        await supabase
          .from('resources')
          .delete()
          .eq('time_block_id', block.id);

        for (const resource of resources) {
          await supabase
            .from('resources')
            .insert({
              time_block_id: block.id,
              title: resource.title,
              url: resource.url,
              description: resource.description,
              category: formData.activityType
            });
        }
      } else {
        const { data: newBlock } = await supabase
          .from('time_blocks')
          .insert({
            template_id: templateId,
            title: formData.title,
            start_time: formData.startTime,
            end_time: formData.endTime,
            activity_type: formData.activityType,
            color: formData.color,
            order_index: formData.orderIndex
          })
          .select()
          .single();

        if (newBlock) {
          for (let i = 0; i < instructions.length; i++) {
            await supabase
              .from('task_instructions')
              .insert({
                time_block_id: newBlock.id,
                instruction_text: instructions[i].text,
                is_checklist_item: instructions[i].isChecklist,
                order_index: i
              });
          }

          for (const resource of resources) {
            await supabase
              .from('resources')
              .insert({
                time_block_id: newBlock.id,
                title: resource.title,
                url: resource.url,
                description: resource.description,
                category: formData.activityType
              });
          }
        }
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving block:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const activityTypes = [
    { value: 'meditation', label: 'Meditation', color: '#8B5CF6' },
    { value: 'training', label: 'Training', color: '#EF4444' },
    { value: 'business', label: 'Business', color: '#3B82F6' },
    { value: 'academic', label: 'Academic', color: '#F59E0B' },
    { value: 'personal', label: 'Personal', color: '#EC4899' },
    { value: 'health', label: 'Health', color: '#10B981' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {block ? 'Edit Time Block' : 'Add Time Block'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Morning Meditation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Activity Type
            </label>
            <select
              value={formData.activityType}
              onChange={(e) => {
                const type = e.target.value as any;
                const selectedType = activityTypes.find(t => t.value === type);
                setFormData({
                  ...formData,
                  activityType: type,
                  color: selectedType?.color || '#3B82F6'
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Instructions & Checklist
              </label>
              <button
                onClick={() => setInstructions([...instructions, { text: '', isChecklist: true }])}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Instruction
              </button>
            </div>
            <div className="space-y-2">
              {instructions.map((inst, index) => (
                <div key={index} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={inst.isChecklist}
                    onChange={(e) => {
                      const newInst = [...instructions];
                      newInst[index].isChecklist = e.target.checked;
                      setInstructions(newInst);
                    }}
                    className="mt-3"
                    title="Make this a checklist item"
                  />
                  <input
                    type="text"
                    value={inst.text}
                    onChange={(e) => {
                      const newInst = [...instructions];
                      newInst[index].text = e.target.value;
                      setInstructions(newInst);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter instruction..."
                  />
                  <button
                    onClick={() => setInstructions(instructions.filter((_, i) => i !== index))}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Video Resources
              </label>
              <button
                onClick={() => setResources([...resources, { title: '', url: '', description: '' }])}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Resource
              </button>
            </div>
            <div className="space-y-3">
              {resources.map((res, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <input
                      type="text"
                      value={res.title}
                      onChange={(e) => {
                        const newRes = [...resources];
                        newRes[index].title = e.target.value;
                        setResources(newRes);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Resource title..."
                    />
                    <button
                      onClick={() => setResources(resources.filter((_, i) => i !== index))}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="url"
                    value={res.url}
                    onChange={(e) => {
                      const newRes = [...resources];
                      newRes[index].url = e.target.value;
                      setResources(newRes);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://..."
                  />
                  <input
                    type="text"
                    value={res.description}
                    onChange={(e) => {
                      const newRes = [...resources];
                      newRes[index].description = e.target.value;
                      setResources(newRes);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Description..."
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving || !formData.title}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
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
