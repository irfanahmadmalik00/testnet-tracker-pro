
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { Airdrop, AirdropCategory, AirdropState } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AirdropActions {
  addAirdrop: (airdrop: Omit<Airdrop, 'id' | 'userId' | 'completed' | 'pinned' | 'createdAt'> & { userId: string }) => void;
  updateAirdrop: (id: string, airdrop: Partial<Airdrop>) => void;
  deleteAirdrop: (id: string) => void;
  toggleCompleted: (id: string) => void;
  togglePinned: (id: string) => void;
  addCategory: (name: string) => void;
  getUserAirdrops: (userId: string) => Airdrop[];
  getPinnedAirdrops: (userId: string) => Airdrop[];
}

// Define default categories
const defaultCategories: AirdropCategory[] = [
  { id: '1', name: 'Layer 1 & Testnet Mainnet' },
  { id: '2', name: 'Telegram Bot Airdrops' },
  { id: '3', name: 'Daily Check-in Airdrops' },
  { id: '4', name: 'Twitter Airdrops' },
  { id: '5', name: 'Social Airdrops' },
  { id: '6', name: 'AI Airdrops' },
  { id: '7', name: 'Wallet Airdrops' },
  { id: '8', name: 'Exchange Airdrops' }
];

// Create airdrop store
const useAirdropStore = create<AirdropState & AirdropActions>()(
  persist(
    (set, get) => ({
      airdrops: [],
      categories: defaultCategories,
      isLoading: false,
      error: null,

      // Add a new airdrop
      addAirdrop: (airdropData) => {
        const newAirdrop: Airdrop = {
          id: uuidv4(),
          userId: airdropData.userId,
          title: airdropData.title,
          category: airdropData.category,
          description: airdropData.description,
          links: airdropData.links,
          fundingAmount: airdropData.fundingAmount,
          rewards: airdropData.rewards,
          timeCommitment: airdropData.timeCommitment,
          workRequired: airdropData.workRequired,
          completed: false,
          pinned: false,
          createdAt: Date.now()
        };

        set((state) => ({
          airdrops: [newAirdrop, ...state.airdrops]
        }));

        toast.success('Airdrop added successfully');
      },

      // Update existing airdrop
      updateAirdrop: (id, updatedAirdrop) => {
        set((state) => ({
          airdrops: state.airdrops.map((airdrop) => 
            airdrop.id === id ? { ...airdrop, ...updatedAirdrop } : airdrop
          )
        }));

        toast.success('Airdrop updated successfully');
      },

      // Delete an airdrop
      deleteAirdrop: (id) => {
        set((state) => ({
          airdrops: state.airdrops.filter((airdrop) => airdrop.id !== id)
        }));

        toast.success('Airdrop deleted successfully');
      },

      // Toggle completed status
      toggleCompleted: (id) => {
        set((state) => ({
          airdrops: state.airdrops.map((airdrop) => 
            airdrop.id === id ? { ...airdrop, completed: !airdrop.completed } : airdrop
          )
        }));

        const airdrop = get().airdrops.find((a) => a.id === id);
        toast.success(airdrop?.completed ? 'Airdrop marked as incomplete' : 'Airdrop marked as completed');
      },

      // Toggle pinned status
      togglePinned: (id) => {
        set((state) => ({
          airdrops: state.airdrops.map((airdrop) => 
            airdrop.id === id ? { ...airdrop, pinned: !airdrop.pinned } : airdrop
          )
        }));

        const airdrop = get().airdrops.find((a) => a.id === id);
        toast.success(airdrop?.pinned ? 'Airdrop unpinned' : 'Airdrop pinned');
      },

      // Add a new category
      addCategory: (name) => {
        const newCategory: AirdropCategory = {
          id: uuidv4(),
          name
        };

        set((state) => ({
          categories: [...state.categories, newCategory]
        }));

        toast.success('Category added successfully');
      },

      // Get airdrops for specific user
      getUserAirdrops: (userId) => {
        const airdrops = get().airdrops;
        return airdrops.filter((airdrop) => airdrop.userId === userId);
      },

      // Get pinned airdrops for specific user
      getPinnedAirdrops: (userId) => {
        const airdrops = get().airdrops;
        return airdrops.filter((airdrop) => airdrop.userId === userId && airdrop.pinned);
      }
    }),
    {
      name: 'airdrop-storage'
    }
  )
);

export default useAirdropStore;
