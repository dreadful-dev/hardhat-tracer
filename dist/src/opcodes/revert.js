"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../format/error");
const utils_1 = require("../utils");
function parse(step) {
    const offset = Number(step.stack[step.stack.length - 1].toString());
    const length = Number(step.stack[step.stack.length - 2].toString());
    const data = (0, utils_1.hexPrefix)(step.memory.slice(offset, offset + length).toString("hex"));
    return {
        opcode: "REVERT",
        params: { data },
    };
}
async function format(item, dependencies) {
    return `${(0, utils_1.colorLabel)("[REVERT]")} ${await (0, error_1.formatError)(item.params.data, dependencies)}`;
}
exports.default = { parse, format };
//# sourceMappingURL=revert.js.map