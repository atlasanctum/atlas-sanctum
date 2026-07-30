/**
 * InvestmentFlow Page - Placeholder
 * 
 * Multi-step wizard for investing in regenerative projects
 * TODO: Fully implement investment wizard
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Leaf, Award, CreditCard, Check, ShoppingCart } from 'lucide-react';
import { useProjects } from '@/hooks/useMarketplace';
import type { CarbonProject } from '@/types/marketplace';
import { PROJECT_TYPE_ICONS, PROJECT_TYPE_LABELS } from '@/types/marketplace';

export default function InvestmentFlow() {
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useProjects();
  const [step, setStep] = useState(0);
  const [selectedProjects, setSelectedProjects] = useState<Array<{ project: CarbonProject; quantity: number }>>([]);

  const toggleProject = (project: CarbonProject) => {
    const existing = selectedProjects.find(p => p.project.id === project.id);
    if (existing) {
      setSelectedProjects(selectedProjects.filter(p => p.project.id !== project.id));
    } else {
      setSelectedProjects([...selectedProjects, { project, quantity: 1 }]);
    }
  };

  const totalAmount = selectedProjects.reduce(
    (sum, p) => sum + p.project.price_per_credit * p.quantity, 
    0
  );

  const totalCredits = selectedProjects.reduce(
    (sum, p) => sum + p.quantity, 
    0
  );

  const steps = ['Select Projects', 'Review', 'Complete'];

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((stepName, idx) => (
            <div key={stepName} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                idx <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {idx < step ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-sm ${idx <= step ? 'text-foreground' : 'text-muted-foreground'}`}>
                {stepName}
              </span>
              {idx < steps.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 0 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Select Projects to Invest In
                </CardTitle>
                <CardDescription>
                  Choose one or more projects from our verified marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
                ) : (
                  <div className="grid gap-3">
                    {projects.slice(0, 6).map((project) => {
                      const isSelected = selectedProjects.some(p => p.project.id === project.id);
                      return (
                        <button
                          key={project.id}
                          onClick={() => toggleProject(project)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{PROJECT_TYPE_ICONS[project.project_type]}</span>
                              <div>
                                <h4 className="font-medium text-foreground">{project.title}</h4>
                                <p className="text-sm text-muted-foreground">{project.location}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">${project.price_per_credit}/credit</p>
                              <Badge variant="secondary">{PROJECT_TYPE_LABELS[project.project_type]}</Badge>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary */}
            {selectedProjects.length > 0 && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Selected Projects</p>
                      <p className="text-xl font-bold text-foreground">{selectedProjects.length} project(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Estimated Total</p>
                      <p className="text-xl font-bold text-primary">${totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/marketplace')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button>
              <Button 
                onClick={() => setStep(1)} 
                disabled={selectedProjects.length === 0}
              >
                Review Selection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Review Your Investment
                </CardTitle>
                <CardDescription>
                  Confirm your project selections before checkout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProjects.map(({ project, quantity }) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{PROJECT_TYPE_ICONS[project.project_type]}</span>
                      <div>
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">{quantity} credit(s) × ${project.price_per_credit}</p>
                      </div>
                    </div>
                    <p className="font-bold text-foreground">${(quantity * project.price_per_credit).toFixed(2)}</p>
                  </div>
                ))}

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Investment</span>
                    <span className="text-primary">${totalAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {totalCredits} carbon credit(s) • Estimated CO₂ offset: {(totalCredits * 1).toFixed(1)} tonnes
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep(2)}>
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Payment
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-6 flex items-center justify-center">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Investment Complete!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your investment in regenerative projects.
                  Your carbon credits are now in your portfolio.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/portfolio">View Portfolio</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/marketplace">Continue Investing</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
}