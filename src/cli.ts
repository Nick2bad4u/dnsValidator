/**
 * DNS Validator CLI Tool
 *
 * A command-line interface for validating DNS records and queries
 */

import { program } from "commander";
import { readFileSync, writeFileSync } from "node:fs";
import { arrayJoin, isEmpty } from "ts-extras";

import {
    isCAARecord,
    isCNAMERecord,
    isDNSRecord,
    isNAPTRRecord,
    isNSRecord,
    isPTRRecord,
    isSOARecord,
    isSRVRecord,
    isTLSARecord,
    isTXTRecord,
    validateAAAARecord,
    validateARecord,
    validateDNSResponse,
    validateMXRecord,
} from "./index";

interface CLIOptions {
    data?: string;
    file?: string;
    format?: "csv" | "json" | "table";
    output?: string;
    strict?: boolean;
    type?: string;
    verbose?: boolean;
}

/**
 * Formats results as CSV
 */
function formatCSV(results: any[]): string {
    const headers = [
        "Type",
        "Success",
        "Error",
        "RecordData",
    ];
    const rows = results.map((result) => [
        result.type ?? "Query",
        result.success ? "true" : "false",
        result.error ?? "",
        JSON.stringify(result.record ?? result.query),
    ]);

    const csvRows = [headers, ...rows].map((row) =>
        arrayJoin(
            row.map((cell) => `"${cell.replaceAll('"', '""')}"`),
            ","
        )
    );

    return arrayJoin(csvRows, "\n");
}

/**
 * Formats output based on the specified format
 */
function formatOutput(results: any[], format: string): string {
    switch (format) {
        case "csv": {
            return formatCSV(results);
        }
        case "table": {
            return formatTable(results);
        }
        default: {
            return JSON.stringify(results, null, 2);
        }
    }
}

/**
 * Formats results as a table
 */
function formatTable(results: any[]): string {
    const headers = [
        "Type",
        "Status",
        "Record/Query",
        "Result",
    ];
    const rows = results.map((result) => [
        result.type ?? "Query",
        result.success ? "✓ Valid" : "✗ Invalid",
        result.record
            ? `${JSON.stringify(result.record, null, 0).slice(0, 50)}...`
            : `${JSON.stringify(result.query, null, 0).slice(0, 50)}...`,
        result.success ? "OK" : `${result.error?.slice(0, 50)}...`,
    ]);

    const colWidths = headers.map((header, i) =>
        Math.max(header.length, ...rows.map((row) => row[i].length))
    );

    const separator = `+${arrayJoin(
        colWidths.map((w) => "-".repeat(w + 2)),
        "+"
    )}+`;
    const headerRow = `|${arrayJoin(
        headers.map((h, i) => ` ${h.padEnd(colWidths[i] ?? 0)} `),
        "|"
    )}|`;

    const dataRows = rows.map(
        (row) =>
            `|${arrayJoin(
                row.map((cell, i) => ` ${cell.padEnd(colWidths[i] ?? 0)} `),
                "|"
            )}|`
    );

    return arrayJoin(
        [
            separator,
            headerRow,
            separator,
            ...dataRows,
            separator,
        ],
        "\n"
    );
}

/**
 * Validates a DNS query
 */
function validateQuery(query: any): any {
    try {
        const result = validateDNSResponse(query);

        return {
            query,
            recordCount: query.answers?.length ?? 0,
            success: true,
            validation: result,
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : String(error),
            query,
            success: false,
        };
    }
}

/**
 * Validates a single DNS record
 */
function validateSingleRecord(record: any, options: CLIOptions): any {
    try {
        const recordType = options.type ?? record.type;

        if (!recordType) {
            throw new Error(
                "Record type must be specified either in the record or via --type option"
            );
        }

        let result: unknown;
        const recordWithType = { ...record, type: recordType };

        // Use basic validation first
        const isValid = isDNSRecord(recordWithType);

        if (!isValid && options.strict) {
            throw new Error(`Invalid ${recordType} record structure`);
        }

        // Perform detailed validation based on type
        switch (recordType.toUpperCase()) {
            case "A": {
                result = validateARecord(recordWithType);
                break;
            }
            case "AAAA": {
                result = validateAAAARecord(recordWithType);
                break;
            }
            case "CAA": {
                result = isCAARecord(recordWithType)
                    ? { errors: [], isValid: true, record: recordWithType }
                    : {
                          errors: ["Invalid CAA record"],
                          isValid: false,
                          record: recordWithType,
                      };
                break;
            }
            case "CNAME": {
                result = isCNAMERecord(recordWithType)
                    ? { errors: [], isValid: true, record: recordWithType }
                    : {
                          errors: ["Invalid CNAME record"],
                          isValid: false,
                          record: recordWithType,
                      };
                break;
            }
            case "MX": {
                result = validateMXRecord(recordWithType);
                break;
            }
            case "NAPTR": {
                result = isNAPTRRecord(recordWithType)
                    ? { errors: [], isValid: true, record: recordWithType }
                    : {
                          errors: ["Invalid NAPTR record"],
                          isValid: false,
                          record: recordWithType,
                      };
                break;
            }
            case "NS": {
                result = isNSRecord(recordWithType)
                    ? { errors: [], isValid: true, record: recordWithType }
                    : {
                          errors: ["Invalid NS record"],
                          isValid: false,
                          record: recordWithType,
                      };
                break;
            }
            case "PTR": {
                result = isPTRRecord(recordWithType)
                    ? { errors: [], isValid: true, record: recordWithType }
                    : {
                          errors: ["Invalid PTR record"],
                          isValid: false,
                          record: recordWithType,
                      };
                break;
            }
            case "SOA": {
                result = isSOARecord(recordWithType)
                    ? { errors: [], isValid: true, record: recordWithType }
                    : {
                          errors: ["Invalid SOA record"],
                          isValid: false,
                          record: recordWithType,
                      };
                break;
            }
            case "SRV": {
                result = isSRVRecord(recordWithType)
                    ? { errors: [], isValid: true, record: recordWithType }
                    : {
                          errors: ["Invalid SRV record"],
                          isValid: false,
                          record: recordWithType,
                      };
                break;
            }
            case "TLSA": {
                result = isTLSARecord(recordWithType)
                    ? { errors: [], isValid: true, record: recordWithType }
                    : {
                          errors: ["Invalid TLSA record"],
                          isValid: false,
                          record: recordWithType,
                      };
                break;
            }
            case "TXT": {
                result = isTXTRecord(recordWithType)
                    ? { errors: [], isValid: true, record: recordWithType }
                    : {
                          errors: ["Invalid TXT record"],
                          isValid: false,
                          record: recordWithType,
                      };
                break;
            }
            default: {
                if (options.strict) {
                    throw new Error(`Unsupported record type: ${recordType}`);
                }
                result = {
                    isValid: isValid,
                    record: recordWithType,
                    warnings: [`Unknown record type: ${recordType}`],
                };
            }
        }

        return {
            record: recordWithType,
            success: true,
            type: recordType,
            validation: result,
        };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : String(error),
            record,
            success: false,
            type: options.type ?? record.type ?? "unknown",
        };
    }
}

/**
 * Main CLI program
 */
program
    .name("dns-response-validator")
    .description("CLI tool for validating DNS records and queries")
    .version("1.0.0");

// Single record validation command
program
    .command("record")
    .description("Validate a single DNS record")
    .option("-t, --type <type>", "DNS record type (A, AAAA, MX, etc.)")
    .option("-d, --data <data>", "DNS record data as JSON string")
    .option("-f, --file <file>", "Read DNS record from JSON file")
    .option("-o, --output <file>", "Write results to file")
    .option("--format <format>", "Output format (json, table, csv)", "json")
    .option("-v, --verbose", "Verbose output")
    .option("-s, --strict", "Strict validation mode")
    .action((options: CLIOptions) => {
        try {
            let record: unknown;

            if (options.data?.startsWith("{")) {
                // JSON string input
                record = JSON.parse(options.data);
            } else if (options.file) {
                // File input
                const fileContent = readFileSync(options.file, "utf8");
                record = JSON.parse(fileContent);
            } else {
                console.error(
                    "Error: Must provide either --data or --file option"
                );
                process.exit(1);
            }

            const result = validateSingleRecord(record, options);
            const output = formatOutput([result], options.format ?? "json");

            if (options.output) {
                writeFileSync(options.output, output);
                console.log(`Results written to ${options.output}`);
            } else {
                console.log(output);
            }

            if (!result.success) {
                process.exit(1);
            }
        } catch (error) {
            console.error(
                "Error:",
                error instanceof Error ? error.message : String(error)
            );
            process.exit(1);
        }
    });

// Query validation command
program
    .command("query")
    .description("Validate a DNS query response")
    .option("-d, --data <data>", "DNS query data as JSON string")
    .option("-f, --file <file>", "Read DNS query from JSON file")
    .option("-o, --output <file>", "Write results to file")
    .option("--format <format>", "Output format (json, table, csv)", "json")
    .option("-v, --verbose", "Verbose output")
    .option("-s, --strict", "Strict validation mode")
    .action((options: CLIOptions) => {
        try {
            let query: unknown;

            if (options.data?.startsWith("{")) {
                // JSON string input
                query = JSON.parse(options.data);
            } else if (options.file) {
                // File input
                const fileContent = readFileSync(options.file, "utf8");
                query = JSON.parse(fileContent);
            } else {
                console.error(
                    "Error: Must provide either --data or --file option"
                );
                process.exit(1);
            }

            const result = validateQuery(query);
            const output = formatOutput([result], options.format ?? "json");

            if (options.output) {
                writeFileSync(options.output, output);
                console.log(`Results written to ${options.output}`);
            } else {
                console.log(output);
            }

            if (!result.success) {
                process.exit(1);
            }
        } catch (error) {
            console.error(
                "Error:",
                error instanceof Error ? error.message : String(error)
            );
            process.exit(1);
        }
    });

// Bulk validation command
program
    .command("bulk")
    .description("Validate multiple DNS records or queries from a file")
    .option(
        "-f, --file <file>",
        "Input file containing JSON array of records/queries"
    )
    .option("-o, --output <file>", "Write results to file")
    .option("--format <format>", "Output format (json, table, csv)", "json")
    .option("-v, --verbose", "Verbose output")
    .option("-s, --strict", "Strict validation mode")
    .option(
        "--type <type>",
        "Default record type for records without type field"
    )
    .option("--mode <mode>", "Validation mode: records or queries", "records")
    .action((options: CLIOptions & { mode?: string }) => {
        try {
            if (!options.file) {
                console.error("Error: Must provide --file option");
                process.exit(1);
            }

            const fileContent = readFileSync(options.file, "utf8");
            const data = JSON.parse(fileContent);

            if (!Array.isArray(data)) {
                console.error("Error: Input file must contain a JSON array");
                process.exit(1);
            }

            const results = data.map((item, index) => {
                if (options.verbose) {
                    console.error(
                        `Processing item ${index + 1}/${data.length}...`
                    );
                }

                if (options.mode === "queries") {
                    return validateQuery(item);
                }
                return validateSingleRecord(item, options);
            });

            const output = formatOutput(results, options.format ?? "json");

            if (options.output) {
                writeFileSync(options.output, output);
                console.log(`Results written to ${options.output}`);
            } else {
                console.log(output);
            }

            // Summary
            const successCount = results.filter((r) => r.success).length;
            const failCount = results.length - successCount;

            console.error(
                `\nSummary: ${successCount} succeeded, ${failCount} failed`
            );

            if (failCount > 0) {
                process.exit(1);
            }
        } catch (error) {
            console.error(
                "Error:",
                error instanceof Error ? error.message : String(error)
            );
            process.exit(1);
        }
    });

// Examples command
program
    .command("examples")
    .description("Show usage examples")
    .action(() => {
        console.log(
            '\nDNS Validator CLI - Usage Examples\n\n1. Validate a single A record:\n   dns-response-validator record --type A --data \'{"name":"example.com","address":"192.168.1.1","ttl":300}\'\n\n2. Validate a record from file:\n   dns-response-validator record --file record.json --format table\n\n3. Validate a DNS query response:\n   dns-response-validator query --file query.json --verbose\n\n4. Bulk validate records:\n   dns-response-validator bulk --file records.json --format csv --output results.csv\n\n5. Bulk validate with strict mode:\n   dns-response-validator bulk --file records.json --strict --verbose\n\nSample A record JSON:\n{\n  "type": "A",\n  "name": "example.com",\n  "address": "192.168.1.1",\n  "ttl": 300\n}\n\nSample DNS query JSON:\n{\n  "question": {\n    "name": "example.com",\n    "type": "A",\n    "class": "IN"\n  },\n  "answers": [\n    {\n      "type": "A",\n      "name": "example.com",\n      "address": "192.168.1.1",\n      "ttl": 300\n    }\n  ]\n}\n'
        );
    });

// Parse command line arguments
/**
 * Run the CLI with the provided argv (excluding the first two node/script
 * entries). Exposed for testing so we can invoke the command definitions
 * without spawning a child process.
 */
export function runCLI(argv: string[] = process.argv.slice(2)): void {
    program.parse([
        "node",
        "dns-response-validator",
        ...argv,
    ]);
    if (isEmpty(argv)) {
        program.outputHelp();
    }
}

// Execute only when run as a script, not when imported for tests
if (require.main === module) {
    runCLI();
}
