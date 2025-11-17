import { useMemo } from 'react';
import { TimeBlock } from '../types';
import { Award, TrendingUp, Target, Flame } from 'lucide-react';

interface ProgressDashboardProps {
  blocks: TimeBlock[];
  completedBlocks: Set<string>;
  streak: number;
}

interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  color: string;
}

export function ProgressDashboard({ blocks, completedBlocks, streak }: ProgressDashboardProps) {
  const categoryScores = useMemo(() => {
    const categories: { [key: string]: { completed: number; total: number; color: string } } = {
      academic: { completed: 0, total: 0, color: '#F59E0B' },
      training: { completed: 0, total: 0, color: '#EF4444' },
      business: { completed: 0, total: 0, color: '#3B82F6' },
      meditation: { completed: 0, total: 0, color: '#8B5CF6' },
      personal: { completed: 0, total: 0, color: '#EC4899' },
      health: { completed: 0, total: 0, color: '#10B981' }
    };

    blocks.forEach(block => {
      const category = block.activityType;
      if (categories[category]) {
        categories[category].total++;
        if (completedBlocks.has(block.id)) {
          categories[category].completed++;
        }
      }
    });

    const scores: CategoryScore[] = [
      {
        name: 'Academic Excellence',
        score: Math.round((categories.academic.completed / Math.max(categories.academic.total, 1)) * 50),
        maxScore: 50,
        color: categories.academic.color
      },
      {
        name: 'Athletic Performance',
        score: Math.round((categories.training.completed / Math.max(categories.training.total, 1)) * 50),
        maxScore: 50,
        color: categories.training.color
      },
      {
        name: 'AI Business Progress',
        score: Math.round((categories.business.completed / Math.max(categories.business.total, 1)) * 50),
        maxScore: 50,
        color: categories.business.color
      },
      {
        name: 'Physical Training',
        score: Math.round(((categories.health.completed + categories.training.completed) / Math.max(categories.health.total + categories.training.total, 1)) * 50),
        maxScore: 50,
        color: categories.health.color
      },
      {
        name: 'Personal Development',
        score: Math.round(((categories.meditation.completed + categories.personal.completed) / Math.max(categories.meditation.total + categories.personal.total, 1)) * 50),
        maxScore: 50,
        color: categories.meditation.color
      },
      {
        name: 'Discipline Habits',
        score: Math.round((completedBlocks.size / Math.max(blocks.length, 1)) * 50),
        maxScore: 50,
        color: '#6366F1'
      }
    ];

    return scores;
  }, [blocks, completedBlocks]);

  const totalScore = categoryScores.reduce((sum, cat) => sum + cat.score, 0);
  const maxTotalScore = 300;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Weekly Scorecard</h2>
            <p className="text-sm opacity-90">Track your progress across all areas</p>
          </div>
        </div>
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">{totalScore}</div>
          <div className="text-xl opacity-90">out of {maxTotalScore} points</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900">Current Streak</h3>
          </div>
          <div className="text-4xl font-bold text-orange-500">{streak} days</div>
          <p className="text-sm text-gray-600 mt-1">Keep the momentum going!</p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-bold text-gray-900">Today's Target</h3>
          </div>
          <div className="text-4xl font-bold text-green-500">
            {Math.round((completedBlocks.size / Math.max(blocks.length, 1)) * 100)}%
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {completedBlocks.size} of {blocks.length} completed
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Category Breakdown
        </h3>
        <div className="space-y-4">
          {categoryScores.map((category) => (
            <div key={category.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
                <span className="text-sm font-bold" style={{ color: category.color }}>
                  {category.score}/{category.maxScore}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(category.score / category.maxScore) * 100}%`,
                    backgroundColor: category.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
