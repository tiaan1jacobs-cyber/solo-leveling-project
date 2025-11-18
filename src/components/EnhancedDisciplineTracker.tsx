import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, XCircle, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';
import { ProgressRing } from './ui/ProgressRing';
import { disciplineRulesData } from '../data/disciplineRules';
import { mockRuleViolations, mockDailyAnalytics } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

export function EnhancedDisciplineTracker() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'foundation', 'mental', 'character', 'excellence'];

  const filteredRules = selectedCategory === 'all'
    ? disciplineRulesData
    : disciplineRulesData.filter(rule => rule.category === selectedCategory);

  const violationsByRule = useMemo(() => {
    const map = new Map<number, number>();
    mockRuleViolations.forEach(violation => {
      map.set(violation.ruleNumber, (map.get(violation.ruleNumber) || 0) + 1);
    });
    return map;
  }, []);

  const atRiskRules = disciplineRulesData.filter(rule => {
    const violations = violationsByRule.get(rule.rule_number) || 0;
    return violations >= 2;
  });

  const weeklyCompliance = mockDailyAnalytics.map(day => ({
    date: format(new Date(day.date), 'EEE'),
    compliance: Math.round((day.rulesFollowed / day.rulesTotal) * 100)
  }));

  const totalViolations = mockRuleViolations.length;
  const completedConsequences = mockRuleViolations.filter(v => v.consequenceCompleted).length;
  const averageCompliance = Math.round(
    (mockDailyAnalytics.reduce((sum, day) => sum + (day.rulesFollowed / day.rulesTotal), 0) / mockDailyAnalytics.length) * 100
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      foundation: 'from-red-500 to-orange-500',
      mental: 'from-blue-500 to-cyan-500',
      character: 'from-green-500 to-emerald-500',
      excellence: 'from-purple-500 to-pink-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      foundation: { variant: 'danger' as const, label: 'Foundation' },
      mental: { variant: 'info' as const, label: 'Mental' },
      character: { variant: 'success' as const, label: 'Character' },
      excellence: { variant: 'warning' as const, label: 'Excellence' }
    };
    return badges[category as keyof typeof badges] || { variant: 'neutral' as const, label: category };
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white rounded-xl p-8 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
              <Shield className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">Discipline Code Tracker</h2>
              <p className="text-sm opacity-90">20 rules for ultimate transformation</p>
            </div>
          </div>
          <div className="text-center">
            <ProgressRing progress={averageCompliance} size={120} strokeWidth={10} color="#ffffff" showLabel={true} />
            <p className="text-sm mt-2 opacity-90">Weekly Compliance</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-blue-600">Rules Followed</h3>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {20 - atRiskRules.length}/20
            </div>
            <p className="text-sm text-gray-600 mt-1">Perfect discipline</p>
          </CardBody>
        </Card>

        <Card className="border-2 border-red-200 bg-red-50">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-blue-600">Total Violations</h3>
            </div>
            <div className="text-3xl font-bold text-red-600">{totalViolations}</div>
            <p className="text-sm text-gray-600 mt-1">This week</p>
          </CardBody>
        </Card>

        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardBody>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h3 className="font-bold text-blue-600">At Risk</h3>
            </div>
            <div className="text-3xl font-bold text-orange-600">{atRiskRules.length}</div>
            <p className="text-sm text-gray-600 mt-1">Rules need attention</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Weekly Compliance Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyCompliance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="compliance"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {atRiskRules.length > 0 && (
        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <CardBody>
            <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Rules At Risk
            </h3>
            <div className="space-y-3">
              {atRiskRules.map(rule => (
                <div key={rule.rule_number} className="p-4 bg-white rounded-lg border-2 border-orange-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="warning" size="sm">Rule {rule.rule_number}</Badge>
                        <Badge variant="danger" size="sm">
                          {violationsByRule.get(rule.rule_number)} violations
                        </Badge>
                      </div>
                      <h4 className="font-bold text-gray-900">{rule.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <div className="flex gap-2 mb-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredRules.map((rule, index) => {
          const violations = violationsByRule.get(rule.rule_number) || 0;
          const hasViolations = violations > 0;
          const isAtRisk = violations >= 2;
          const badge = getCategoryBadge(rule.category);

          return (
            <motion.div
              key={rule.rule_number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`${
                  isAtRisk
                    ? 'border-2 border-orange-300 bg-orange-50'
                    : hasViolations
                    ? 'border-2 border-yellow-300 bg-yellow-50'
                    : 'border-2 border-green-200 bg-white'
                }`}
              >
                <CardBody>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${getCategoryColor(rule.category)}`}>
                      {hasViolations ? (
                        isAtRisk ? (
                          <AlertTriangle className="w-6 h-6 text-white" />
                        ) : (
                          <XCircle className="w-6 h-6 text-white" />
                        )
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-500">Rule #{rule.rule_number}</span>
                        <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                        {rule.severity === 'major' && (
                          <Badge variant="danger" size="sm">Major</Badge>
                        )}
                        {hasViolations && (
                          <Badge variant="warning" size="sm">{violations} violation{violations > 1 ? 's' : ''}</Badge>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{rule.title}</h4>
                      <p className="text-sm text-gray-700 mb-2">{rule.description}</p>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mt-3">
                        <p className="text-sm text-blue-900">
                          <strong>Why:</strong> {rule.reason}
                        </p>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">CONSEQUENCES:</p>
                        <div className="space-y-1">
                          {rule.consequences.map((consequence, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="font-bold">#{idx + 1}:</span>
                              <span>{consequence.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {mockRuleViolations.length > 0 && (
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-red-600" />
              Violation History
            </h3>
            <div className="space-y-3">
              {mockRuleViolations.map(violation => (
                <div
                  key={violation.id}
                  className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="danger" size="sm">Rule #{violation.ruleNumber}</Badge>
                        <span className="text-sm text-gray-600">{format(new Date(violation.violationDate), 'MMM d, yyyy')}</span>
                        <Badge variant="warning" size="sm">Offense {violation.offenseCount}</Badge>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{violation.ruleTitle}</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Consequence:</strong> {violation.consequenceApplied}
                      </p>
                      {violation.notes && (
                        <p className="text-sm text-gray-600 italic">Note: {violation.notes}</p>
                      )}
                    </div>
                    <div>
                      {violation.consequenceCompleted ? (
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="sm">
                          <AlertTriangle className="w-3 h-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
