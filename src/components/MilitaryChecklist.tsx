import { useState, useEffect } from 'react';
import { Check, AlertCircle, Flame } from 'lucide-react';
import { dailyChecklist } from '../data/militarySchedule';

interface ChecklistItem {
  id: string;
  label: string;
  critical: boolean;
  checked: boolean;
}

export default function MilitaryChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('military-checklist');
    if (saved) {
      return JSON.parse(saved);
    }
    return dailyChecklist.map(item => ({ ...item, checked: false }));
  });

  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('perfect-streak') || '0');
  });

  useEffect(() => {
    localStorage.setItem('military-checklist', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const now = new Date();
    const lastReset = localStorage.getItem('last-checklist-reset');
    const today = now.toDateString();

    if (lastReset !== today && now.getHours() >= 0) {
      const completionRate = getCompletionRate();
      if (completionRate === 100) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('perfect-streak', newStreak.toString());
      } else {
        setStreak(0);
        localStorage.setItem('perfect-streak', '0');
      }

      setItems(dailyChecklist.map(item => ({ ...item, checked: false })));
      localStorage.setItem('last-checklist-reset', today);
    }
  }, []);

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const getCompletionRate = () => {
    const completed = items.filter(i => i.checked).length;
    return Math.round((completed / items.length) * 100);
  };

  const completionRate = getCompletionRate();
  const isLateWarning = new Date().getHours() >= 23 && completionRate < 100;

  const getStatusColor = () => {
    if (completionRate === 100) return 'text-green-500 border-green-500';
    if (completionRate >= 70) return 'text-yellow-500 border-yellow-500';
    if (completionRate >= 50) return 'text-orange-500 border-orange-500';
    return 'text-red-500 border-red-500';
  };

  return (
    <div className={`bg-black border-2 rounded-lg p-6 ${isLateWarning ? 'border-red-500 animate-pulse' : 'border-red-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-wider">DAILY CHECKLIST</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getStatusColor()}`}>
              {completionRate}%
            </div>
            <div className="text-xs text-gray-500 uppercase">Complete</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-6 h-6" />
              <span className="text-2xl font-bold">{streak}</span>
            </div>
            <div className="text-xs text-gray-500 uppercase">Day Streak</div>
          </div>
        </div>
      </div>

      {isLateWarning && (
        <div className="mb-4 p-3 bg-red-950/50 border border-red-600 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-400 text-sm font-bold">
            WARNING: Tasks incomplete after 23:00. Execute now or log failure.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border ${
              item.checked
                ? 'bg-green-950/30 border-green-800 hover:bg-green-950/50'
                : 'bg-gray-900/50 border-gray-800 hover:bg-gray-900'
            }`}
          >
            <div
              className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                item.checked
                  ? 'bg-green-600 border-green-600'
                  : 'border-gray-600'
              }`}
            >
              {item.checked && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className={`flex-1 text-left ${item.checked ? 'text-gray-400 line-through' : 'text-white'}`}>
              {item.label}
            </span>
            {item.critical && !item.checked && (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
        <p className="text-gray-400 text-sm text-center">
          {completionRate === 100 ? (
            <span className="text-green-400 font-bold">PERFECT EXECUTION. This is the standard.</span>
          ) : (
            <span>Incomplete = Weakness visible. {items.filter(i => !i.checked).length} items remaining.</span>
          )}
        </p>
      </div>
    </div>
  );
}
