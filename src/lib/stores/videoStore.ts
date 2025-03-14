
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { Video, VideoCategory, VideoState } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface VideoActions {
  addVideo: (video: Omit<Video, 'id' | 'userId' | 'pinned' | 'createdAt'> & { userId: string }) => void;
  updateVideo: (id: string, video: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  togglePinned: (id: string) => void;
  addCategory: (name: string) => void;
  getUserVideos: (userId: string) => Video[];
  getPinnedVideos: (userId: string) => Video[];
}

// Define default categories
const defaultCategories: VideoCategory[] = [
  { id: '1', name: 'Crypto Tutorials' },
  { id: '2', name: 'Airdrop Guides' },
  { id: '3', name: 'Testnet Walkthroughs' },
  { id: '4', name: 'Market Analysis' },
  { id: '5', name: 'NFT Guides' },
  { id: '6', name: 'DeFi Tutorials' }
];

// Create default videos with admin ID
const defaultVideos: Video[] = [
  {
    id: '1',
    userId: 'admin-1',
    title: 'Crypto Airdrop Guide 2023',
    category: 'Airdrop Guides',
    description: 'Complete guide to finding and claiming crypto airdrops in 2023.',
    videoId: 'lN3BCkDFQ08',
    pinned: true,
    createdAt: Date.now() - 1000000
  },
  {
    id: '2',
    userId: 'admin-1',
    title: 'How to Join Testnets',
    category: 'Testnet Walkthroughs',
    description: 'Step-by-step guide to joining crypto testnets for rewards.',
    videoId: 'qLfyHsepqao',
    pinned: false,
    createdAt: Date.now() - 2000000
  },
  {
    id: '3',
    userId: 'admin-1',
    title: 'Best Crypto Tools for Beginners',
    category: 'Crypto Tutorials',
    description: 'Essential tools for every crypto enthusiast and trader.',
    videoId: 'aE3gXyzomMY',
    pinned: false,
    createdAt: Date.now() - 3000000
  },
  {
    id: '4',
    userId: 'admin-1',
    title: 'NFT Market Analysis',
    category: 'Market Analysis',
    description: 'In-depth look at the current state of the NFT market.',
    videoId: 'tGBVa74Pwm0',
    pinned: false,
    createdAt: Date.now() - 4000000
  },
  {
    id: '5',
    userId: 'admin-1',
    title: 'DeFi Yield Farming Strategy',
    category: 'DeFi Tutorials',
    description: 'Advanced strategies for DeFi yield farming and liquidity provision.',
    videoId: 'hfiyu3O8TLc',
    pinned: false,
    createdAt: Date.now() - 5000000
  },
  {
    id: '6',
    userId: 'admin-1',
    title: 'Crypto Tax Guide',
    category: 'Crypto Tutorials',
    description: 'Everything you need to know about crypto taxes and reporting.',
    videoId: '3o4rO-_-Ww4',
    pinned: false,
    createdAt: Date.now() - 6000000
  },
  {
    id: '7',
    userId: 'admin-1',
    title: 'Layer 2 Solutions Explained',
    category: 'Crypto Tutorials',
    description: 'Comprehensive guide to Ethereum L2 scaling solutions.',
    videoId: 'S0svZPP87GI',
    pinned: false,
    createdAt: Date.now() - 7000000
  },
  {
    id: '8',
    userId: 'admin-1',
    title: 'How to Use MetaMask',
    category: 'Crypto Tutorials',
    description: 'Complete beginner\'s guide to setting up and using MetaMask.',
    videoId: 'LFcnInoKdqg',
    pinned: false,
    createdAt: Date.now() - 8000000
  }
];

// Create video store
const useVideoStore = create<VideoState & VideoActions>()(
  persist(
    (set, get) => ({
      videos: defaultVideos,
      categories: defaultCategories,
      isLoading: false,
      error: null,

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

      // Get pinned videos for specific user
      getPinnedVideos: (userId) => {
        const videos = get().videos;
        return videos.filter((video) => video.userId === userId && video.pinned);
      }
    }),
    {
      name: 'video-storage'
    }
  )
);

export default useVideoStore;
