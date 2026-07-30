import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ManagementLinkProps {
  title: string;
  description: string;
  dashboardType: 'impact' | 'refi' | 'admin';
}

export const ManagementLink: React.FC<ManagementLinkProps> = ({
  title,
  description,
  dashboardType,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (dashboardType === 'admin') {
      navigate('/admin');
    } else {
      // For customer-facing dashboards, we can navigate to the respective tab
      const tabParam = dashboardType === 'impact' ? 'impact' : 'refi';
      navigate(`/marketplace?tab=${tabParam}`);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-700 transition-colors">
      <h3 className="text-xl font-bold text-emerald-400 mb-2">{title}</h3>
      <p className="text-slate-400 mb-4">{description}</p>
      <Button
        onClick={handleClick}
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
