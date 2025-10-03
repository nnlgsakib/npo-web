import { Router } from 'express';
import logger from '../log';
import { createTxn, filterTxns, listTxns, totalAmountTaka } from '../service/txns';

const router = Router();

// POST /api/rec_txn (public)
// Body: { name?: string, number: string, txnId: string, amount: number | string }
router.post('/rec_txn', async (req, res) => {
  logger.info('rec_txn invoked');
  const { name, number, txnId } = req.body ?? {};
  const amountRaw = (req.body ?? {}).amount;

  if (!number || !txnId || amountRaw === undefined) {
    logger.warn('rec_txn missing fields', { hasName: !!name, hasNumber: !!number, hasTxnId: !!txnId, hasAmount: amountRaw !== undefined });
    return res.status(400).json({ error: 'Missing required fields: number, txnId, amount' });
  }

  const amountNum = typeof amountRaw === 'string' ? Number(amountRaw) : Number(amountRaw);
  if (!Number.isFinite(amountNum)) {
    logger.warn('rec_txn invalid amount', { amountRaw });
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const rec = await createTxn({ name, number: String(number), txnId: String(txnId), amount: amountNum });
    return res.status(201).json({ ok: true, txn: rec });
  } catch (err: any) {
    if (err && err.code === 'DUPLICATE') {
      return res.status(409).json({ error: 'Transaction already recorded' });
    }
    logger.error('rec_txn failed', { error: err?.message });
    return res.status(500).json({ error: 'Failed to record transaction' });
  }
});

// GET /api/get_txn_details (public)
// Query: name?: string, number?: string, txnId?: string
// Returns all records matching ALL provided filters (AND logic), matches any provided key
router.get('/get_txn_details', async (req, res) => {
  const name = (req.query.name as string | undefined) || undefined;
  const number = (req.query.number as string | undefined) || undefined;
  const txnId = (req.query.txnId as string | undefined) || undefined;

  if (!name && !number && !txnId) {
    return res.status(400).json({ error: 'Provide at least one of: name, number, txnId' });
  }

  try {
    const matches = await filterTxns({ name, number, txnId });
    logger.info('get_txn_details matches', { count: matches.length });
    return res.json({ ok: true, count: matches.length, txns: matches });
  } catch (err: any) {
    logger.error('get_txn_details failed', { error: err?.message });
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// GET /api/get_full_txn_record (public)
// Query: page?: number (default 1), pageSize?: number (default 20)
router.get('/get_full_txn_record', async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
  const pageSizeRaw = parseInt(String(req.query.pageSize ?? '20'), 10);
  const pageSize = Math.min(100, Math.max(1, Number.isFinite(pageSizeRaw) ? pageSizeRaw : 20));

  try {
    const [all, total] = await Promise.all([listTxns(), totalAmountTaka()]);
    const start = (page - 1) * pageSize;
    const items = all.slice(start, start + pageSize);
    return res.json({ ok: true, totalAmount: total, count: all.length, page, pageSize, txns: items });
  } catch (err: any) {
    logger.error('get_full_txn_record failed', { error: err?.message });
    return res.status(500).json({ error: 'Failed to fetch full transaction record' });
  }
});

export default router;
