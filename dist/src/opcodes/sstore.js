"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function parse(step) {
    return {
        opcode: "SSTORE",
        params: {
            key: (0, utils_1.hexPrefix)(step.stack[step.stack.length - 1].toString(16)),
            value: (0, utils_1.hexPrefix)(step.stack[step.stack.length - 2].toString(16)),
        },
        format() {
            return format(this);
        },
    };
}
function format(item) {
    return `${(0, utils_1.colorLabel)("[SSTORE]")} ${(0, utils_1.colorKey)(item.params.key)} ← ${(0, utils_1.colorValue)(item.params.value)}`;
}
exports.default = { parse, format };
//# sourceMappingURL=sstore.js.map