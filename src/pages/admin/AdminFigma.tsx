import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Lock, AlertTriangle } from 'lucide-react';
import AdminApp from '@/components/admin/adminFigma/app/App';

/**
 * AdminFigma - The Real-Time Command Intelligence Center
 * This component provides secure access to the admin command center
 * featuring real-time command intelligence, system monitoring, and operational control
 * Only users with admin privileges can access this page
 */
const AdminFigma = () => {
  const { isAdmin, loading, user } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-slate-400">Verifying command center access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <Lock className="w-20 h-20 text-amber-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-slate-400 mb-6">Please log in to access the Command Center.</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-2">You don't have permission to access this area.</p>
          <p className="text-slate-500 text-sm mb-6">Admin privileges are required to access the Command Center.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <AdminApp />;
};

export default AdminFigma;
