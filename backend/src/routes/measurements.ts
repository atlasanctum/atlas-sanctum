import express from 'express';
import { query } from '../db';

const router = express.Router();

router.post('/', async (req, res) => {
  const { assetId, source, timestamp, geo, metrics, provenance } = req.body;
  if (!assetId) return res.status(422).json({ code: 'invalid', message: 'assetId required' });
  try {
    const result = await query('INSERT INTO measurements (asset_id, source, timestamp, geo, metrics, provenance) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [assetId, source || null, timestamp || null, geo || {}, metrics || {}, provenance || {}]);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

router.get('/asset/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query('SELECT * FROM measurements WHERE asset_id=$1 ORDER BY timestamp DESC', [id]);
    res.json({ items: result.rows });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

export default router;
