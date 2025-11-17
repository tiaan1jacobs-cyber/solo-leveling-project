// Solo Leveling Theme - Dark RPG Aesthetic with Blue/Purple Glowing Accents

export const soloLevelingTheme = {
  // Core Background Colors
  background: {
    primary: '#0a0e1a',      // Deep black-blue (darker than night)
    secondary: '#111827',     // Slightly lighter black
    tertiary: '#1a1f35',      // Dark blue-black
    card: '#0f1419',          // Card background
    cardHover: '#1a202c',     // Card hover state
  },

  // Glowing Accent Colors (Like Solo Leveling UI)
  glow: {
    primary: '#3b82f6',       // Bright blue glow
    secondary: '#8b5cf6',     // Purple glow
    cyan: '#06b6d4',          // Cyan accent
    success: '#10b981',       // Green for success
    warning: '#f59e0b',       // Gold/amber warning
    danger: '#ef4444',        // Red danger
  },

  // Text Colors
  text: {
    primary: '#ffffff',       // Pure white
    secondary: '#cbd5e1',     // Light gray
    muted: '#64748b',         // Muted gray
    glowing: '#3b82f6',       // Glowing blue text
  },

  // Border Colors with Glow
  border: {
    default: 'rgba(59, 130, 246, 0.3)',  // Blue glow border
    hover: 'rgba(59, 130, 246, 0.6)',    // Stronger blue
    purple: 'rgba(139, 92, 246, 0.4)',   // Purple glow
    cyan: 'rgba(6, 182, 212, 0.4)',      // Cyan glow
  },

  // Shadows with Glow Effects
  shadow: {
    glow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
    glowStrong: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2)',
    purpleGlow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.1)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  },

  // Gradients
  gradient: {
    card: 'linear-gradient(135deg, rgba(15, 20, 25, 0.9) 0%, rgba(26, 31, 53, 0.9) 100%)',
    blueGlow: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    button: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    buttonHover: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    stat: 'linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
  },

  // Stats/Level Colors (RPG-style)
  stats: {
    strength: '#ef4444',      // Red
    intelligence: '#3b82f6',  // Blue
    agility: '#10b981',       // Green
    endurance: '#f59e0b',     // Gold
    luck: '#8b5cf6',          // Purple
    wisdom: '#06b6d4',        // Cyan
  },

  // XP/Progress Colors
  progress: {
    bar: '#3b82f6',
    barBg: 'rgba(59, 130, 246, 0.1)',
    glow: 'rgba(59, 130, 246, 0.5)',
  },

  // Quest/Mission Colors
  quest: {
    daily: '#3b82f6',        // Blue
    weekly: '#8b5cf6',       // Purple
    monthly: '#f59e0b',      // Gold
    completed: '#10b981',    // Green
  },
};

// Glass morphism effect (like Solo Leveling UI)
export const glassMorphism = {
  background: 'rgba(15, 20, 25, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  boxShadow: soloLevelingTheme.shadow.glow,
};

// Stat card style
export const statCardStyle = {
  background: soloLevelingTheme.gradient.card,
  border: `1px solid ${soloLevelingTheme.border.default}`,
  boxShadow: soloLevelingTheme.shadow.card,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: soloLevelingTheme.border.hover,
    boxShadow: soloLevelingTheme.shadow.glowStrong,
    transform: 'translateY(-2px)',
  },
};

// Level up animation keyframes
export const levelUpAnimation = `
  @keyframes levelUp {
    0% {
      transform: scale(1);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    }
  }
`;

// XP gain animation
export const xpGainAnimation = `
  @keyframes xpGain {
    0% {
      opacity: 0;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
`;
