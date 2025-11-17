import { useState, useEffect } from 'react';
import { Clock, Monitor, BookOpen, Dumbbell, Coffee, Moon, Sun, Edit2 } from 'lucide-react';
import { weeklySchedule, DailyBlock } from '../data/militarySchedule';
import { ScheduleInstructionEditor } from './ScheduleInstructionEditor';
import { EnhancedTaskModal } from './EnhancedTaskModal';

export default function MilitaryDailyView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingBlock, setEditingBlock] = useState<DailyBlock | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<DailyBlock | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = dayNames[currentTime.getDay()];
  const todaySchedule = weeklySchedule.find(s => s.day === today);

  if (!todaySchedule) return null;

  const getBlockIcon = (type: string) => {
    if (type === 'da') return Monitor;
    if (type === 'training') return Dumbbell;
    if (type === 'class') return BookOpen;
    if (type === 'core') return Coffee;
    if (type === 'recovery') return Moon;
    return Clock;
  };

  const getBlockColor = (type: string) => {
    if (type === 'da') return 'bg-red-900/60 border-red-700';
    if (type === 'training') return 'bg-orange-900/50 border-orange-700';
    if (type === 'class') return 'bg-blue-900/50 border-blue-700';
    if (type === 'core') return 'bg-green-900/50 border-green-700';
    if (type === 'recovery') return 'bg-purple-900/50 border-purple-700';
    return 'bg-gray-800/80 border-gray-600';
  };

  const isCurrentBlock = (block: DailyBlock) => {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [startHour, startMin] = block.time.split(':').map(Number);
    const [endHour, endMin] = block.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

  const getTimeUntilNext = (block: DailyBlock) => {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [startHour, startMin] = block.time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;

    if (currentMinutes < startMinutes) {
      const diff = startMinutes - currentMinutes;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return `in ${hours}h ${mins}m`;
    }
    return null;
  };

  const isClassDay = today === 'Tuesday' || today === 'Thursday';

  return (
    <div className="space-y-6">
      <div
        className={`p-6 rounded-lg border-2 relative overflow-hidden ${isClassDay ? 'border-blue-600' : 'border-red-600'}`}
        style={{
          backgroundImage: 'url(/schedule_header.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: isClassDay
              ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(17, 24, 39, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(127, 29, 29, 0.85) 0%, rgba(17, 24, 39, 0.9) 100%)',
          }}
        />
        <div className="relative z-10 text-center">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Today Is</div>
          <div className="text-4xl font-bold text-white mb-2">{today}</div>
          {isClassDay && (
            <div className="inline-block px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-lg">
              CLASS DAY - Classes 8:30-12:00
            </div>
          )}
          {!isClassDay && (
            <div className="inline-block px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-lg">
              NO CLASSES - MAXIMIZE OUTPUT
            </div>
          )}
          <div className="text-gray-400 mt-2">{currentTime.toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="bg-black border-2 border-red-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white tracking-wider mb-6 flex items-center gap-3">
          <Clock className="w-8 h-8 text-red-500" />
          DAILY SCHEDULE
        </h2>

        <div className="space-y-2">
          {todaySchedule.blocks.map((block) => {
            const Icon = getBlockIcon(block.type);
            const isCurrent = isCurrentBlock(block);
            const timeUntil = getTimeUntilNext(block);

            return (
              <button
                key={block.id}
                onClick={() => setSelectedBlock(block)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left hover:scale-[1.02] ${
                  isCurrent
                    ? 'border-red-500 bg-red-950/50 shadow-lg shadow-red-900/50'
                    : getBlockColor(block.type)
                }`}
              >
                <div className="flex items-start gap-4">
                  <Icon className={`w-6 h-6 flex-shrink-0 ${isCurrent ? 'text-red-400' : 'text-gray-200'}`} />

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-base ${isCurrent ? 'text-red-400' : 'text-white'}`}>
                          {block.time} - {block.endTime}
                        </span>
                        {block.isDA && (
                          <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                            DA JOB
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded animate-pulse">
                            NOW
                          </span>
                        )}
                        {timeUntil && (
                          <span className="text-gray-300 text-sm font-medium">{timeUntil}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBlock(block);
                        }}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className={`text-lg font-bold ${isCurrent ? 'text-white' : 'text-gray-100'}`}>
                      {block.activity}
                    </div>

                    {block.description && (
                      <div className="text-gray-200 text-sm mt-1">
                        {block.description}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {editingBlock && (
        <ScheduleInstructionEditor
          dayOfWeek={today}
          blockId={editingBlock.id}
          onClose={() => setEditingBlock(null)}
          onSave={() => {
            setEditingBlock(null);
          }}
        />
      )}

      {selectedBlock && (
        <EnhancedTaskModal
          dayOfWeek={today}
          blockId={selectedBlock.id}
          activity={selectedBlock.activity}
          time={selectedBlock.time}
          endTime={selectedBlock.endTime}
          onClose={() => setSelectedBlock(null)}
        />
      )}
    </div>
  );
}
