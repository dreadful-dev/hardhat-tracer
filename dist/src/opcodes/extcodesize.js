"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function parse(step) {
    const address = (0, utils_1.parseAddress)(step.stack[step.stack.length - 1].toString(16));
    const next = 1; // get stack just after this opcode
    return {
        isAwaitedItem: true,
        next,
        parse: (stepNext) => ({
            opcode: "EXTCODESIZE",
            params: {
                address,
                size: Number(stepNext.stack[step.stack.length - 1].toString()),
            },
            format() {
                return format(this);
            },
        }),
    };
}
function format(item) {
    return `${(0, utils_1.colorLabel)("[EXTCODESIZE]")} ${(0, utils_1.colorKey)(item.params.address)} → ${(0, utils_1.colorValue)(item.params.size.toString())}`;
}
exports.default = { parse, format };
//# sourceMappingURL=extcodesize.js.map