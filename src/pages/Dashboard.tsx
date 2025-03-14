
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import useAuthStore from '@/lib/stores/authStore';
import useAirdropStore from '@/lib/stores/airdropStore';
import useTestnetStore from '@/lib/stores/testnetStore';
import { DashboardStats as DashboardStatsType } from '@/lib/types';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { getUserAirdrops } = useAirdropStore();
  const { getUserTestnets } = useTestnetStore();
  const [stats, setStats] = useState<DashboardStatsType>({
    totalAirdrops: 0,
    completedAirdrops: 0,
    activeTestnets: 0,
    dailyTasks: 0,
    progressPercentage: 0
  });

  useEffect(() => {
    if (user) {
      const userAirdrops = getUserAirdrops(user.id);
      const userTestnets = getUserTestnets(user.id);
      
      // Calculate dashboard stats
      const totalAirdrops = userAirdrops.length;
      const completedAirdrops = userAirdrops.filter(airdrop => airdrop.completed).length;
      const activeTestnets = userTestnets.filter(testnet => !testnet.completed).length;
      
      // Calculate daily tasks (we'll estimate this as sum of active testnets and incomplete airdrops)
      const dailyTasks = activeTestnets + (totalAirdrops - completedAirdrops);
      
      // Calculate progress percentage
      const progressPercentage = totalAirdrops > 0 
        ? Math.round((completedAirdrops / totalAirdrops) * 100) 
        : 0;
      
      setStats({
        totalAirdrops,
        completedAirdrops,
        activeTestnets,
        dailyTasks,
        progressPercentage
      });
    }
  }, [user, getUserAirdrops, getUserTestnets]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
          <p className="text-muted-foreground">
            Track your crypto airdrops, testnets, and tools all in one place.
          </p>
        </motion.div>

        <DashboardStats stats={stats} />
      </div>
    </Layout>
  );
};

export default Dashboard;
