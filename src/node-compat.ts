/**
 * Node.js DNS API compatibility utilities.
 *
 * Provides helpers to transform between this library's internal record
 * representations and the shapes returned by Node's built-in 'dns' module.
 */
import type { UnknownArray, UnknownRecord } from "type-fest";

import { isDefined } from "ts-extras";

import type { ANYRecord, SOARecord, TLSARecord, TXTRecord } from "./types";

/** Convert Node resolveAny array to internal ANYRecord */
export function fromNodeResolveAny(arr: Readonly<UnknownArray>): ANYRecord {
    const records = arr.filter(
        (entry): entry is UnknownRecord =>
            typeof entry === "object" && entry !== null
    );
    return { records: [...records], type: "ANY" };
}

/** Convert Node resolveTxt result (string[][]) to internal TXTRecord[] */
export function fromNodeTxt(
    records: readonly (readonly string[])[],
    ttl?: number
): TXTRecord[] {
    return records.map((chunks) => {
        const base: TXTRecord = {
            entries: [...chunks],
            type: "TXT",
        };
        if (isDefined(ttl)) {
            base.ttl = ttl;
        }

        return base;
    });
}

/** Determine if a given object already matches the Node resolveSoa shape */
export function isNodeSOAShape(obj: unknown): boolean {
    if (obj === null || typeof obj !== "object") {
        return false;
    }

    const candidate: Partial<UnknownRecord> = obj;

    return (
        candidate["type"] === "SOA" &&
        typeof candidate["nsname"] === "string" &&
        typeof candidate["hostmaster"] === "string" &&
        typeof candidate["serial"] === "number" &&
        typeof candidate["refresh"] === "number" &&
        typeof candidate["retry"] === "number" &&
        typeof candidate["expire"] === "number" &&
        typeof candidate["minttl"] === "number"
    );
}

/** Determine if a given object matches the Node TLSA shape */
export function isNodeTLSAShape(obj: unknown): boolean {
    if (obj === null || typeof obj !== "object") {
        return false;
    }

    const candidate: Partial<UnknownRecord> = obj;

    return (
        candidate["type"] === "TLSA" &&
        typeof candidate["certUsage"] === "number" &&
        typeof candidate["selector"] === "number" &&
        typeof candidate["match"] === "number" &&
        (typeof candidate["data"] === "string" ||
            candidate["data"] instanceof ArrayBuffer ||
            candidate["data"] instanceof Uint8Array)
    );
}

/** Normalize an SOA record to include both internal and Node field names */
export function normalizeSOA(record: Readonly<SOARecord>): SOARecord {
    const normalized: SOARecord = { ...record };

    if (isDefined(normalized.primary) && !isDefined(normalized.nsname)) {
        normalized.nsname = normalized.primary;
    }

    if (isDefined(normalized.nsname) && !isDefined(normalized.primary)) {
        normalized.primary = normalized.nsname;
    }

    if (isDefined(normalized.admin) && !isDefined(normalized.hostmaster)) {
        normalized.hostmaster = normalized.admin;
    }

    if (isDefined(normalized.hostmaster) && !isDefined(normalized.admin)) {
        normalized.admin = normalized.hostmaster;
    }

    if (isDefined(normalized.expiration) && !isDefined(normalized.expire))
        normalized.expire = normalized.expiration;
    if (isDefined(normalized.expire) && !isDefined(normalized.expiration))
        normalized.expiration = normalized.expire;
    if (isDefined(normalized.minimum) && !isDefined(normalized.minttl))
        normalized.minttl = normalized.minimum;
    if (isDefined(normalized.minttl) && !isDefined(normalized.minimum))
        normalized.minimum = normalized.minttl;
    return normalized;
}

/** Normalize a TLSA record to include both internal and Node field names */
export function normalizeTLSA(record: Readonly<TLSARecord>): TLSARecord {
    const normalized: TLSARecord = { ...record };

    if (isDefined(normalized.usage) && !isDefined(normalized.certUsage))
        normalized.certUsage = normalized.usage;
    if (isDefined(normalized.certUsage) && !isDefined(normalized.usage))
        normalized.usage = normalized.certUsage;
    if (isDefined(normalized.matchingType) && !isDefined(normalized.match))
        normalized.match = normalized.matchingType;
    if (isDefined(normalized.match) && !isDefined(normalized.matchingType))
        normalized.matchingType = normalized.match;
    if (isDefined(normalized.certificate) && !isDefined(normalized.data))
        normalized.data = normalized.certificate;
    if (
        isDefined(normalized.data) &&
        !isDefined(normalized.certificate) &&
        typeof normalized.data === "string"
    )
        normalized.certificate = normalized.data;
    return normalized;
}

/**
 * Create an ANY record container from a heterogeneous Node resolveAny response
 * array.
 */
export function toANYRecord(
    entries: Readonly<ANYRecord["records"]>
): ANYRecord {
    return { records: entries ? [...entries] : [], type: "ANY" };
}

/** Convert internal TXTRecord[] to Node resolveTxt shape (string[][]) */
export function toNodeTxt(records: readonly Readonly<TXTRecord>[]): string[][] {
    return records.map((record) => [...record.entries]);
}
