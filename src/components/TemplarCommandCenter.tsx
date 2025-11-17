import { useState, useEffect } from 'react';
import { AlertTriangle, Crown, Shield, Coins } from 'lucide-react';
import { templarQuotes, templarColors, templarShadows, templarIcons } from '../styles/templarTokens';
import EmergencyProtocol from './EmergencyProtocol';
import MilitaryDailyView from './MilitaryDailyView';
import TemplarChecklist from './TemplarChecklist';
import DAJobTracker from './DAJobTracker';
import CombatSchedule from './CombatSchedule';
import BusinessMetrics from './BusinessMetrics';
import CognitiveAnchor from './CognitiveAnchor';

export default function TemplarCommandCenter() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % templarQuotes.length);
    }, 30000);
    return () => clearInterval(quoteTimer);
  }, []);

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/hero_background_1.png)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${templarColors.background.primary}95 0%, ${templarColors.background.secondary}90 50%, ${templarColors.background.primary}95 100%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${templarColors.gold[900]} 2px,
            ${templarColors.gold[900]} 4px
          )`,
        }}
      />

      <div className="relative z-10">
        <header
          className="sticky top-0 z-40 backdrop-blur-md border-b-4"
          style={{
            background: `linear-gradient(90deg, ${templarColors.background.primary} 0%, ${templarColors.background.tertiary} 50%, ${templarColors.background.primary} 100%)`,
            borderColor: templarColors.gold[700],
            boxShadow: templarShadows.gold.glow,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div
                  className="relative w-14 h-14 rounded-lg flex items-center justify-center group"
                  style={{
                    background: templarColors.red.cross,
                    boxShadow: templarShadows.red.glow,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: templarColors.gold[500],
                      boxShadow: templarShadows.gold.intense,
                    }}
                  />
                  <span className="relative text-3xl">{templarIcons.cross}</span>
                </div>

                <div>
                  <h1
                    className="text-2xl font-bold tracking-[0.2em] uppercase"
                    style={{
                      color: templarColors.gold[500],
                      textShadow: templarShadows.gold.text,
                      fontFamily: 'Cinzel, serif',
                    }}
                  >
                    Templar Command
                  </h1>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: templarColors.gold[700] }}
                    >
                      Non Nobis Domine
                    </span>
                    <span style={{ color: templarColors.gold[800] }}>•</span>
                    <span
                      className="text-xs"
                      style={{ color: templarColors.stone.light }}
                    >
                      Est. MCXVIII
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEmergencyOpen(true)}
                className="relative group"
              >
                <div
                  className="absolute -inset-2 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"
                  style={{
                    background: templarColors.red.blood,
                    boxShadow: templarShadows.red.intense,
                  }}
                />
                <div
                  className="relative px-6 py-3 rounded-lg flex items-center gap-3 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${templarColors.red.blood} 0%, ${templarColors.red.cross} 100%)`,
                    border: `2px solid ${templarColors.gold[700]}`,
                  }}
                >
                  <img
                    src="/emergency_warning.png"
                    alt="Emergency"
                    className="w-6 h-6 animate-pulse"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))' }}
                  />
                  <span
                    className="font-bold text-sm tracking-wider"
                    style={{
                      color: templarColors.gold[400],
                      textShadow: templarShadows.gold.text,
                    }}
                  >
                    BREACH PROTOCOL
                  </span>
                </div>
              </button>
            </div>

            <div
              className="py-3 border-t-2"
              style={{
                borderColor: templarColors.gold[900],
                background: `linear-gradient(90deg, transparent 0%, ${templarColors.gold[900]}20 50%, transparent 100%)`,
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <Crown className="w-4 h-4" style={{ color: templarColors.gold[600] }} />
                <p
                  className="text-center text-sm italic"
                  style={{
                    color: templarColors.gold[600],
                    fontFamily: 'Crimson Text, serif',
                  }}
                >
                  "{templarQuotes[currentQuote]}"
                </p>
                <Crown className="w-4 h-4" style={{ color: templarColors.gold[600] }} />
              </div>
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
              <TemplarChecklist />
              <BusinessMetrics />
              <CognitiveAnchor />

              <div
                className="rounded-lg p-6 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${templarColors.background.tertiary} 0%, ${templarColors.background.secondary} 100%)`,
                  border: `2px solid ${templarColors.gold[800]}`,
                  boxShadow: templarShadows.depth.medium,
                }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-10"
                  style={{
                    background: `radial-gradient(circle, ${templarColors.gold[500]} 0%, transparent 70%)`,
                  }}
                />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5" style={{ color: templarColors.gold[500] }} />
                    <h3
                      className="text-lg font-bold uppercase tracking-wider"
                      style={{
                        color: templarColors.gold[500],
                        textShadow: templarShadows.gold.text,
                      }}
                    >
                      Treasury Records
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div
                      className="flex justify-between p-2 rounded"
                      style={{ background: templarColors.background.primary }}
                    >
                      <span style={{ color: templarColors.stone.light }}>Breach Protocols:</span>
                      <span
                        className="font-bold"
                        style={{ color: templarColors.red.crimson }}
                      >
                        {localStorage.getItem('emergency-protocol-count') || '0'}
                      </span>
                    </div>

                    <div
                      className="flex justify-between p-2 rounded"
                      style={{ background: templarColors.background.primary }}
                    >
                      <span style={{ color: templarColors.stone.light }}>Anchor Rituals:</span>
                      <span
                        className="font-bold"
                        style={{ color: templarColors.gold[500] }}
                      >
                        {localStorage.getItem('anchor-usage-count') || '0'}
                      </span>
                    </div>
                  </div>

                  <div
                    className="mt-4 p-3 rounded flex items-center gap-2"
                    style={{
                      background: `linear-gradient(90deg, ${templarColors.gold[900]}40 0%, transparent 100%)`,
                      border: `1px solid ${templarColors.gold[800]}`,
                    }}
                  >
                    <Coins className="w-4 h-4" style={{ color: templarColors.gold[600] }} />
                    <span
                      className="text-xs italic"
                      style={{ color: templarColors.gold[700] }}
                    >
                      "Time is the coin of nobility"
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <EmergencyProtocol
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />
    </div>
  );
}
