'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

const ON_COLOR = '#059669'; // Emerald/Brand-500
const OFF_COLOR = '#6B7280'; // Gray-500 (muted)

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
}: SwitchProps) {
  const { theme } = useTheme();
  const sizeClasses = {
    sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', translateX: checked ? 16 : 2 },
    md: { track: 'w-12 h-6', thumb: 'w-5 h-5', translateX: checked ? 26 : 3 },
    lg: { track: 'w-16 h-8', thumb: 'w-7 h-7', translateX: checked ? 34 : 4 },
  };

  const { track, thumb, translateX } = sizeClasses[size];
  const activeColor = ON_COLOR;

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`
        relative inline-flex items-center rounded-full
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${track}
        ${className}
      `}
      style={{
        backgroundColor: checked ? activeColor : OFF_COLOR,
      }}
    >
      <motion.span
        className={`
          block rounded-full shadow-md flex-shrink-0
          ${thumb}
        `}
        style={{
          backgroundColor: '#FFFFFF',
        }}
        layout
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
          mass: 1,
        }}
      >
        <motion.span
          className="block w-full h-full rounded-full"
          animate={{
            x: translateX - (size === 'sm' ? 2 : size === 'md' ? 3 : 4),
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      </motion.span>
    </motion.button>
  );
}

export default Switch;
