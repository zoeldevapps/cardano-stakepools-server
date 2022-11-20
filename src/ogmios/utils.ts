import { bech32 } from "bech32";

export function bechIdToHex(bechId: string) {
  return Buffer.from(bech32.fromWords(bech32.decode(bechId, 256).words)).toString("hex");
}

export function toBechId(id: string) {
  return bech32.encode("pool", bech32.toWords(Buffer.from(id, "hex")));
}
