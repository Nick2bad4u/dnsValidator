# Function: toANYRecord()

> **toANYRecord**(`entries`): [`ANYRecord`](../interfaces/ANYRecord.md)

Defined in: [node-compat.ts:45](https://github.com/Nick2bad4u/dnsValidator/blob/main/src/node-compat.ts#L45)

Create an ANY record container from a heterogeneous Node resolveAny response array.

## Parameters

### entries

(\{ `type`: `"A"`; `address`: `string`; `ttl?`: `number`; \} \| \{ `type`: `"AAAA"`; `address`: `string`; `ttl?`: `number`; \} \| \{ `type`: `"CNAME"`; `value`: `string`; \} \| \{ `type`: `"MX"`; `exchange`: `string`; `priority`: `number`; \} \| \{ `type`: `"NAPTR"`; `flags`: `string`; `service`: `string`; `regexp`: `string`; `replacement`: `string`; `order`: `number`; `preference`: `number`; \} \| \{ `type`: `"NS"`; `value`: `string`; \} \| \{ `type`: `"PTR"`; `value`: `string`; \} \| \{ `type`: `"SOA"`; `nsname`: `string`; `hostmaster`: `string`; `serial`: `number`; `refresh`: `number`; `retry`: `number`; `expire`: `number`; `minttl`: `number`; \} \| \{ `type`: `"SRV"`; `priority`: `number`; `weight`: `number`; `port`: `number`; `name`: `string`; \} \| \{ `type`: `"TLSA"`; `certUsage`: `number`; `selector`: `number`; `match`: `number`; `data`: `string` \| `ArrayBuffer`; \} \| \{ `type`: `"TXT"`; `entries`: `string`[]; \})[] | `undefined`

## Returns

[`ANYRecord`](../interfaces/ANYRecord.md)
