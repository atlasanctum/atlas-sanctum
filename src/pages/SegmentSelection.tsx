import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboarding } from '@/hooks/useOnboarding';
import type { UserSegment } from '@/types/userSegments';
import { USER_SEGMENTS } from '@/types/userSegments';

export default function SegmentSelection() {
  const navigate = useNavigate();
  const { startOnboarding } = useOnboarding();
  const [selectedSegment, setSelectedSegment] = useState<UserSegment | null>(null);

  const handleSelectSegment = (segmentId: UserSegment) => {
    setSelectedSegment(segmentId);
  };

  const handleContinue = () => {
    if (selectedSegment) {
      startOnboarding(selectedSegment);
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Choose Your Path
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Select Your User Segment
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the segment that best describes your role in the regenerative ecosystem.
            This will customize your onboarding experience and platform features.
          </p>
        </motion.div>

        {/* Segment Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {Object.values(USER_SEGMENTS).map((segment, index) => (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full cursor-pointer transition-all ${
                  selectedSegment === segment.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-md hover:border-primary/50'
                }`}
                onClick={() => handleSelectSegment(segment.id)}
              >
                {selectedSegment === segment.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${segment.color.replace('text-', 'bg-')}/10 mb-4`}>
                    <span className={`text-2xl ${segment.color}`}>
                      {segment.icon === 'TreePine' && '🌲'}
                      {segment.icon === 'GraduationCap' && '🎓'}
                      {segment.icon === 'Briefcase' && '💼'}
                      {segment.icon === 'Building2' && '🏢'}
                      {segment.icon === 'TrendingUp' && '📈'}
                      {segment.icon === 'Network' && '🔗'}
                      {segment.icon === 'Heart' && '❤️'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {segment.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {segment.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <Badge variant="secondary" className="mb-2">
                      {segment.pricingModel}
                    </Badge>
                    <p className={`text-lg font-bold ${segment.color}`}>
                      {segment.priceRange}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-foreground">Key Features:</p>
                    <ul className="space-y-1">
                      {segment.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedSegment}
            className="px-8 py-6 text-lg"
          >
            Continue to Onboarding
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 max-w-2xl mx-auto"
        >
          <div className="bg-muted/50 border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Not sure which segment to choose?</strong> You can always update your segment later in your profile settings.
              Each segment provides a tailored onboarding experience and access to relevant platform features.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
