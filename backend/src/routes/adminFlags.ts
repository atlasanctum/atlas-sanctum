import express from 'express';
import { getAllFlags, isFeatureEnabled, setFeatureFlag } from '../featureFlags';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Read-only for everyone with admin rights
router.get('/', adminAuth, (req, res) => {
  res.json(getAllFlags());
});

// Set a flag value: POST /api/admin/flags/:flag  { value: true }
router.post('/:flag', adminAuth, express.json(), (req, res) => {
  const flag = req.params.flag as string;
  const value = req.body?.value;
  const boolVal = !!value;
  setFeatureFlag(flag, boolVal);
  res.json({ [flag]: isFeatureEnabled(flag) });
});

export default router;
