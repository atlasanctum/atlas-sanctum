import { motion } from "framer-motion";
import { Shield, Heart, Scale, Eye, Globe, Brain } from "lucide-react";

export interface EthicsPrinciple {
  id: string;
  name: string;
  description: string;
  icon: string;
  weight: number;
}

const principles: EthicsPrinciple[] = [
  {
    id: "1",
    name: "Human Dignity",
    description: "Respect for the inherent worth and rights of all individuals",
    icon: "heart",
    weight: 95,
  },
  {
    id: "2",
    name: "Fairness & Justice",
    description: "Equitable treatment and impartial decision-making processes",
    icon: "scale",
    weight: 92,
  },
  {
    id: "3",
    name: "Transparency",
    description: "Open, explainable, and auditable AI decision-making",
    icon: "eye",
    weight: 88,
  },
  {
    id: "4",
    name: "Privacy Protection",
    description: "Safeguarding personal data and individual autonomy",
    icon: "shield",
    weight: 90,
  },
  {
    id: "5",
    name: "Global Welfare",
    description: "Promoting collective well-being and sustainable development",
    icon: "globe",
    weight: 87,
  },
  {
    id: "6",
    name: "Responsible AI",
    description: "Ethical development and deployment of AI systems",
    icon: "brain",
    weight: 93,
  },
];

const iconMap: Record<string, any> = {
  heart: Heart,
  scale: Scale,
  eye: Eye,
  shield: Shield,
  globe: Globe,
  brain: Brain,
};

export function EthicsFramework() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="mb-2">Universal Ethics Framework</h2>
        <p className="text-gray-600">
          Our AI-driven decision-making is grounded in these fundamental ethical principles,
          ensuring every proposal is evaluated against universal values.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {principles.map((principle, index) => {
          const Icon = iconMap[principle.icon];
          return (
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm mb-1">{principle.name}</h3>
                  <p className="text-xs text-gray-600">{principle.description}</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Priority Weight</span>
                  <span className="text-xs">{principle.weight}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full"
                    style={{ width: `${principle.weight}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 bg-indigo-600 text-white rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5" />
          <h4 className="text-sm">How AI Ethics Scoring Works</h4>
        </div>
        <p className="text-sm opacity-90">
          Each proposal is automatically evaluated by our AI system against these ethical principles.
          The AI analyzes potential impacts, identifies ethical concerns, and provides transparency
          reports. All evaluations are recorded on-chain for complete auditability.
        </p>
      </div>
    </div>
  );
}
