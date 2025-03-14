
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { Tool, ToolCategory, ToolState } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ToolActions {
  addTool: (tool: Omit<Tool, 'id' | 'userId' | 'pinned' | 'createdAt'> & { userId: string }) => void;
  updateTool: (id: string, tool: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  togglePinned: (id: string) => void;
  addCategory: (name: string) => void;
  getUserTools: (userId: string) => Tool[];
  getPinnedTools: (userId: string) => Tool[];
}

// Define default categories
const defaultCategories: ToolCategory[] = [
  { id: '1', name: 'Wallet Connect' },
  { id: '2', name: 'Airdrop Claim Checker' },
  { id: '3', name: 'Gas Fee Calculator' },
  { id: '4', name: 'Testnet Token Faucets' },
  { id: '5', name: 'Crypto Wallet Extensions' },
  { id: '6', name: 'Swaps & Bridges' }
];

// Create tool store
const useToolStore = create<ToolState & ToolActions>()(
  persist(
    (set, get) => ({
      tools: [],
      categories: defaultCategories,
      isLoading: false,
      error: null,

      // Add a new tool
      addTool: (toolData) => {
        const newTool: Tool = {
          id: uuidv4(),
          userId: toolData.userId,
          title: toolData.title,
          category: toolData.category,
          description: toolData.description,
          link: toolData.link,
          pinned: false,
          createdAt: Date.now()
        };

        set((state) => ({
          tools: [newTool, ...state.tools]
        }));

        toast.success('Tool added successfully');
      },

      // Update existing tool
      updateTool: (id, updatedTool) => {
        set((state) => ({
          tools: state.tools.map((tool) => 
            tool.id === id ? { ...tool, ...updatedTool } : tool
          )
        }));

        toast.success('Tool updated successfully');
      },

      // Delete a tool
      deleteTool: (id) => {
        set((state) => ({
          tools: state.tools.filter((tool) => tool.id !== id)
        }));

        toast.success('Tool deleted successfully');
      },

      // Toggle pinned status
      togglePinned: (id) => {
        set((state) => ({
          tools: state.tools.map((tool) => 
            tool.id === id ? { ...tool, pinned: !tool.pinned } : tool
          )
        }));

        const tool = get().tools.find((t) => t.id === id);
        toast.success(tool?.pinned ? 'Tool unpinned' : 'Tool pinned');
      },

      // Add a new category
      addCategory: (name) => {
        const newCategory: ToolCategory = {
          id: uuidv4(),
          name
        };

        set((state) => ({
          categories: [...state.categories, newCategory]
        }));

        toast.success('Category added successfully');
      },

      // Get tools for specific user
      getUserTools: (userId) => {
        const tools = get().tools;
        return tools.filter((tool) => tool.userId === userId);
      },

      // Get pinned tools for specific user
      getPinnedTools: (userId) => {
        const tools = get().tools;
        return tools.filter((tool) => tool.userId === userId && tool.pinned);
      }
    }),
    {
      name: 'tool-storage'
    }
  )
);

export default useToolStore;
