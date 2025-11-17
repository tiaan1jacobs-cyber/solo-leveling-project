import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { disciplineRulesData } from '../data/disciplineRules';
import { Shield, AlertTriangle, CheckCircle, XCircle, Award, Flame } from 'lucide-react';

interface DisciplineRule {
  id: string;
  rule_number: number;
  title: string;
  description: string;
  reason: string;
  category: string;
  severity: string;
}

interface Violation {
  id: string;
  rule_id: string;
  violation_date: string;
  offense_number: number;
  notes: string;
  consequence_completed: boolean;
}

interface Consequence {
  id: string;
  rule_id: string;
  offense_number: number;
  consequence_text: string;
  consequence_type: string;
}

export function DisciplineCode() {
  const [rules, setRules] = useState<DisciplineRule[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [consequences, setConsequences] = useState<Consequence[]>([]);
  const [selectedRule, setSelectedRule] = useState<DisciplineRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({ current: 0, longest: 0, total: 0 });
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: rulesData } = await supabase
      .from('discipline_rules')
      .select('*')
      .order('rule_number');

    if (!rulesData || rulesData.length === 0) {
      await seedRules();
      await loadData();
      return;
    }

    const { data: violationsData } = await supabase
      .from('rule_violations')
      .select('*')
      .order('violation_date', { ascending: false });

    const { data: consequencesData } = await supabase
      .from('consequences')
      .select('*');

    const { data: streakRecord } = await supabase
      .from('discipline_streaks')
      .select('*')
      .single();

    if (rulesData) setRules(rulesData);
    if (violationsData) setViolations(violationsData);
    if (consequencesData) setConsequences(consequencesData);
    if (streakRecord) {
      setStreakData({
        current: streakRecord.current_streak,
        longest: streakRecord.longest_streak,
        total: streakRecord.total_perfect_days
      });
    }

    setLoading(false);
  };

  const seedRules = async () => {
    for (const ruleData of disciplineRulesData) {
      const { data: rule } = await supabase
        .from('discipline_rules')
        .insert({
          rule_number: ruleData.rule_number,
          title: ruleData.title,
          description: ruleData.description,
          reason: ruleData.reason,
          category: ruleData.category,
          severity: ruleData.severity
        })
        .select()
        .single();

      if (rule) {
        for (const cons of ruleData.consequences) {
          await supabase
            .from('consequences')
            .insert({
              rule_id: rule.id,
              offense_number: cons.offense,
              consequence_text: cons.text,
              consequence_type: cons.type
            });
        }
      }
    }
  };

  const handleViolation = async (rule: DisciplineRule) => {
    const today = new Date().toISOString().split('T')[0];
    const recentViolations = violations.filter(v =>
      v.rule_id === rule.id &&
      new Date(v.violation_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    const offenseNumber = recentViolations.length + 1;

    const notes = prompt(`Why did you violate "${rule.title}"? (This helps identify triggers)`);
    if (notes === null) return;

    await supabase
      .from('rule_violations')
      .insert({
        rule_id: rule.id,
        violation_date: today,
        offense_number: Math.min(offenseNumber, 3),
        notes: notes || '',
        consequence_completed: false
      });

    const { data: streakRecord } = await supabase
      .from('discipline_streaks')
      .select('*')
      .single();

    if (streakRecord && streakRecord.current_streak > 0) {
      await supabase
        .from('discipline_streaks')
        .update({ current_streak: 0 })
        .eq('id', streakRecord.id);
    }

    await loadData();
    alert(`Violation recorded. Offense #${Math.min(offenseNumber, 3)}. Check your consequences and complete them immediately!`);
  };

  const markConsequenceComplete = async (violationId: string) => {
    await supabase
      .from('rule_violations')
      .update({
        consequence_completed: true,
        consequence_completed_at: new Date().toISOString()
      })
      .eq('id', violationId);

    await loadData();
  };

  const todayViolations = violations.filter(v =>
    v.violation_date === new Date().toISOString().split('T')[0]
  );

  const weekViolations = violations.filter(v =>
    new Date(v.violation_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  const categories = [
    { id: 'all', name: 'All Rules', color: 'gray' },
    { id: 'foundation', name: 'Foundation', color: 'blue' },
    { id: 'mental', name: 'Mental', color: 'purple' },
    { id: 'character', name: 'Character', color: 'green' },
    { id: 'excellence', name: 'Excellence', color: 'orange' }
  ];

  const filteredRules = categoryFilter === 'all'
    ? rules
    : rules.filter(r => r.category === categoryFilter);

  if (loading) {
    return <div className="text-center py-12">Loading discipline code...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Personal Discipline Code</h2>
            <p className="text-sm opacity-90">The 20 Sacred Rules of Transformation</p>
          </div>
        </div>
        <div className="text-sm italic opacity-90">
          "Discipline equals freedom. Every rule followed is a step toward greatness."
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-green-500" />
            <h3 className="font-bold text-gray-900">Perfect Days Streak</h3>
          </div>
          <div className="text-4xl font-bold text-green-500">{streakData.current}</div>
          <p className="text-sm text-gray-600 mt-1">Longest: {streakData.longest} days</p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-6 h-6 text-blue-500" />
            <h3 className="font-bold text-gray-900">Total Perfect Days</h3>
          </div>
          <div className="text-4xl font-bold text-blue-500">{streakData.total}</div>
          <p className="text-sm text-gray-600 mt-1">Lifetime achievement</p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="font-bold text-gray-900">This Week</h3>
          </div>
          <div className="text-4xl font-bold text-red-500">{weekViolations.length}</div>
          <p className="text-sm text-gray-600 mt-1">violations recorded</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              categoryFilter === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {todayViolations.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
          <h3 className="font-bold text-red-900 mb-2">Today's Violations - Complete Consequences!</h3>
          <div className="space-y-2">
            {todayViolations.map(violation => {
              const rule = rules.find(r => r.id === violation.rule_id);
              const consequence = consequences.find(c =>
                c.rule_id === violation.rule_id &&
                c.offense_number === violation.offense_number
              );

              return (
                <div key={violation.id} className="bg-white p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Rule #{rule?.rule_number}: {rule?.title}</p>
                      <p className="text-sm text-red-600 mt-1">
                        <strong>Consequence (Offense #{violation.offense_number}):</strong> {consequence?.consequence_text}
                      </p>
                      {violation.notes && (
                        <p className="text-sm text-gray-600 mt-1">Notes: {violation.notes}</p>
                      )}
                    </div>
                    {!violation.consequence_completed && (
                      <button
                        onClick={() => markConsequenceComplete(violation.id)}
                        className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold"
                      >
                        Mark Complete
                      </button>
                    )}
                    {violation.consequence_completed && (
                      <CheckCircle className="w-6 h-6 text-green-500 ml-4" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredRules.map(rule => {
          const ruleViolations = violations.filter(v => v.rule_id === rule.id);
          const recentViolations = ruleViolations.filter(v =>
            new Date(v.violation_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          );
          const todayViolation = todayViolations.find(v => v.rule_id === rule.id);

          const getCategoryColor = (category: string) => {
            switch(category) {
              case 'foundation': return 'blue';
              case 'mental': return 'purple';
              case 'character': return 'green';
              case 'excellence': return 'orange';
              default: return 'gray';
            }
          };

          const color = getCategoryColor(rule.category);

          return (
            <div
              key={rule.id}
              className={`bg-white border-2 rounded-xl p-5 ${
                todayViolation ? 'border-red-400 bg-red-50' : `border-${color}-200`
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-2xl font-bold text-${color}-600`}>
                      #{rule.rule_number}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900">{rule.title}</h3>
                    {rule.severity === 'major' && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
                        MAJOR
                      </span>
                    )}
                    <span className={`bg-${color}-100 text-${color}-700 text-xs px-2 py-1 rounded-full font-semibold`}>
                      {rule.category}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-2">{rule.description}</p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Why:</strong> {rule.reason}
                  </p>

                  {recentViolations.length > 0 && (
                    <div className="text-sm text-orange-600 font-semibold">
                      ⚠️ {recentViolations.length} violation(s) in past 30 days
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedRule(rule)}
                  className="ml-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold"
                >
                  View Details
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleViolation(rule)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold"
                >
                  <XCircle className="w-4 h-4" />
                  Report Violation
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRule && (
        <RuleDetailModal
          rule={selectedRule}
          consequences={consequences.filter(c => c.rule_id === selectedRule.id)}
          violations={violations.filter(v => v.rule_id === selectedRule.id)}
          onClose={() => setSelectedRule(null)}
        />
      )}
    </div>
  );
}

function RuleDetailModal({ rule, consequences, violations, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Rule #{rule.rule_number}</h2>
              <h3 className="text-xl font-semibold text-gray-700 mt-1">{rule.title}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700">{rule.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Why This Rule Exists</h4>
            <p className="text-gray-700">{rule.reason}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Consequences by Offense</h4>
            <div className="space-y-3">
              {consequences.map((cons: any) => (
                <div key={cons.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-semibold text-gray-900 mb-1">
                    {cons.offense_number === 1 ? '1st' : cons.offense_number === 2 ? '2nd' : '3rd'} Offense
                  </div>
                  <p className="text-gray-700">{cons.consequence_text}</p>
                  <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {cons.consequence_type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {violations.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Violation History</h4>
              <div className="space-y-2">
                {violations.slice(0, 5).map((v: any) => (
                  <div key={v.id} className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(v.violation_date).toLocaleDateString()}
                        </p>
                        {v.notes && <p className="text-sm text-gray-600 mt-1">{v.notes}</p>}
                      </div>
                      {v.consequence_completed && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
