import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, Loader2, Repeat, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProjectOption {
  id: string;
  title: string;
  price_per_credit: number;
  co2_offset_per_credit: number;
}

interface DonationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  onSuccess?: () => void;
  defaultProjectId?: string;
}

const PRESETS = [25, 100, 500, 1000];

export const DonationFormDialog = ({ open, onOpenChange, userId, onSuccess, defaultProjectId }: DonationFormDialogProps) => {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectId, setProjectId] = useState<string>(defaultProjectId ?? '');
  const [amount, setAmount] = useState<number>(100);
  const [frequency, setFrequency] = useState<'one_time' | 'monthly'>('one_time');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const { data } = await supabase
        .from('carbon_projects')
        .select('id,title,price_per_credit,co2_offset_per_credit')
        .eq('status', 'active')
        .order('title')
        .limit(50);
      if (data) {
        setProjects(data);
        if (!projectId && data[0]) setProjectId(defaultProjectId ?? data[0].id);
      }
    })();
  }, [open, defaultProjectId, projectId]);

  const selected = projects.find((p) => p.id === projectId);
  const estCredits = selected && selected.price_per_credit > 0 ? amount / selected.price_per_credit : 0;
  const estOffset = selected ? estCredits * selected.co2_offset_per_credit : 0;

  const handleSubmit = async () => {
    if (!userId) { toast.error('Please sign in to donate.'); return; }
    if (!projectId) { toast.error('Please choose a project.'); return; }
    if (!amount || amount < 1) { toast.error('Amount must be at least $1.'); return; }

    setSubmitting(true);
    try {
      if (frequency === 'one_time') {
        const pricePer = selected?.price_per_credit ?? 1;
        const quantity = Math.max(1, Number((amount / pricePer).toFixed(4)));
        const { error } = await supabase.from('transactions').insert({
          user_id: userId,
          project_id: projectId,
          quantity,
          price_per_credit: pricePer,
          total_amount: amount,
          transaction_type: 'donation',
          status: 'completed',
          payment_method: 'card',
          completed_at: new Date().toISOString(),
        });
        if (error) throw error;
        toast.success(`Donation of $${amount.toLocaleString()} recorded. Thank you!`);
      } else {
        const now = new Date();
        const end = new Date(now); end.setMonth(end.getMonth() + 1);
        const { error } = await supabase.from('subscriptions').insert({
          user_id: userId,
          plan_id: `donation_${projectId}`,
          plan_name: `Monthly Donation · ${selected?.title ?? 'Project'}`,
          amount,
          currency: 'USD',
          billing_period: 'monthly',
          current_period_start: now.toISOString(),
          current_period_end: end.toISOString(),
          status: 'active',
          payment_method: 'card',
          metadata: { type: 'recurring_donation', project_id: projectId },
        });
        if (error) throw error;
        toast.success(`Recurring donation of $${amount}/mo activated.`);
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to record donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-500" /> Make a Donation
          </DialogTitle>
          <DialogDescription>Support a regenerative project one-time or with a monthly commitment.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger><SelectValue placeholder="Select a project" /></SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Frequency</Label>
            <RadioGroup value={frequency} onValueChange={(v) => setFrequency(v as 'one_time' | 'monthly')} className="grid grid-cols-2 gap-2">
              <label className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer ${frequency === 'one_time' ? 'border-emerald-500 bg-emerald-500/5' : ''}`}>
                <RadioGroupItem value="one_time" /> <DollarSign className="w-4 h-4" /> One-time
              </label>
              <label className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer ${frequency === 'monthly' ? 'border-emerald-500 bg-emerald-500/5' : ''}`}>
                <RadioGroupItem value="monthly" /> <Repeat className="w-4 h-4" /> Monthly
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Amount (USD)</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Button key={p} type="button" variant={amount === p ? 'default' : 'outline'} size="sm" onClick={() => setAmount(p)}>
                  ${p}
                </Button>
              ))}
            </div>
            <Input type="number" min={1} step={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>

          {selected && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Estimated credits</span><span className="tabular-nums font-medium">{estCredits.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Estimated CO₂ offset</span><span className="tabular-nums font-medium">{estOffset.toFixed(2)} tons</span></div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting || !projectId} className="gap-2">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
            {frequency === 'monthly' ? `Donate $${amount}/mo` : `Donate $${amount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonationFormDialog;