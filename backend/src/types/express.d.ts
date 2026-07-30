import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
      sessionID?: string;
    }
  }
}
