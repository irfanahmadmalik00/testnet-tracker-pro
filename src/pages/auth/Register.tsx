
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AuthForm from '@/components/auth/AuthForm';
import useAuthStore from '@/lib/stores/authStore';

const Register = () => {
  const { isAuthenticated } = useAuthStore();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gradient-primary">
            Join CryptoTracker
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            Track and manage your crypto airdrops, testnets, and tools in one place.
          </p>
          <div className="mb-6 p-4 border border-primary/20 bg-primary/5 rounded-lg">
            <h3 className="font-semibold mb-2">Registration Steps:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Enter your details and an invite code</li>
              <li>Join our Telegram group (t.me/Web3_Airdrops_Education)</li>
              <li>Enter your Telegram username to complete registration</li>
            </ol>
          </div>
          <AuthForm type="register" />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
