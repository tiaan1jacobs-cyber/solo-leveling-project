import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ScheduleTemplate, TimeBlock, TaskInstruction, Resource } from '../types';
import { scheduleTemplates, timeBlocks, taskInstructions, resources } from '../data/scheduleData';

export function useScheduleData() {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [instructions, setInstructions] = useState<TaskInstruction[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: templatesData } = await supabase
        .from('schedule_templates')
        .select('*');

      const { data: blocksData } = await supabase
        .from('time_blocks')
        .select('*')
        .order('order_index');

      const { data: instructionsData } = await supabase
        .from('task_instructions')
        .select('*')
        .order('order_index');

      const { data: resourcesData } = await supabase
        .from('resources')
        .select('*');

      if (!templatesData || templatesData.length === 0) {
        await seedInitialData();
        await loadData();
        return;
      }

      setTemplates(templatesData.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description || '',
        dayType: t.day_type as any
      })));

      setBlocks(blocksData?.map(b => ({
        id: b.id,
        templateId: b.template_id,
        startTime: b.start_time,
        endTime: b.end_time,
        title: b.title,
        activityType: b.activity_type as any,
        orderIndex: b.order_index,
        color: b.color
      })) || []);

      setInstructions(instructionsData?.map(i => ({
        id: i.id,
        timeBlockId: i.time_block_id,
        instructionText: i.instruction_text,
        orderIndex: i.order_index,
        isChecklistItem: i.is_checklist_item
      })) || []);

      setAllResources(resourcesData?.map(r => ({
        id: r.id,
        title: r.title,
        url: r.url,
        category: r.category,
        timeBlockId: r.time_block_id,
        description: r.description || ''
      })) || []);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const seedInitialData = async () => {
    const templateMap = new Map<string, string>();

    for (const template of scheduleTemplates) {
      const { data } = await supabase
        .from('schedule_templates')
        .insert({
          name: template.name,
          description: template.description,
          day_type: template.dayType
        })
        .select()
        .single();

      if (data) {
        templateMap.set(template.id, data.id);
      }
    }

    const blockMap = new Map<string, string>();

    for (const block of timeBlocks) {
      const newTemplateId = templateMap.get(block.templateId);
      if (newTemplateId) {
        const { data } = await supabase
          .from('time_blocks')
          .insert({
            template_id: newTemplateId,
            start_time: block.startTime,
            end_time: block.endTime,
            title: block.title,
            activity_type: block.activityType,
            order_index: block.orderIndex,
            color: block.color
          })
          .select()
          .single();

        if (data) {
          blockMap.set(block.id, data.id);
        }
      }
    }

    for (const instruction of taskInstructions) {
      const newBlockId = blockMap.get(instruction.timeBlockId);
      if (newBlockId) {
        await supabase
          .from('task_instructions')
          .insert({
            time_block_id: newBlockId,
            instruction_text: instruction.instructionText,
            order_index: instruction.orderIndex,
            is_checklist_item: instruction.isChecklistItem
          });
      }
    }

    for (const resource of resources) {
      const newBlockId = resource.timeBlockId ? blockMap.get(resource.timeBlockId) : null;
      await supabase
        .from('resources')
        .insert({
          title: resource.title,
          url: resource.url,
          category: resource.category,
          time_block_id: newBlockId,
          description: resource.description
        });
    }
  };

  return {
    templates,
    blocks,
    instructions,
    allResources,
    loading,
    reload: loadData
  };
}
