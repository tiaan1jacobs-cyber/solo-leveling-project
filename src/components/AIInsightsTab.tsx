import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Brain,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Activity,
  Target
} from 'lucide-react';
import { Card, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';
import { ProgressRing } from './ui/ProgressRing';
import {
  mockAIAdaptations,
  mockPatternDetections,
  mockDailyAnalytics,
  calculateOptimizationScore
} from '../data/mockData';
import { AIAdaptation } from '../types';

export function AIInsightsTab() {
  const [adaptations] = useState(mockAIAdaptations);
  const patterns = mockPatternDetections;
  const optimizationScore = calculateOptimizationScore(mockDailyAnalytics, patterns, adaptations);

  const acceptedAdaptations = adaptations.filter(a => a.status === 'accepted');
  const pendingAdaptations = adaptations.filter(a => a.status === 'pending');
  const rejectedAdaptations = adaptations.filter(a => a.status === 'rejected');

  const highConfidencePatterns = patterns.filter(p => p.confidence >= 0.85);
  const recentPatterns = patterns.slice(0, 5);

  const optimizationCategories = {
    timeAllocation: 85,
    energyAlignment: 92,
    goalProgress: 78,
    consistency: 88,
    recovery: 75
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowPredictions = [
    { time: '05:30', activity: 'Morning Routine', risk: 'low', confidence: 95 },
    { time: '09:00', activity: 'Deep Work', risk: 'low', confidence: 92 },
    { time: '13:00', activity: 'Client Calls', risk: 'medium', confidence: 78 },
    { time: '16:00', activity: 'Tennis Training', risk: 'low', confidence: 94 },
    { time: '21:00', activity: 'Wind Down', risk: 'medium', confidence: 72 }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white rounded-xl p-8 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
              <Brain className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">AI Schedule Intelligence</h2>
              <p className="text-sm opacity-90">Powered by advanced pattern recognition and predictive analytics</p>
            </div>
          </div>
          <div className="text-center">
            <ProgressRing progress={optimizationScore} size={120} strokeWidth={10} color="#ffffff" showLabel={true} />
            <p className="text-sm mt-2 opacity-90">Optimization Score</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-blue-600">Accepted</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600">{acceptedAdaptations.length}</div>
            <p className="text-sm text-blue-600 mt-1">Active optimizations</p>
          </CardBody>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-blue-600">Pending</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600">{pendingAdaptations.length}</div>
            <p className="text-sm text-blue-600 mt-1">Awaiting review</p>
          </CardBody>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-blue-600">Patterns</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600">{highConfidencePatterns.length}</div>
            <p className="text-sm text-blue-600 mt-1">High confidence insights</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Adaptation History
          </h3>
          <div className="space-y-3">
            {acceptedAdaptations.map((adaptation, index) => (
              <motion.div
                key={adaptation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Accepted
                      </Badge>
                      <span className="text-sm text-gray-600">{format(new Date(adaptation.date), 'MMM d, yyyy')}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{adaptation.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{adaptation.reasoning}</p>
                    {adaptation.beforeValue && adaptation.afterValue && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-white rounded border border-gray-200 text-gray-600 line-through">
                          {adaptation.beforeValue}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="px-2 py-1 bg-green-100 rounded border border-green-300 text-green-700 font-medium">
                          {adaptation.afterValue}
                        </span>
                      </div>
                    )}
                    {adaptation.successMetric && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${adaptation.successMetric * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-green-600">
                          {Math.round(adaptation.successMetric * 100)}% success
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Undo this change"
                  >
                    <RotateCcw className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Pattern Recognition
          </h3>
          <div className="grid gap-4">
            {recentPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="neutral" size="sm">{pattern.activityType}</Badge>
                      <span className="text-sm font-medium text-purple-600">
                        {Math.round(pattern.confidence * 100)}% confidence
                      </span>
                      <span className="text-xs text-gray-500">({pattern.dataPoints} data points)</span>
                    </div>
                    <p className="text-gray-900 font-medium mb-1">{pattern.insight}</p>
                    {pattern.actionTaken && (
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-700">Action: {pattern.actionTaken}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-orange-600" />
              Optimization Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(optimizationCategories).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-bold text-blue-600">{value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Top Suggestions</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Add 15-minute recovery block after intense workouts</li>
                <li>• Move meditation to evening for better consistency</li>
                <li>• Increase deep work duration on high-energy days</li>
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Tomorrow's Forecast
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              AI prediction for {format(tomorrow, 'EEEE, MMMM d')}
            </p>
            <div className="space-y-3">
              {tomorrowPredictions.map((prediction, index) => {
                const riskColors = {
                  low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'success' as const },
                  medium: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'warning' as const },
                  high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'danger' as const }
                };
                const colors = riskColors[prediction.risk as keyof typeof riskColors];

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{prediction.time}</span>
                          <span className="text-sm text-gray-700">{prediction.activity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={colors.badge} size="sm">
                            {prediction.risk} risk
                          </Badge>
                          <span className="text-xs text-gray-600">{prediction.confidence}% confidence</span>
                        </div>
                      </div>
                      <div className="w-12 h-12">
                        <ProgressRing
                          progress={prediction.confidence}
                          size={48}
                          strokeWidth={4}
                          color={colors.text.replace('text-', '#')}
                          showLabel={false}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
