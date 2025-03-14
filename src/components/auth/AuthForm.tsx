
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '@/lib/stores/authStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const { login, register, isAuthLoading } = useAuthStore();
  const [showTelegramDialog, setShowTelegramDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    inviteCode: '',
    telegramUsername: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    inviteCode: '',
    telegramUsername: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (type === 'register') {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
        isValid = false;
      }
      
      if (!formData.inviteCode.trim()) {
        newErrors.inviteCode = 'Invite code is required';
        isValid = false;
      }
      
      if (type === 'register' && !formData.telegramUsername.trim()) {
        newErrors.telegramUsername = 'Telegram username is required';
        isValid = false;
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (type === 'login') {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      }
    } else {
      // Check if Telegram step is needed
      if (!formData.telegramUsername.trim()) {
        setShowTelegramDialog(true);
        return;
      }

      const success = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.inviteCode,
        formData.telegramUsername
      );
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="neo-morphism rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {type === 'login' ? 'Login to Your Account' : 'Create an Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {type === 'register' && (
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-destructive text-xs mt-1">{errors.username}</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            {type === 'register' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="inviteCode" className="block text-sm font-medium">
                    Invite Code
                  </label>
                  <input
                    id="inviteCode"
                    name="inviteCode"
                    type="text"
                    value={formData.inviteCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors"
                    placeholder="Enter invite code"
                  />
                  {errors.inviteCode && (
                    <p className="text-destructive text-xs mt-1">{errors.inviteCode}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="telegramUsername" className="block text-sm font-medium">
                    Telegram Username
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="telegramUsername"
                      name="telegramUsername"
                      type="text"
                      value={formData.telegramUsername}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-colors"
                      placeholder="Your Telegram @username"
                    />
                    <a 
                      href="https://t.me/Web3_Airdrops_Education" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 py-3 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                  {errors.telegramUsername && (
                    <p className="text-destructive text-xs mt-1">{errors.telegramUsername}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Join our <a href="https://t.me/Web3_Airdrops_Education" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Telegram Group</a> and enter your username
                  </p>
                </div>
              </>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAuthLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                type === 'login' ? 'Sign In' : 'Create Account'
              )}
            </motion.button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            {type === 'login' ? (
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-primary hover:underline focus:outline-none"
                >
                  Register
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary hover:underline focus:outline-none"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Telegram Dialog */}
      <Dialog open={showTelegramDialog} onOpenChange={setShowTelegramDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join our Telegram Group</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <p>Please join our Telegram group to complete your registration.</p>
            <div className="flex flex-col space-y-2">
              <a 
                href="https://t.me/Web3_Airdrops_Education" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90"
              >
                <ExternalLink size={18} />
                Join Telegram Group
              </a>
              <p className="text-xs text-muted-foreground text-center">
                After joining, enter your Telegram username in the registration form
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthForm;
