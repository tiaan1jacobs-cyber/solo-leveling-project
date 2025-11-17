import { useState } from 'react';
import { motion } from 'framer-motion';
import { Resource } from '../types';
import { ExternalLink, Search, BookOpen, Dumbbell, Briefcase, GraduationCap, Heart } from 'lucide-react';
import { soloLevelingTheme } from '../styles/soloLevelingTokens';

interface ResourceLibraryProps {
  resources: Resource[];
}

export function ResourceLibrary({ resources }: ResourceLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen, color: 'gray' },
    { id: 'meditation', name: 'Meditation', icon: Heart, color: 'purple' },
    { id: 'training', name: 'Training', icon: Dumbbell, color: 'red' },
    { id: 'business', name: 'Business', icon: Briefcase, color: 'blue' },
    { id: 'academic', name: 'Academic', icon: GraduationCap, color: 'yellow' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{
          background: soloLevelingTheme.gradient.card,
          border: `2px solid ${soloLevelingTheme.border.purple}`,
          boxShadow: soloLevelingTheme.shadow.purpleGlow,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">Resource Library</h2>
          </div>
          <p className="text-slate-400">Video tutorials and guides for every activity</p>
        </div>
      </div>

      <div
        className="rounded-xl p-4"
        style={{
          background: soloLevelingTheme.background.card,
          border: `1px solid ${soloLevelingTheme.border.default}`,
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-slate-500"
            style={{
              background: soloLevelingTheme.background.secondary,
              border: `1px solid ${soloLevelingTheme.border.default}`,
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          const categoryColors = {
            all: soloLevelingTheme.glow.primary,
            meditation: soloLevelingTheme.glow.secondary,
            training: soloLevelingTheme.stats.strength,
            business: soloLevelingTheme.stats.luck,
            academic: soloLevelingTheme.stats.wisdom,
          };
          const color = categoryColors[category.id as keyof typeof categoryColors] || soloLevelingTheme.glow.primary;

          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
              style={{
                background: isSelected ? `${color}30` : soloLevelingTheme.background.card,
                border: `1px solid ${isSelected ? color : soloLevelingTheme.border.default}`,
                color: isSelected ? color : soloLevelingTheme.text.secondary,
                boxShadow: isSelected ? `0 0 15px ${color}40` : 'none',
              }}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No resources found matching your criteria</p>
          </div>
        ) : (
          filteredResources.map((resource, index) => {
            const categoryColors: { [key: string]: string } = {
              meditation: soloLevelingTheme.glow.secondary,
              training: soloLevelingTheme.stats.strength,
              business: soloLevelingTheme.stats.luck,
              academic: soloLevelingTheme.stats.wisdom
            };
            const color = categoryColors[resource.category] || soloLevelingTheme.glow.primary;

            return (
              <motion.a
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl p-5 transition-all group"
                style={{
                  background: soloLevelingTheme.background.card,
                  border: `1px solid ${color}40`,
                  boxShadow: soloLevelingTheme.shadow.card,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{
                      background: `${color}20`,
                      border: `1px solid ${color}40`,
                    }}
                  >
                    <ExternalLink className="w-6 h-6" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white transition-colors mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">{resource.description}</p>
                    <span
                      className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                      style={{
                        background: `${color}20`,
                        color,
                      }}
                    >
                      {resource.category}
                    </span>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-white flex-shrink-0 transition-colors" />
                </div>
              </motion.a>
            );
          })
        )}
      </div>
    </div>
  );
}
