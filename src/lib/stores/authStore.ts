
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { AuthState, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const VALID_INVITE_CODE = 'ishowcryptoairdrops';
const SPECIAL_USER_EMAIL = 'malickirfan00@gmail.com';
const SPECIAL_USER_PASSWORD = 'Irfan@123#13';
const SPECIAL_USERNAME = 'UmarCryptospace';

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, inviteCode: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

// Create the auth store
const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAuthLoading: false,
      error: null,

      // Handle login
      login: async (email: string, password: string) => {
        set({ isAuthLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Special admin user check
          if (email === SPECIAL_USER_EMAIL && password === SPECIAL_USER_PASSWORD) {
            const user: User = {
              id: 'admin-1',
              email: SPECIAL_USER_EMAIL,
              username: SPECIAL_USERNAME,
              isAdmin: true
            };
            
            set({ user, isAuthenticated: true, isAuthLoading: false });
            toast.success(`Welcome back, ${user.username}!`);
            return true;
          }
          
          // Get users from localStorage (this is a mock, in production you'd use a real backend)
          const storedUsers = localStorage.getItem('users');
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
          
          // Find user
          const user = users.find(u => u.email === email);
          
          // Check user and password
          if (!user) {
            set({ isAuthLoading: false, error: 'User not found' });
            toast.error('User not found. Please register first.');
            return false;
          }
          
          // In a real app, we'd check hashed passwords here
          // For demo purposes, we're not implementing password hashing
          // This is insecure and should never be done in production
          const passwordMatch = localStorage.getItem(`user-${user.id}-password`) === password;
          
          if (!passwordMatch) {
            set({ isAuthLoading: false, error: 'Invalid password' });
            toast.error('Invalid password');
            return false;
          }
          
          set({ user, isAuthenticated: true, isAuthLoading: false });
          toast.success(`Welcome back, ${user.username}!`);
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ isAuthLoading: false, error: errorMessage });
          toast.error(errorMessage);
          return false;
        }
      },

      // Handle registration
      register: async (username: string, email: string, password: string, inviteCode: string) => {
        set({ isAuthLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Validate invite code
          if (inviteCode !== VALID_INVITE_CODE) {
            set({ isAuthLoading: false, error: 'Invalid invite code' });
            toast.error('Invalid invite code');
            return false;
          }
          
          // Get existing users or initialize empty array
          const storedUsers = localStorage.getItem('users');
          const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
          
          // Check if email already exists
          if (users.some(u => u.email === email)) {
            set({ isAuthLoading: false, error: 'Email already registered' });
            toast.error('Email already registered');
            return false;
          }
          
          // Create new user
          const newUser: User = {
            id: uuidv4(),
            email,
            username,
            isAdmin: email === SPECIAL_USER_EMAIL
          };
          
          // Save user
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          
          // Save password (in a real app, we'd hash passwords)
          // This is for demo purposes only and is insecure
          localStorage.setItem(`user-${newUser.id}-password`, password);
          
          // Set authenticated state
          set({ user: newUser, isAuthenticated: true, isAuthLoading: false });
          
          toast.success('Registration successful!');
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({ isAuthLoading: false, error: errorMessage });
          toast.error(errorMessage);
          return false;
        }
      },

      // Handle logout
      logout: () => {
        set({ user: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },

      // Check if user is authenticated
      checkAuth: () => {
        const { isAuthenticated } = get();
        return isAuthenticated;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
