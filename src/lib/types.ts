export interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  telegramUsername: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  error: string | null;
}

export interface Airdrop {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  links: Array<{id: string; name: string; url: string}>;
  fundingAmount: string;
  rewards: string;
  timeCommitment: string;
  workRequired: string;
  completed: boolean;
  pinned: boolean;
  createdAt: number;
}

export interface Testnet {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  links: Array<{id: string; name: string; url: string}>;
  progress: number;
  rewards: string;
  completed: boolean;
  pinned: boolean;
  createdAt: number;
}

export interface Tool {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  link: string;
  pinned: boolean;
  createdAt: number;
}

export interface Video {
  id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  videoId: string;
  pinned: boolean;
  createdAt: number;
}

export interface AirdropCategory {
  id: string;
  name: string;
}

export interface TestnetCategory {
  id: string;
  name: string;
}

export interface ToolCategory {
  id: string;
  name: string;
}

export interface VideoCategory {
  id: string;
  name: string;
}

export interface AirdropState {
  airdrops: Airdrop[];
  categories: AirdropCategory[];
  isLoading: boolean;
  error: string | null;
}

export interface TestnetState {
  testnets: Testnet[];
  categories: TestnetCategory[];
  isLoading: boolean;
  error: string | null;
}

export interface ToolState {
  tools: Tool[];
  categories: ToolCategory[];
  isLoading: boolean;
  error: string | null;
}

export interface VideoState {
  videos: Video[];
  categories: VideoCategory[];
  isLoading: boolean;
  error: string | null;
}

export interface DashboardStats {
  totalAirdrops: number;
  completedAirdrops: number;
  activeTestnets: number;
  dailyTasks: number;
  progressPercentage: number;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'pinned';
export type ViewMode = 'grid' | 'list';
