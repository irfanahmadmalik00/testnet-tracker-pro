
import React, { useState } from 'react';
import Card from '@/components/common/Card';
import CategoryBadge from '@/components/common/CategoryBadge';
import PinButton from '@/components/common/PinButton';
import { Airdrop } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface AirdropCardProps {
  airdrop: Airdrop;
  onEdit: (airdrop: Airdrop) => void;
  onDelete: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onTogglePinned: (id: string) => void;
}

const AirdropCard = ({
  airdrop,
  onEdit,
  onDelete,
  onToggleCompleted,
  onTogglePinned
}: AirdropCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(airdrop);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this airdrop?')) {
      onDelete(airdrop.id);
    }
  };

  const handleToggleCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompleted(airdrop.id);
  };

  const handleTogglePinned = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePinned(airdrop.id);
  };

  const copyToClipboard = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <Card
      isPinned={airdrop.pinned}
      isCompleted={airdrop.completed}
      className={`cursor-pointer transition-all duration-300 ${airdrop.completed ? 'opacity-60' : ''}`}
      onClick={toggleDetails}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <CategoryBadge category={airdrop.category} />
          <div className="flex items-center space-x-2">
            <PinButton isPinned={airdrop.pinned} onClick={handleTogglePinned} />
          </div>
        </div>
        
        <h3 className="text-lg font-bold mb-2 line-clamp-1">{airdrop.title}</h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {airdrop.description}
        </p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
          <div>
            <span className="text-muted-foreground">Funding: </span>
            <span>{airdrop.fundingAmount}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Rewards: </span>
            <span>{airdrop.rewards}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Time: </span>
            <span>{airdrop.timeCommitment}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Work: </span>
            <span>{airdrop.workRequired}</span>
          </div>
        </div>
        
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border pt-4 mt-2">
                <h4 className="font-medium text-sm mb-2">Links:</h4>
                <ul className="space-y-2 max-h-36 overflow-y-auto scrollbar-none">
                  {airdrop.links.map((link) => (
                    <li key={link.id} className="flex items-center justify-between">
                      <span className="text-sm line-clamp-1 flex-1">{link.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => copyToClipboard(e, link.url)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                          </svg>
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <path d="M15 3h6v6"></path>
                            <path d="m10 14 11-11"></path>
                          </svg>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleCompleted}
              className={`p-1.5 rounded-full ${airdrop.completed ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
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
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <path d="M22 4 12 14.01l-3-3"></path>
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEdit}
              className="p-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
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
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </motion.button>
          </div>
          <button
            onClick={toggleDetails}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDetails ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default AirdropCard;
