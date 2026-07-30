import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Transition variants — swap the name prop to pick a different feel per page
const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -12 },
  },
  slideRight: {
    initial: { opacity: 0, x: -32 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: 32 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 1.02 },
  },
} as const;

export type TransitionVariant = keyof typeof variants;

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: TransitionVariant;
}

// Route-to-variant map — dashboards slide up, detail pages fade, auth pages scale
const routeVariants: Record<string, TransitionVariant> = {
  '/auth':               'scale',
  '/dashboard':          'slideUp',
  '/marketplace':        'slideUp',
  '/portfolio':          'slideUp',
  '/governance':         'slideUp',
  '/measurements':       'slideUp',
  '/bioregions':         'slideRight',
  '/valuation':          'slideRight',
  '/regenerative-agriculture': 'slideRight',
  '/health':             'slideRight',
  '/security':           'fade',
  '/adoption':           'fade',
  '/outreach':           'fade',
};

function pickVariant(pathname: string, override?: TransitionVariant): TransitionVariant {
  if (override) return override;
  // Exact match first, then prefix match for parameterised routes like /project/:id
  if (routeVariants[pathname]) return routeVariants[pathname];
  const prefix = Object.keys(routeVariants).find(k => pathname.startsWith(k) && k !== '/');
  return prefix ? routeVariants[prefix] : 'slideUp';
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, variant }) => {
  const { pathname } = useLocation();
  const v = variants[pickVariant(pathname, variant)];

  return (
    <motion.div
      key={pathname}
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      // Prevent layout shift during transition
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
