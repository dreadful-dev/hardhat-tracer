"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("../format/log");
const utils_1 = require("../utils");
async function format(item, dependencies) {
    return `${(0, utils_1.colorLabel)("[EVENT]")} ${await (0, log_1.formatLog)({
        data: item.params.data,
        topics: item.params.topics,
    }, item.params.address, dependencies)}`;
}
exports.default = { format };
//# sourceMappingURL=log.js.map