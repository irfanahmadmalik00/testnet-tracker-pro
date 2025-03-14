
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PinButtonProps {
  isPinned: boolean;
  onClick: () => void;
  className?: string;
}

const PinButton = ({ isPinned, onClick, className }: PinButtonProps) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        'p-1.5 rounded-full transition-colors',
        isPinned ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        className
      )}
      whileTap={{ scale: 0.9 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isPinned ? (
          <path d="M12 2l.642 1.345L14 4l-1.358.655L12 6l-.642-1.345L10 4l1.358-.655z M18.285 5.715l.39 1.138L20 7.5l-1.325.647L18.285 9.5l-.39-1.353L16 7.5l1.325-.647z M5.715 5.715l.39 1.138L7.5 7.5l-1.395.647L5.715 9.5l-.39-1.353L4 7.5l1.325-.647z M12 12l-3 10h6l-3-10z" />
        ) : (
          <path d="M12 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z M12 12l9 5-2.45 2.45-1.05-1.05a2 2 0 0 0-2.82.37L12 22l-2.68-3.18a2 2 0 0 0-2.82-.37l-1.05 1.05L3 17l9-5z" />
        )}
      </svg>
    </motion.button>
  );
};

export default PinButton;
