
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
          <AuthForm type="register" />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
