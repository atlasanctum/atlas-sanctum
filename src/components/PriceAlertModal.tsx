import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    price_per_credit: number;
  };
}

export function PriceAlertModal({ isOpen, onClose, project }: PriceAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(project.price_per_credit.toString());
  const [direction, setDirection] = useState<'above' | 'below'>('below');
  const { createAlert } = usePriceAlerts();

  const handleSubmit = async () => {
    await createAlert.mutateAsync({
      projectId: project.id,
      targetPrice: parseFloat(targetPrice),
      direction,
    });
    onClose();
  };

  const priceDiff = parseFloat(targetPrice) - project.price_per_credit;
  const percentDiff = ((priceDiff / project.price_per_credit) * 100).toFixed(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Set Price Alert
          </DialogTitle>
          <DialogDescription>
            Get notified when {project.title} reaches your target price.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Price */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Current Price</p>
            <p className="text-2xl font-bold text-foreground">
              ${project.price_per_credit.toFixed(2)}
              <span className="text-sm font-normal text-muted-foreground ml-1">per credit</span>
            </p>
          </div>

          {/* Direction Selection */}
          <div className="space-y-3">
            <Label>Alert me when price goes</Label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDirection('below')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  direction === 'below'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <TrendingDown className={`w-6 h-6 mb-2 ${
                  direction === 'below' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className="font-medium text-foreground">Below</p>
                <p className="text-xs text-muted-foreground">Buy opportunity</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDirection('above')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  direction === 'above'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <TrendingUp className={`w-6 h-6 mb-2 ${
                  direction === 'above' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className="font-medium text-foreground">Above</p>
                <p className="text-xs text-muted-foreground">Sell signal</p>
              </motion.button>
            </div>
          </div>

          {/* Target Price Input */}
          <div className="space-y-3">
            <Label htmlFor="targetPrice">Target Price</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="targetPrice"
                type="number"
                step="0.01"
                min="0"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>
            
            {/* Price Difference Indicator */}
            <AnimatePresence mode="wait">
              {targetPrice && parseFloat(targetPrice) !== project.price_per_credit && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    priceDiff < 0 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-ocean/10 text-ocean'
                  }`}
                >
                  {priceDiff < 0 ? (
                    <span>Alert when price drops {Math.abs(parseFloat(percentDiff))}% (${Math.abs(priceDiff).toFixed(2)} less)</span>
                  ) : (
                    <span>Alert when price rises {percentDiff}% (${priceDiff.toFixed(2)} more)</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createAlert.isPending || !targetPrice}
            className="flex-1 gap-2"
          >
            {createAlert.isPending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Set Alert
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
