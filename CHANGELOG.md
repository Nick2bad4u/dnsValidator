# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-27

### Added

- Initial release of DNS Validator library
- Support for 13 DNS record types:
  - A records (IPv4 addresses)
  - AAAA records (IPv6 addresses)
  - ANY records (generic DNS records)
  - CAA records (Certificate Authority Authorization)
  - CNAME records (Canonical names)
  - MX records (Mail exchange)
  - NAPTR records (Naming Authority Pointer)
  - NS records (Name servers)
  - PTR records (Pointer records)
  - SOA records (Start of Authority)
  - SRV records (Service records)
  - TLSA records (DANE TLSA)
  - TXT records (Text records)
- Individual validation functions for each record type (e.g., `isARecord()`, `isMXRecord()`)
- Generic DNS record validation (`isDNSRecord()`)
- Detailed validation results with errors and warnings (`validateDNSRecord()`)
- Complete DNS query result validation (`validateDNSResponse()`)
- Comprehensive TypeScript support with strict typing
- Full test coverage with Jest
- ESLint configuration for code quality
- Production-ready build configuration
- Detailed documentation and examples
- MIT License

### Technical Details

- Written in TypeScript with strict type checking
- Uses validator.js for common validation patterns (IP addresses, domains, emails)
- Custom validation logic for DNS-specific requirements
- Zero-dependency main library (validator.js is the only runtime dependency)
- Supports both CommonJS and ES modules
- Generates TypeScript declaration files
- Includes source maps for debugging

### Development

- Complete development environment setup
- TypeScript configuration for both building and testing
- Jest test configuration with TypeScript support
- ESLint configuration for code linting
- npm scripts for building, testing, and linting
- Example usage file demonstrating all features
- Comprehensive README with API documentation
