# Coverage Gap Enumeration (Wave 2)

Module cli.ts (key untested branches/lines from prior lcov inspection):

- record command: error path when neither --data nor --file provided (already partly covered via earlier tests but ensure table/csv variants)
- record command strict mode: invalid structure triggers throw (unsupported type with --strict)
- default branch of validateSingleRecord with strict=false returning warnings (unknown type)
- query command analogous error path (no data/file)
- bulk command: missing --file; non-array JSON file; mode=queries path; verbose progress output; failure summary exit when at least one invalid
- formatTable: ensure row truncation logic exercised (records >50 chars and error substring path)
- formatCSV: escaping of quotes and error field blank vs populated
- runCLI: help output when argv empty (requires capturing program.outputHelp path)

Module dnssec.ts (remaining invalid branches to hit):

- validateRRSIG: each individual field validation (currently some covered). Need: INVALID_RRSIG_ALGORITHM (value 0), INVALID_RRSIG_LABELS (128), INVALID_RRSIG_TTL (negative), INVALID_RRSIG_EXPIRATION (negative), INVALID_RRSIG_INCEPTION (negative), INVALID_RRSIG_TIMESTAMP_ORDER (inception >= expiration), INVALID_RRSIG_SIGNER_NAME (missing), INVALID_RRSIG_SIGNER_FORMAT (bad domain), INVALID_RRSIG_SIGNATURE (missing), INVALID_RRSIG_SIGNATURE_FORMAT (non-base64)
- validateDNSKEY: INVALID_DNSKEY_FLAGS, INVALID_DNSKEY_PROTOCOL (protocol !=3), INVALID_DNSKEY_ALGORITHM, INVALID_DNSKEY_PUBLIC_KEY, INVALID_DNSKEY_PUBLIC_KEY_FORMAT
- validateDS: INVALID_DS_KEY_TAG, INVALID_DS_ALGORITHM, INVALID_DS_DIGEST_TYPE, INVALID_DS_DIGEST, INVALID_DS_DIGEST_FORMAT, INVALID_DS_DIGEST_LENGTH (mismatched length per digest type)
- validateNSEC: INVALID_NSEC_STRUCTURE (non-object), INVALID_NSEC_NEXT_DOMAIN, INVALID_NSEC_DOMAIN_FORMAT, INVALID_NSEC_TYPES (types not array), INVALID_NSEC_TYPE (invalid entry)
- validateNSEC3: INVALID_NSEC3_STRUCTURE, INVALID_NSEC3_HASH_ALGORITHM, INVALID_NSEC3_FLAGS, INVALID_NSEC3_ITERATIONS, INVALID_NSEC3_SALT_TYPE, INVALID_NSEC3_SALT_FORMAT, INVALID_NSEC3_NEXT_HASHED_NAME, INVALID_NSEC3_NEXT_HASHED_FORMAT, INVALID_NSEC3_TYPES, INVALID_NSEC3_TYPE
- validateNSEC3PARAM: analogous INVALID\_\* branches as for NSEC3PARAM

Module enhanced-validators.ts:

- validateARecord: branch where type mismatches returns early; ttl invalid branch
- validateAAAARecord: same patterns
- validateMXRecord: invalid exchange FQDN vs invalid priority vs invalid ttl
  (Many already covered; confirm coverage after new tests.)
- getValidationSuggestions: default branch (unsupported type) plus specific branches (A, AAAA, MX, CNAME). Need ensure each case executed at least once.

Module validators.ts:

- validateDNSRecord default suggestion for unsupported type branch
- isDNSRecord switch default false already maybe covered but confirm with unsupported type test
- Additional early failures for each record type (A missing address, AAAA invalid, MX invalid etc.) some lines still unhit; will craft records lacking one required field to push per-type suggestion strings.

Module performance.ts:

- Branch in trackPerformance: result object without isValid true path (already) vs path where result missing or not object; need call wrapped function returning primitive to skip recordSuccess.

Plan: Add targeted test files: cli-branches-extra.test.ts, dnssec-negative-more.test.ts, validators-branches-extra.test.ts, enhanced-suggestions.test.ts, performance-track-extra.test.ts.
