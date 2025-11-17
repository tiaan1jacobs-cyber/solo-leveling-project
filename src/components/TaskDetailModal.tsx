import { useState, useEffect } from 'react';
import { TimeBlock, TaskInstruction, Resource, ChecklistProgress } from '../types';
import { X, CheckSquare, Square, ExternalLink, Clock, CheckCircle2 } from 'lucide-react';

interface TaskDetailModalProps {
  block: TimeBlock | null;
  instructions: TaskInstruction[];
  resources: Resource[];
  checklistProgress: ChecklistProgress[];
  onClose: () => void;
  onChecklistToggle: (instructionId: string, completed: boolean) => void;
  onMarkComplete: () => void;
}

export function TaskDetailModal({
  block,
  instructions,
  resources,
  checklistProgress,
  onClose,
  onChecklistToggle,
  onMarkComplete
}: TaskDetailModalProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!block) return;

    const updateTimer = () => {
      const now = new Date();
      const [endHour, endMinute] = block.endTime.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);

      const diff = endTime.getTime() - now.getTime();
      if (diff > 0) {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeRemaining('Time is up!');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [block]);

  if (!block) return null;

  const sortedInstructions = [...instructions].sort((a, b) => a.orderIndex - b.orderIndex);
  const checklistItems = sortedInstructions.filter(i => i.isChecklistItem);
  const completedCount = checklistItems.filter(item =>
    checklistProgress.find(p => p.instructionId === item.id && p.completed)
  ).length;
  const totalCount = checklistItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{block.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {block.startTime} - {block.endTime}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${block.color}20`, color: block.color }}>
                {block.activityType}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-900">Time Remaining</span>
              <span className="text-2xl font-bold text-blue-600">{timeRemaining}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-blue-700 mt-1">
              {completedCount} of {totalCount} tasks completed ({Math.round(progressPercentage)}%)
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Task Instructions</h3>
            <div className="space-y-2">
              {sortedInstructions.map((instruction) => {
                const isCompleted = checklistProgress.find(
                  p => p.instructionId === instruction.id && p.completed
                );

                return (
                  <div
                    key={instruction.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      instruction.isChecklistItem
                        ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                        : 'bg-blue-50 border-l-4 border-blue-400'
                    }`}
                    onClick={() => {
                      if (instruction.isChecklistItem) {
                        onChecklistToggle(instruction.id, !isCompleted);
                      }
                    }}
                  >
                    {instruction.isChecklistItem ? (
                      isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )
                    ) : (
                      <div className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'
                      }`}
                    >
                      {instruction.instructionText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {resources.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Video Resources</h3>
              <div className="space-y-2">
                {resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                  >
                    <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-purple-600">
                        {resource.title}
                      </div>
                      <div className="text-sm text-gray-600">{resource.description}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onMarkComplete}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Mark Block Complete
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
