# DNS Validator

A comprehensive TypeScript library for validating DNS query results and individual DNS records. Supports traditional DNS records (A, AAAA, MX, TXT, etc.) and DNSSEC records (DNSKEY, DS, RRSIG, NSEC, etc.) with enhanced error reporting and performance optimization.

[![npm version](https://badge.fury.io/js/dns-response-validator.svg)](https://badge.fury.io/js/dns-response-validator)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **Comprehensive DNS Record Support** - Validates 19+ DNS record types including DNSSEC
- � **DNSSEC Ready** - Full support for DNSKEY, DS, RRSIG, NSEC, NSEC3, and SSHFP records
- � **Enhanced Error Reporting** - Detailed validation results with specific error messages and suggestions
- ⚡ **Performance Optimized** - Built-in caching, pre-validation, and performance tracking
- 🎯 **Type Safe** - Full TypeScript support with strict typing
- 🧪 **Well Tested** - Comprehensive test suite with 100% coverage
- � **Excellent Documentation** - Complete API docs with examples

## Installation

```bash
npm install dns-response-validator
```

```bash
yarn add dns-response-validator
```

```bash
pnpm add dns-response-validator
```

## Quick Start

### Basic Validation

```typescript
import { isARecord, isMXRecord, validateARecord } from 'dns-response-validator';

// Simple validation
const aRecord = { type: 'A', address: '192.168.1.1', ttl: 300 };
console.log(isARecord(aRecord)); // true

// Enhanced validation with detailed feedback
const result = validateARecord(aRecord);
console.log(result.isValid); // true
console.log(result.errors); // []
console.log(result.warnings); // []
import { isARecord, validateDNSRecord } from 'dns-response-validator';

// Validate an A record
const aRecord = {
  type: 'A',
  address: '192.168.1.1',
  ttl: 300,
};

console.log(isARecord(aRecord)); // true

// Get detailed validation results
const validation = validateDNSRecord(aRecord);
console.log(validation);
// { isValid: true, errors: [], warnings: [] }
```

## Supported DNS Record Types

| Record Type | Function          | Description                         |
| ----------- | ----------------- | ----------------------------------- |
| A           | `isARecord()`     | IPv4 address records                |
| AAAA        | `isAAAARecord()`  | IPv6 address records                |
| ANY         | `isANYRecord()`   | Any type of DNS record              |
| CAA         | `isCAARecord()`   | Certificate Authority Authorization |
| CNAME       | `isCNAMERecord()` | Canonical name records              |
| MX          | `isMXRecord()`    | Mail exchange records               |
| NAPTR       | `isNAPTRRecord()` | Naming Authority Pointer            |
| NS          | `isNSRecord()`    | Name server records                 |
| PTR         | `isPTRRecord()`   | Pointer records                     |
| SOA         | `isSOARecord()`   | Start of Authority records          |
| SRV         | `isSRVRecord()`   | Service records                     |
| TLSA        | `isTLSARecord()`  | DANE TLSA records                   |
| TXT         | `isTXTRecord()`   | Text records                        |

## Node.js `dns` Module Compatibility

This library now provides optional compatibility helpers for the core Node.js `dns` module API.

Key points:

- SOA records accept both internal field names (`primary`, `admin`, `expiration`, `minimum`) and Node.js names (`nsname`, `hostmaster`, `expire`, `minttl`). Both sets are normalized via `normalizeSOA()`.
- TLSA records accept both (`usage`, `matchingType`, `certificate`) and Node.js forms (`certUsage`, `match`, `data`). Use `normalizeTLSA()` convenience helper.
- ANY queries can be represented with a heterogeneous `records` array (similar to `dns.resolveAny`) in addition to the legacy `value` field.
- Node DNS error code constants are exported as `NodeDNSErrorCodes` along with a type guard `isNodeDNSErrorCode()`.
- Compatibility helpers are exported from `node-compat` and re-exported at the root.

### Examples

```typescript
import {
  normalizeSOA,
  normalizeTLSA,
  fromNodeTxt,
  toNodeTxt,
  fromNodeResolveAny,
  NodeDNSErrorCodes,
} from 'dns-response-validator';

const soa = normalizeSOA({
  type: 'SOA',
  nsname: 'ns1.example.com',
  hostmaster: 'hostmaster.example.com',
  serial: 2024010101,
  refresh: 3600,
  retry: 600,
  expire: 1209600,
  minttl: 300,
});

const tlsa = normalizeTLSA({
  type: 'TLSA',
  certUsage: 3,
  selector: 1,
  match: 1,
  data: 'abcdef1234',
});

console.log(NodeDNSErrorCodes.DNS_ENOTFOUND); // 'ENOTFOUND'
// TXT conversion
const nodeTxt = [['v=spf1', 'include:_spf.example.com', '~all']];
const internalTxt = fromNodeTxt(nodeTxt, 300);
const backToNode = toNodeTxt(internalTxt);

// ANY conversion
const anyNode = [
  { type: 'A', address: '127.0.0.1', ttl: 60 },
  { type: 'CNAME', value: 'example.com' },
];
const anyRecord = fromNodeResolveAny(anyNode);
```

### Supported DNS Error Codes

The following constants mirror `node:dns` and `dns.promises` error codes:

`NODATA`, `FORMERR`, `SERVFAIL`, `NOTFOUND`, `NOTIMP`, `REFUSED`, `BADQUERY`, `BADNAME`, `BADFAMILY`, `BADRESP`, `CONNREFUSED`, `TIMEOUT`, `EOF`, `FILE`, `NOMEM`, `DESTRUCTION`, `BADSTR`, `BADFLAGS`, `NONAME`, `BADHINTS`, `NOTINITIALIZED`, `LOADIPHLPAPI`, `ADDRGETNETWORKPARAMS`, `CANCELLED`.

### Intentional Extensions

The library includes DNSSEC-related record validators (DNSKEY, DS, RRSIG, NSEC, NSEC3, SSHFP) that are not part of Node's core `dns` output. These are additive and do not affect Node compatibility.

### Backward Compatibility

Previous field names still work; new Node-style names are additive. When both aliases are supplied the normalization helpers populate missing counterparts to create a fully dual-access shape.

## API Reference

### Individual Record Validation

Each DNS record type has its own validation function that returns a boolean:

```typescript
import {
  isARecord,
  isAAAARecord,
  isMXRecord,
  isTXTRecord,
} from 'dns-response-validator';

// A Record (IPv4)
const aRecord = { type: 'A', address: '8.8.8.8', ttl: 300 };
console.log(isARecord(aRecord)); // true

// AAAA Record (IPv6)
const aaaaRecord = { type: 'AAAA', address: '2001:db8::1', ttl: 300 };
console.log(isAAAARecord(aaaaRecord)); // true

// MX Record
const mxRecord = {
  type: 'MX',
  priority: 10,
  exchange: 'mail.example.com',
  ttl: 300,
};
console.log(isMXRecord(mxRecord)); // true

// TXT Record
const txtRecord = {
  type: 'TXT',
  entries: ['v=spf1 include:_spf.google.com ~all'],
  ttl: 300,
};
console.log(isTXTRecord(txtRecord)); // true
```

### Generic Record Validation

```typescript
import { isDNSRecord, validateDNSRecord } from 'dns-response-validator';

const unknownRecord = {
  type: 'A',
  address: '192.168.1.1',
  ttl: 300,
};

// Check if it's a valid DNS record of any type
console.log(isDNSRecord(unknownRecord)); // true

// Get detailed validation results
const result = validateDNSRecord(unknownRecord);
console.log(result);
// {
//   isValid: true,
//   errors: [],
//   warnings: []
// }
```

### DNS Query Result Validation

Validate complete DNS query responses:

```typescript
import { validateDNSResponse, DNSQueryResult } from 'dns-response-validator';

const dnsResponse: DNSQueryResult = {
  question: {
    name: 'example.com',
    type: 'A',
    class: 'IN',
  },
  answers: [
    {
      type: 'A',
      address: '93.184.216.34',
      ttl: 86400,
    },
  ],
};

const validation = validateDNSResponse(dnsResponse);
console.log(validation);
// {
//   isValid: true,
//   errors: [],
//   warnings: []
// }
```

## TypeScript Support

The library is written in TypeScript and provides comprehensive type definitions:

```typescript
import {
  ARecord,
  MXRecord,
  DNSRecord,
  ValidationResult,
} from 'dns-response-validator';

// Strict typing for DNS records
const aRecord: ARecord = {
  type: 'A',
  address: '192.168.1.1',
  ttl: 300,
};

const mxRecord: MXRecord = {
  type: 'MX',
  priority: 10,
  exchange: 'mail.example.com',
  ttl: 300,
};

// Union type for any DNS record
const record: DNSRecord = aRecord;

// Validation result typing
const result: ValidationResult = {
  isValid: true,
  errors: [],
  warnings: [],
};
```

## Complex Record Examples

### SOA Record

```typescript
import { isSOARecord } from 'dns-response-validator';

const soaRecord = {
  type: 'SOA',
  primary: 'ns1.example.com',
  admin: 'admin.example.com',
  serial: 2023010101,
  refresh: 86400,
  retry: 7200,
  expiration: 3600000,
  minimum: 86400,
  ttl: 86400,
};

console.log(isSOARecord(soaRecord)); // true
```

### SRV Record

```typescript
import { isSRVRecord } from 'dns-response-validator';

const srvRecord = {
  type: 'SRV',
  priority: 10,
  weight: 20,
  port: 443,
  name: 'target.example.com',
  ttl: 300,
};

console.log(isSRVRecord(srvRecord)); // true
```

### CAA Record

```typescript
import { isCAARecord } from 'dns-response-validator';

const caaRecord = {
  type: 'CAA',
  critical: 0,
  issue: 'letsencrypt.org',
  ttl: 86400,
};

console.log(isCAARecord(caaRecord)); // true
```

### TLSA Record

```typescript
import { isTLSARecord } from 'dns-response-validator';

const tlsaRecord = {
  type: 'TLSA',
  usage: 3,
  selector: 1,
  matchingType: 1,
  certificate: 'abcdef1234567890abcdef1234567890',
  ttl: 300,
};

console.log(isTLSARecord(tlsaRecord)); // true
```

## Error Handling

The library provides detailed error information for invalid records:

```typescript
import { validateDNSRecord } from 'dns-response-validator';

const invalidRecord = {
  type: 'A',
  address: '999.999.999.999', // Invalid IP
  ttl: 300,
};

const result = validateDNSRecord(invalidRecord);
console.log(result);
// {
//   isValid: false,
//   errors: ['Invalid A record structure or values'],
//   warnings: []
// }
```

## Command Line Interface (CLI)

The DNS Validator includes a powerful CLI tool for validating DNS records and queries from the command line.

### Installation

After installing the package globally:

```bash
npm install -g dns-response-validator
```

Or run directly with npx:

```bash
npx dns-response-validator --help
```

### CLI Usage

#### Validate a Single Record

```bash
# Validate an A record
dns-response-validator record --type A --data '{"name":"example.com","address":"192.168.1.1","ttl":300}'

# Validate a record from file
dns-response-validator record --file record.json --format table

# Validate with strict mode
dns-response-validator record --file record.json --strict --format table
```

#### Validate DNS Query Response

```bash
# Validate a DNS query response
dns-response-validator query --file query.json --verbose

# Validate with custom output format
dns-response-validator query --data '{"answers":[...]}' --format csv
```

#### Bulk Validation

```bash
# Validate multiple records from file
dns-response-validator bulk --file records.json --format csv --output results.csv

# Strict mode bulk validation
dns-response-validator bulk --file records.json --strict --verbose
```

#### CLI Options

- `--type <type>`: DNS record type (A, AAAA, MX, TXT, etc.)
- `--data <json>`: DNS record/query data as JSON string
- `--file <file>`: Read data from JSON file
- `--output <file>`: Write results to file
- `--format <format>`: Output format (json, table, csv)
- `--verbose`: Show detailed output
- `--strict`: Enable strict validation mode

#### Sample Record Files

**A Record (record.json):**

```json
{
  "type": "A",
  "name": "example.com",
  "address": "192.168.1.1",
  "ttl": 300
}
```

**DNS Query Response (query.json):**

```json
{
  "question": {
    "name": "example.com",
    "type": "A",
    "class": "IN"
  },
  "answers": [
    {
      "type": "A",
      "name": "example.com",
      "address": "192.168.1.1",
      "ttl": 300
    }
  ]
}
```

**Multiple Records (records.json):**

```json
[
  {
    "type": "A",
    "name": "example.com",
    "address": "192.168.1.1",
    "ttl": 300
  },
  {
    "type": "MX",
    "name": "example.com",
    "exchange": "mail.example.com",
    "priority": 10,
    "ttl": 3600
  }
]
```

#### CLI Examples

View all available examples:

```bash
dns-response-validator examples
```

## Development

### Building the Project

```bash
npm run build        # Build TypeScript to JavaScript
npm run build:watch  # Build in watch mode
npm run clean        # Clean dist directory
```

### Testing

```bash
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Code Quality

```bash
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint code linting
npm run lint:fix     # Fix linting issues automatically
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- Uses [validator.js](https://github.com/validatorjs/validator.js) for common validations
- Tested with [Jest](https://jestjs.io/)

## Changelog

### 1.0.0

- Initial release
- Support for all major DNS record types
- Comprehensive TypeScript support
- Full test coverage
- Production-ready validation functions
