declare module "dns-response-validator/dnssec" {
    export { validateRRSIG } from "../src/dnssec";
}

declare module "dns-response-validator/validators" {
    export { validateDNSRecord } from "../src/validators";
}
