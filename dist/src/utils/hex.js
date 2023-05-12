"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexPrefix = exports.shallowCopyStack2 = exports.shallowCopyStack = exports.parseMemory = exports.parseBytes32 = exports.parseAddress = exports.parseUint = exports.parseNumber = exports.parseHex = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
function parseHex(str) {
    return !str.startsWith("0x") ? "0x" + str : str;
}
exports.parseHex = parseHex;
function parseNumber(str) {
    return parseUint(str).toNumber();
}
exports.parseNumber = parseNumber;
function parseUint(str) {
    return ethers_1.BigNumber.from(parseHex(str));
}
exports.parseUint = parseUint;
function parseAddress(str) {
    return (0, utils_1.hexZeroPad)((0, utils_1.hexStripZeros)(parseHex(str)), 20);
}
exports.parseAddress = parseAddress;
function parseBytes32(str) {
    return (0, utils_1.hexZeroPad)((0, utils_1.hexStripZeros)(parseHex(str)), 32);
}
exports.parseBytes32 = parseBytes32;
function parseMemory(strArr) {
    return (0, utils_1.arrayify)(parseHex(strArr.join("")));
}
exports.parseMemory = parseMemory;
function shallowCopyStack(stack) {
    return [...stack];
}
exports.shallowCopyStack = shallowCopyStack;
function shallowCopyStack2(stack) {
    return [...stack].map((x) => ethers_1.BigNumber.from(x).toHexString());
}
exports.shallowCopyStack2 = shallowCopyStack2;
/**
 * Ensures 0x prefix to a hex string which may or may not
 * @param str A hex string that may or may not have 0x prepended
 */
function hexPrefix(str) {
    if (!str.startsWith("0x")) {
        str = "0x" + str;
    }
    return str;
}
exports.hexPrefix = hexPrefix;
//# sourceMappingURL=hex.js.map