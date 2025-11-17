import { useState, useEffect } from 'react';
import { Monitor, Check, Edit2 } from 'lucide-react';
import { daSchedule } from '../data/militarySchedule';

interface DAEntry {
  day: string;
  time: string;
  task: string;
  label: string;
  completed: boolean;
  log: string;
}

export default function DAJobTracker() {
  const [entries, setEntries] = useState<DAEntry[]>(() => {
    const saved = localStorage.getItem('da-tracker');
    if (saved) {
      return JSON.parse(saved);
    }
    return daSchedule.map(item => ({ ...item, completed: false, log: '' }));
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLog, setEditLog] = useState('');

  useEffect(() => {
    localStorage.setItem('da-tracker', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const now = new Date();
    const lastReset = localStorage.getItem('last-da-reset');
    const monday = getMonday(now);
    const mondayStr = monday.toDateString();

    if (lastReset !== mondayStr) {
      setEntries(daSchedule.map(item => ({ ...item, completed: false, log: '' })));
      localStorage.setItem('last-da-reset', mondayStr);
    }
  }, []);

  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const toggleComplete = (day: string, time: string) => {
    setEntries(entries.map(entry =>
      entry.day === day && entry.time === time
        ? { ...entry, completed: !entry.completed }
        : entry
    ));
  };

  const startEdit = (day: string, time: string, currentLog: string) => {
    setEditingId(`${day}-${time}`);
    setEditLog(currentLog);
  };

  const saveLog = (day: string, time: string) => {
    setEntries(entries.map(entry =>
      entry.day === day && entry.time === time
        ? { ...entry, log: editLog }
        : entry
    ));
    setEditingId(null);
    setEditLog('');
  };

  const totalHours = entries.length;
  const completedHours = entries.filter(e => e.completed).length;

  return (
    <div className="bg-black border-2 border-red-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Monitor className="w-8 h-8 text-red-500" />
          <h2 className="text-2xl font-bold text-white tracking-wider">DA JOB TRACKER</h2>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-500">
            {completedHours}/{totalHours}
          </div>
          <div className="text-xs text-gray-500 uppercase">Hours This Week</div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-red-950/30 border border-red-900 rounded-lg">
        <p className="text-red-400 font-bold text-center">
          "Getting paid to build your empire on someone else's dime"
        </p>
        <p className="text-gray-400 text-sm text-center mt-2">
          Every DA hour wasted is theft from yourself AND your employer. Log what you accomplished or admit you're a thief.
        </p>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const isEditing = editingId === `${entry.day}-${entry.time}`;

          return (
            <div
              key={`${entry.day}-${entry.time}`}
              className={`p-4 rounded-lg border ${
                entry.completed
                  ? 'bg-green-950/30 border-green-800'
                  : 'bg-gray-900/50 border-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleComplete(entry.day, entry.time)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    entry.completed
                      ? 'bg-green-600 border-green-600'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {entry.completed && <Check className="w-4 h-4 text-white" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-white font-bold">{entry.day}</span>
                      <span className="text-gray-400 ml-2">{entry.time}</span>
                    </div>
                    <button
                      onClick={() => startEdit(entry.day, entry.time, entry.log)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-red-400 text-sm mb-1">{entry.task}</div>
                  <div className="text-gray-500 text-xs mb-2">{entry.label}</div>

                  {isEditing ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={editLog}
                        onChange={(e) => setEditLog(e.target.value)}
                        placeholder="What did you accomplish?"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm mb-2 focus:outline-none focus:border-red-500"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveLog(entry.day, entry.time)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : entry.log ? (
                    <div className="mt-2 p-2 bg-black/50 border border-gray-800 rounded text-gray-300 text-sm">
                      {entry.log}
                    </div>
                  ) : (
                    <div className="mt-2 text-gray-600 text-sm italic">
                      No log yet - click edit to add
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
