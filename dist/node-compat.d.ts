/**
 * Node.js DNS API compatibility utilities.
 *
 * Provides helpers to transform between this library's internal record
 * representations and the shapes returned by Node's built-in 'dns' module.
 */
import { SOARecord, TLSARecord, ANYRecord, TXTRecord } from './types';
/** Normalize an SOA record to include both internal and Node field names */
export declare function normalizeSOA(record: SOARecord): SOARecord;
/** Normalize a TLSA record to include both internal and Node field names */
export declare function normalizeTLSA(record: TLSARecord): TLSARecord;
/**
 * Create an ANY record container from a heterogeneous Node resolveAny response array.
 */
export declare function toANYRecord(entries: ANYRecord['records']): ANYRecord;
/** Determine if a given object already matches the Node resolveSoa shape */
export declare function isNodeSOAShape(obj: any): boolean;
/** Determine if a given object matches the Node TLSA shape */
export declare function isNodeTLSAShape(obj: any): boolean;
/** Convert Node resolveAny array to internal ANYRecord */
export declare function fromNodeResolveAny(arr: any[]): ANYRecord;
/** Convert Node resolveTxt result (string[][]) to internal TXTRecord[] */
export declare function fromNodeTxt(records: string[][], ttl?: number): TXTRecord[];
/** Convert internal TXTRecord[] to Node resolveTxt shape (string[][]) */
export declare function toNodeTxt(records: TXTRecord[]): string[][];
//# sourceMappingURL=node-compat.d.ts.map