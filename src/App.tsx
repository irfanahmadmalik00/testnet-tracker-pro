
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Airdrops from "./pages/Airdrops";
import Testnets from "./pages/Testnets";
import Tools from "./pages/Tools";
import Videos from "./pages/Videos";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import useAirdropStore from "./lib/stores/airdropStore";

const queryClient = new QueryClient();

const App = () => {
  // Get the daily reset check function
  const checkDailyReset = useAirdropStore((state) => state.checkDailyReset);
  
  // Check for daily reset when app loads
  useEffect(() => {
    checkDailyReset();
    
    // Also check for reset when tab becomes active
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkDailyReset();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkDailyReset]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/airdrops" element={<ProtectedRoute><Airdrops /></ProtectedRoute>} />
            <Route path="/testnets" element={<ProtectedRoute><Testnets /></ProtectedRoute>} />
            <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
            
            {/* Public Routes */}
            <Route path="/videos" element={<Videos />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
