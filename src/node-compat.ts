/**
 * Node.js DNS API compatibility utilities.
 *
 * Provides helpers to transform between this library's internal record
 * representations and the shapes returned by Node's built-in 'dns' module.
 */
import { isDefined, safeCastTo } from "ts-extras";

import type { ANYRecord, SOARecord, TLSARecord, TXTRecord } from "./types";

/** Convert Node resolveAny array to internal ANYRecord */
export function fromNodeResolveAny(arr: any[]): ANYRecord {
    // We trust individual entries conform loosely; higher-level validation can be applied per record type.
    return { records: arr as any, type: "ANY" };
}

/** Convert Node resolveTxt result (string[][]) to internal TXTRecord[] */
export function fromNodeTxt(records: string[][], ttl?: number): TXTRecord[] {
    return records.map((chunks) => {
        const base: TXTRecord = safeCastTo<TXTRecord>({
            entries: chunks,
            type: "TXT",
        });
        if (isDefined(ttl)) (base as any).ttl = ttl; // Ttl optional
        return base;
    });
}

/** Determine if a given object already matches the Node resolveSoa shape */
export function isNodeSOAShape(obj: any): boolean {
    return (
        obj?.type === "SOA" &&
        typeof obj.nsname === "string" &&
        typeof obj.hostmaster === "string" &&
        typeof obj.serial === "number" &&
        typeof obj.refresh === "number" &&
        typeof obj.retry === "number" &&
        typeof obj.expire === "number" &&
        typeof obj.minttl === "number"
    );
}

/** Determine if a given object matches the Node TLSA shape */
export function isNodeTLSAShape(obj: any): boolean {
    return (
        obj?.type === "TLSA" &&
        typeof obj.certUsage === "number" &&
        typeof obj.selector === "number" &&
        typeof obj.match === "number" &&
        (typeof obj.data === "string" ||
            obj.data instanceof ArrayBuffer ||
            obj.data instanceof Uint8Array)
    );
}

/** Normalize an SOA record to include both internal and Node field names */
export function normalizeSOA(record: SOARecord): SOARecord {
    if (record.primary && !record.nsname) record.nsname = record.primary;
    if (record.nsname && !record.primary) record.primary = record.nsname;
    if (record.admin && !record.hostmaster) record.hostmaster = record.admin;
    if (record.hostmaster && !record.admin) record.admin = record.hostmaster;
    if (isDefined(record.expiration) && !isDefined(record.expire))
        record.expire = record.expiration;
    if (isDefined(record.expire) && !isDefined(record.expiration))
        record.expiration = record.expire;
    if (isDefined(record.minimum) && !isDefined(record.minttl))
        record.minttl = record.minimum;
    if (isDefined(record.minttl) && !isDefined(record.minimum))
        record.minimum = record.minttl;
    return record;
}

/** Normalize a TLSA record to include both internal and Node field names */
export function normalizeTLSA(record: TLSARecord): TLSARecord {
    if (isDefined(record.usage) && !isDefined(record.certUsage))
        record.certUsage = record.usage;
    if (isDefined(record.certUsage) && !isDefined(record.usage))
        record.usage = record.certUsage;
    if (isDefined(record.matchingType) && !isDefined(record.match))
        record.match = record.matchingType;
    if (isDefined(record.match) && !isDefined(record.matchingType))
        record.matchingType = record.match;
    if (record.certificate && !record.data) record.data = record.certificate;
    if (record.data && !record.certificate && typeof record.data === "string")
        record.certificate = record.data;
    return record;
}

/**
 * Create an ANY record container from a heterogeneous Node resolveAny response
 * array.
 */
export function toANYRecord(entries: ANYRecord["records"]): ANYRecord {
    return { records: entries!, type: "ANY" };
}

/** Convert internal TXTRecord[] to Node resolveTxt shape (string[][]) */
export function toNodeTxt(records: TXTRecord[]): string[][] {
    return records.map((r) => r.entries);
}
