import { ScheduleTemplate } from '../types';
import { Calendar, Zap, Target } from 'lucide-react';

interface TemplateSelectorProps {
  templates: ScheduleTemplate[];
  activeTemplateId: string;
  onTemplateChange: (templateId: string) => void;
}

export function TemplateSelector({ templates, activeTemplateId, onTemplateChange }: TemplateSelectorProps) {
  const getTemplateIcon = (dayType: string) => {
    switch (dayType) {
      case 'development':
        return Zap;
      case 'class':
        return Calendar;
      case 'intensive':
        return Target;
      default:
        return Calendar;
    }
  };

  const getTemplateImage = (dayType: string) => {
    switch (dayType) {
      case 'development':
        return 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800';
      case 'class':
        return 'https://images.pexels.com/photos/267586/pexels-photo-267586.jpeg?auto=compress&cs=tinysrgb&w=800';
      case 'intensive':
        return 'https://images.pexels.com/photos/4753928/pexels-photo-4753928.jpeg?auto=compress&cs=tinysrgb&w=800';
      default:
        return '';
    }
  };

  const getTemplateGradient = (dayType: string) => {
    switch (dayType) {
      case 'development':
        return 'from-blue-600 to-cyan-500';
      case 'class':
        return 'from-green-600 to-emerald-500';
      case 'intensive':
        return 'from-red-600 to-orange-500';
      default:
        return 'from-gray-600 to-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map((template) => {
        const Icon = getTemplateIcon(template.dayType);
        const gradient = getTemplateGradient(template.dayType);
        const image = getTemplateImage(template.dayType);
        const isActive = activeTemplateId === template.id;

        return (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
              isActive
                ? 'ring-4 ring-offset-2 ring-blue-500 shadow-2xl scale-105'
                : 'hover:shadow-xl hover:scale-102 shadow-md'
            }`}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={image}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 mix-blend-multiply`} />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full mb-3 inline-block">
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="font-bold text-2xl mb-2 drop-shadow-lg">
                    {template.name}
                  </h3>
                  <p className="text-sm opacity-90 px-4 drop-shadow">
                    {template.description}
                  </p>
                </div>
              </div>

              {isActive && (
                <div className="absolute top-4 right-4">
                  <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    ✓ ACTIVE
                  </div>
                </div>
              )}
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform transition-transform ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`} />
          </button>
        );
      })}
    </div>
  );
}
