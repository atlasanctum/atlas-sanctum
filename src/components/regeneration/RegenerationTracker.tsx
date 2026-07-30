import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  TreePine,
  Droplets,
  Mountain,
  Waves,
  TrendingUp,
  Target,
  Activity,
  Globe
} from 'lucide-react';

interface RegenerationProject {
  id: string;
  name: string;
  type: 'reforestation' | 'soil_restoration' | 'wetland_recovery' | 'marine_restoration' | 'urban_greening';
  location: string;
  area: number; // hectares
  startDate: Date;
  targetCompletion: Date;
  status: 'planning' | 'active' | 'completed' | 'paused';
  progress: number;
  carbonSequestered: number;
  biodiversityScore: number;
  communityImpact: number;
  budget: number;
  spent: number;
  stakeholders: number;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  metrics: {
    name: string;
    target: number;
    current: number;
    unit: string;
  }[];
}

interface RegenerationStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalArea: number;
  carbonSequestered: number;
  biodiversityImproved: number;
  communitiesBenefited: number;
  successRate: number;
}

const RegenerationTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'monitoring' | 'impact'>('overview');
  const [selectedProject, setSelectedProject] = useState<RegenerationProject | null>(null);

  const [regenerationStats, setRegenerationStats] = useState<RegenerationStats>({
    totalProjects: 1247,
    activeProjects: 892,
    completedProjects: 355,
    totalArea: 2500000, // hectares
    carbonSequestered: 15000000, // tons
    biodiversityImproved: 87.5, // percentage
    communitiesBenefited: 45000,
    successRate: 94.2
  });

  const [projects, setProjects] = useState<RegenerationProject[]>([
    {
      id: '1',
      name: 'Amazon Rainforest Corridor',
      type: 'reforestation',
      location: 'Brazil',
      area: 50000,
      startDate: new Date('2023-01-15'),
      targetCompletion: new Date('2028-12-31'),
      status: 'active',
      progress: 65,
      carbonSequestered: 125000,
      biodiversityScore: 82,
      communityImpact: 78,
      budget: 25000000,
      spent: 16250000,
      stakeholders: 45,
      milestones: [
        {
          id: '1',
          title: 'Site Preparation',
          description: 'Clear invasive species and prepare planting areas',
          targetDate: new Date('2023-06-30'),
          completedDate: new Date('2023-06-15'),
          status: 'completed',
          metrics: [
            { name: 'Area Prepared', target: 50000, current: 50000, unit: 'ha' }
          ]
        },
        {
          id: '2',
          title: 'Seedling Production',
          description: 'Produce and nurture native tree seedlings',
          targetDate: new Date('2024-12-31'),
          status: 'in_progress',
          metrics: [
            { name: 'Seedlings Produced', target: 2500000, current: 1800000, unit: 'seedlings' }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Mediterranean Soil Recovery',
      type: 'soil_restoration',
      location: 'Spain',
      area: 25000,
      startDate: new Date('2022-09-01'),
      targetCompletion: new Date('2027-08-31'),
      status: 'active',
      progress: 78,
      carbonSequestered: 75000,
      biodiversityScore: 91,
      communityImpact: 85,
      budget: 12000000,
      spent: 9360000,
      stakeholders: 28,
      milestones: [
        {
          id: '1',
          title: 'Soil Analysis',
          description: 'Complete comprehensive soil testing',
          targetDate: new Date('2023-02-28'),
          completedDate: new Date('2023-02-20'),
          status: 'completed',
          metrics: [
            { name: 'Samples Tested', target: 500, current: 500, unit: 'samples' }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Great Barrier Reef Protection',
      type: 'marine_restoration',
      location: 'Australia',
      area: 100000,
      startDate: new Date('2021-03-01'),
      targetCompletion: new Date('2030-02-28'),
      status: 'active',
      progress: 45,
      carbonSequestered: 50000,
      biodiversityScore: 76,
      communityImpact: 92,
      budget: 50000000,
      spent: 22500000,
      stakeholders: 67,
      milestones: [
        {
          id: '1',
          title: 'Coral Nursery Setup',
          description: 'Establish coral nurseries for breeding',
          targetDate: new Date('2022-12-31'),
          completedDate: new Date('2022-11-30'),
          status: 'completed',
          metrics: [
            { name: 'Coral Fragments', target: 10000, current: 8500, unit: 'fragments' }
          ]
        }
      ]
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'projects', label: 'Projects', icon: TreePine },
    { id: 'monitoring', label: 'Monitoring', icon: TrendingUp },
    { id: 'impact', label: 'Impact', icon: Target }
  ];

  const ProjectCard: React.FC<{ project: RegenerationProject }> = ({ project }) => {
    const statusColors = {
      planning: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      active: 'bg-green-500/10 text-green-500 border-green-500/20',
      completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };

    const typeIcons = {
      reforestation: TreePine,
      soil_restoration: Mountain,
      wetland_recovery: Droplets,
      marine_restoration: Waves,
      urban_greening: Globe
    };

    const TypeIcon = typeIcons[project.type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedProject(project)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{project.name}</h3>
              <p className="text-sm text-muted-foreground">{project.location}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}>
            {project.status.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{project.progress}%</div>
            <p className="text-xs text-muted-foreground">Progress</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{project.area.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Hectares</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Carbon Sequestered</span>
            <span className="font-medium">{project.carbonSequestered.toLocaleString()} tons</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Biodiversity Score</span>
            <span className="font-medium">{project.biodiversityScore}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget Spent</span>
            <span className="font-medium">${(project.spent / 1000000).toFixed(1)}M</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Target Completion</span>
            <span className="font-medium">{project.targetCompletion.toLocaleDateString()}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const MilestoneCard: React.FC<{ milestone: Milestone }> = ({ milestone }) => {
    const statusColors = {
      pending: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      completed: 'bg-green-500/10 text-green-500 border-green-500/20',
      delayed: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-start space-x-4 p-4 border border-border/50 rounded-lg"
      >
        <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
          milestone.status === 'completed' ? 'bg-green-500' :
          milestone.status === 'in_progress' ? 'bg-blue-500' :
          milestone.status === 'delayed' ? 'bg-red-500' : 'bg-gray-500'
        }`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-foreground">{milestone.title}</h4>
            <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[milestone.status]}`}>
              {milestone.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>

          <div className="space-y-2">
            {milestone.metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{metric.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {metric.current.toLocaleString()}/{metric.target.toLocaleString()} {metric.unit}
                  </span>
                  <div className="w-16 h-2 bg-muted rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(metric.current / metric.target) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Target: {milestone.targetDate.toLocaleDateString()}</span>
            {milestone.completedDate && (
              <span>Completed: {milestone.completedDate.toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Regeneration Tracker</h1>
              <p className="text-muted-foreground mt-1">Monitor and manage ecosystem restoration projects</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">{regenerationStats.successRate}% Success Rate</span>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <TreePine className="w-4 h-4 inline mr-2" />
                Start New Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{regenerationStats.totalProjects.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{regenerationStats.activeProjects.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{regenerationStats.completedProjects.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500">{(regenerationStats.totalArea / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground">Hectares</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">{(regenerationStats.carbonSequestered / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground">CO₂ Tons</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-500">{regenerationStats.biodiversityImproved}%</div>
              <div className="text-xs text-muted-foreground">Biodiversity</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-pink-500">{regenerationStats.communitiesBenefited.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-500">{regenerationStats.successRate}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'projects' | 'monitoring' | 'impact')}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Project Type Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Project Types</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'Reforestation', count: 456, percentage: 36.5, color: 'bg-green-500' },
                      { type: 'Soil Restoration', count: 312, percentage: 25.1, color: 'bg-brown-500' },
                      { type: 'Marine Restoration', count: 234, percentage: 18.8, color: 'bg-blue-500' },
                      { type: 'Wetland Recovery', count: 156, percentage: 12.5, color: 'bg-cyan-500' },
                      { type: 'Urban Greening', count: 89, percentage: 7.1, color: 'bg-purple-500' }
                    ].map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium text-foreground">{item.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Regional Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { region: 'Latin America', projects: 423, area: 850000 },
                      { region: 'Africa', projects: 312, area: 620000 },
                      { region: 'Asia Pacific', projects: 289, area: 580000 },
                      { region: 'Europe', projects: 156, area: 310000 },
                      { region: 'North America', projects: 67, area: 140000 }
                    ].map((item) => (
                      <div key={item.region} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">{item.region}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.projects} projects • {(item.area / 1000).toFixed(0)}K ha
                          </div>
                        </div>
                        <div className="w-16 h-2 bg-muted rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${(item.projects / 423) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    {
                      action: 'Project milestone completed',
                      project: 'Amazon Rainforest Corridor',
                      details: 'Site preparation phase completed ahead of schedule',
                      time: '2 hours ago',
                      type: 'success'
                    },
                    {
                      action: 'New project initiated',
                      project: 'Mediterranean Soil Recovery',
                      details: 'Phase 2 soil amendment program started',
                      time: '1 day ago',
                      type: 'info'
                    },
                    {
                      action: 'Biodiversity milestone reached',
                      project: 'Great Barrier Reef Protection',
                      details: 'Coral coverage increased by 15% in monitored areas',
                      time: '3 days ago',
                      type: 'success'
                    },
                    {
                      action: 'Funding milestone achieved',
                      project: 'Serengeti Restoration',
                      details: '$2.5M additional funding secured for grassland recovery',
                      time: '1 week ago',
                      type: 'success'
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-border/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground">{activity.action}</h4>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm font-medium text-primary mb-1">{activity.project}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Project Filters */}
              <div className="flex flex-wrap gap-4">
                <select className="px-4 py-2 border border-border/50 rounded-lg bg-background">
                  <option>All Types</option>
                  <option>Reforestation</option>
                  <option>Soil Restoration</option>
                  <option>Marine Restoration</option>
                </select>
                <select className="px-4 py-2 border border-border/50 rounded-lg bg-background">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Planning</option>
                  <option>Completed</option>
                </select>
                <select className="px-4 py-2 border border-border/50 rounded-lg bg-background">
                  <option>All Regions</option>
                  <option>Latin America</option>
                  <option>Africa</option>
                  <option>Asia Pacific</option>
                </select>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {/* Project Details Modal */}
              <AnimatePresence>
                {selectedProject && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedProject(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-6 border-b border-border/50">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-foreground">{selectedProject.name}</h2>
                          <button
                            onClick={() => setSelectedProject(null)}
                            className="p-2 hover:bg-muted rounded-lg"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-muted-foreground mt-2">{selectedProject.location}</p>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Project Overview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{selectedProject.progress}%</div>
                            <p className="text-sm text-muted-foreground">Progress</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{selectedProject.area.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">Hectares</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">{selectedProject.carbonSequestered.toLocaleString()}</div>
                            <p className="text-sm text-muted-foreground">CO₂ Tons</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-500">{selectedProject.stakeholders}</div>
                            <p className="text-sm text-muted-foreground">Stakeholders</p>
                          </div>
                        </div>

                        {/* Milestones */}
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">Project Milestones</h3>
                          <div className="space-y-4">
                            {selectedProject.milestones.map((milestone) => (
                              <MilestoneCard key={milestone.id} milestone={milestone} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'monitoring' && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Real-time Monitoring</h3>
                  <div className="space-y-4">
                    {[
                      { metric: 'Soil Moisture', value: '68%', trend: 'up', status: 'good' },
                      { metric: 'Tree Survival Rate', value: '94%', trend: 'up', status: 'excellent' },
                      { metric: 'Biodiversity Index', value: '8.2', trend: 'stable', status: 'good' },
                      { metric: 'Carbon Sequestration', value: '1,247 tons/week', trend: 'up', status: 'excellent' }
                    ].map((item) => (
                      <div key={item.metric} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{item.metric}</div>
                          <div className="text-sm text-muted-foreground">{item.value}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'excellent' ? 'bg-green-500' :
                            item.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`} />
                          <TrendingUp className={`w-4 h-4 ${
                            item.trend === 'up' ? 'text-green-500' : 'text-muted-foreground'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Alert System</h3>
                  <div className="space-y-4">
                    {[
                      {
                        type: 'warning',
                        message: 'Drought conditions detected in Kenya project area',
                        time: '2 hours ago',
                        project: 'Mediterranean Soil Recovery'
                      },
                      {
                        type: 'success',
                        message: 'Milestone achieved: 10,000 trees planted',
                        time: '1 day ago',
                        project: 'Amazon Rainforest Corridor'
                      },
                      {
                        type: 'info',
                        message: 'Weather monitoring system updated',
                        time: '3 days ago',
                        project: 'Great Barrier Reef Protection'
                      }
                    ].map((alert, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border border-border/50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.type === 'warning' ? 'bg-yellow-500' :
                          alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{alert.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">{alert.project}</span>
                            <span className="text-xs text-muted-foreground">{alert.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'impact' && (
            <motion.div
              key="impact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Environmental Impact</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Carbon Sequestration</span>
                        <span className="font-medium">15.2M tons CO₂</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">87% of 2030 target achieved</p>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Biodiversity Enhancement</span>
                        <span className="font-medium">+45,230 species</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full" style={{ width: '78%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">12% above baseline</p>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Soil Health Improvement</span>
                        <span className="font-medium">+32% organic matter</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div className="bg-brown-500 h-3 rounded-full" style={{ width: '65%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Ongoing monitoring</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Social Impact</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Communities Benefited</span>
                        <span className="font-medium">45,678 people</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div className="bg-purple-500 h-3 rounded-full" style={{ width: '92%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Direct beneficiaries</p>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Jobs Created</span>
                        <span className="font-medium">12,456 positions</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div className="bg-orange-500 h-3 rounded-full" style={{ width: '76%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Full-time equivalent</p>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Education Programs</span>
                        <span className="font-medium">234 schools</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div className="bg-cyan-500 h-3 rounded-full" style={{ width: '88%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Environmental education</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Stories */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Impact Stories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Forest Corridor Success',
                      story: 'The Amazon Rainforest Corridor project has successfully connected 50,000 hectares of fragmented forest, allowing wildlife migration and preventing species extinction.',
                      metrics: '2,340 animal crossings recorded',
                      image: '🌳'
                    },
                    {
                      title: 'Community Transformation',
                      story: 'Indigenous communities in Kenya have increased their agricultural yields by 40% through regenerative soil practices, improving food security and income.',
                      metrics: '$2.1M additional annual income',
                      image: '👥'
                    }
                  ].map((story, index) => (
                    <div key={index} className="border border-border/50 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{story.image}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-2">{story.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{story.story}</p>
                          <div className="text-sm font-medium text-primary">{story.metrics}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegenerationTracker;