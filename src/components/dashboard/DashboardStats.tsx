
import React from 'react';
import { motion } from 'framer-motion';
import ProgressBar from '@/components/common/ProgressBar';
import { DashboardStats as DashboardStatsType } from '@/lib/types';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statItems = [
    {
      title: 'Total Airdrops',
      value: stats.totalAirdrops,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <path d="M12 6.5V15"></path>
          <path d="M8 8v2.4"></path>
          <path d="M16 8v2.4"></path>
        </svg>
      ),
    },
    {
      title: 'Completed Airdrops',
      value: stats.completedAirdrops,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <path d="M22 4 12 14.01l-3-3"></path>
        </svg>
      ),
    },
    {
      title: 'Active Testnets',
      value: stats.activeTestnets,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <path d="M9 22V12h6v10"></path>
        </svg>
      ),
    },
    {
      title: 'Daily Tasks',
      value: stats.dailyTasks,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
          <path d="M12 8v4l2 2"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="neo-morphism rounded-xl p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="rounded-lg p-3 bg-primary/10">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="neo-morphism rounded-xl p-6"
      >
        <h3 className="text-lg font-bold mb-4">Overall Progress</h3>
        <ProgressBar
          progress={stats.progressPercentage}
          variant={stats.progressPercentage >= 80 ? 'success' : 'default'}
          className="mb-2"
        />
        <p className="text-sm text-muted-foreground mt-2">
          You've completed {stats.progressPercentage}% of your tasks. Keep up the good work!
        </p>
      </motion.div>
    </div>
  );
};

export default DashboardStats;
