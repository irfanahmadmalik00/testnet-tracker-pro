
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { Video, VideoCategory, VideoState } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface VideoActions {
  addVideo: (video: Omit<Video, 'id' | 'pinned' | 'createdAt'>) => void;
  updateVideo: (id: string, video: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  togglePinned: (id: string) => void;
  addCategory: (name: string) => void;
  getUserVideos: (userId: string) => Video[];
  getPinnedVideos: () => Video[];
  initializeDefaultVideos: () => void;
}

// Define default categories
const defaultCategories: VideoCategory[] = [
  { id: '1', name: 'Tutorials' },
  { id: '2', name: 'Crypto News' },
  { id: '3', name: 'Airdrops' },
  { id: '4', name: 'Testnets' }
];

// Default videos (based on the YouTube links provided)
const defaultVideos: Video[] = [
  {
    id: 'v1',
    userId: 'admin-1',
    title: 'Crypto Video Tutorial 1',
    category: 'Tutorials',
    description: 'Comprehensive guide to crypto airdrops and testnets',
    videoId: 'lN3BCkDFQ08',
    pinned: false,
    createdAt: Date.now() - 1000000
  },
  {
    id: 'v2',
    userId: 'admin-1',
    title: 'Crypto Video Tutorial 2',
    category: 'Tutorials',
    description: 'Learn how to participate in crypto airdrops effectively',
    videoId: 'qLfyHsepqao',
    pinned: false,
    createdAt: Date.now() - 900000
  },
  {
    id: 'v3',
    userId: 'admin-1',
    title: 'Crypto Video Tutorial 3',
    category: 'Airdrops',
    description: 'Latest airdrops and how to claim them',
    videoId: 'aE3gXyzomMY',
    pinned: false,
    createdAt: Date.now() - 800000
  },
  {
    id: 'v4',
    userId: 'admin-1',
    title: 'Crypto Video Tutorial 4',
    category: 'Testnets',
    description: 'Guide to participating in popular testnets',
    videoId: 'tGBVa74Pwm0',
    pinned: false,
    createdAt: Date.now() - 700000
  },
  {
    id: 'v5',
    userId: 'admin-1',
    title: 'Crypto Video Tutorial 5',
    category: 'Crypto News',
    description: 'Latest developments in the crypto space',
    videoId: 'hfiyu3O8TLc',
    pinned: false,
    createdAt: Date.now() - 600000
  },
  {
    id: 'v6',
    userId: 'admin-1',
    title: 'Crypto Video Tutorial 6',
    category: 'Tutorials',
    description: 'Advanced techniques for crypto trading',
    videoId: '3o4rO-_-Ww4',
    pinned: false,
    createdAt: Date.now() - 500000
  },
  {
    id: 'v7',
    userId: 'admin-1',
    title: 'Crypto Video Tutorial 7',
    category: 'Airdrops',
    description: 'How to find the best airdrops',
    videoId: 'S0svZPP87GI',
    pinned: false,
    createdAt: Date.now() - 400000
  },
  {
    id: 'v8',
    userId: 'admin-1',
    title: 'Crypto Video Tutorial 8',
    category: 'Testnets',
    description: 'Complete guide to testnet participation',
    videoId: 'LFcnInoKdqg',
    pinned: false,
    createdAt: Date.now() - 300000
  }
];

// Create video store
const useVideoStore = create<VideoState & VideoActions>()(
  persist(
    (set, get) => ({
      videos: [],
      categories: defaultCategories,
      isLoading: false,
      error: null,

      // Initialize default videos
      initializeDefaultVideos: () => {
        const existingVideos = get().videos;
        if (existingVideos.length === 0) {
          set({ videos: defaultVideos });
        }
      },

      // Add a new video
      addVideo: (videoData) => {
        const newVideo: Video = {
          id: uuidv4(),
          userId: videoData.userId,
          title: videoData.title,
          category: videoData.category,
          description: videoData.description,
          videoId: videoData.videoId,
          pinned: false,
          createdAt: Date.now()
        };

        set((state) => ({
          videos: [newVideo, ...state.videos]
        }));

        toast.success('Video added successfully');
      },

      // Update existing video
      updateVideo: (id, updatedVideo) => {
        set((state) => ({
          videos: state.videos.map((video) => 
            video.id === id ? { ...video, ...updatedVideo } : video
          )
        }));

        toast.success('Video updated successfully');
      },

      // Delete a video
      deleteVideo: (id) => {
        set((state) => ({
          videos: state.videos.filter((video) => video.id !== id)
        }));

        toast.success('Video deleted successfully');
      },

      // Toggle pinned status
      togglePinned: (id) => {
        set((state) => ({
          videos: state.videos.map((video) => 
            video.id === id ? { ...video, pinned: !video.pinned } : video
          )
        }));

        const video = get().videos.find((v) => v.id === id);
        toast.success(video?.pinned ? 'Video unpinned' : 'Video pinned');
      },

      // Add a new category
      addCategory: (name) => {
        const newCategory: VideoCategory = {
          id: uuidv4(),
          name
        };

        set((state) => ({
          categories: [...state.categories, newCategory]
        }));

        toast.success('Category added successfully');
      },

      // Get videos for specific user
      getUserVideos: (userId) => {
        const videos = get().videos;
        return videos.filter((video) => video.userId === userId);
      },

      // Get pinned videos
      getPinnedVideos: () => {
        const videos = get().videos;
        return videos.filter((video) => video.pinned);
      }
    }),
    {
      name: 'video-storage'
    }
  )
);

export default useVideoStore;
