"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printConsole = void 0;
const opcodes_1 = require("../opcodes");
// TODO make dependencies optional
async function printConsole(txTrace, dependencies) {
    if (!txTrace.top) {
        throw new Error("[hardhat-tracer]: this.top is undefined in print");
    }
    await printCall(dependencies, 0, txTrace.top);
}
exports.printConsole = printConsole;
async function printCall(dependencies, depth = 0, item) {
    const indentation = "   ".repeat(depth);
    console.log(indentation + (await (0, opcodes_1.format)(item, dependencies)));
    if (!!item.children) {
        for (const childItem of item.children) {
            await printCall(dependencies, depth + 1, childItem);
        }
    }
}
//# sourceMappingURL=console.js.map