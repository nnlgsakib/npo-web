import { db, nextSequence } from './db';
import logger from '../log';

export type TxnRecord = {
  id: string;
  name?: string;
  number: string; // sender number (e.g., bKash phone)
  txnId: string; // bKash transaction id
  amount: number; // amount in Taka
  createdAt: string; // ISO timestamp
};

const txnPrefix = 'txn:';
const txnIdIndexPrefix = 'txnByTxnId:'; // txnByTxnId:<txnId> -> id

function txnKey(id: string) {
  return `${txnPrefix}${id}`;
}

function txnIdIndexKey(txnId: string) {
  return `${txnIdIndexPrefix}${txnId}`;
}

export async function createTxn(input: {
  name?: string;
  number: string;
  txnId: string;
  amount: number;
}): Promise<TxnRecord> {
  // Ensure unique by txnId
  try {
    const existingId = await db.get(txnIdIndexKey(input.txnId));
    if (existingId) {
      logger.warn('txn duplicate by txnId', { txnId: input.txnId });
      const err: any = new Error('Transaction already recorded');
      err.code = 'DUPLICATE';
      throw err;
    }
  } catch (e: any) {
    if (!e || !e.notFound) {
      logger.error('txn index lookup failed', { error: e?.message });
      throw e;
    }
  }

  const id = String(await nextSequence('txns'));
  const now = new Date().toISOString();
  const rec: TxnRecord = {
    id,
    name: input.name,
    number: input.number,
    txnId: input.txnId,
    amount: input.amount,
    createdAt: now,
  };
  try {
    await db.put(txnKey(id), rec as any);
    await db.put(txnIdIndexKey(input.txnId), id as any);
    logger.info('txn stored', { id });
    return rec;
  } catch (err: any) {
    logger.error('failed to store txn', { error: err?.message });
    throw err;
  }
}

export async function listTxns(): Promise<TxnRecord[]> {
  const list: TxnRecord[] = [];
  try {
    for await (const [_key, value] of db.iterator({ gte: txnPrefix, lt: 'txn;' })) {
      list.push(value as TxnRecord);
    }
  } catch (err: any) {
    logger.error('list txns failed', { error: err?.message });
    throw err;
  }
  // newest first
  list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return list;
}

export async function filterTxns(filter: { name?: string; number?: string; txnId?: string }): Promise<TxnRecord[]> {
  const { name, number, txnId } = filter;
  const all = await listTxns();
  return all.filter((t) => {
    if (name && (!t.name || t.name.toLowerCase() !== name.toLowerCase())) return false;
    if (number && t.number !== number) return false;
    if (txnId && t.txnId !== txnId) return false;
    return true;
  });
}

export async function totalAmountTaka(): Promise<number> {
  const all = await listTxns();
  return all.reduce((sum, t) => sum + (Number.isFinite(t.amount) ? t.amount : 0), 0);
}
