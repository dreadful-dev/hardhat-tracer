"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfOpcodesAreValid = void 0;
const opcodes_1 = require("@nomicfoundation/ethereumjs-evm/dist/opcodes");
function checkIfOpcodesAreValid(opcodes, vm) {
    // fetch the opcodes which work on this VM
    const activeOpcodesMap = new Map();
    for (const opcode of (0, opcodes_1.getOpcodesForHF)(vm._common).opcodes.values()) {
        activeOpcodesMap.set(opcode.fullName, true);
    }
    // check if there are any opcodes specified in tracer which do not work
    for (const opcode of opcodes.keys()) {
        if (!activeOpcodesMap.get(opcode)) {
            throw new Error(`[hardhat-tracer]: The opcode "${opcode}" is not active on this VM. If the opcode name is misspelled in the config, please correct it.`);
        }
    }
}
exports.checkIfOpcodesAreValid = checkIfOpcodesAreValid;
//# sourceMappingURL=check-opcodes.js.map