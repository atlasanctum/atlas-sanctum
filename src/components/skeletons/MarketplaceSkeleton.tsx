import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export const MarketplaceSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Header Skeleton */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={fadeInUpTransition}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-9 w-96" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <Skeleton className="h-6 w-[500px]" />
        </motion.div>

        {/* Search and Filter Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fadeInUpTransition, delay: 0.1 }}
        >
          <Card className="mb-8 bg-card/50 border-border/50">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-md" />
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Skeleton className="h-4 w-16" />
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-md" />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metrics Grid Skeleton */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[...Array(4)].map((_, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              transition={fadeInUpTransition}
            >
              <Card className="border-l-4 border-l-muted">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-1 animate-pulse" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects Grid Skeleton */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {[...Array(6)].map((_, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              transition={fadeInUpTransition}
            >
              <Card className="bg-card/50 border-border/50 overflow-hidden">
                <Skeleton className="h-48 w-full animate-pulse" />
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div>
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-9 w-24 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fadeInUpTransition, delay: 0.3 }}
        >
          <div className="flex gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-md" />
            ))}
          </div>
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-72 w-full rounded-lg animate-pulse" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketplaceSkeleton;