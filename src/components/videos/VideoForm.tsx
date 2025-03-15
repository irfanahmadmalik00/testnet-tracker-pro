
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video } from '@/lib/types';
import useVideoStore from '@/lib/stores/videoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CategorySelect from '@/components/common/CategorySelect';
import { X } from 'lucide-react';

interface VideoFormProps {
  userId: string;
  onClose: () => void;
  editingVideo: Video | null;
}

const VideoForm = ({ userId, onClose, editingVideo }: VideoFormProps) => {
  const { addVideo, updateVideo, categories, addCategory } = useVideoStore();
  
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    description: string;
    videoId: string;
  }>({
    title: '',
    category: categories[0]?.name || '',
    description: '',
    videoId: ''
  });

  const [errors, setErrors] = useState<{
    title?: string;
    category?: string;
    description?: string;
    videoId?: string;
  }>({});

  // If editing, populate form with video data
  useEffect(() => {
    if (editingVideo) {
      setFormData({
        title: editingVideo.title,
        category: editingVideo.category,
        description: editingVideo.description,
        videoId: editingVideo.videoId
      });
    }
  }, [editingVideo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
    
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: undefined
      }));
    }
  };

  const extractYouTubeId = (url: string): string => {
    if (!url) return '';
    
    // Handle direct video IDs
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    
    // Handle youtube.com URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const videoId = extractYouTubeId(formData.videoId);
    if (!videoId) {
      newErrors.videoId = 'Valid YouTube video ID or URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const videoId = extractYouTubeId(formData.videoId);
    
    if (editingVideo) {
      updateVideo(editingVideo.id, {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        videoId: videoId
      });
    } else {
      addVideo({
        userId,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        videoId: videoId
      });
    }
    
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {editingVideo ? 'Edit Video' : 'Add New Video'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter video title"
              />
              {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <CategorySelect
                categories={categories}
                selectedCategory={formData.category}
                onCategoryChange={handleCategoryChange}
                onAddCategory={addCategory}
                placeholder="Select video category"
              />
              {errors.category && <p className="text-destructive text-xs">{errors.category}</p>}
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter video description"
                rows={3}
              />
              {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
            </div>
            
            {/* YouTube Video ID */}
            <div className="space-y-2">
              <label htmlFor="videoId" className="block text-sm font-medium">
                YouTube Video ID or URL
              </label>
              <Input
                id="videoId"
                name="videoId"
                value={formData.videoId}
                onChange={handleChange}
                placeholder="e.g., dQw4w9WgXcQ or https://youtube.com/watch?v=dQw4w9WgXcQ"
              />
              <p className="text-xs text-muted-foreground">
                Enter either the YouTube video ID or the full URL
              </p>
              {errors.videoId && <p className="text-destructive text-xs">{errors.videoId}</p>}
            </div>
            
            {/* Preview */}
            {extractYouTubeId(formData.videoId) && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Preview</p>
                <div className="aspect-video w-full rounded-md overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(formData.videoId)}`}
                    title="YouTube video preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-md"
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingVideo ? 'Update Video' : 'Create Video'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VideoForm;
