import { useState, useEffect } from 'react';
import { TrendingUp, Plus } from 'lucide-react';

interface Metric {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
  period: string;
}

export default function BusinessMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>(() => {
    const saved = localStorage.getItem('business-metrics');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 'leads', label: 'Leads Generated', target: 50, current: 0, unit: '', period: 'week' },
      { id: 'emails', label: 'Cold Emails Sent', target: 25, current: 0, unit: '', period: 'week' },
      { id: 'calls', label: 'Sales Calls', target: 3, current: 0, unit: '', period: 'week' },
      { id: 'revenue', label: 'Monthly Revenue', target: 5000, current: 0, unit: '$', period: 'month' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('business-metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    const now = new Date();
    const lastReset = localStorage.getItem('last-metrics-reset');
    const monday = getMonday(now);
    const mondayStr = monday.toDateString();

    if (lastReset !== mondayStr) {
      setMetrics(metrics.map(m => m.period === 'week' ? { ...m, current: 0 } : m));
      localStorage.setItem('last-metrics-reset', mondayStr);
    }
  }, []);

  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const incrementMetric = (id: string) => {
    setMetrics(metrics.map(m =>
      m.id === id ? { ...m, current: m.current + 1 } : m
    ));
  };

  const getStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 80) return { color: 'green', label: 'On Track' };
    if (percentage >= 50) return { color: 'yellow', label: 'Behind' };
    return { color: 'red', label: 'Critical' };
  };

  const getStatusClasses = (color: string) => {
    if (color === 'green') return 'bg-green-950/30 border-green-800 text-green-400';
    if (color === 'yellow') return 'bg-yellow-950/30 border-yellow-800 text-yellow-400';
    return 'bg-red-950/30 border-red-800 text-red-400';
  };

  return (
    <div
      className="border-2 border-red-900 rounded-lg p-6 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/business_warfare_1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(26,26,26,0.85) 100%)',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-red-500" />
          <h2 className="text-2xl font-bold text-white tracking-wider">BUSINESS METRICS</h2>
        </div>

      <div className="space-y-4">
        {metrics.map((metric) => {
          const status = getStatus(metric.current, metric.target);
          const percentage = Math.min(100, Math.round((metric.current / metric.target) * 100));

          return (
            <div
              key={metric.id}
              className={`p-4 rounded-lg border ${getStatusClasses(status.color)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white font-bold">{metric.label}</div>
                  <div className="text-gray-500 text-sm">
                    Target: {metric.unit}{metric.target}/{metric.period}
                  </div>
                </div>
                <button
                  onClick={() => incrementMetric(metric.id)}
                  className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        status.color === 'green'
                          ? 'bg-green-500'
                          : status.color === 'yellow'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {metric.unit}{metric.current}
                  </div>
                  <div className={`text-xs font-bold ${
                    status.color === 'green'
                      ? 'text-green-400'
                      : status.color === 'yellow'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}>
                    {status.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

        <div className="mt-4 p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
          <p className="text-gray-400 text-sm text-center">
            Weekly metrics reset every Monday. Click + to increment.
          </p>
        </div>
      </div>
    </div>
  );
}
