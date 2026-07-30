import { useState } from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CarbonProject, ProjectType} from '@/types/marketplace';
import { PROJECT_TYPE_LABELS, PROJECT_TYPE_ICONS } from '@/types/marketplace';
import { PurchaseModal } from './PurchaseModal';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface ProjectCategoryCategoryCardProps {
  type: ProjectType;
  projects: CarbonProject[];
  totalMarketValue: number;
  participantCount: number;
  index: number;
  isCompareMode?: boolean;
  selectedForCompare?: CarbonProject[];
  onToggleCompare?: (project: CarbonProject) => void;
}

const categoryDescriptions: Record<ProjectType, string> = {
  reforestation: 'Restore forests and create lasting ecosystems through strategic reforestation initiatives',
  renewable_energy: 'Transition to clean energy with solar, wind, and hydroelectric projects',
  methane_capture: 'Capture and reduce methane emissions from agriculture and waste management',
  ocean_restoration: 'Restore marine ecosystems, coral reefs, and ocean biodiversity',
  soil_carbon: 'Build soil health while sequestering carbon through regenerative agriculture',
  direct_air_capture: 'Remove CO₂ directly from the atmosphere using advanced technology',
};

const categoryColors: Record<ProjectType, { bg: string; border: string; text: string; icon: string }> = {
  reforestation: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-900 dark:text-emerald-100',
    icon: '🌲',
  },
  renewable_energy: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-100',
    icon: '⚡',
  },
  methane_capture: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-900 dark:text-purple-100',
    icon: '🏭',
  },
  ocean_restoration: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
    icon: '🌊',
  },
  soil_carbon: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-900 dark:text-orange-100',
    icon: '🌱',
  },
  direct_air_capture: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    border: 'border-cyan-200 dark:border-cyan-800',
    text: 'text-cyan-900 dark:text-cyan-100',
    icon: '💨',
  },
};

export function ProjectCategoryCard({
  type,
  projects,
  totalMarketValue,
  participantCount,
  index,
  isCompareMode = false,
  selectedForCompare = [],
  onToggleCompare,
}: ProjectCategoryCategoryCardProps) {
  const colors = categoryColors[type];
  const topProjects = projects.slice(0, 3);
  const totalCredits = projects.reduce((sum, p) => sum + p.total_credits, 0);
  const totalAvailable = projects.reduce((sum, p) => sum + p.available_credits, 0);
  
  const [selectedProject, setSelectedProject] = useState<CarbonProject | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { user } = useSupabaseAuth();

  const handleBuyNow = (project: CarbonProject, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedProject(project);
    setShowPurchaseModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className={`overflow-hidden border-2 ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300`} role="article" aria-labelledby={`category-title-${type}`}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{PROJECT_TYPE_ICONS[type]}</span>
                  <div>
                    <CardTitle id={`category-title-${type}`} className={`text-2xl ${colors.text}`}>
                      {PROJECT_TYPE_LABELS[type]}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className={`${colors.text} opacity-85`}>
                  {categoryDescriptions[type]}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Category Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-lg bg-background/50 border ${colors.border}`}>
                <p className="text-xs text-muted-foreground mb-1">Active Projects</p>
                <p className={`text-2xl font-bold ${colors.text}`}>
                  {projects.length}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-background/50 border ${colors.border}`}>
                <p className="text-xs text-muted-foreground mb-1">Market Value</p>
                <p className={`text-2xl font-bold ${colors.text}`}>
                  ${(totalMarketValue / 1e9).toFixed(1)}B
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-background/50 border ${colors.border}`}>
                <p className="text-xs text-muted-foreground mb-1">Total Credits</p>
                <p className={`text-2xl font-bold ${colors.text}`}>
                  {(totalCredits / 1e6).toFixed(1)}M
                </p>
              </div>
            </div>

            {/* Top Projects Preview with Buy Button */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                Featured Projects ({Math.min(topProjects.length, 3)} of {projects.length})
              </h4>
              <div className="space-y-2">
                {topProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg bg-background/60 border transition-colors group ${
                      isCompareMode && selectedForCompare.some(p => p.id === project.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-background/80 hover:bg-background'
                    }`}
                  >
                    {/* Compare Checkbox */}
                    {isCompareMode && (
                      <div className="mr-3 flex-shrink-0">
                        <Checkbox
                          checked={selectedForCompare.some(p => p.id === project.id)}
                          onCheckedChange={() => onToggleCompare?.(project)}
                          disabled={!selectedForCompare.some(p => p.id === project.id) && selectedForCompare.length >= 4}
                          aria-label={`Select ${project.title} for comparison`}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/project/${project.id}`}
                        className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors"
                      >
                        {project.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {project.location}, {project.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">${project.price_per_credit}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((project.available_credits / project.total_credits) * 100)}% available
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={(e) => handleBuyNow(project, e)}
                        aria-label={`Buy credits from ${project.title}`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                        Buy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="flex items-center gap-3 pt-2 border-t">
              <div className="flex items-center gap-1.5 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {participantCount.toLocaleString()} investors
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {totalAvailable.toLocaleString()} credits available
                </span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Link to="/explore-verified-projects" aria-label={`Explore ${PROJECT_TYPE_LABELS[type]} category`}>
                Explore Category
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Purchase Modal */}
      {selectedProject && (
        <PurchaseModal
          project={selectedProject}
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedProject(null);
          }}
        />
      )}
    </>
  );
}