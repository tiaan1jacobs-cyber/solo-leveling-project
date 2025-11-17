import { useState } from 'react';
import { RefreshCw, Wind } from 'lucide-react';

export default function CognitiveAnchor() {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);
  const [usageCount, setUsageCount] = useState(() => {
    return parseInt(localStorage.getItem('anchor-usage-count') || '0');
  });

  const protocol = [
    { text: 'Inhale through nose', duration: 4000, icon: Wind },
    { text: 'Hold breath', duration: 4000, icon: Wind },
    { text: 'Exhale through mouth', duration: 6000, icon: Wind },
    { text: 'Posture reset: shoulders open', duration: 3000, icon: RefreshCw },
    { text: 'This is data, not injury', duration: 3000, icon: RefreshCw },
    { text: 'Information received. Processing complete.', duration: 3000, icon: RefreshCw },
    { text: 'Resume mission.', duration: 2000, icon: RefreshCw },
  ];

  const startProtocol = () => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('anchor-usage-count', newCount.toString());

    setIsActive(true);
    setStep(0);

    let currentStep = 0;
    const runStep = () => {
      if (currentStep < protocol.length) {
        setStep(currentStep);
        setTimeout(() => {
          currentStep++;
          runStep();
        }, protocol[currentStep].duration);
      } else {
        setIsActive(false);
      }
    };
    runStep();
  };

  if (isActive) {
    const current = protocol[step];
    const Icon = current.icon;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        style={{
          backgroundImage: 'url(/mental_discipline.png)',
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
        <div className="relative z-10 max-w-2xl w-full mx-4 p-12 bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-red-600 rounded-lg text-center backdrop-blur-md">
          <div className="mb-8">
            <Icon className="w-24 h-24 text-red-500 mx-auto animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            {current.text}
          </h2>
          <div className="flex justify-center gap-2 mt-8">
            {protocol.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === step ? 'bg-red-500' : i < step ? 'bg-green-500' : 'bg-gray-700'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={startProtocol}
      className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white font-bold py-4 px-6 rounded-lg transition-all border-2 border-red-600 shadow-lg hover:shadow-red-900/50"
    >
      <div className="flex items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6" />
        <span className="text-lg tracking-wider">UPDATE: DATA RECEIVED</span>
      </div>
      {usageCount > 0 && (
        <div className="text-sm text-red-300 mt-1">
          Used {usageCount} times
        </div>
      )}
    </button>
  );
}
