# DNS Response Validator Documentation

Welcome to the official documentation site for **dns-response-validator**.

## Overview

This site contains:

- High-level introduction (this page)
- Auto-generated API reference (TypeDoc markdown)
- Usage examples and CLI help
- DNSSEC validation utilities overview

## Quick Links

- [API Globals](globals.md)
- [Interfaces](interfaces/)
- [Functions](functions/)
- [Variables](variables/)

## Install

```bash
npm install dns-response-validator
```

## Example

```typescript
import { isARecord, validateDNSRecord } from 'dns-response-validator';

const record = { type: 'A', address: '192.168.1.1', ttl: 300 };
console.log(isARecord(record)); // true
console.log(validateDNSRecord(record));
```

## Contributing

Issues and PRs welcome at the GitHub repository.

---
Generated automatically; custom landing page preserved on each deploy.
