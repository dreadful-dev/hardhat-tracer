import { BigNumber } from "ethers";
export declare function parseHex(str: string): string;
export declare function parseNumber(str: string): number;
export declare function parseUint(str: string): BigNumber;
export declare function parseAddress(str: string): string;
export declare function parseBytes32(str: string): string;
export declare function parseMemory(strArr: string[]): Uint8Array;
export declare function shallowCopyStack(stack: string[]): string[];
export declare function shallowCopyStack2(stack: Array<bigint>): string[];
/**
 * Ensures 0x prefix to a hex string which may or may not
 * @param str A hex string that may or may not have 0x prepended
 */
export declare function hexPrefix(str: string): string;
//# sourceMappingURL=hex.d.ts.map