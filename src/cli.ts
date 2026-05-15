/**
 * DNS Validator CLI Tool
 *
 * A command-line interface for validating DNS records and queries
 */

import type { UnknownRecord } from "type-fest";

import { program } from "commander";
import { readFileSync, writeFileSync } from "node:fs";
import {
    arrayJoin,
    isDefined,
    isEmpty,
    isPresent,
    safeCastTo,
} from "ts-extras";

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
    isValidDNSQueryResult,
    validateAAAARecord,
    validateARecord,
    validateDNSResponse,
    validateMXRecord,
} from "./index";

interface BasicValidationResult {
    errors?: string[];
    isValid: boolean;
    record?: unknown;
    warnings?: string[];
}

interface CLIOptions {
    data?: string;
    file?: string;
    format?: "csv" | "json" | "table";
    output?: string;
    strict?: boolean;
    type?: string;
    verbose?: boolean;
}

interface CLIValidationResult {
    error?: string;
    query?: unknown;
    record?: unknown;
    recordCount?: number;
    success: boolean;
    type?: string;
    validation?: unknown;
    warnings?: string[];
}

function formatCSV(results: readonly Readonly<CLIValidationResult>[]): string {
    const headers = [
        "Type",
        "Success",
        "Error",
        "RecordData",
    ];
    const rows = results.map((result) => [
        typeof result.type === "string" ? result.type : "Query",
        result.success ? "true" : "false",
        typeof result.error === "string" ? result.error : "",
        JSON.stringify(result.record ?? result.query ?? null),
    ]);

    const csvRows = [headers, ...rows].map((row) =>
        arrayJoin(
            row.map(
                (cell) =>
                    `"${(typeof cell === "string" ? cell : JSON.stringify(cell)).replaceAll('"', '""')}"`
            ),
            ","
        )
    );

    return arrayJoin(csvRows, "\n");
}

const tableOutputFormatter = (
    results: readonly Readonly<CLIValidationResult>[]
): string => {
    const headers = [
        "Type",
        "Status",
        "Record/Query",
        "Result",
    ];
    const rows = results.map((result) => [
        typeof result.type === "string" ? result.type : "Query",
        result.success ? "✓ Valid" : "✗ Invalid",
        isDefined(result.record)
            ? `${JSON.stringify(result.record, null, 0).slice(0, 50)}...`
            : `${JSON.stringify(result.query ?? null, null, 0).slice(0, 50)}...`,
        result.success
            ? "OK"
            : `${(typeof result.error === "string" ? result.error : "").slice(0, 50)}...`,
    ]);

    const colWidths = headers.map((header, i) =>
        Math.max(header.length, ...rows.map((row) => row[i]?.length ?? 0))
    );

    const separator = `+${arrayJoin(
        colWidths.map((width) => "-".repeat(width + 2)),
        "+"
    )}+`;
    const headerRow = `|${arrayJoin(
        headers.map((header, i) => ` ${header.padEnd(colWidths[i] ?? 0)} `),
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
};

/**
 * Formats output based on the specified format
 */
function formatOutput(
    results: readonly Readonly<CLIValidationResult>[],
    format: "csv" | "json" | "table"
): string {
    switch (format) {
        case "csv": {
            return formatCSV(results);
        }
        case "json": {
            return JSON.stringify(results, null, 2);
        }
        case "table": {
            return tableOutputFormatter(results);
        }
        default: {
            return JSON.stringify(results, null, 2);
        }
    }
}

function isRecordObject(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null;
}

function parseJsonInput(
    options: Readonly<CLIOptions>,
    kind: "query" | "record"
): unknown {
    if (options.data?.startsWith("{") === true) {
        return JSON.parse(options.data);
    }

    if (isPresent(options.file)) {
        const fileContent = readFileSync(options.file, "utf8");
        return JSON.parse(fileContent);
    }

    throw new Error(`Must provide either --data or --file option for ${kind}`);
}

function recordTypeFrom(
    record: unknown,
    options: Readonly<CLIOptions>
): string {
    if (typeof options.type === "string") {
        return options.type;
    }
    if (isRecordObject(record) && typeof record["type"] === "string") {
        return record["type"];
    }
    return "unknown";
}

function validateByType(
    recordType: string,
    recordWithType: Readonly<UnknownRecord>
): BasicValidationResult {
    const perTypeValidators: Readonly<
        Record<string, (record: unknown) => BasicValidationResult>
    > = {
        A: (record) => validateARecord(record),
        AAAA: (record) => validateAAAARecord(record),
        CAA: (record) =>
            isCAARecord(record)
                ? { errors: [], isValid: true, record }
                : { errors: ["Invalid CAA record"], isValid: false, record },
        CNAME: (record) =>
            isCNAMERecord(record)
                ? { errors: [], isValid: true, record }
                : { errors: ["Invalid CNAME record"], isValid: false, record },
        MX: (record) => validateMXRecord(record),
        NAPTR: (record) =>
            isNAPTRRecord(record)
                ? { errors: [], isValid: true, record }
                : { errors: ["Invalid NAPTR record"], isValid: false, record },
        NS: (record) =>
            isNSRecord(record)
                ? { errors: [], isValid: true, record }
                : { errors: ["Invalid NS record"], isValid: false, record },
        PTR: (record) =>
            isPTRRecord(record)
                ? { errors: [], isValid: true, record }
                : { errors: ["Invalid PTR record"], isValid: false, record },
        SOA: (record) =>
            isSOARecord(record)
                ? { errors: [], isValid: true, record }
                : { errors: ["Invalid SOA record"], isValid: false, record },
        SRV: (record) =>
            isSRVRecord(record)
                ? { errors: [], isValid: true, record }
                : { errors: ["Invalid SRV record"], isValid: false, record },
        TLSA: (record) =>
            isTLSARecord(record)
                ? { errors: [], isValid: true, record }
                : { errors: ["Invalid TLSA record"], isValid: false, record },
        TXT: (record) =>
            isTXTRecord(record)
                ? { errors: [], isValid: true, record }
                : { errors: ["Invalid TXT record"], isValid: false, record },
    };

    const validatorForType = perTypeValidators[recordType.toUpperCase()];
    if (isDefined(validatorForType)) {
        return validatorForType(recordWithType);
    }

    return {
        isValid: isDNSRecord(recordWithType),
        record: recordWithType,
        warnings: [`Unknown record type: ${recordType}`],
    };
}

/**
 * Validates a DNS query.
 *
 * @throws When the input is not an object accepted by query validation.
 */
function validateQuery(query: unknown): CLIValidationResult {
    try {
        if (!isValidDNSQueryResult(query)) {
            throw new Error("Query must be an object");
        }
        const result = validateDNSResponse(query);
        const answers = query.answers;
        const recordCount = Array.isArray(answers) ? answers.length : 0;

        return {
            query,
            recordCount,
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
 *
 * @throws When strict validation is enabled and the record type is missing or
 *   unsupported.
 */

function validateSingleRecord(
    record: unknown,
    options: Readonly<CLIOptions>
): CLIValidationResult {
    try {
        const sourceType =
            isRecordObject(record) && typeof record["type"] === "string"
                ? record["type"]
                : undefined;
        const recordType = options.type ?? sourceType;

        if (!isDefined(recordType)) {
            throw new Error(
                "Record type must be specified either in the record or via --type option"
            );
        }

        const recordData = isRecordObject(record) ? record : {};
        const recordWithType = safeCastTo<UnknownRecord>({
            ...recordData,
            type: recordType,
        });

        // Use basic validation first
        const isValid = isDNSRecord(recordWithType);

        if (!isValid && options.strict === true) {
            throw new Error(`Invalid ${recordType} record structure`);
        }

        const result = validateByType(recordType, recordWithType);
        if (
            options.strict === true &&
            !isDefined(result.errors) &&
            isDefined(result.warnings)
        ) {
            throw new Error(`Unsupported record type: ${recordType}`);
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
            type: recordTypeFrom(record, options),
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
    .action((options: Readonly<CLIOptions>) => {
        try {
            const record = parseJsonInput(options, "record");

            const result = validateSingleRecord(record, options);
            const output = formatOutput([result], options.format ?? "json");

            if (isPresent(options.output)) {
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
    .action((options: Readonly<CLIOptions>) => {
        try {
            const query = parseJsonInput(options, "query");

            const result = validateQuery(query);
            const output = formatOutput([result], options.format ?? "json");

            if (isPresent(options.output)) {
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
    .action((options: Readonly<CLIOptions & { mode?: string }>) => {
        try {
            if (isPresent(options.file)) {
                const fileContent = readFileSync(options.file, "utf8");
                const data: unknown = JSON.parse(fileContent);

                if (!Array.isArray(data)) {
                    console.error(
                        "Error: Input file must contain a JSON array"
                    );
                    process.exit(1);
                }

                const results = data.map((item, index) => {
                    if (options.verbose === true) {
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

                if (isPresent(options.output)) {
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
            } else {
                console.error("Error: Must provide --file option");
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
