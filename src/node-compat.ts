/**
 * Node.js DNS API compatibility utilities.
 *
 * Provides helpers to transform between this library's internal record
 * representations and the shapes returned by Node's built-in 'dns' module.
 */
import { SOARecord, TLSARecord, ANYRecord, TXTRecord } from './types';

/** Normalize an SOA record to include both internal and Node field names */
export function normalizeSOA(record: SOARecord): SOARecord {
  if (record.primary && !record.nsname) record.nsname = record.primary;
  if (record.nsname && !record.primary) record.primary = record.nsname;
  if (record.admin && !record.hostmaster) record.hostmaster = record.admin;
  if (record.hostmaster && !record.admin) record.admin = record.hostmaster;
  if (record.expiration !== undefined && record.expire === undefined)
    record.expire = record.expiration;
  if (record.expire !== undefined && record.expiration === undefined)
    record.expiration = record.expire;
  if (record.minimum !== undefined && record.minttl === undefined)
    record.minttl = record.minimum;
  if (record.minttl !== undefined && record.minimum === undefined)
    record.minimum = record.minttl;
  return record;
}

/** Normalize a TLSA record to include both internal and Node field names */
export function normalizeTLSA(record: TLSARecord): TLSARecord {
  if (record.usage !== undefined && record.certUsage === undefined)
    record.certUsage = record.usage;
  if (record.certUsage !== undefined && record.usage === undefined)
    record.usage = record.certUsage;
  if (record.matchingType !== undefined && record.match === undefined)
    record.match = record.matchingType;
  if (record.match !== undefined && record.matchingType === undefined)
    record.matchingType = record.match;
  if (record.certificate && !record.data) record.data = record.certificate;
  if (record.data && !record.certificate && typeof record.data === 'string')
    record.certificate = record.data;
  return record;
}

/**
 * Create an ANY record container from a heterogeneous Node resolveAny response array.
 */
export function toANYRecord(entries: ANYRecord['records']): ANYRecord {
  return { type: 'ANY', records: entries as NonNullable<ANYRecord['records']> };
}

/** Determine if a given object already matches the Node resolveSoa shape */
export function isNodeSOAShape(obj: any): boolean {
  return (
    obj &&
    obj.type === 'SOA' &&
    typeof obj.nsname === 'string' &&
    typeof obj.hostmaster === 'string' &&
    typeof obj.serial === 'number' &&
    typeof obj.refresh === 'number' &&
    typeof obj.retry === 'number' &&
    typeof obj.expire === 'number' &&
    typeof obj.minttl === 'number'
  );
}

/** Determine if a given object matches the Node TLSA shape */
export function isNodeTLSAShape(obj: any): boolean {
  return (
    obj &&
    obj.type === 'TLSA' &&
    typeof obj.certUsage === 'number' &&
    typeof obj.selector === 'number' &&
    typeof obj.match === 'number' &&
    (typeof obj.data === 'string' ||
      obj.data instanceof ArrayBuffer ||
      obj.data instanceof Uint8Array)
  );
}

/** Convert Node resolveAny array to internal ANYRecord */
export function fromNodeResolveAny(arr: any[]): ANYRecord {
  // We trust individual entries conform loosely; higher-level validation can be applied per record type.
  return { type: 'ANY', records: arr as any };
}

/** Convert Node resolveTxt result (string[][]) to internal TXTRecord[] */
export function fromNodeTxt(records: string[][], ttl?: number): TXTRecord[] {
  return records.map(chunks => {
    const base: TXTRecord = { type: 'TXT', entries: chunks } as TXTRecord;
    if (ttl !== undefined) (base as any).ttl = ttl; // ttl optional
    return base;
  });
}

/** Convert internal TXTRecord[] to Node resolveTxt shape (string[][]) */
export function toNodeTxt(records: TXTRecord[]): string[][] {
  return records.map(r => r.entries);
}
