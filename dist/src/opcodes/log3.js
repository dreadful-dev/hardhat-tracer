"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function parse(step, currentAddress) {
    if (!currentAddress) {
        throw new Error("[hardhat-tracer]: currentAddress is required for log to be recorded");
    }
    const stack = (0, utils_1.shallowCopyStack2)(step.stack);
    if (stack.length < 5) {
        throw new Error("[hardhat-tracer]: Faulty LOG3");
    }
    const dataOffset = (0, utils_1.parseNumber)(stack.pop());
    const dataSize = (0, utils_1.parseNumber)(stack.pop());
    const topic0 = (0, utils_1.parseHex)(stack.pop());
    const topic1 = (0, utils_1.parseHex)(stack.pop());
    const topic2 = (0, utils_1.parseHex)(stack.pop());
    const data = (0, utils_1.hexPrefix)(step.memory.slice(dataOffset, dataOffset + dataSize).toString("hex"));
    return {
        opcode: "LOG3",
        params: {
            data,
            topics: [topic0, topic1, topic2],
            address: currentAddress,
        },
        format() {
            throw new Error("[hardhat-tracer]: Not implemented directly");
        },
    };
}
exports.default = { parse };
//# sourceMappingURL=log3.js.map