# DNS Validator

A production-ready TypeScript library for validating DNS query results and individual DNS records. Supports validation of all major DNS record types including A, AAAA, ANY, CAA, CNAME, MX, NAPTR, NS, PTR, SOA, SRV, TLSA, and TXT records.

[![npm version](https://badge.fury.io/js/dns-validator.svg)](https://badge.fury.io/js/dns-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## Features

- 🔍 **Comprehensive DNS Record Validation** - Supports 13 different DNS record types
- 📏 **Type-Safe** - Full TypeScript support with strict type checking
- 🛡️ **Production Ready** - Thoroughly tested with comprehensive test suite
- 🎯 **Zero Dependencies** - Uses only the lightweight `validator.js` library
- 📦 **Small Bundle Size** - Optimized for minimal footprint
- 🔧 **Easy to Use** - Simple, intuitive API design

## Installation

```bash
npm install dns-validator
```

```bash
yarn add dns-validator
```

## Quick Start

```typescript
import { isARecord, validateDNSRecord } from "dns-validator";

// Validate an A record
const aRecord = {
  type: "A",
  address: "192.168.1.1",
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

## API Reference

### Individual Record Validation

Each DNS record type has its own validation function that returns a boolean:

```typescript
import {
  isARecord,
  isAAAARecord,
  isMXRecord,
  isTXTRecord,
} from "dns-validator";

// A Record (IPv4)
const aRecord = { type: "A", address: "8.8.8.8", ttl: 300 };
console.log(isARecord(aRecord)); // true

// AAAA Record (IPv6)
const aaaaRecord = { type: "AAAA", address: "2001:db8::1", ttl: 300 };
console.log(isAAAARecord(aaaaRecord)); // true

// MX Record
const mxRecord = {
  type: "MX",
  priority: 10,
  exchange: "mail.example.com",
  ttl: 300,
};
console.log(isMXRecord(mxRecord)); // true

// TXT Record
const txtRecord = {
  type: "TXT",
  entries: ["v=spf1 include:_spf.google.com ~all"],
  ttl: 300,
};
console.log(isTXTRecord(txtRecord)); // true
```

### Generic Record Validation

```typescript
import { isDNSRecord, validateDNSRecord } from "dns-validator";

const unknownRecord = {
  type: "A",
  address: "192.168.1.1",
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
import { validateDNSResponse, DNSQueryResult } from "dns-validator";

const dnsResponse: DNSQueryResult = {
  question: {
    name: "example.com",
    type: "A",
    class: "IN",
  },
  answers: [
    {
      type: "A",
      address: "93.184.216.34",
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
import { ARecord, MXRecord, DNSRecord, ValidationResult } from "dns-validator";

// Strict typing for DNS records
const aRecord: ARecord = {
  type: "A",
  address: "192.168.1.1",
  ttl: 300,
};

const mxRecord: MXRecord = {
  type: "MX",
  priority: 10,
  exchange: "mail.example.com",
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
import { isSOARecord } from "dns-validator";

const soaRecord = {
  type: "SOA",
  primary: "ns1.example.com",
  admin: "admin.example.com",
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
import { isSRVRecord } from "dns-validator";

const srvRecord = {
  type: "SRV",
  priority: 10,
  weight: 20,
  port: 443,
  name: "target.example.com",
  ttl: 300,
};

console.log(isSRVRecord(srvRecord)); // true
```

### CAA Record

```typescript
import { isCAARecord } from "dns-validator";

const caaRecord = {
  type: "CAA",
  critical: 0,
  issue: "letsencrypt.org",
  ttl: 86400,
};

console.log(isCAARecord(caaRecord)); // true
```

### TLSA Record

```typescript
import { isTLSARecord } from "dns-validator";

const tlsaRecord = {
  type: "TLSA",
  usage: 3,
  selector: 1,
  matchingType: 1,
  certificate: "abcdef1234567890abcdef1234567890",
  ttl: 300,
};

console.log(isTLSARecord(tlsaRecord)); // true
```

## Error Handling

The library provides detailed error information for invalid records:

```typescript
import { validateDNSRecord } from "dns-validator";

const invalidRecord = {
  type: "A",
  address: "999.999.999.999", // Invalid IP
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
