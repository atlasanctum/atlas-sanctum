import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Calculator, Car, Home, Plane, ShoppingBag, Utensils,
  Leaf, ArrowRight, TrendingDown, Zap, Factory, TreeDeciduous
} from 'lucide-react';
import { useProjects } from '@/hooks/useMarketplace';
import { PROJECT_TYPE_ICONS } from '@/types/marketplace';

interface EmissionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  unit: string;
  factor: number; // kg CO2 per unit
  defaultValue: number;
}

const personalCategories: EmissionCategory[] = [
  { id: 'driving', name: 'Driving (miles/year)', icon: <Car className="w-5 h-5" />, unit: 'miles', factor: 0.411, defaultValue: 12000 },
  { id: 'flights', name: 'Flights (hours/year)', icon: <Plane className="w-5 h-5" />, unit: 'hours', factor: 250, defaultValue: 10 },
  { id: 'electricity', name: 'Electricity (kWh/month)', icon: <Zap className="w-5 h-5" />, unit: 'kWh', factor: 0.42, defaultValue: 900 },
  { id: 'heating', name: 'Heating (therms/year)', icon: <Home className="w-5 h-5" />, unit: 'therms', factor: 5.3, defaultValue: 500 },
  { id: 'diet', name: 'Diet Impact (1-10 scale)', icon: <Utensils className="w-5 h-5" />, unit: 'score', factor: 500, defaultValue: 5 },
  { id: 'shopping', name: 'Shopping ($$/month)', icon: <ShoppingBag className="w-5 h-5" />, unit: '$', factor: 0.02, defaultValue: 500 },
];

const businessCategories: EmissionCategory[] = [
  { id: 'employees', name: 'Employees', icon: <Factory className="w-5 h-5" />, unit: 'people', factor: 4000, defaultValue: 50 },
  { id: 'officeSpace', name: 'Office Space (sq ft)', icon: <Home className="w-5 h-5" />, unit: 'sq ft', factor: 15, defaultValue: 5000 },
  { id: 'businessTravel', name: 'Business Travel ($/year)', icon: <Plane className="w-5 h-5" />, unit: '$', factor: 0.5, defaultValue: 50000 },
  { id: 'electricity', name: 'Electricity (kWh/month)', icon: <Zap className="w-5 h-5" />, unit: 'kWh', factor: 0.42, defaultValue: 10000 },
  { id: 'shipping', name: 'Shipping (packages/year)', icon: <ShoppingBag className="w-5 h-5" />, unit: 'packages', factor: 2, defaultValue: 1000 },
];

export default function CarbonCalculator() {
  const [mode, setMode] = useState<'personal' | 'business'>('personal');
  const [values, setValues] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const { data: projects = [] } = useProjects();

  const categories = mode === 'personal' ? personalCategories : businessCategories;

  const getValue = (id: string, defaultVal: number) => values[id] ?? defaultVal;

  const totalEmissions = useMemo(() => {
    return categories.reduce((sum, cat) => {
      const value = getValue(cat.id, cat.defaultValue);
      let emission = value * cat.factor;
      // Adjust for annual values
      if (cat.id === 'electricity' || cat.id === 'shopping') {
        emission *= 12; // monthly to yearly
      }
      return sum + emission;
    }, 0) / 1000; // Convert to tonnes
  }, [categories, values]);

  const recommendedProjects = useMemo(() => {
    if (!projects.length) return [];
    // Sort by price efficiency (cost per tonne CO2)
    return [...projects]
      .filter(p => p.available_credits > 0)
      .map(p => ({
        ...p,
        efficiency: p.price_per_credit / p.co2_offset_per_credit,
        creditsNeeded: Math.ceil(totalEmissions / p.co2_offset_per_credit),
        totalCost: Math.ceil(totalEmissions / p.co2_offset_per_credit) * p.price_per_credit,
      }))
      .sort((a, b) => a.efficiency - b.efficiency)
      .slice(0, 3);
  }, [projects, totalEmissions]);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setValues({});
    setShowResults(false);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Calculator className="w-5 h-5" />
            <span className="font-medium">Carbon Footprint Calculator</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Calculate Your Carbon Footprint
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estimate your annual carbon emissions and discover projects to offset your environmental impact.
          </p>
        </motion.div>

        <Tabs value={mode} onValueChange={(v) => { setMode(v as any); setShowResults(false); }}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="personal" className="gap-2">
              <Home className="w-4 h-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="business" className="gap-2">
              <Factory className="w-4 h-4" />
              Business
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="bg-card-gradient border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {mode === 'personal' ? <Home className="w-5 h-5" /> : <Factory className="w-5 h-5" />}
                      {mode === 'personal' ? 'Personal Emissions' : 'Business Emissions'}
                    </CardTitle>
                    <CardDescription>
                      Adjust the values below to match your {mode} usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2 text-sm">
                            {category.icon}
                            {category.name}
                          </Label>
                          <span className="text-sm font-medium text-foreground">
                            {getValue(category.id, category.defaultValue).toLocaleString()} {category.unit}
                          </span>
                        </div>
                        <Slider
                          value={[getValue(category.id, category.defaultValue)]}
                          onValueChange={([v]) => setValues({ ...values, [category.id]: v })}
                          min={0}
                          max={category.defaultValue * 3}
                          step={category.defaultValue / 20}
                          className="w-full"
                        />
                      </div>
                    ))}

                    {/* Live Preview */}
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/50 mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Annual Emissions</span>
                        <div className="flex items-center gap-2">
                          <Leaf className="w-5 h-5 text-primary" />
                          <span className="text-2xl font-bold text-foreground">
                            {totalEmissions.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">tonnes CO₂</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <Button variant="outline" onClick={handleReset}>
                        Reset
                      </Button>
                      <Button onClick={handleCalculate} className="gap-2">
                        Calculate & Get Recommendations
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Results Summary */}
                <Card className="bg-card-gradient border-border/50 overflow-hidden">
                  <div className="bg-primary/10 p-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"
                    >
                      <TreeDeciduous className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      {totalEmissions.toFixed(1)} tonnes CO₂/year
                    </h2>
                    <p className="text-muted-foreground">
                      Your estimated annual carbon footprint
                    </p>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <TrendingDown className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Trees equivalent</p>
                        <p className="text-xl font-bold text-foreground">
                          {Math.round(totalEmissions * 45)}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Car className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Miles driven equiv.</p>
                        <p className="text-xl font-bold text-foreground">
                          {Math.round(totalEmissions * 2433).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Plane className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">NYC-LA flights</p>
                        <p className="text-xl font-bold text-foreground">
                          {(totalEmissions / 0.9).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Projects */}
                <Card className="bg-card-gradient border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-primary" />
                      Recommended Offset Projects
                    </CardTitle>
                    <CardDescription>
                      Projects selected for best value and impact to offset your emissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendedProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{PROJECT_TYPE_ICONS[project.project_type]}</span>
                            <div>
                              <h4 className="font-semibold text-foreground">{project.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {project.location}, {project.country}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {project.certification}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
                          <div>
                            <p className="text-xs text-muted-foreground">Credits Needed</p>
                            <p className="font-semibold text-foreground">{project.creditsNeeded}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Cost per Credit</p>
                            <p className="font-semibold text-foreground">${project.price_per_credit.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total to Offset</p>
                            <p className="font-semibold text-primary">${project.totalCost.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button asChild className="w-full gap-2">
                            <Link to={`/marketplace/${project.id}`}>
                              View Project
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    ))}

                    {recommendedProjects.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Leaf className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No projects available at the moment.</p>
                        <Button asChild variant="link" className="mt-2">
                          <Link to="/marketplace">Browse All Projects</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => setShowResults(false)}>
                    Adjust Values
                  </Button>
                  <Button asChild>
                    <Link to="/marketplace" className="gap-2">
                      Explore Marketplace
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </div>
    </PageLayout>
  );
}
