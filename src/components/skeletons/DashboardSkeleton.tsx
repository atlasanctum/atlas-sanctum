import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
  },
};

const fadeInUpTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={fadeInUpTransition}
        className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="hidden sm:block">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fadeInUpTransition, delay: 0.1 }}
          className="mb-8"
        >
          <Skeleton className="h-10 w-72 mb-2" />
          <Skeleton className="h-5 w-96" />
        </motion.div>

        {/* Stats Grid Skeleton */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          {[...Array(4)].map((_, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              transition={fadeInUpTransition}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Skeleton className="w-12 h-12 rounded-xl animate-pulse" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-24 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links Skeleton */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {[...Array(4)].map((_, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              transition={fadeInUpTransition}
              className="p-4 rounded-xl border border-border/50 bg-card/50"
            >
              <Skeleton className="w-10 h-10 rounded-lg mb-3" />
              <Skeleton className="h-4 w-24" />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section Skeleton */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {[...Array(2)].map((_, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              transition={fadeInUpTransition}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full rounded-lg animate-pulse" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity Section Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fadeInUpTransition, delay: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/30"
                  >
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-60" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardSkeleton;