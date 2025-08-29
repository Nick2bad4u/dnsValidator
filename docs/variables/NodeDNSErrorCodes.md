# Variable: NodeDNSErrorCodes

> `const` **NodeDNSErrorCodes**: `Readonly`\<\{ `NODATA`: `"NODATA"`; `FORMERR`: `"FORMERR"`; `SERVFAIL`: `"SERVFAIL"`; `NOTFOUND`: `"NOTFOUND"`; `NOTIMP`: `"NOTIMP"`; `REFUSED`: `"REFUSED"`; `BADQUERY`: `"BADQUERY"`; `BADNAME`: `"BADNAME"`; `BADFAMILY`: `"BADFAMILY"`; `BADRESP`: `"BADRESP"`; `CONNREFUSED`: `"CONNREFUSED"`; `TIMEOUT`: `"TIMEOUT"`; `EOF`: `"EOF"`; `FILE`: `"FILE"`; `NOMEM`: `"NOMEM"`; `DESTRUCTION`: `"DESTRUCTION"`; `BADSTR`: `"BADSTR"`; `BADFLAGS`: `"BADFLAGS"`; `NONAME`: `"NONAME"`; `BADHINTS`: `"BADHINTS"`; `NOTINITIALIZED`: `"NOTINITIALIZED"`; `LOADIPHLPAPI`: `"LOADIPHLPAPI"`; `ADDRGETNETWORKPARAMS`: `"ADDRGETNETWORKPARAMS"`; `CANCELLED`: `"CANCELLED"`; \}\>

Defined in: [errors.ts:34](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/errors.ts#L34)

Node.js dns module error code constants (subset) for compatibility.
These mirror the standard error codes exposed by the core 'dns' module so that
consumers can write portable code when using this library as a validation layer.

Source reference: https://nodejs.org/api/dns.html#dns-error-codes
