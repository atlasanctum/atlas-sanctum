import express from 'express';
import { query } from '../db';
import { hashPassword, verifyPassword } from '../utils/auth';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) return res.status(422).json({ code: 'invalid', message: 'Email and password required' });
  try {
    const hash = await hashPassword(password);
    const result = await query('INSERT INTO users (email, display_name, password_hash) VALUES ($1,$2,$3) RETURNING id,email,display_name', [email, displayName, hash]);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(422).json({ code: 'invalid', message: 'Email and password required' });
  try {
    const result = await query('SELECT id,email,display_name,password_hash FROM users WHERE email=$1', [email]);
    if (result.rowCount === 0) return res.status(401).json({ code: 'unauthorized' });

    const user = result.rows[0];
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) return res.status(401).json({ code: 'unauthorized' });

    // NOTE: For Phase 0 we return user; token generation to be added.
    res.json({ id: user.id, email: user.email, displayName: user.display_name });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

export default router;
