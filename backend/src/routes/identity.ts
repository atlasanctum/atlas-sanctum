import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Simple DID generation stub
router.post('/create-did', (req, res) => {
  const id = 'did:atlas:' + crypto.randomBytes(8).toString('hex');
  // In Phase 0 we return a minimal DID document
  const doc = {
    id,
    controller: id,
    publicKey: [],
    service: [{ id: id + '#identity', type: 'IdentityService', serviceEndpoint: '/api/identity' }],
  };
  res.status(201).json(doc);
});

// Issue a simple verifiable credential (JWT-like stub)
router.post('/issue-credential', (req, res) => {
  const { subjectDid, type, claims } = req.body;
  if (!subjectDid || !type) return res.status(422).json({ code: 'invalid' });
  const vc = {
    id: 'urn:vc:' + crypto.randomBytes(6).toString('hex'),
    type: ['VerifiableCredential', type],
    issuer: 'did:atlas:issuer',
    issuanceDate: new Date().toISOString(),
    credentialSubject: { id: subjectDid, ...claims },
    proof: { type: 'Ed25519Signature2018', jwkThumbprint: crypto.randomBytes(8).toString('hex') },
  };
  res.status(201).json(vc);
});

router.get('/did/:id', (req, res) => {
  const id = req.params.id;
  // In Phase 0 return a placeholder DID document
  res.json({ id: `did:atlas:${id}`, controller: `did:atlas:${id}` });
});

export default router;
