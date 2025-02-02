"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const call_1 = require("../format/call");
const utils_1 = require("../utils");
async function format(item, dependencies) {
    return ((0, utils_1.colorLabel)("[DELEGATECALL]") +
        " " +
        (await (0, call_1.formatCall)(item.params.to, item.params.inputData, 
        // TODO refactor these input types or order
        item.params.returnData ?? "0x", 0, // TODO show some how that msg.value
        item.params.gasUsed ?? 0, item.params.gasLimit, item.params.success ?? true, // if we don't have success, assume it was successful
        dependencies)));
}
exports.default = { format };
//# sourceMappingURL=delegatecall.js.map