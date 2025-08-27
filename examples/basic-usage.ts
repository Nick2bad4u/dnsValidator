import {
  isARecord,
  isMXRecord,
  isTXTRecord,
  isCAARecord,
  isDNSRecord,
  validateDNSRecord,
  validateDNSResponse,
  DNSQueryResult,
  ARecord,
  MXRecord,
} from "../src/index";

/**
 * Example usage of the DNS Validator library
 */

// Example: Validating individual DNS records
console.log("=== Individual Record Validation ===");

// A record validation
const aRecord: ARecord = {
  type: "A",
  address: "192.168.1.1",
  ttl: 300,
};

console.log("A Record valid:", isARecord(aRecord)); // true
console.log("A Record validation:", validateDNSRecord(aRecord));

// Invalid A record
const invalidARecord = {
  type: "A",
  address: "999.999.999.999", // Invalid IP
  ttl: 300,
};

console.log("Invalid A Record valid:", isARecord(invalidARecord)); // false
console.log("Invalid A Record validation:", validateDNSRecord(invalidARecord));

// MX record validation
const mxRecord: MXRecord = {
  type: "MX",
  priority: 10,
  exchange: "mail.example.com",
  ttl: 300,
};

console.log("MX Record valid:", isMXRecord(mxRecord)); // true

// Example: Validating complete DNS query results
console.log("\n=== DNS Query Result Validation ===");

const dnsQueryResult: DNSQueryResult = {
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
    {
      type: "A",
      address: "93.184.216.35",
      ttl: 86400,
    },
  ],
  authority: [
    {
      type: "NS",
      value: "ns1.example.com",
      ttl: 172800,
    },
  ],
};

console.log(
  "DNS Query Result validation:",
  validateDNSResponse(dnsQueryResult),
);

// Example: Type mismatch warning
const mismatchedResult: DNSQueryResult = {
  question: {
    name: "example.com",
    type: "A", // Question asks for A record
    class: "IN",
  },
  answers: [
    {
      type: "CNAME", // But answer is CNAME
      value: "alias.example.com",
      ttl: 300,
    },
  ],
};

console.log(
  "Mismatched Query Result validation:",
  validateDNSResponse(mismatchedResult),
);

// Example: Using generic isDNSRecord function
console.log("\n=== Generic Record Validation ===");

const unknownRecord = {
  type: "TXT",
  entries: ["v=spf1 include:_spf.google.com ~all"],
  ttl: 300,
};

console.log("Unknown record is valid DNS record:", isDNSRecord(unknownRecord)); // true

// Example: Real-world DNS records
console.log("\n=== Real-world Examples ===");

// Google's public DNS
const googleDNS = {
  type: "A",
  address: "8.8.8.8",
  ttl: 21600,
};

console.log("Google DNS A record valid:", isARecord(googleDNS));

// SPF record
const spfRecord = {
  type: "TXT",
  entries: ["v=spf1 include:_spf.google.com include:mailgun.org ~all"],
  ttl: 300,
};

console.log("SPF TXT record valid:", isTXTRecord(spfRecord));

// MX record for Gmail
const gmailMX = {
  type: "MX",
  priority: 10,
  exchange: "aspmx.l.google.com",
  ttl: 3600,
};

console.log("Gmail MX record valid:", isMXRecord(gmailMX));

// CAA record for Let's Encrypt
const letsEncryptCAA = {
  type: "CAA",
  critical: 0,
  issue: "letsencrypt.org",
  ttl: 86400,
};

console.log("Let's Encrypt CAA record valid:", isCAARecord(letsEncryptCAA));

console.log("\n=== Library Usage Complete ===");
