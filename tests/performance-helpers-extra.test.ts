import { describe, it, expect } from "vitest";
import {
    fastPreValidate,
    getRequiredField,
    getOptionalField,
    isValidRecordType,
    isPlainObject,
} from "../src/performance";

describe("performance helpers extra branches", () => {
    it("fastPreValidate returns false on empty or non-string", () => {
        expect(fastPreValidate("", "ipv4")).toBeFalsy();
        expect(fastPreValidate("999.999.999.999", "ipv4")).toBeFalsy(); // Fails regex
    });

    it("fastPreValidate returns null on pass-through", () => {
        expect(fastPreValidate("192.168.1.1", "ipv4")).toBeNull();
    });

    it("getRequiredField object mismatch and success", () => {
        const obj: any = { a: 5, b: { x: 1 }, c: [] };

        expect(getRequiredField<number>(obj, "a", "number")).toBe(5);
        expect(
            getRequiredField<Record<string, unknown>>(obj, "b", "object")
        ).toEqual({ x: 1 });
        // C is array -> not plain object -> null
        expect(
            getRequiredField<Record<string, unknown>>(obj, "c", "object")
        ).toBeNull();
        expect(getRequiredField<any>(obj, "missing", "string")).toBeNull();
    });

    it("getOptionalField undefined, null mismatch, success", () => {
        const obj: any = { a: "hello", b: { y: 2 }, c: [] };

        expect(getOptionalField<string>(obj, "a", "string")).toBe("hello");
        expect(
            getOptionalField<Record<string, unknown>>(obj, "b", "object")
        ).toEqual({ y: 2 });
        expect(
            getOptionalField<Record<string, unknown>>(obj, "c", "object")
        ).toBeNull();
        expect(
            getOptionalField<string>(obj, "missing", "string")
        ).toBeUndefined();
    });

    it("isValidRecordType negative and positive", () => {
        expect(isValidRecordType("A")).toBeTruthy();
        expect(isValidRecordType("UNKNOWN")).toBeFalsy();
        expect(isValidRecordType(123 as any)).toBeFalsy();
    });

    it("isPlainObject negative cases", () => {
        expect(isPlainObject({})).toBeTruthy();
        expect(isPlainObject([])).toBeFalsy();
        expect(isPlainObject(null)).toBeFalsy();
    });
});
