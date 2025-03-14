
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import VideoCard from '@/components/videos/VideoCard';
import VideoForm from '@/components/videos/VideoForm';
import useAuthStore from '@/lib/stores/authStore';
import useVideoStore from '@/lib/stores/videoStore';
import { Video, SortOption, ViewMode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusIcon, LayoutGridIcon, LayoutListIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const Videos = () => {
  const { user } = useAuthStore();
  const { videos: allVideos, togglePinned, deleteVideo } = useVideoStore();
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Admin check
  const isAdmin = user?.isAdmin || false;

  // Load all videos, but only allow editing for admin user
  useEffect(() => {
    setVideos(allVideos);
  }, [allVideos]);

  // Filter and sort videos
  const filteredVideos = videos
    .filter(video => {
      // Filter by category
      const categoryMatch = filterCategory === 'all' || video.category === filterCategory;
      
      // Filter by search term
      const searchMatch = 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sort by option
      if (sortOption === 'newest') return b.createdAt - a.createdAt;
      if (sortOption === 'oldest') return a.createdAt - b.createdAt;
      if (sortOption === 'alphabetical') return a.title.localeCompare(b.title);
      if (sortOption === 'pinned') {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.createdAt - a.createdAt;
      }
      return 0;
    });

  const handleEdit = (video: Video) => {
    if (isAdmin) {
      setEditingVideo(video);
      setShowAddForm(true);
    }
  };

  const handleDelete = (id: string) => {
    if (isAdmin) {
      deleteVideo(id);
    }
  };

  const handleTogglePinned = (id: string) => {
    if (isAdmin) {
      togglePinned(id);
    }
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingVideo(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Crypto Videos</h1>
            <p className="text-muted-foreground">
              Watch and learn from our curated crypto videos
            </p>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="self-start"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          )}
        </div>

        {/* Filters and controls */}
        <div className="mb-8 space-y-4">
          {/* Search and view mode */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value as SortOption)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                  <SelectItem value="pinned">Pinned</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                >
                  <LayoutGridIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                >
                  <LayoutListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && isAdmin && (
          <VideoForm
            userId={user?.id || ''}
            onClose={closeForm}
            editingVideo={editingVideo}
          />
        )}

        {/* Videos Grid/List */}
        {filteredVideos.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <VideoCard
                  video={video}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTogglePinned={handleTogglePinned}
                  isAdmin={isAdmin}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No videos found</p>
            {isAdmin && (
              <Button onClick={() => setShowAddForm(true)}>Add Your First Video</Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Videos;
