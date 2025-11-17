import { useState } from 'react';
import { Shield, Award, Zap, Target, Heart, Brain, Users, Trophy, CheckCircle } from 'lucide-react';

export function RulesManifesto() {
  const [signedName, setSignedName] = useState('');
  const [signedDate, setSignedDate] = useState('');
  const [showSignature, setShowSignature] = useState(false);

  const handleSign = () => {
    if (signedName && signedDate) {
      localStorage.setItem('disciplineCodeSigned', JSON.stringify({ name: signedName, date: signedDate }));
      alert('Discipline Code Signed! You are now committed to excellence.');
      setShowSignature(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 opacity-90" />
        <img
          src="https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Warrior"
          className="w-full h-64 object-cover mix-blend-overlay"
        />
        <div className="relative p-8 text-white text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            PERSONAL DISCIPLINE CODE
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            The Non-Negotiable Laws of Your Transformation
          </h2>
          <p className="text-lg italic opacity-90 max-w-2xl mx-auto">
            "Discipline equals freedom. Every rule followed is a step toward greatness."
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-orange-600" />
          The 20 Sacred Rules
        </h3>
        <p className="text-gray-700 leading-relaxed">
          These rules are not restrictions—they are the foundation of your freedom. Every rule followed is a vote
          for the extraordinary person you are becoming. Each violation has immediate consequences to build discipline
          and maintain accountability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RuleCategory
          icon={Shield}
          title="Foundation Rules (1-5)"
          color="blue"
          description="Wake-up discipline, workout commitment, clean eating, no pornography, no doomscrolling"
        />
        <RuleCategory
          icon={Brain}
          title="Mental Rules (6-10)"
          color="purple"
          description="No excuses, business discipline, positive mindset, sleep schedule, meditation practice"
        />
        <RuleCategory
          icon={Users}
          title="Character Rules (11-15)"
          color="green"
          description="No substances, focused work, academic excellence, positive communication, financial discipline"
        />
        <RuleCategory
          icon={Trophy}
          title="Excellence Rules (16-20)"
          color="orange"
          description="No quitting, complete integrity, high-value content, schedule respect, excellence standard"
        />
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-red-600" />
          Consequence Escalation System
        </h3>

        <div className="space-y-4">
          <ConsequenceLevel
            title="Strike System"
            items={[
              "3 Minor Violations in One Week → Major consequence + weekend intensive",
              "5 Minor Violations in One Week → Complete schedule reset + mentor meeting",
              "1 Major Violation → Immediate major consequence + prevention planning",
              "2 Major Violations in One Month → Complete life audit + accountability partner",
              "3 Major Violations in One Month → Program restart + professional help"
            ]}
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Immediate Enforcement Protocol
        </h3>
        <p className="mb-4 font-semibold">When you violate a rule:</p>
        <ol className="space-y-2 list-decimal list-inside">
          <li><strong>STOP</strong> the violation immediately</li>
          <li><strong>ACKNOWLEDGE</strong> what you did wrong out loud</li>
          <li><strong>IMPLEMENT</strong> the consequence immediately (no delays)</li>
          <li><strong>DOCUMENT</strong> the violation and consequence in your journal</li>
          <li><strong>ANALYZE</strong> why it happened and create prevention strategy</li>
          <li><strong>RECOMMIT</strong> to the standard with renewed intensity</li>
        </ol>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-green-600" />
          Positive Reinforcement System
        </h3>
        <div className="space-y-3">
          <RewardLevel days="7 Days Perfect" reward="Favorite healthy meal + entertainment of choice" />
          <RewardLevel days="14 Days Perfect" reward="Special purchase or experience (under $100)" />
          <RewardLevel days="30 Days Perfect" reward="Significant reward or celebration (under $300)" />
          <RewardLevel days="90 Days Perfect" reward="Major milestone celebration + upgraded goal setting" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Warrior Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            The Warrior's Creed
          </h3>
          <div className="space-y-4 text-lg italic leading-relaxed">
            <p>
              "I am building an extraordinary life through extraordinary discipline. Every rule I follow makes me stronger.
              Every consequence I accept makes me wiser. Every day I execute flawlessly brings me closer to greatness.
            </p>
            <p>
              I do not make excuses. I do not accept mediocrity. I do not quit.
            </p>
            <p>
              I am becoming the person my future self will thank me for being.
            </p>
            <p className="font-bold text-xl">
              This is my code. This is my way. This is my path to excellence."
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-blue-600" />
          Daily Rule Review Checklist
        </h3>
        <p className="text-gray-700 mb-4 font-semibold">Evening Reflection Questions:</p>
        <div className="space-y-2">
          <ChecklistItem text="Did I follow all 20 rules today?" />
          <ChecklistItem text="Which rules were most challenging?" />
          <ChecklistItem text="What violations occurred and were consequences implemented?" />
          <ChecklistItem text="How can I strengthen my discipline tomorrow?" />
          <ChecklistItem text="What triggers led to any violations?" />
          <ChecklistItem text="Am I becoming the person I want to be?" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">🔥 Implementation Schedule</h3>
        <div className="space-y-4">
          <ImplementationWeek
            week="Week 1"
            title="Foundation Rules (1-5)"
            focus="Wake-up, workouts, diet, no porn, no doomscrolling"
          />
          <ImplementationWeek
            week="Week 2"
            title="Add Mental Rules (6-10)"
            focus="No excuses, business discipline, positive mindset, sleep, meditation"
          />
          <ImplementationWeek
            week="Week 3"
            title="Add Character Rules (11-15)"
            focus="No substances, focus, academics, positive communication, financial discipline"
          />
          <ImplementationWeek
            week="Week 4"
            title="Add Excellence Rules (16-20)"
            focus="No quitting, integrity, high-value content, schedule respect, excellence standard"
          />
          <ImplementationWeek
            week="Week 5+"
            title="Full Implementation"
            focus="All 20 rules active with full consequence system"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-xl border-4 border-red-600">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          📝 Sign Your Commitment
        </h3>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <p className="text-gray-800 italic leading-relaxed">
            "I commit to following this discipline code with unwavering dedication. I understand that greatness
            requires sacrifice and discipline. I choose excellence over comfort, growth over stagnation, and
            strength over weakness."
          </p>
        </div>

        {!showSignature ? (
          <button
            onClick={() => setShowSignature(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
          >
            Sign the Discipline Code
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name (Signature)
              </label>
              <input
                type="text"
                value={signedName}
                onChange={(e) => setSignedName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={signedDate}
                onChange={(e) => setSignedDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSign}
                disabled={!signedName || !signedDate}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                I Commit to Excellence
              </button>
              <button
                onClick={() => setShowSignature(false)}
                className="px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RuleCategory({ icon: Icon, title, color, description }: any) {
  const colorMap: any = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
      <div className={`inline-block p-3 rounded-lg bg-gradient-to-r ${colorMap[color]} mb-4`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function ConsequenceLevel({ title, items }: any) {
  return (
    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
      <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
      <ul className="space-y-1 text-sm text-gray-700">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-red-600 font-bold">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RewardLevel({ days, reward }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-300">
      <Award className="w-8 h-8 text-green-600 flex-shrink-0" />
      <div>
        <div className="font-bold text-gray-900">{days}</div>
        <div className="text-sm text-gray-600">{reward}</div>
      </div>
    </div>
  );
}

function ChecklistItem({ text }: any) {
  return (
    <div className="flex items-start gap-2 text-gray-700">
      <span className="text-blue-600 font-bold mt-1">☐</span>
      <span>{text}</span>
    </div>
  );
}

function ImplementationWeek({ week, title, focus }: any) {
  return (
    <div className="bg-white p-4 rounded-lg border border-yellow-300">
      <div className="font-bold text-gray-900 mb-1">
        {week}: {title}
      </div>
      <div className="text-sm text-gray-600">Focus on: {focus}</div>
    </div>
  );
}
