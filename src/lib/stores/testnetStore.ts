
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { Testnet, TestnetCategory, TestnetState } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TestnetActions {
  addTestnet: (testnet: Omit<Testnet, 'id' | 'userId' | 'completed' | 'pinned' | 'createdAt'> & { userId: string }) => void;
  updateTestnet: (id: string, testnet: Partial<Testnet>) => void;
  deleteTestnet: (id: string) => void;
  toggleCompleted: (id: string) => void;
  togglePinned: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  addCategory: (name: string) => void;
  getUserTestnets: (userId: string) => Testnet[];
  getPinnedTestnets: (userId: string) => Testnet[];
}

// Define default categories
const defaultCategories: TestnetCategory[] = [
  { id: '1', name: 'Galxe Testnet' },
  { id: '2', name: 'Bridge Mining' },
  { id: '3', name: 'Mining Sessions' },
  { id: '4', name: 'Daily Testnet Tasks' }
];

// Create testnet store
const useTestnetStore = create<TestnetState & TestnetActions>()(
  persist(
    (set, get) => ({
      testnets: [],
      categories: defaultCategories,
      isLoading: false,
      error: null,

      // Add a new testnet
      addTestnet: (testnetData) => {
        const newTestnet: Testnet = {
          id: uuidv4(),
          userId: testnetData.userId,
          title: testnetData.title,
          category: testnetData.category,
          description: testnetData.description,
          links: testnetData.links,
          progress: testnetData.progress,
          rewards: testnetData.rewards,
          completed: false,
          pinned: false,
          createdAt: Date.now()
        };

        set((state) => ({
          testnets: [newTestnet, ...state.testnets]
        }));

        toast.success('Testnet added successfully');
      },

      // Update existing testnet
      updateTestnet: (id, updatedTestnet) => {
        set((state) => ({
          testnets: state.testnets.map((testnet) => 
            testnet.id === id ? { ...testnet, ...updatedTestnet } : testnet
          )
        }));

        toast.success('Testnet updated successfully');
      },

      // Delete a testnet
      deleteTestnet: (id) => {
        set((state) => ({
          testnets: state.testnets.filter((testnet) => testnet.id !== id)
        }));

        toast.success('Testnet deleted successfully');
      },

      // Toggle completed status
      toggleCompleted: (id) => {
        set((state) => ({
          testnets: state.testnets.map((testnet) => 
            testnet.id === id ? { ...testnet, completed: !testnet.completed } : testnet
          )
        }));

        const testnet = get().testnets.find((t) => t.id === id);
        toast.success(testnet?.completed ? 'Testnet marked as incomplete' : 'Testnet marked as completed');
      },

      // Toggle pinned status
      togglePinned: (id) => {
        set((state) => ({
          testnets: state.testnets.map((testnet) => 
            testnet.id === id ? { ...testnet, pinned: !testnet.pinned } : testnet
          )
        }));

        const testnet = get().testnets.find((t) => t.id === id);
        toast.success(testnet?.pinned ? 'Testnet unpinned' : 'Testnet pinned');
      },

      // Update progress
      updateProgress: (id, progress) => {
        set((state) => ({
          testnets: state.testnets.map((testnet) => 
            testnet.id === id ? { ...testnet, progress } : testnet
          )
        }));

        toast.success('Progress updated');
      },

      // Add a new category
      addCategory: (name) => {
        const newCategory: TestnetCategory = {
          id: uuidv4(),
          name
        };

        set((state) => ({
          categories: [...state.categories, newCategory]
        }));

        toast.success('Category added successfully');
      },

      // Get testnets for specific user
      getUserTestnets: (userId) => {
        const testnets = get().testnets;
        return testnets.filter((testnet) => testnet.userId === userId);
      },

      // Get pinned testnets for specific user
      getPinnedTestnets: (userId) => {
        const testnets = get().testnets;
        return testnets.filter((testnet) => testnet.userId === userId && testnet.pinned);
      }
    }),
    {
      name: 'testnet-storage'
    }
  )
);

export default useTestnetStore;
