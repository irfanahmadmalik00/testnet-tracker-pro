
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const ProgressBar = ({
  progress,
  className,
  showLabel = true,
  variant = 'default'
}: ProgressBarProps) => {
  const variants = {
    default: 'from-primary/70 to-primary',
    success: 'from-green-500/70 to-green-500',
    warning: 'from-yellow-500/70 to-yellow-500',
    danger: 'from-red-500/70 to-red-500'
  };

  const progressValue = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <div className="flex justify-between w-full">
            <span className="text-xs font-medium text-muted-foreground">Progress</span>
            <span className="text-xs font-medium text-foreground">{progressValue}%</span>
          </div>
        )}
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressValue}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full rounded-full bg-gradient-to-r', variants[variant])}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
