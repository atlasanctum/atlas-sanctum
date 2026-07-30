import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { Award, Leaf, AlertTriangle, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { CreditHolding } from '@/types/marketplace';
import { SocialShareButtons } from '@/components/social/SocialShareButtons';

interface RetirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  holding: CreditHolding | null;
}

export function RetirementModal({ isOpen, onClose, holding }: RetirementModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [isRetiring, setIsRetiring] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  if (!holding) return null;

  const project = holding.carbon_projects;
  const totalCO2 = holding.quantity * (project?.co2_offset_per_credit || 1);

  const handleRetire = async () => {
    if (!confirmed) {
      toast.error('Please confirm you understand retirement is permanent');
      return;
    }

    setIsRetiring(true);
    try {
      const newCertificateId = `AS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const { error } = await supabase
        .from('credit_holdings')
        .update({
          retired: true,
          retired_at: new Date().toISOString(),
          certificate_id: newCertificateId,
        })
        .eq('id', holding.id);

      if (error) throw error;

      setCertificateId(newCertificateId);
      setIsComplete(true);
      queryClient.invalidateQueries({ queryKey: ['credit-holdings'] });
      toast.success('Credits retired successfully!');
    } catch (error: any) {
      toast.error(`Retirement failed: ${error.message}`);
    } finally {
      setIsRetiring(false);
    }
  };

  const downloadCertificate = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-certificate', {
        body: { holdingId: holding.id },
      });

      if (error) throw error;

      // Open certificate in new window
      const blob = new Blob([data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error: any) {
      toast.error(`Failed to generate certificate: ${error.message}`);
    }
  };

  const handleClose = () => {
    setConfirmed(false);
    setIsComplete(false);
    setCertificateId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            {isComplete ? 'Credits Retired Successfully!' : 'Retire Carbon Credits'}
          </DialogTitle>
          <DialogDescription>
            {isComplete 
              ? 'Your carbon credits have been permanently retired and a certificate has been generated.'
              : 'Permanently retire credits to claim your environmental impact.'
            }
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, delay: 0.1 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {totalCO2.toFixed(1)} tonnes CO₂ Offset!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Thank you for your contribution to planetary regeneration.
                </p>

                <div className="p-4 rounded-xl bg-muted/50 border border-border/50 mb-6">
                  <p className="text-xs text-muted-foreground mb-1">Certificate ID</p>
                  <p className="font-mono text-sm text-foreground">{certificateId}</p>
                </div>

                <div className="flex gap-3 justify-center flex-wrap">
                  <Button onClick={downloadCertificate} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Certificate
                  </Button>
                  <SocialShareButtons
                    title={`${totalCO2.toFixed(1)} tonnes CO₂ Offset!`}
                    description={`I just retired ${holding.quantity} carbon credits from ${project?.title || 'a regenerative project'} through Atlas Sanctum.`}
                    type="certificate"
                    co2Offset={totalCO2}
                    certificateId={certificateId || undefined}
                  />
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-4"
            >
              {/* Project Info */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{project?.title}</p>
                    <p className="text-sm text-muted-foreground">{project?.location}, {project?.country}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Credits to Retire</p>
                    <p className="text-lg font-bold text-foreground">{holding.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CO₂ Offset</p>
                    <p className="text-lg font-bold text-primary">{totalCO2.toFixed(1)} tonnes</p>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-600 dark:text-amber-400">
                      This action is permanent
                    </p>
                    <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1">
                      Once retired, carbon credits cannot be traded or transferred. 
                      You will receive a certificate proving your environmental contribution.
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked === true)}
                />
                <label
                  htmlFor="confirm"
                  className="text-sm text-muted-foreground cursor-pointer leading-tight"
                >
                  I understand that retiring these credits is permanent and I will receive a certificate 
                  documenting my {totalCO2.toFixed(1)} tonnes CO₂ offset contribution.
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={handleClose} disabled={isRetiring}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleRetire} 
                  disabled={!confirmed || isRetiring}
                  className="gap-2"
                >
                  {isRetiring ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Retiring...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Retire Credits
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
