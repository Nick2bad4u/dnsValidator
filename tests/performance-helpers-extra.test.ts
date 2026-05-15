import { describe, it, expect } from "vitest";
import {
    fastPreValidate,
    getRequiredField,
    getOptionalField,
    isValidRecordType,
    isPlainObject,
} from "../src/performance";
import type { UnknownRecord } from "type-fest";

describe("performance helpers extra branches", () => {
    it("fastPreValidate returns false on empty or non-string", () => {
        expect(fastPreValidate("", "ipv4")).toBeFalsy();
        expect(fastPreValidate("999.999.999.999", "ipv4")).toBeFalsy(); // Fails regex
    });

    it("fastPreValidate returns null on pass-through", () => {
        expect(fastPreValidate("192.168.1.1", "ipv4")).toBeNull();
    });

    it("getRequiredField object mismatch and success", () => {
        const obj: UnknownRecord = { a: 5, b: { x: 1 }, c: [] };

        expect(getRequiredField(obj, "a", "number")).toBe(5);
        expect(getRequiredField(obj, "b", "object")).toStrictEqual({ x: 1 });
        // C is array -> not plain object -> null
        expect(getRequiredField(obj, "c", "object")).toBeNull();
        expect(getRequiredField(obj, "missing", "string")).toBeNull();
    });

    it("getOptionalField undefined, null mismatch, success", () => {
        const obj: UnknownRecord = { a: "hello", b: { y: 2 }, c: [] };

        expect(getOptionalField(obj, "a", "string")).toBe("hello");
        expect(getOptionalField(obj, "b", "object")).toStrictEqual({ y: 2 });
        expect(getOptionalField(obj, "c", "object")).toBeNull();
        expect(getOptionalField(obj, "missing", "string")).toBeUndefined();
    });

    it("isValidRecordType negative and positive", () => {
        expect(isValidRecordType("A")).toBeTruthy();
        expect(isValidRecordType("UNKNOWN")).toBeFalsy();
        expect(isValidRecordType(123 as unknown)).toBeFalsy();
    });

    it("isPlainObject negative cases", () => {
        expect(isPlainObject({})).toBeTruthy();
        expect(isPlainObject([])).toBeFalsy();
        expect(isPlainObject(null)).toBeFalsy();
    });
});
