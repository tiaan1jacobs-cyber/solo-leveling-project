import { useState, useEffect } from 'react';
import { AlertTriangle, Menu, X } from 'lucide-react';
import { accountability } from '../styles/militaryTokens';
import EmergencyProtocol from './EmergencyProtocol';
import MilitaryDailyView from './MilitaryDailyView';
import MilitaryChecklist from './MilitaryChecklist';
import DAJobTracker from './DAJobTracker';
import CombatSchedule from './CombatSchedule';
import BusinessMetrics from './BusinessMetrics';
import CognitiveAnchor from './CognitiveAnchor';

export default function MilitaryCommandCenter() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % accountability.quotes.length);
    }, 30000);
    return () => clearInterval(quoteTimer);
  }, []);

  useEffect(() => {
    const emergencyCount = parseInt(localStorage.getItem('emergency-protocol-count') || '0');

    const handleEmergencyOpen = () => {
      const newCount = emergencyCount + 1;
      localStorage.setItem('emergency-protocol-count', newCount.toString());
    };

    if (emergencyOpen) {
      handleEmergencyOpen();
    }
  }, [emergencyOpen]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-black via-red-950/20 to-black border-b-2 border-red-900 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white hover:text-red-500 transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">⚔</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider">COMMAND CENTER</h1>
                <div className="text-xs text-gray-500 uppercase">Military Discipline System</div>
              </div>
            </div>

            <button
              onClick={() => setEmergencyOpen(true)}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-red-600 rounded-lg blur opacity-75 group-hover:opacity-100 animate-pulse"></div>
              <div className="relative px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 transition-colors">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm">EMERGENCY - READ NOW</span>
              </div>
            </button>
          </div>

          <div className="py-2 border-t border-red-900/50">
            <p className="text-center text-gray-400 text-sm italic animate-pulse">
              "{accountability.quotes[currentQuote]}"
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MilitaryDailyView />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DAJobTracker />
              <CombatSchedule />
            </div>
          </div>

          <div className="space-y-6">
            <MilitaryChecklist />
            <BusinessMetrics />
            <CognitiveAnchor />

            <div className="bg-black border-2 border-red-900 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">QUICK STATS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Emergency Opens:</span>
                  <span className="text-red-500 font-bold">
                    {localStorage.getItem('emergency-protocol-count') || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Anchor Used:</span>
                  <span className="text-blue-500 font-bold">
                    {localStorage.getItem('anchor-usage-count') || '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <EmergencyProtocol
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />
    </div>
  );
}
