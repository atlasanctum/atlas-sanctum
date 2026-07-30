import express from 'express';
import { evaluateAction, listPolicies, addPolicy } from '../services/ethics';

const router = express.Router();

router.post('/evaluate', (req, res) => {
  const action = req.body;
  if (!action) return res.status(422).json({ code: 'invalid', message: 'action required' });
  const result = evaluateAction(action);
  res.json(result);
});

router.get('/policies', (req, res) => {
  res.json(listPolicies());
});

router.post('/policies', (req, res) => {
  // admin only in future; Phase 0 allows open creation for testing
  const rule = req.body;
  const added = addPolicy(rule);
  res.status(201).json(added);
});

export default router;
