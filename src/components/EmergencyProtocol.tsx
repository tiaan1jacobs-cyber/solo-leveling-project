import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { militaryColors } from '../styles/militaryTokens';

interface EmergencyProtocolProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyProtocol({ isOpen, onClose }: EmergencyProtocolProps) {
  const [countdown, setCountdown] = useState(60);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(60);
      setCanClose(false);

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="max-w-4xl w-full mx-4 p-8 bg-gradient-to-br from-red-950/50 to-black border-2 border-red-600 rounded-lg shadow-2xl relative">
        <button
          onClick={handleClose}
          disabled={!canClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
            canClose
              ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
          title={canClose ? 'Close' : `Wait ${countdown}s`}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-red-500 mb-2 tracking-wider">
            ATTENTION: SYSTEM COMPROMISE DETECTED
          </h1>
          <div className="h-1 w-full bg-red-600 mb-4"></div>
        </div>

        <div className="space-y-6 text-white">
          <p className="text-xl text-center font-bold text-red-400">
            You are not scrolling by accident.
          </p>

          <p className="text-lg leading-relaxed">
            Your brain is running predictive loops. You know where this leads.
            <br />
            The next 5 minutes will not be worth the 5 hours of flatline.
          </p>

          <div className="bg-black/50 p-6 rounded-lg border border-red-900">
            <h3 className="text-xl font-bold text-red-400 mb-3">SYSTEM CHECK:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Your discipline is being measured RIGHT NOW</li>
              <li>• Every man who built something real controlled this first</li>
              <li>• This isn't recreation - this is circuit-burning</li>
              <li>• You are downgrading your hardware</li>
            </ul>
          </div>

          <div className="bg-black/50 p-6 rounded-lg border border-red-900">
            <h3 className="text-xl font-bold text-red-400 mb-3">THE MATH:</h3>
            <p className="text-gray-300">
              500+ hours wasted. That's 3 full months of work. GONE.
            </p>
          </div>

          <div className="bg-black/50 p-6 rounded-lg border border-red-900">
            <h3 className="text-xl font-bold text-red-400 mb-3">YOUR COMPETITION:</h3>
            <p className="text-gray-300">
              While you're clicking, someone with your exact opportunities
              is choosing differently. In 12 months, the gap will be too wide.
            </p>
          </div>

          <div className="bg-black/50 p-6 rounded-lg border border-red-900">
            <h3 className="text-xl font-bold text-red-400 mb-3">THINK:</h3>
            <p className="text-gray-300">
              Could you tell any man you respect about the last month
              without embarrassment? That gap between who you claim
              to be and who you are IS YOUR ENTIRE LIFE.
            </p>
          </div>

          <div className="bg-red-950/50 p-6 rounded-lg border-2 border-red-600">
            <h3 className="text-xl font-bold text-red-400 mb-3">IMMEDIATE ACTION:</h3>
            <ol className="space-y-2 text-gray-300 list-decimal list-inside">
              <li>Stand up NOW</li>
              <li>State aloud: 'Update: data received'</li>
              <li>20 push-ups OR 3-minute walk outside</li>
              <li>Do NOT negotiate</li>
            </ol>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-red-500 mb-4">
              CLOSE THIS. RESET. MOVE.
            </p>
            {!canClose && (
              <p className="text-red-400 text-lg animate-pulse">
                Cannot close for: {countdown} seconds
              </p>
            )}
            {canClose && (
              <p className="text-green-400 text-lg">
                You may close now. Execute the protocol.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
