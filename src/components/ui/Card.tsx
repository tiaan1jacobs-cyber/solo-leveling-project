import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { soloLevelingTheme } from '../../styles/soloLevelingTokens';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glassmorphism?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, gradient = false, glassmorphism = false, onClick }: CardProps) {
  const baseClasses = 'rounded-xl overflow-hidden transition-all duration-300';
  const hoverClasses = hover ? 'cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02, boxShadow: soloLevelingTheme.shadow.glowStrong } : {}}
      transition={{ duration: 0.3 }}
      style={{
        background: gradient ? soloLevelingTheme.gradient.card : soloLevelingTheme.background.card,
        border: `1px solid ${soloLevelingTheme.border.default}`,
        boxShadow: soloLevelingTheme.shadow.card,
      }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 ${className}`} style={{ borderBottom: `1px solid ${soloLevelingTheme.border.default}` }}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 ${className}`} style={{
      borderTop: `1px solid ${soloLevelingTheme.border.default}`,
      background: soloLevelingTheme.background.cardHover
    }}>
      {children}
    </div>
  );
}
