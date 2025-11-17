import { useState, useEffect } from 'react';
import { Swords, Check } from 'lucide-react';
import { combatSchedule } from '../data/militarySchedule';

interface CombatEntry {
  day: string;
  session1: string;
  session2?: string;
  type: string;
  note: string;
  completed: boolean;
}

export default function CombatSchedule() {
  const [entries, setEntries] = useState<CombatEntry[]>(() => {
    const saved = localStorage.getItem('combat-schedule');
    if (saved) {
      return JSON.parse(saved);
    }
    return combatSchedule.map(item => ({ ...item, completed: false }));
  });

  useEffect(() => {
    localStorage.setItem('combat-schedule', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const now = new Date();
    const lastReset = localStorage.getItem('last-combat-reset');
    const monday = getMonday(now);
    const mondayStr = monday.toDateString();

    if (lastReset !== mondayStr) {
      setEntries(combatSchedule.map(item => ({ ...item, completed: false })));
      localStorage.setItem('last-combat-reset', mondayStr);
    }
  }, []);

  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const toggleComplete = (day: string) => {
    setEntries(entries.map(entry =>
      entry.day === day ? { ...entry, completed: !entry.completed } : entry
    ));
  };

  const completedCount = entries.filter(e => e.completed).length;
  const totalCount = entries.length;

  return (
    <div
      className="border-2 border-red-900 rounded-lg p-6 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/combat_training.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(26,26,26,0.7) 100%)',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Swords className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold text-white tracking-wider">COMBAT TRAINING</h2>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">
              {completedCount}/{totalCount}
            </div>
            <div className="text-xs text-gray-500 uppercase">This Week</div>
          </div>
        </div>

      <div className="space-y-2">
        {entries.map((entry) => {
          const isRestDay = entry.session1 === '';

          return (
            <button
              key={entry.day}
              onClick={() => !isRestDay && toggleComplete(entry.day)}
              className={`w-full p-4 rounded-lg border transition-all text-left ${
                entry.completed
                  ? 'bg-green-950/30 border-green-800'
                  : isRestDay
                  ? 'bg-blue-950/20 border-blue-900'
                  : 'bg-gray-900/50 border-gray-800 hover:bg-gray-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {!isRestDay && (
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                      entry.completed
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-600'
                    }`}
                  >
                    {entry.completed && <Check className="w-4 h-4 text-white" />}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold">{entry.day}</span>
                    {entry.session1 && (
                      <span className="text-gray-400 text-sm">
                        {entry.session1}
                        {entry.session2 && ` & ${entry.session2}`}
                      </span>
                    )}
                  </div>

                  <div className={`text-sm mb-1 ${isRestDay ? 'text-blue-400' : 'text-red-400'}`}>
                    {entry.type}
                  </div>

                  {entry.note && (
                    <div className="text-gray-500 text-xs">{entry.note}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

        <div className="mt-4 p-3 bg-red-950/30 border border-red-900 rounded-lg">
          <p className="text-red-400 text-sm text-center font-bold">
            Miss training = 100 burpees + public accountability. No exceptions.
          </p>
        </div>
      </div>
    </div>
  );
}
