import { useState } from 'react';
import { Shield, Flame, Sword, ChevronDown, ChevronRight, AlertTriangle, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';

interface Commandment {
  id: number;
  title: string;
  category: string;
  severity: 'critical' | 'high' | 'medium';
}

const commandments: Commandment[] = [
  { id: 1, title: 'ZERO PORNOGRAPHY', category: 'Mental Discipline', severity: 'critical' },
  { id: 2, title: 'WAKE AT 6:30 AM - NO SNOOZE', category: 'Daily Discipline', severity: 'critical' },
  { id: 3, title: 'COLD WATER DAILY', category: 'Physical Toughness', severity: 'high' },
  { id: 4, title: 'TENNIS - NO EXCEPTIONS', category: 'Athletic Training', severity: 'critical' },
  { id: 5, title: 'COMBAT TRAINING - 6 DAYS PER WEEK', category: 'Combat Mastery', severity: 'critical' },
  { id: 6, title: 'DA JOB PRODUCTIVITY', category: 'Business Warfare', severity: 'high' },
  { id: 7, title: 'BUSINESS WORK DAILY', category: 'Business Warfare', severity: 'critical' },
  { id: 8, title: 'NO SCROLLING / NO DISTRACTIONS', category: 'Mental Discipline', severity: 'high' },
  { id: 9, title: 'EVENING REFLECTION MANDATORY', category: 'Self Mastery', severity: 'medium' },
  { id: 10, title: 'MIDNIGHT BEDTIME - NO EXCUSES', category: 'Recovery Protocol', severity: 'high' },
];

const severityColors = {
  critical: 'border-red-500 bg-red-50',
  high: 'border-orange-500 bg-orange-50',
  medium: 'border-yellow-500 bg-yellow-50'
};

const severityBadges = {
  critical: 'danger',
  high: 'warning',
  medium: 'neutral'
} as const;

export function CommandmentsView() {
  const [expandedCommandment, setExpandedCommandment] = useState<number | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleCommandment = (id: number) => {
    setExpandedCommandment(expandedCommandment === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
            <Shield className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-1">THE 10 COMMANDMENTS</h2>
            <p className="text-sm opacity-90">Non-Negotiable Rules for Discipline & Dominance</p>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="border-2 border-red-500 bg-red-50">
        <CardBody>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-red-600 mb-2">BRUTAL HONESTY WARNING</h3>
              <p className="text-sm text-red-800">
                These commandments contain harsh language and brutal truth. They are designed to break through
                excuses and force accountability. If you can't handle direct, unfiltered reality, this isn't for you.
                These rules separate warriors from civilians.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
          <CardBody>
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-red-600 font-medium">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {commandments.filter(c => c.severity === 'critical').length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
          <CardBody>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-orange-600 font-medium">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">
                  {commandments.filter(c => c.severity === 'high').length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
          <CardBody>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Rules</p>
                <p className="text-2xl font-bold text-blue-600">{commandments.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Commandments List */}
      <div className="space-y-3">
        {commandments.map((commandment) => (
          <Card
            key={commandment.id}
            className={`border-2 ${severityColors[commandment.severity]} transition-all hover:shadow-md cursor-pointer`}
            onClick={() => toggleCommandment(commandment.id)}
          >
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold">
                      {commandment.id}
                    </div>
                    <Badge variant={severityBadges[commandment.severity]} size="sm">
                      {commandment.category}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {commandment.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-blue-600 mb-1">{commandment.title}</h3>

                  {expandedCommandment === commandment.id && (
                    <div className="mt-4 space-y-4">
                      <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
                        <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                          <Flame className="w-5 h-5" />
                          HARSH REALITY
                        </h4>
                        <p className="text-sm text-red-800 mb-3">
                          Full brutal truth and context available in your detailed rules files. This commandment
                          is non-negotiable. Violation results in immediate penalties and loss of progress.
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFullContent(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                        >
                          <BookOpen className="w-4 h-4" />
                          View Complete Rules
                        </button>
                      </div>

                      <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
                        <h4 className="font-bold text-orange-600 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          VIOLATION CONSEQUENCES
                        </h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Immediate penalty exercises</li>
                          <li>• Loss of progress/XP</li>
                          <li>• Accountability measures</li>
                          <li>• Extended discipline requirements</li>
                          <li>• Detailed penalties in complete rules document</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                        <h4 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
                          <Sword className="w-5 h-5" />
                          WARRIOR'S CHOICE
                        </h4>
                        <p className="text-sm text-blue-800 font-medium">
                          You're either a warrior who controls his impulses, or a civilian controlled by them.
                          There is no in-between. Choose greatness or choose mediocrity. The choice is yours
                          every single day.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {expandedCommandment === commandment.id ? (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Bottom Info */}
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border-2 border-gray-700">
        <CardBody>
          <div className="space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-400" />
              COMPLETE RULES AVAILABLE
            </h3>
            <p className="text-sm text-gray-300">
              The full harsh version with complete context, brutal truths, and detailed violation penalties
              is available in your files:
            </p>
            <ul className="text-sm text-gray-400 space-y-1 ml-4">
              <li>• ALL_RULES_NUCLEAR_COMPLETE.txt</li>
              <li>• COMPLETE_RULES_AND_BRUTAL_REALITY.txt</li>
              <li>• INTEGRATION_GUIDE_RULES_AND_MOTIVATION.txt</li>
            </ul>
            <p className="text-sm text-red-300 font-medium mt-4">
              These commandments are your foundation. Break them and you break yourself. Keep them and you
              become unstoppable.
            </p>
            <button
              onClick={() => setShowFullContent(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all font-bold text-sm shadow-lg hover:shadow-xl mt-4"
            >
              <BookOpen className="w-5 h-5" />
              Read Full Rules Now
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Full Content Modal */}
      {showFullContent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-2 border-red-500 shadow-2xl">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-white" />
                <div>
                  <h2 className="text-2xl font-bold text-white">THE 10 COMMANDMENTS</h2>
                  <p className="text-sm text-white/80">Complete Nuclear Version - All Rules</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullContent(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <span className="text-white text-2xl font-bold">×</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-white">
              <div className="space-y-8">
                <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                  <p className="text-red-300 font-bold text-sm">
                    ⚠️ WARNING: This content contains harsh language and brutal truth. It's designed to break through excuses.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg">1</span>
                      COMMANDMENT 1: ZERO PORNOGRAPHY
                    </h3>
                    <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                      <p className="font-bold text-red-400">FULL HARSH REALITY:</p>
                      <p>You cannot build an empire with a brain that's been fried by pornography. Every single time you click, you're choosing to be weak. Your competition doesn't waste time on this - they're out there building businesses, training their bodies, developing skills, becoming DANGEROUS while you're draining yourself to pixels.</p>

                      <p className="font-bold text-orange-400 mt-4">THE BRUTAL TRUTH:</p>
                      <p>Your brain is DAMAGED. Your dopamine receptors are fried. Your reward system is hijacked. You need escalation just to feel ANYTHING. This is literal neurological damage you're choosing every single day.</p>

                      <p className="font-bold text-yellow-400 mt-4">VIOLATION PENALTY:</p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>STREAK RESET TO DAY 0</li>
                        <li>200 BURPEES IMMEDIATELY</li>
                        <li>1,000 WORD ESSAY on why you chose weakness</li>
                        <li>PUBLIC ACCOUNTABILITY</li>
                        <li>LOSE ALL BUSINESS WARRIOR XP FOR THE WEEK</li>
                        <li>NO PHONE FOR 3 DAYS</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg">2</span>
                      COMMANDMENT 2: WAKE AT 6:30 AM - NO SNOOZE
                    </h3>
                    <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                      <p className="font-bold text-red-400">FULL HARSH REALITY:</p>
                      <p>The snooze button is for weak men. Every single time you hit that button, you're training yourself to break promises to yourself. Every negotiation with yourself in the morning is practice for negotiating with yourself all day long.</p>

                      <p className="font-bold text-orange-400 mt-4">THE BRUTAL TRUTH:</p>
                      <p>The first decision of your day sets the tone for every decision after. You just decided to be weak. You just proved your word means nothing.</p>

                      <p className="font-bold text-yellow-400 mt-4">VIOLATION PENALTY:</p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>50 BURPEES THE SECOND YOU GET UP</li>
                        <li>NO BREAKFAST UNTIL BURPEES ARE DONE</li>
                        <li>LOSE MENTAL FORTRESS XP FOR THE DAY</li>
                        <li>TOMORROW YOU WAKE AT 6:00 AM (30 min earlier)</li>
                        <li>NO CAFFEINE FOR 3 HOURS</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg">3</span>
                      COMMANDMENT 3: COLD WATER DAILY
                    </h3>
                    <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                      <p className="font-bold text-red-400">FULL HARSH REALITY:</p>
                      <p>Three minutes of cold water. That's it. Warriors embrace discomfort. Civilians avoid it. It's that simple. You can't handle 3 minutes of cold water? How do you expect to handle building a business? Fighting? Competing? Winning?</p>

                      <p className="font-bold text-yellow-400 mt-4">VIOLATION PENALTY:</p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>NO HOT WATER FOR 3 DAYS - COLD ONLY</li>
                        <li>100 BURPEES IMMEDIATELY</li>
                        <li>LOSE MENTAL FORTRESS XP</li>
                        <li>5-MINUTE COLD SHOWER TOMORROW</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <p className="text-center text-gray-400 italic">
                      [View complete files for all 10 commandments with full details, penalties, and harsh reality checks]
                    </p>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-500">Files contain complete versions:</p>
                      <ul className="text-xs text-gray-600 ml-4">
                        <li>• ALL_RULES_NUCLEAR_COMPLETE.txt</li>
                        <li>• COMPLETE_RULES_AND_BRUTAL_REALITY.txt</li>
                        <li>• INTEGRATION_GUIDE_RULES_AND_MOTIVATION.txt</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
