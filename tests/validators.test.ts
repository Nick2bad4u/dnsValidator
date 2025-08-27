import {
  isARecord,
  isAAAARecord,
  isCNAMERecord,
  isMXRecord,
  isTXTRecord,
  isNSRecord,
  isPTRRecord,
  isSOARecord,
  isSRVRecord,
  isCAARecord,
  isNAPTRRecord,
  isTLSARecord,
  isANYRecord,
  isDNSRecord,
  validateDNSRecord,
} from "../src/validators";

describe("DNS Record Validators", () => {
  describe("isARecord", () => {
    it("should validate valid A records", () => {
      const validARecord = {
        type: "A",
        address: "192.168.1.1",
        ttl: 300,
      };
      expect(isARecord(validARecord)).toBe(true);
    });

    it("should reject invalid IP addresses", () => {
      const invalidARecord = {
        type: "A",
        address: "999.999.999.999",
        ttl: 300,
      };
      expect(isARecord(invalidARecord)).toBe(false);
    });

    it("should reject IPv6 addresses", () => {
      const invalidARecord = {
        type: "A",
        address: "2001:db8::1",
        ttl: 300,
      };
      expect(isARecord(invalidARecord)).toBe(false);
    });

    it("should work without TTL", () => {
      const validARecord = {
        type: "A",
        address: "8.8.8.8",
      };
      expect(isARecord(validARecord)).toBe(true);
    });

    it("should reject non-object inputs", () => {
      expect(isARecord(null)).toBe(false);
      expect(isARecord(undefined)).toBe(false);
      expect(isARecord("string")).toBe(false);
      expect(isARecord(123)).toBe(false);
      expect(isARecord([])).toBe(false);
    });

    it("should reject records with wrong type", () => {
      const wrongTypeRecord = {
        type: "AAAA",
        address: "192.168.1.1",
        ttl: 300,
      };
      expect(isARecord(wrongTypeRecord)).toBe(false);
    });

    it("should reject records with invalid TTL", () => {
      const invalidTTLRecord = {
        type: "A",
        address: "192.168.1.1",
        ttl: -1,
      };
      expect(isARecord(invalidTTLRecord)).toBe(false);
    });
  });

  describe("isAAAARecord", () => {
    it("should validate valid AAAA records", () => {
      const validAAAARecord = {
        type: "AAAA",
        address: "2001:db8::1",
        ttl: 300,
      };
      expect(isAAAARecord(validAAAARecord)).toBe(true);
    });

    it("should reject IPv4 addresses", () => {
      const invalidAAAARecord = {
        type: "AAAA",
        address: "192.168.1.1",
        ttl: 300,
      };
      expect(isAAAARecord(invalidAAAARecord)).toBe(false);
    });

    it("should reject invalid IPv6 addresses", () => {
      const invalidAAAARecord = {
        type: "AAAA",
        address: "invalid:ipv6:address",
        ttl: 300,
      };
      expect(isAAAARecord(invalidAAAARecord)).toBe(false);
    });

    it("should work without TTL", () => {
      const validAAAARecord = {
        type: "AAAA",
        address: "::1",
      };
      expect(isAAAARecord(validAAAARecord)).toBe(true);
    });

    it("should reject non-object inputs", () => {
      expect(isAAAARecord(null)).toBe(false);
      expect(isAAAARecord(undefined)).toBe(false);
      expect(isAAAARecord("string")).toBe(false);
      expect(isAAAARecord([])).toBe(false);
    });
  });

  describe("isCNAMERecord", () => {
    it("should validate valid CNAME records", () => {
      const validCNAMERecord = {
        type: "CNAME",
        value: "example.com",
        ttl: 300,
      };
      expect(isCNAMERecord(validCNAMERecord)).toBe(true);
    });

    it("should reject invalid domain names", () => {
      const invalidCNAMERecord = {
        type: "CNAME",
        value: "invalid..domain",
        ttl: 300,
      };
      expect(isCNAMERecord(invalidCNAMERecord)).toBe(false);
    });
  });

  describe("isMXRecord", () => {
    it("should validate valid MX records", () => {
      const validMXRecord = {
        type: "MX",
        priority: 10,
        exchange: "mail.example.com",
        ttl: 300,
      };
      expect(isMXRecord(validMXRecord)).toBe(true);
    });

    it("should reject invalid priority values", () => {
      const invalidMXRecord = {
        type: "MX",
        priority: -1,
        exchange: "mail.example.com",
        ttl: 300,
      };
      expect(isMXRecord(invalidMXRecord)).toBe(false);
    });

    it("should reject invalid exchange domains", () => {
      const invalidMXRecord = {
        type: "MX",
        priority: 10,
        exchange: "invalid..domain",
        ttl: 300,
      };
      expect(isMXRecord(invalidMXRecord)).toBe(false);
    });
  });

  describe("isTXTRecord", () => {
    it("should validate valid TXT records", () => {
      const validTXTRecord = {
        type: "TXT",
        entries: [
          "v=spf1 include:_spf.google.com ~all",
          "google-site-verification=abc123",
        ],
        ttl: 300,
      };
      expect(isTXTRecord(validTXTRecord)).toBe(true);
    });

    it("should reject non-array entries", () => {
      const invalidTXTRecord = {
        type: "TXT",
        entries: "not an array",
        ttl: 300,
      };
      expect(isTXTRecord(invalidTXTRecord)).toBe(false);
    });

    it("should handle empty entries array", () => {
      const validTXTRecord = {
        type: "TXT",
        entries: [],
        ttl: 300,
      };
      expect(isTXTRecord(validTXTRecord)).toBe(true);
    });

    it("should reject entries with non-string values", () => {
      const invalidTXTRecord = {
        type: "TXT",
        entries: ["valid string", 123, "another string"],
        ttl: 300,
      };
      expect(isTXTRecord(invalidTXTRecord)).toBe(false);
    });

    it("should handle single entry", () => {
      const validTXTRecord = {
        type: "TXT",
        entries: ["single entry"],
        ttl: 300,
      };
      expect(isTXTRecord(validTXTRecord)).toBe(true);
    });

    it("should work without TTL", () => {
      const validTXTRecord = {
        type: "TXT",
        entries: ["test entry"],
      };
      expect(isTXTRecord(validTXTRecord)).toBe(true);
    });
  });

  describe("isNSRecord", () => {
    it("should validate valid NS records", () => {
      const validNSRecord = {
        type: "NS",
        value: "ns1.example.com",
        ttl: 300,
      };
      expect(isNSRecord(validNSRecord)).toBe(true);
    });

    it("should reject invalid domain names", () => {
      const invalidNSRecord = {
        type: "NS",
        value: "invalid..domain",
        ttl: 300,
      };
      expect(isNSRecord(invalidNSRecord)).toBe(false);
    });
  });

  describe("isPTRRecord", () => {
    it("should validate valid PTR records", () => {
      const validPTRRecord = {
        type: "PTR",
        value: "example.com",
        ttl: 300,
      };
      expect(isPTRRecord(validPTRRecord)).toBe(true);
    });

    it("should reject invalid domain names", () => {
      const invalidPTRRecord = {
        type: "PTR",
        value: "invalid..domain",
        ttl: 300,
      };
      expect(isPTRRecord(invalidPTRRecord)).toBe(false);
    });

    it("should work without TTL", () => {
      const validPTRRecord = {
        type: "PTR",
        value: "host.example.com",
      };
      expect(isPTRRecord(validPTRRecord)).toBe(true);
    });
  });

  describe("isNAPTRRecord", () => {
    it("should validate valid NAPTR records", () => {
      const validNAPTRRecord = {
        type: "NAPTR",
        order: 100,
        preference: 10,
        flags: "S",
        service: "SIP+D2U",
        regexp: "",
        replacement: "sip.example.com",
        ttl: 300,
      };
      expect(isNAPTRRecord(validNAPTRRecord)).toBe(true);
    });

    it("should validate NAPTR with empty replacement", () => {
      const validNAPTRRecord = {
        type: "NAPTR",
        order: 100,
        preference: 10,
        flags: "U",
        service: "E2U+sip",
        regexp: "!^.*$!sip:info@example.com!",
        replacement: "",
        ttl: 300,
      };
      expect(isNAPTRRecord(validNAPTRRecord)).toBe(true);
    });

    it("should reject invalid order values", () => {
      const invalidNAPTRRecord = {
        type: "NAPTR",
        order: -1,
        preference: 10,
        flags: "S",
        service: "SIP+D2U",
        regexp: "",
        replacement: "sip.example.com",
        ttl: 300,
      };
      expect(isNAPTRRecord(invalidNAPTRRecord)).toBe(false);
    });

    it("should reject invalid flags", () => {
      const invalidNAPTRRecord = {
        type: "NAPTR",
        order: 100,
        preference: 10,
        flags: "Z", // Invalid flag
        service: "SIP+D2U",
        regexp: "",
        replacement: "sip.example.com",
        ttl: 300,
      };
      expect(isNAPTRRecord(invalidNAPTRRecord)).toBe(false);
    });
  });

  describe("isANYRecord", () => {
    it("should validate valid ANY records", () => {
      const validANYRecord = {
        type: "ANY",
        value: "some data",
        ttl: 300,
      };
      expect(isANYRecord(validANYRecord)).toBe(true);
    });

    it("should validate ANY records with various value types", () => {
      const anyRecordWithObject = {
        type: "ANY",
        value: { nested: "data" },
        ttl: 300,
      };
      expect(isANYRecord(anyRecordWithObject)).toBe(true);

      const anyRecordWithArray = {
        type: "ANY",
        value: ["array", "data"],
        ttl: 300,
      };
      expect(isANYRecord(anyRecordWithArray)).toBe(true);
    });

    it("should work without TTL", () => {
      const validANYRecord = {
        type: "ANY",
        value: "some data",
      };
      expect(isANYRecord(validANYRecord)).toBe(true);
    });

    it("should reject records without value", () => {
      const invalidANYRecord = {
        type: "ANY",
        ttl: 300,
      };
      expect(isANYRecord(invalidANYRecord)).toBe(false);
    });
  });

  describe("isSOARecord", () => {
    it("should validate valid SOA records", () => {
      const validSOARecord = {
        type: "SOA",
        primary: "ns1.example.com",
        admin: "admin.example.com",
        serial: 2023010101,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
        ttl: 300,
      };
      expect(isSOARecord(validSOARecord)).toBe(true);
    });

    it("should reject invalid serial numbers", () => {
      const invalidSOARecord = {
        type: "SOA",
        primary: "ns1.example.com",
        admin: "admin.example.com",
        serial: -1,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
        ttl: 300,
      };
      expect(isSOARecord(invalidSOARecord)).toBe(false);
    });

    it("should reject invalid admin format", () => {
      const invalidSOARecord = {
        type: "SOA",
        primary: "ns1.example.com",
        admin: "invalid-admin-format",
        serial: 2023010101,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
        ttl: 300,
      };
      expect(isSOARecord(invalidSOARecord)).toBe(false);
    });

    it("should reject invalid refresh values", () => {
      const invalidSOARecord = {
        type: "SOA",
        primary: "ns1.example.com",
        admin: "admin.example.com",
        serial: 2023010101,
        refresh: -1,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
        ttl: 300,
      };
      expect(isSOARecord(invalidSOARecord)).toBe(false);
    });

    it("should work without TTL", () => {
      const validSOARecord = {
        type: "SOA",
        primary: "ns1.example.com",
        admin: "admin.example.com",
        serial: 2023010101,
        refresh: 86400,
        retry: 7200,
        expiration: 3600000,
        minimum: 86400,
      };
      expect(isSOARecord(validSOARecord)).toBe(true);
    });
  });

  describe("isSRVRecord", () => {
    it("should validate valid SRV records", () => {
      const validSRVRecord = {
        type: "SRV",
        priority: 10,
        weight: 20,
        port: 443,
        name: "target.example.com",
        ttl: 300,
      };
      expect(isSRVRecord(validSRVRecord)).toBe(true);
    });

    it("should reject invalid port numbers", () => {
      const invalidSRVRecord = {
        type: "SRV",
        priority: 10,
        weight: 20,
        port: 70000,
        name: "target.example.com",
        ttl: 300,
      };
      expect(isSRVRecord(invalidSRVRecord)).toBe(false);
    });
  });

  describe("isCAARecord", () => {
    it("should validate valid CAA records with issue property", () => {
      const validCAARecord = {
        type: "CAA",
        critical: 0,
        issue: "letsencrypt.org",
        ttl: 300,
      };
      expect(isCAARecord(validCAARecord)).toBe(true);
    });

    it("should validate valid CAA records with contact email", () => {
      const validCAARecord = {
        type: "CAA",
        critical: 128,
        contactemail: "admin@example.com",
        ttl: 300,
      };
      expect(isCAARecord(validCAARecord)).toBe(true);
    });

    it("should reject CAA records without any properties", () => {
      const invalidCAARecord = {
        type: "CAA",
        critical: 0,
        ttl: 300,
      };
      expect(isCAARecord(invalidCAARecord)).toBe(false);
    });
  });

  describe("isTLSARecord", () => {
    it("should validate valid TLSA records", () => {
      const validTLSARecord = {
        type: "TLSA",
        usage: 3,
        selector: 1,
        matchingType: 1,
        certificate: "abcdef1234567890",
        ttl: 300,
      };
      expect(isTLSARecord(validTLSARecord)).toBe(true);
    });

    it("should reject invalid usage values", () => {
      const invalidTLSARecord = {
        type: "TLSA",
        usage: 5,
        selector: 1,
        matchingType: 1,
        certificate: "abcdef1234567890",
        ttl: 300,
      };
      expect(isTLSARecord(invalidTLSARecord)).toBe(false);
    });

    it("should reject non-hex certificate data", () => {
      const invalidTLSARecord = {
        type: "TLSA",
        usage: 3,
        selector: 1,
        matchingType: 1,
        certificate: "not-hex-data!",
        ttl: 300,
      };
      expect(isTLSARecord(invalidTLSARecord)).toBe(false);
    });
  });

  describe("isDNSRecord", () => {
    it("should validate any valid DNS record type", () => {
      const aRecord = { type: "A", address: "192.168.1.1" };
      const aaaaRecord = { type: "AAAA", address: "2001:db8::1" };
      const cnameRecord = { type: "CNAME", value: "example.com" };

      expect(isDNSRecord(aRecord)).toBe(true);
      expect(isDNSRecord(aaaaRecord)).toBe(true);
      expect(isDNSRecord(cnameRecord)).toBe(true);
    });

    it("should reject unknown record types", () => {
      const unknownRecord = { type: "UNKNOWN", value: "something" };
      expect(isDNSRecord(unknownRecord)).toBe(false);
    });
  });

  describe("validateDNSRecord", () => {
    it("should return validation result for valid records", () => {
      const validRecord = { type: "A", address: "192.168.1.1" };
      const result = validateDNSRecord(validRecord);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return validation errors for invalid records", () => {
      const invalidRecord = { type: "A", address: "invalid-ip" };
      const result = validateDNSRecord(invalidRecord);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle non-object inputs", () => {
      const result = validateDNSRecord("not an object");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Record must be an object");
    });
  });
});
