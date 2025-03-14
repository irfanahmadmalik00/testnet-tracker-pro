
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  isPinned?: boolean;
  isCompleted?: boolean;
  className?: string;
  variant?: 'default' | 'glass' | 'neo';
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Card = ({
  children,
  isPinned = false,
  isCompleted = false,
  className,
  variant = 'default',
  onClick,
  ...props
}: CardProps & Omit<HTMLMotionProps<"div">, "onClick">) => {
  const cardVariants = {
    default: 'bg-card border border-border shadow-subtle',
    glass: 'glass-morphism',
    neo: 'neo-morphism'
  };

  const handleClick = onClick ? (e: React.MouseEvent<HTMLDivElement>) => onClick(e) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        'relative rounded-xl overflow-hidden',
        cardVariants[variant],
        isCompleted && 'opacity-75',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {isPinned && (
        <div className="absolute top-0 right-0 bg-primary p-0.5 rounded-bl-lg z-10">
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
            className="text-primary-foreground"
          >
            <path d="M12 2l.642 1.345L14 4l-1.358.655L12 6l-.642-1.345L10 4l1.358-.655z" />
            <path d="M18.285 5.715l.39 1.138L20 7.5l-1.325.647L18.285 9.5l-.39-1.353L16 7.5l1.325-.647z" />
            <path d="M5.715 5.715l.39 1.138L7.5 7.5l-1.395.647L5.715 9.5l-.39-1.353L4 7.5l1.325-.647z" />
            <path d="M12 12l-3 10h6l-3-10z" />
          </svg>
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;
