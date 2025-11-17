import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  Copy,
  Clock,
  Save,
  RotateCcw,
  CheckCircle2,
  Circle,
  GripVertical,
  Sparkles,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TimeBlock } from '../types';
import { Card, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';
import { activityColors } from '../styles/designTokens';
import { soloLevelingTheme } from '../styles/soloLevelingTokens';

interface AdvancedScheduleEditorProps {
  blocks: TimeBlock[];
  completedBlocks: Set<string>;
  onBlockClick: (block: TimeBlock) => void;
  onBlocksReorder: (blocks: TimeBlock[]) => void;
  onBlockAdd: () => void;
  onBlockEdit: (block: TimeBlock) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockDuplicate: (block: TimeBlock) => void;
}

export function AdvancedScheduleEditor({
  blocks,
  completedBlocks,
  onBlockClick,
  onBlocksReorder,
  onBlockAdd,
  onBlockEdit,
  onBlockDelete,
  onBlockDuplicate,
}: AdvancedScheduleEditorProps) {
  const [editMode, setEditMode] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set());
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const handleReorder = (newOrder: TimeBlock[]) => {
    onBlocksReorder(newOrder);
    toast.success('Schedule reordered');
  };

  const handleBulkDelete = () => {
    if (selectedBlocks.size === 0) return;
    if (!confirm(`Delete ${selectedBlocks.size} selected blocks?`)) return;

    selectedBlocks.forEach(id => onBlockDelete(id));
    setSelectedBlocks(new Set());
    toast.success(`${selectedBlocks.size} blocks deleted`);
  };

  const toggleBlockSelection = (blockId: string) => {
    const newSelection = new Set(selectedBlocks);
    if (newSelection.has(blockId)) {
      newSelection.delete(blockId);
    } else {
      newSelection.add(blockId);
    }
    setSelectedBlocks(newSelection);
  };

  const getActivityColor = (type: string) => {
    return activityColors[type as keyof typeof activityColors] || activityColors.personal;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Daily Schedule</h2>
          <p className="text-sm text-slate-400">
            {editMode ? 'Drag to reorder, click to select' : 'Click any block to view details'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {editMode && selectedBlocks.size > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedBlocks.size})
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all"
            style={{
              background: editMode
                ? soloLevelingTheme.stats.warning
                : soloLevelingTheme.background.card,
              border: `1px solid ${editMode ? soloLevelingTheme.stats.warning : soloLevelingTheme.border.default}`,
              color: 'white',
            }}
          >
            <Edit3 className="w-4 h-4" />
            {editMode ? 'Done' : 'Edit'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBlockAdd}
            className="px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all text-white"
            style={{
              background: soloLevelingTheme.gradient.button,
              boxShadow: soloLevelingTheme.shadow.glow,
            }}
          >
            <Plus className="w-4 h-4" />
            Add Block
          </motion.button>
        </div>
      </div>

      <div className="relative">
        <div
          className="absolute left-16 top-0 bottom-0 w-0.5 opacity-30"
          style={{
            background: `linear-gradient(to bottom, ${soloLevelingTheme.glow.primary}, ${soloLevelingTheme.glow.secondary}, ${soloLevelingTheme.glow.cyan})`
          }}
        />

        <Reorder.Group
          axis="y"
          values={blocks}
          onReorder={handleReorder}
          className="space-y-3"
        >
          {blocks.map((block, index) => {
            const isCompleted = completedBlocks.has(block.id);
            const isSelected = selectedBlocks.has(block.id);
            const isHovered = hoveredBlock === block.id;
            const colors = getActivityColor(block.activityType);

            return (
              <Reorder.Item
                key={block.id}
                value={block}
                drag={editMode}
                dragListener={editMode}
                dragConstraints={{ top: 0, bottom: 0 }}
                onMouseEnter={() => setHoveredBlock(block.id)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <Card
                    className={`overflow-visible transition-all duration-300 ${
                      isCompleted ? 'opacity-75' : ''
                    }`}
                    style={{
                      background: soloLevelingTheme.background.card,
                      border: `1px solid ${isSelected ? soloLevelingTheme.glow.primary : soloLevelingTheme.border.default}`,
                      boxShadow: isSelected
                        ? `0 0 0 4px ${soloLevelingTheme.glow.primary}40`
                        : isHovered
                        ? soloLevelingTheme.shadow.glowStrong
                        : soloLevelingTheme.shadow.card,
                      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    }}
                    onClick={() => {
                      if (editMode) {
                        toggleBlockSelection(block.id);
                      } else {
                        onBlockClick(block);
                      }
                    }}
                  >
                    <CardBody className="p-0">
                      <div className="flex items-center">
                        {editMode && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="px-4 cursor-move flex items-center"
                          >
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </motion.div>
                        )}

                        <div
                          className={`w-2 h-24 bg-gradient-to-b ${colors.gradient} relative`}
                        >
                          {isCompleted && (
                            <div className="absolute inset-0 bg-green-500 opacity-75" />
                          )}
                        </div>

                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant={isCompleted ? 'success' : 'neutral'}
                                  size="sm"
                                  className="font-mono"
                                >
                                  {block.startTime} - {block.endTime}
                                </Badge>
                                <Badge variant="neutral" size="sm">
                                  {block.activityType}
                                </Badge>
                                {index === 0 && (
                                  <Badge variant="info" size="sm">
                                    <Zap className="w-3 h-3" />
                                    Next
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-bold text-white mb-1">
                                {block.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {calculateDuration(block.startTime, block.endTime)}
                                </span>
                                {isCompleted && (
                                  <span className="flex items-center gap-1 text-green-600 font-medium">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-10 h-10 rounded-full flex items-center justify-center"
                                  style={{
                                    background: soloLevelingTheme.glow.success,
                                    boxShadow: `0 0 15px ${soloLevelingTheme.glow.success}80`,
                                  }}
                                >
                                  <CheckCircle2 className="w-6 h-6 text-white" />
                                </motion.div>
                              ) : (
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center"
                                  style={{
                                    background: soloLevelingTheme.background.secondary,
                                    border: `1px solid ${soloLevelingTheme.border.default}`,
                                  }}
                                >
                                  <Circle className="w-6 h-6 text-slate-500" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {(isHovered || editMode) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 flex items-center justify-end gap-2"
                          style={{
                            borderTop: `1px solid ${soloLevelingTheme.border.default}`,
                            background: soloLevelingTheme.background.secondary,
                          }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onBlockEdit(block);
                            }}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onBlockDuplicate(block);
                              toast.success('Block duplicated');
                            }}
                            className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this block?')) {
                                onBlockDelete(block.id);
                                toast.success('Block deleted');
                              }
                            }}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      )}
                    </CardBody>
                  </Card>

                  {index < blocks.length - 1 && (
                    <div className="flex items-center justify-center py-2">
                      <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>

      {blocks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Schedule Yet</h3>
          <p className="text-gray-600 mb-6">Create your first time block to get started</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBlockAdd}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add First Block
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

function calculateDuration(start: string, end: string): string {
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const duration = endMinutes - startMinutes;

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
