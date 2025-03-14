
import React from 'react';
import Card from '@/components/common/Card';
import CategoryBadge from '@/components/common/CategoryBadge';
import PinButton from '@/components/common/PinButton';
import { Tool } from '@/lib/types';
import { motion } from 'framer-motion';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolCardProps {
  tool: Tool;
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onTogglePinned: (id: string) => void;
}

const ToolCard = ({
  tool,
  onEdit,
  onDelete,
  onTogglePinned
}: ToolCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(tool);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete this tool?')) {
      onDelete(tool.id);
    }
  };

  const handleTogglePinned = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onTogglePinned(tool.id);
  };

  return (
    <Card
      isPinned={tool.pinned}
      className="transition-all duration-300 h-full"
    >
      <a 
        href={tool.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block p-5 h-full"
      >
        <div className="flex justify-between items-start mb-3">
          <CategoryBadge category={tool.category} />
          <div className="flex items-center space-x-2">
            <PinButton isPinned={tool.pinned} onClick={handleTogglePinned} />
          </div>
        </div>
        
        <h3 className="text-lg font-bold mb-2 line-clamp-1">{tool.title}</h3>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {tool.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEdit}
              className="p-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              <Edit className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm">Visit</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </a>
    </Card>
  );
};

export default ToolCard;
