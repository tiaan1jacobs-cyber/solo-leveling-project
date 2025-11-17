import { useState, useEffect } from 'react';
import { Check, AlertCircle, Flame, Crown } from 'lucide-react';
import { dailyChecklist } from '../data/militarySchedule';
import { templarColors, templarShadows } from '../styles/templarTokens';

interface ChecklistItem {
  id: string;
  label: string;
  critical: boolean;
  checked: boolean;
}

export default function TemplarChecklist() {
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
    if (completionRate === 100) return templarColors.gold[500];
    if (completionRate >= 70) return templarColors.gold[700];
    if (completionRate >= 50) return templarColors.accent.bronze;
    return templarColors.red.cross;
  };

  return (
    <div
      className={`rounded-lg p-6 relative overflow-hidden ${isLateWarning ? 'animate-pulse' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${templarColors.background.tertiary} 0%, ${templarColors.background.secondary} 100%)`,
        border: isLateWarning ? `3px solid ${templarColors.red.cross}` : `2px solid ${templarColors.gold[800]}`,
        boxShadow: isLateWarning ? templarShadows.red.glow : templarShadows.depth.medium,
      }}
    >
      <div
        className="absolute top-0 right-0 w-40 h-40 opacity-5"
        style={{
          background: `radial-gradient(circle, ${templarColors.gold[500]} 0%, transparent 70%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold tracking-wider uppercase"
            style={{
              color: templarColors.gold[500],
              textShadow: templarShadows.gold.text,
              fontFamily: 'Cinzel, serif',
            }}
          >
            Daily Oath
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div
                className="text-3xl font-bold"
                style={{
                  color: getStatusColor(),
                  textShadow: templarShadows.gold.text,
                }}
              >
                {completionRate}%
              </div>
              <div
                className="text-xs uppercase tracking-wider"
                style={{ color: templarColors.stone.light }}
              >
                Complete
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Crown className="w-6 h-6" style={{ color: templarColors.gold[500] }} />
                <span
                  className="text-2xl font-bold"
                  style={{
                    color: templarColors.gold[500],
                    textShadow: templarShadows.gold.text,
                  }}
                >
                  {streak}
                </span>
              </div>
              <div
                className="text-xs uppercase tracking-wider"
                style={{ color: templarColors.stone.light }}
              >
                Day Reign
              </div>
            </div>
          </div>
        </div>

        {isLateWarning && (
          <div
            className="mb-4 p-3 rounded-lg flex items-center gap-3"
            style={{
              background: templarColors.red.blood,
              border: `1px solid ${templarColors.red.cross}`,
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: templarColors.gold[400] }} />
            <p
              className="text-sm font-bold"
              style={{ color: templarColors.gold[400] }}
            >
              WARNING: Tasks incomplete past vigil hour. Honor demands completion.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition-all"
              style={{
                background: item.checked
                  ? `${templarColors.gold[900]}40`
                  : `${templarColors.background.primary}80`,
                border: item.checked
                  ? `1px solid ${templarColors.gold[700]}`
                  : `1px solid ${templarColors.stone.dark}`,
              }}
            >
              <div
                className="w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  background: item.checked ? templarColors.gold[600] : 'transparent',
                  borderColor: item.checked ? templarColors.gold[600] : templarColors.stone.medium,
                  boxShadow: item.checked ? templarShadows.gold.glow : 'none',
                }}
              >
                {item.checked && <Check className="w-4 h-4 text-black" />}
              </div>
              <span
                className={`flex-1 text-left ${item.checked ? 'line-through' : ''}`}
                style={{
                  color: item.checked ? templarColors.stone.light : templarColors.gold[300],
                }}
              >
                {item.label}
              </span>
              {item.critical && !item.checked && (
                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: templarColors.red.cross }} />
              )}
            </button>
          ))}
        </div>

        <div
          className="mt-4 p-3 rounded-lg"
          style={{
            background: `${templarColors.background.primary}80`,
            border: `1px solid ${templarColors.gold[900]}`,
          }}
        >
          <p
            className="text-sm text-center italic"
            style={{
              color: completionRate === 100 ? templarColors.gold[500] : templarColors.stone.light,
            }}
          >
            {completionRate === 100 ? (
              <span>
                <Crown className="w-4 h-4 inline mr-2" />
                Perfect execution. This is the way of nobility.
              </span>
            ) : (
              `Incomplete = Honor stained. ${items.filter(i => !i.checked).length} oaths remaining.`
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
