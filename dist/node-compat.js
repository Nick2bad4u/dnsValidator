"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNodeTxt = exports.fromNodeTxt = exports.fromNodeResolveAny = exports.isNodeTLSAShape = exports.isNodeSOAShape = exports.toANYRecord = exports.normalizeTLSA = exports.normalizeSOA = void 0;
/** Normalize an SOA record to include both internal and Node field names */
function normalizeSOA(record) {
    if (record.primary && !record.nsname)
        record.nsname = record.primary;
    if (record.nsname && !record.primary)
        record.primary = record.nsname;
    if (record.admin && !record.hostmaster)
        record.hostmaster = record.admin;
    if (record.hostmaster && !record.admin)
        record.admin = record.hostmaster;
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
exports.normalizeSOA = normalizeSOA;
/** Normalize a TLSA record to include both internal and Node field names */
function normalizeTLSA(record) {
    if (record.usage !== undefined && record.certUsage === undefined)
        record.certUsage = record.usage;
    if (record.certUsage !== undefined && record.usage === undefined)
        record.usage = record.certUsage;
    if (record.matchingType !== undefined && record.match === undefined)
        record.match = record.matchingType;
    if (record.match !== undefined && record.matchingType === undefined)
        record.matchingType = record.match;
    if (record.certificate && !record.data)
        record.data = record.certificate;
    if (record.data && !record.certificate && typeof record.data === 'string')
        record.certificate = record.data;
    return record;
}
exports.normalizeTLSA = normalizeTLSA;
/**
 * Create an ANY record container from a heterogeneous Node resolveAny response array.
 */
function toANYRecord(entries) {
    return { type: 'ANY', records: entries };
}
exports.toANYRecord = toANYRecord;
/** Determine if a given object already matches the Node resolveSoa shape */
function isNodeSOAShape(obj) {
    return (obj &&
        obj.type === 'SOA' &&
        typeof obj.nsname === 'string' &&
        typeof obj.hostmaster === 'string' &&
        typeof obj.serial === 'number' &&
        typeof obj.refresh === 'number' &&
        typeof obj.retry === 'number' &&
        typeof obj.expire === 'number' &&
        typeof obj.minttl === 'number');
}
exports.isNodeSOAShape = isNodeSOAShape;
/** Determine if a given object matches the Node TLSA shape */
function isNodeTLSAShape(obj) {
    return (obj &&
        obj.type === 'TLSA' &&
        typeof obj.certUsage === 'number' &&
        typeof obj.selector === 'number' &&
        typeof obj.match === 'number' &&
        (typeof obj.data === 'string' ||
            obj.data instanceof ArrayBuffer ||
            obj.data instanceof Uint8Array));
}
exports.isNodeTLSAShape = isNodeTLSAShape;
/** Convert Node resolveAny array to internal ANYRecord */
function fromNodeResolveAny(arr) {
    // We trust individual entries conform loosely; higher-level validation can be applied per record type.
    return { type: 'ANY', records: arr };
}
exports.fromNodeResolveAny = fromNodeResolveAny;
/** Convert Node resolveTxt result (string[][]) to internal TXTRecord[] */
function fromNodeTxt(records, ttl) {
    return records.map(chunks => {
        const base = { type: 'TXT', entries: chunks };
        if (ttl !== undefined)
            base.ttl = ttl; // ttl optional
        return base;
    });
}
exports.fromNodeTxt = fromNodeTxt;
/** Convert internal TXTRecord[] to Node resolveTxt shape (string[][]) */
function toNodeTxt(records) {
    return records.map(r => r.entries);
}
exports.toNodeTxt = toNodeTxt;
//# sourceMappingURL=node-compat.js.map