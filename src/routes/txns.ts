import { Router } from 'express';
import logger from '../log';
import adminOnly from '../middleware/adminOnly';

type Txn = {
  txnHash: string;
  number: number; // e.g., block number or sequence number
  meta?: Record<string, unknown>;
  recordedAt: string; // ISO timestamp
};

const txns: Txn[] = [];

const router = Router();

// POST /api/record_txn_by_txn_hash_and_number (public)
router.post('/record_txn_by_txn_hash_and_number', (req, res) => {
  logger.info('record_txn invoked');
  const { txnHash, number, meta } = req.body ?? {};
  if (!txnHash || number === undefined) {
    logger.warn('record_txn missing fields', { hasHash: !!txnHash, hasNumber: number !== undefined });
    return res.status(400).json({ error: 'Missing txnHash or number' });
  }
  const exists = txns.find(t => t.txnHash === txnHash || t.number === Number(number));
  if (exists) {
    logger.warn('record_txn conflict', { txnHash, number: Number(number) });
    return res.status(409).json({ error: 'Transaction already recorded' });
  }
  const txn: Txn = { txnHash, number: Number(number), meta: meta ?? {}, recordedAt: new Date().toISOString() };
  txns.push(txn);
  logger.info('record_txn success', { txnHash, number: txn.number });
  return res.status(201).json({ ok: true, txn });
});

// GET /api/get_txn_details (admin)
router.get('/get_txn_details', adminOnly, (req, res) => {
  const txnHash = req.query.txnHash as string;
  if (!txnHash) return res.status(400).json({ error: 'Missing txnHash' });
  const txn = txns.find(t => t.txnHash === txnHash);
  if (!txn) {
    logger.warn('get_txn_details not found', { txnHash });
    return res.status(404).json({ error: 'Transaction not found' });
  }
  // Return a subset to simulate "details"
  return res.json({ ok: true, details: { txnHash: txn.txnHash, number: txn.number, recordedAt: txn.recordedAt } });
});

// GET /api/get_full_txn_record (admin)
router.get('/get_full_txn_record', adminOnly, (req, res) => {
  const txnHash = (req.query.txnHash as string) || '';
  const number = req.query.number ? Number(req.query.number) : undefined;
  let txn = undefined as Txn | undefined;
  if (txnHash) txn = txns.find(t => t.txnHash === txnHash);
  if (!txn && number !== undefined) txn = txns.find(t => t.number === number);
  if (!txn) {
    logger.warn('get_full_txn_record not found', { txnHash, number });
    return res.status(404).json({ error: 'Transaction not found' });
  }
  return res.json({ ok: true, txn });
});

// GET /api/get_txn_info_by_number_or_hash (adminn -> admin)
router.get('/get_txn_info_by_number_or_hash', adminOnly, (req, res) => {
  const txnHash = (req.query.txnHash as string) || '';
  const number = req.query.number ? Number(req.query.number) : undefined;
  let txn = undefined as Txn | undefined;
  if (txnHash) txn = txns.find(t => t.txnHash === txnHash);
  if (!txn && number !== undefined) txn = txns.find(t => t.number === number);
  if (!txn) {
    logger.warn('get_txn_info_by_number_or_hash not found', { txnHash, number });
    return res.status(404).json({ error: 'Transaction not found' });
  }
  // Simulate a summarized info response
  const info = { id: `${txn.number}:${txn.txnHash}`, when: txn.recordedAt };
  return res.json({ ok: true, info });
});

export default router;
