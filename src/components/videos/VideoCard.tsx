
import React from 'react';
import { motion } from 'framer-motion';
import { Video } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import PinButton from '@/components/common/PinButton';

interface VideoCardProps {
  video: Video;
  onEdit: (video: Video) => void;
  onDelete: (id: string) => void;
  onTogglePinned: (id: string) => void;
  isAdmin: boolean;
}

const VideoCard = ({ 
  video, 
  onEdit, 
  onDelete, 
  onTogglePinned,
  isAdmin
}: VideoCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(video);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this video?')) {
      onDelete(video.id);
    }
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePinned(video.id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${video.pinned ? 'border-primary' : ''}`}>
      <CardHeader className="p-4 pb-0 relative">
        {isAdmin && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
            <PinButton
              isPinned={video.pinned}
              onClick={handlePinClick}
            />
          </div>
        )}
        <CardTitle className="line-clamp-2 text-lg font-bold">
          {video.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="aspect-video w-full mb-4 rounded-md overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-md"
          ></iframe>
        </div>
        
        <div>
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {video.category}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              {formatDate(video.createdAt)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {video.description}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Watch
        </Button>
        
        {isAdmin && (
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
