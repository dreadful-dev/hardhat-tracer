"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function parse(step, currentAddress) {
    if (!currentAddress) {
        throw new Error("[hardhat-tracer]: currentAddress is required for log to be recorded");
    }
    const stack = (0, utils_1.shallowCopyStack2)(step.stack);
    if (stack.length < 2) {
        throw new Error("[hardhat-tracer]: Faulty LOG0");
    }
    const dataOffset = (0, utils_1.parseNumber)(stack.pop());
    const dataSize = (0, utils_1.parseNumber)(stack.pop());
    const data = (0, utils_1.hexPrefix)(step.memory.slice(dataOffset, dataOffset + dataSize).toString("hex"));
    return {
        opcode: "LOG0",
        params: {
            data,
            topics: [],
            address: currentAddress,
        },
        format() {
            throw new Error("[hardhat-tracer]: Not implemented directly");
        },
    };
}
exports.default = { parse };
//# sourceMappingURL=log0.js.map