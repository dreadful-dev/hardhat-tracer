"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function parse(step) {
    const key = (0, utils_1.hexPrefix)(step.stack[step.stack.length - 1].toString(16));
    const next = 1; // get stack just after this opcode
    return {
        isAwaitedItem: true,
        next,
        parse: (stepNext) => ({
            opcode: "SLOAD",
            params: {
                key,
                value: (0, utils_1.hexPrefix)(stepNext.stack[stepNext.stack.length - 1].toString(16)),
            },
            format() {
                return format(this);
            },
        }),
    };
}
function format(item) {
    return `${(0, utils_1.colorLabel)("[SLOAD]")}  ${(0, utils_1.colorKey)(item.params.key)} → ${(0, utils_1.colorValue)(item.params.value)}`;
}
exports.default = { parse, format };
//# sourceMappingURL=sload.js.map