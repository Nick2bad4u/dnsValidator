#!/usr/bin/env node
"use strict";
/**
 * DNS Validator CLI Tool
 *
 * A command-line interface for validating DNS records and queries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCLI = void 0;
const commander_1 = require("commander");
const fs_1 = require("fs");
const index_1 = require("./index");
/**
 * Validates a single DNS record
 */
function validateSingleRecord(record, options) {
    try {
        const recordType = options.type || record.type;
        if (!recordType) {
            throw new Error('Record type must be specified either in the record or via --type option');
        }
        let result;
        const recordWithType = { ...record, type: recordType };
        // Use basic validation first
        const isValid = (0, index_1.isDNSRecord)(recordWithType);
        if (!isValid && options.strict) {
            throw new Error(`Invalid ${recordType} record structure`);
        }
        // Perform detailed validation based on type
        switch (recordType.toUpperCase()) {
            case 'A':
                result = (0, index_1.validateARecord)(recordWithType);
                break;
            case 'AAAA':
                result = (0, index_1.validateAAAARecord)(recordWithType);
                break;
            case 'MX':
                result = (0, index_1.validateMXRecord)(recordWithType);
                break;
            case 'TXT':
                result = (0, index_1.isTXTRecord)(recordWithType)
                    ? { isValid: true, record: recordWithType, errors: [] }
                    : {
                        isValid: false,
                        record: recordWithType,
                        errors: ['Invalid TXT record'],
                    };
                break;
            case 'SOA':
                result = (0, index_1.isSOARecord)(recordWithType)
                    ? { isValid: true, record: recordWithType, errors: [] }
                    : {
                        isValid: false,
                        record: recordWithType,
                        errors: ['Invalid SOA record'],
                    };
                break;
            case 'SRV':
                result = (0, index_1.isSRVRecord)(recordWithType)
                    ? { isValid: true, record: recordWithType, errors: [] }
                    : {
                        isValid: false,
                        record: recordWithType,
                        errors: ['Invalid SRV record'],
                    };
                break;
            case 'NS':
                result = (0, index_1.isNSRecord)(recordWithType)
                    ? { isValid: true, record: recordWithType, errors: [] }
                    : {
                        isValid: false,
                        record: recordWithType,
                        errors: ['Invalid NS record'],
                    };
                break;
            case 'CNAME':
                result = (0, index_1.isCNAMERecord)(recordWithType)
                    ? { isValid: true, record: recordWithType, errors: [] }
                    : {
                        isValid: false,
                        record: recordWithType,
                        errors: ['Invalid CNAME record'],
                    };
                break;
            case 'PTR':
                result = (0, index_1.isPTRRecord)(recordWithType)
                    ? { isValid: true, record: recordWithType, errors: [] }
                    : {
                        isValid: false,
                        record: recordWithType,
                        errors: ['Invalid PTR record'],
                    };
                break;
            case 'CAA':
                result = (0, index_1.isCAARecord)(recordWithType)
                    ? { isValid: true, record: recordWithType, errors: [] }
                    : {
                        isValid: false,
                        record: recordWithType,
                        errors: ['Invalid CAA record'],
                    };
                break;
            case 'NAPTR':
                result = (0, index_1.isNAPTRRecord)(recordWithType)
                    ? { isValid: true, record: recordWithType, errors: [] }
                    : {
                        isValid: false,
                        record: recordWithType,
                        errors: ['Invalid NAPTR record'],
                    };
                break;
            case 'TLSA':
                result = (0, index_1.isTLSARecord)(recordWithType)
                    ? { isValid: true, record: recordWithType, errors: [] }
                    : {
                        isValid: false,
                        record: recordWithType,
                        errors: ['Invalid TLSA record'],
                    };
                break;
            default:
                if (options.strict) {
                    throw new Error(`Unsupported record type: ${recordType}`);
                }
                result = {
                    isValid: isValid,
                    record: recordWithType,
                    warnings: [`Unknown record type: ${recordType}`],
                };
        }
        return {
            success: true,
            record: recordWithType,
            validation: result,
            type: recordType,
        };
    }
    catch (error) {
        return {
            success: false,
            record,
            error: error instanceof Error ? error.message : String(error),
            type: options.type || record.type || 'unknown',
        };
    }
}
/**
 * Validates a DNS query
 */
function validateQuery(query, _options) {
    try {
        const result = (0, index_1.validateDNSResponse)(query);
        return {
            success: true,
            query,
            validation: result,
            recordCount: query.answers?.length || 0,
        };
    }
    catch (error) {
        return {
            success: false,
            query,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
/**
 * Formats output based on the specified format
 */
function formatOutput(results, format) {
    switch (format) {
        case 'table':
            return formatTable(results);
        case 'csv':
            return formatCSV(results);
        case 'json':
        default:
            return JSON.stringify(results, null, 2);
    }
}
/**
 * Formats results as a table
 */
function formatTable(results) {
    const headers = ['Type', 'Status', 'Record/Query', 'Result'];
    const rows = results.map(result => [
        result.type || 'Query',
        result.success ? '✓ Valid' : '✗ Invalid',
        result.record
            ? JSON.stringify(result.record, null, 0).substring(0, 50) + '...'
            : JSON.stringify(result.query, null, 0).substring(0, 50) + '...',
        result.success ? 'OK' : result.error?.substring(0, 50) + '...',
    ]);
    const colWidths = headers.map((header, i) => Math.max(header.length, ...rows.map(row => row[i].length)));
    const separator = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+';
    const headerRow = '|' +
        headers.map((h, i) => ` ${h.padEnd(colWidths[i] || 0)} `).join('|') +
        '|';
    const dataRows = rows.map(row => '|' +
        row.map((cell, i) => ` ${cell.padEnd(colWidths[i] || 0)} `).join('|') +
        '|');
    return [separator, headerRow, separator, ...dataRows, separator].join('\n');
}
/**
 * Formats results as CSV
 */
function formatCSV(results) {
    const headers = ['Type', 'Success', 'Error', 'RecordData'];
    const rows = results.map(result => [
        result.type || 'Query',
        result.success ? 'true' : 'false',
        result.error || '',
        JSON.stringify(result.record || result.query),
    ]);
    const csvRows = [headers, ...rows].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','));
    return csvRows.join('\n');
}
/**
 * Main CLI program
 */
commander_1.program
    .name('dns-response-validator')
    .description('CLI tool for validating DNS records and queries')
    .version('1.0.0');
// Single record validation command
commander_1.program
    .command('record')
    .description('Validate a single DNS record')
    .option('-t, --type <type>', 'DNS record type (A, AAAA, MX, etc.)')
    .option('-d, --data <data>', 'DNS record data as JSON string')
    .option('-f, --file <file>', 'Read DNS record from JSON file')
    .option('-o, --output <file>', 'Write results to file')
    .option('--format <format>', 'Output format (json, table, csv)', 'json')
    .option('-v, --verbose', 'Verbose output')
    .option('-s, --strict', 'Strict validation mode')
    .action((options) => {
    try {
        let record;
        if (options.data && options.data.startsWith('{')) {
            // JSON string input
            record = JSON.parse(options.data);
        }
        else if (options.file) {
            // File input
            const fileContent = (0, fs_1.readFileSync)(options.file, 'utf8');
            record = JSON.parse(fileContent);
        }
        else {
            console.error('Error: Must provide either --data or --file option');
            process.exit(1);
        }
        const result = validateSingleRecord(record, options);
        const output = formatOutput([result], options.format || 'json');
        if (options.output) {
            (0, fs_1.writeFileSync)(options.output, output);
            console.log(`Results written to ${options.output}`);
        }
        else {
            console.log(output);
        }
        if (!result.success) {
            process.exit(1);
        }
    }
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
// Query validation command
commander_1.program
    .command('query')
    .description('Validate a DNS query response')
    .option('-d, --data <data>', 'DNS query data as JSON string')
    .option('-f, --file <file>', 'Read DNS query from JSON file')
    .option('-o, --output <file>', 'Write results to file')
    .option('--format <format>', 'Output format (json, table, csv)', 'json')
    .option('-v, --verbose', 'Verbose output')
    .option('-s, --strict', 'Strict validation mode')
    .action((options) => {
    try {
        let query;
        if (options.data && options.data.startsWith('{')) {
            // JSON string input
            query = JSON.parse(options.data);
        }
        else if (options.file) {
            // File input
            const fileContent = (0, fs_1.readFileSync)(options.file, 'utf8');
            query = JSON.parse(fileContent);
        }
        else {
            console.error('Error: Must provide either --data or --file option');
            process.exit(1);
        }
        const result = validateQuery(query, options);
        const output = formatOutput([result], options.format || 'json');
        if (options.output) {
            (0, fs_1.writeFileSync)(options.output, output);
            console.log(`Results written to ${options.output}`);
        }
        else {
            console.log(output);
        }
        if (!result.success) {
            process.exit(1);
        }
    }
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
// Bulk validation command
commander_1.program
    .command('bulk')
    .description('Validate multiple DNS records or queries from a file')
    .option('-f, --file <file>', 'Input file containing JSON array of records/queries')
    .option('-o, --output <file>', 'Write results to file')
    .option('--format <format>', 'Output format (json, table, csv)', 'json')
    .option('-v, --verbose', 'Verbose output')
    .option('-s, --strict', 'Strict validation mode')
    .option('--type <type>', 'Default record type for records without type field')
    .option('--mode <mode>', 'Validation mode: records or queries', 'records')
    .action((options) => {
    try {
        if (!options.file) {
            console.error('Error: Must provide --file option');
            process.exit(1);
        }
        const fileContent = (0, fs_1.readFileSync)(options.file, 'utf8');
        const data = JSON.parse(fileContent);
        if (!Array.isArray(data)) {
            console.error('Error: Input file must contain a JSON array');
            process.exit(1);
        }
        const results = data.map((item, index) => {
            if (options.verbose) {
                console.error(`Processing item ${index + 1}/${data.length}...`);
            }
            if (options.mode === 'queries') {
                return validateQuery(item, options);
            }
            else {
                return validateSingleRecord(item, options);
            }
        });
        const output = formatOutput(results, options.format || 'json');
        if (options.output) {
            (0, fs_1.writeFileSync)(options.output, output);
            console.log(`Results written to ${options.output}`);
        }
        else {
            console.log(output);
        }
        // Summary
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;
        console.error(`\nSummary: ${successCount} succeeded, ${failCount} failed`);
        if (failCount > 0) {
            process.exit(1);
        }
    }
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
// Examples command
commander_1.program
    .command('examples')
    .description('Show usage examples')
    .action(() => {
    console.log(`
DNS Validator CLI - Usage Examples

1. Validate a single A record:
   dns-response-validator record --type A --data '{"name":"example.com","address":"192.168.1.1","ttl":300}'

2. Validate a record from file:
   dns-response-validator record --file record.json --format table

3. Validate a DNS query response:
   dns-response-validator query --file query.json --verbose

4. Bulk validate records:
   dns-response-validator bulk --file records.json --format csv --output results.csv

5. Bulk validate with strict mode:
   dns-response-validator bulk --file records.json --strict --verbose

Sample A record JSON:
{
  "type": "A",
  "name": "example.com",
  "address": "192.168.1.1",
  "ttl": 300
}

Sample DNS query JSON:
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
`);
});
// Parse command line arguments
/**
 * Run the CLI with the provided argv (excluding the first two node/script entries).
 * Exposed for testing so we can invoke the command definitions without spawning a child process.
 */
function runCLI(argv = process.argv.slice(2)) {
    commander_1.program.parse(['node', 'dns-response-validator', ...argv]);
    if (!argv.length) {
        commander_1.program.outputHelp();
    }
}
exports.runCLI = runCLI;
// Execute only when run as a script, not when imported for tests
if (require.main === module) {
    runCLI();
}
//# sourceMappingURL=cli.js.map