import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Import routes
import proposalsRouter from './routes/proposals';
import votingRouter from './routes/voting';
import reputationRouter from './routes/reputation';
import delegationRouter from './routes/delegation';
import challengesRouter from './routes/challenges';
import impactRouter from './routes/impact';
import analyticsRouter from './routes/analytics';
import membersRouter from './routes/members';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API root
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'Decentralized AI Governance API',
    version: '1.0.0',
    endpoints: {
      proposals: '/api/proposals',
      voting: '/api/voting',
      reputation: '/api/reputation',
      delegation: '/api/delegation',
      challenges: '/api/challenges',
      impact: '/api/impact',
      analytics: '/api/analytics',
      members: '/api/members'
    }
  });
});

// Mount routes
app.use('/api/proposals', proposalsRouter);
app.use('/api/voting', votingRouter);
app.use('/api/reputation', reputationRouter);
app.use('/api/delegation', delegationRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/impact', impactRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/members', membersRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-proposal', (proposalId: string) => {
    socket.join(`proposal-${proposalId}`);
    console.log(`Socket ${socket.id} joined proposal-${proposalId}`);
  });

  socket.on('leave-proposal', (proposalId: string) => {
    socket.leave(`proposal-${proposalId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io for use in routes
export { io };

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
