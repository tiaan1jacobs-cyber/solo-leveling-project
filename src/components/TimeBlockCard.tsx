import { TimeBlock } from '../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TimeBlockCardProps {
  block: TimeBlock;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

export function TimeBlockCard({ block, isCompleted, isActive, onClick }: TimeBlockCardProps) {
  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (isActive) {
      return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusColor = () => {
    if (isCompleted) return 'border-green-500 bg-green-50';
    if (isActive) return 'border-yellow-500 bg-yellow-50';
    return 'border-gray-300 bg-white hover:bg-gray-50';
  };

  return (
    <div
      onClick={onClick}
      className={`border-l-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${getStatusColor()}`}
      style={{ borderLeftColor: block.color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getStatusIcon()}
            <span className="text-sm font-semibold text-gray-600">
              {block.startTime} - {block.endTime}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{block.title}</h3>
          <span
            className="inline-block px-2 py-1 text-xs rounded-full font-medium"
            style={{ backgroundColor: `${block.color}20`, color: block.color }}
          >
            {block.activityType}
          </span>
        </div>
      </div>
    </div>
  );
}
