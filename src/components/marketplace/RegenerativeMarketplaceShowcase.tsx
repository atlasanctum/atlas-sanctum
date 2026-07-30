import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCategoryCard } from './ProjectCategoryCard';
import type { CarbonProject, ProjectType} from '@/types/marketplace';
import { Globe, Zap, BarChart3, Award, Leaf } from 'lucide-react';

interface RegenerativeMarketplaceShowcaseProps {
  projects: CarbonProject[];
  isLoading?: boolean;
  isCompareMode?: boolean;
  selectedForCompare?: CarbonProject[];
  onToggleCompare?: (project: CarbonProject) => void;
}

const projectTypeCategories: ProjectType[] = [
  'reforestation',
  'renewable_energy',
  'methane_capture',
  'ocean_restoration',
  'soil_carbon',
  'direct_air_capture',
];

export function RegenerativeMarketplaceShowcase({ 
  projects, 
  isLoading,
  isCompareMode = false,
  selectedForCompare = [],
  onToggleCompare,
}: RegenerativeMarketplaceShowcaseProps) {
  const categorizedProjects = useMemo(() => {
    const categories: Record<ProjectType, CarbonProject[]> = {
      reforestation: [],
      renewable_energy: [],
      methane_capture: [],
      ocean_restoration: [],
      soil_carbon: [],
      direct_air_capture: [],
    };

    projects.forEach((project) => {
      if (categories[project.project_type]) {
        categories[project.project_type].push(project);
      }
    });

    return categories;
  }, [projects]);

  const categoryStats = useMemo(() => {
    const stats: Record<ProjectType, { marketValue: number; participants: number }> = {
      reforestation: { marketValue: 0, participants: 0 },
      renewable_energy: { marketValue: 0, participants: 0 },
      methane_capture: { marketValue: 0, participants: 0 },
      ocean_restoration: { marketValue: 0, participants: 0 },
      soil_carbon: { marketValue: 0, participants: 0 },
      direct_air_capture: { marketValue: 0, participants: 0 },
    };

    Object.entries(categorizedProjects).forEach(([type, typeProjects]) => {
      const typeKey = type as ProjectType;
      typeProjects.forEach((project) => {
        stats[typeKey].marketValue += project.total_credits * project.price_per_credit;
        // Estimate participants based on availability
        stats[typeKey].participants += Math.ceil(project.total_credits / 10);
      });
    });

    return stats;
  }, [categorizedProjects]);

  const totalMarketValue = Object.values(categoryStats).reduce((sum, s) => sum + s.marketValue, 0);
  const totalProjects = projects.length;
  const averagePricePerCredit = projects.length > 0
    ? projects.reduce((sum, p) => sum + p.price_per_credit, 0) / projects.length
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-20 bg-muted rounded" />
              <CardContent className="space-y-3 mt-4">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Market Overview Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Leaf className="w-8 h-8 text-primary" />
            Regenerative Impact Categories
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover vetted regenerative projects organized by ecosystem restoration type
          </p>
        </div>

        {/* Key Marketplace Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4" />
                Total Market Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                ${(totalMarketValue / 1e9).toFixed(1)}B
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Regenerative asset value
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/50 bg-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-emerald-900">
                <BarChart3 className="w-4 h-4" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">{totalProjects}</p>
              <p className="text-xs text-emerald-700 mt-1">
                Verified & certified
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200/50 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-900">
                <Zap className="w-4 h-4" />
                Average Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                ${averagePricePerCredit.toFixed(2)}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Per regenerative credit
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200/50 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-purple-900">
                <Award className="w-4 h-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">6</p>
              <p className="text-xs text-purple-700 mt-1">
                Ecosystem restoration types
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Category Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">
            Explore by Regeneration Type
          </h3>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            6 Categories
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projectTypeCategories.map((type, index) => (
            <ProjectCategoryCard
              key={type}
              type={type}
              projects={categorizedProjects[type]}
              totalMarketValue={categoryStats[type].marketValue}
              participantCount={categoryStats[type].participants}
              index={index}
              isCompareMode={isCompareMode}
              selectedForCompare={selectedForCompare}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      </div>

      {/* Impact Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6"
      >
        <div className="flex items-start gap-4">
          <Leaf className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-2">
              Enterprise-Grade Regeneration
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each project category represents verified regenerative impact verified through satellite monitoring, 
              biodiversity assessments, and carbon accounting. Enterprise investors get institutional-grade 
              verification, compliance with ESG standards, and access to APIs for real-time tracking.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                ISO 14064 Verified
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/30">
                Real-time Monitoring
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30 hover:bg-blue-500/30">
                API Access
              </Badge>
              <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30 hover:bg-amber-500/30">
                ESG Compliant
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
