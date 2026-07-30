import { motion } from "framer-motion";
import { Wallet, Globe2, Layers, Settings, ExternalLink } from "lucide-react";

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  showImpactSummary?: boolean;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  { label: "Buy Credits", icon: Wallet, href: "/marketplace", description: "Purchase carbon credits" },
  { label: "My Portfolio", icon: Globe2, href: "/portfolio", description: "View your holdings" },
  { label: "Explore Projects", icon: Layers, href: "/marketplace", description: "Browse available projects" },
  { label: "Settings", icon: Settings, href: "/settings", description: "Manage your account" },
];

const QuickActions = ({ 
  actions = DEFAULT_ACTIONS,
  showImpactSummary = true
}: QuickActionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
    >
      <h2 className="font-display text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.a
            key={action.label}
            href={action.href}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
            title={action.description}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <action.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium text-foreground flex-1">{action.label}</span>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
          </motion.a>
        ))}
      </div>

      {showImpactSummary && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-ocean/10 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Your Impact</h3>
          <p className="text-sm text-muted-foreground mb-3">
            You've contributed to protecting 24 hectares of rainforest this month.
          </p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-full bg-gradient-to-r from-primary to-ocean rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">72% toward monthly goal</p>
        </div>
      )}
    </motion.div>
  );
};

export default QuickActions;
