"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = exports.parse = void 0;
const call_1 = __importDefault(require("./call"));
const create_1 = __importDefault(require("./create"));
const create2_1 = __importDefault(require("./create2"));
const delegatecall_1 = __importDefault(require("./delegatecall"));
const exception_1 = __importDefault(require("./exception"));
const extcodehash_1 = __importDefault(require("./extcodehash"));
const extcodesize_1 = __importDefault(require("./extcodesize"));
const log_1 = __importDefault(require("./log"));
const log0_1 = __importDefault(require("./log0"));
const log1_1 = __importDefault(require("./log1"));
const log2_1 = __importDefault(require("./log2"));
const log3_1 = __importDefault(require("./log3"));
const log4_1 = __importDefault(require("./log4"));
const revert_1 = __importDefault(require("./revert"));
const selfdestruct_1 = __importDefault(require("./selfdestruct"));
const sload_1 = __importDefault(require("./sload"));
const sstore_1 = __importDefault(require("./sstore"));
const staticcall_1 = __importDefault(require("./staticcall"));
function parse(step, currentAddress) {
    switch (step.opcode.name) {
        case "EXTCODESIZE":
            return extcodesize_1.default.parse(step);
        case "EXTCODEHASH":
            return extcodehash_1.default.parse(step);
        case "LOG0":
            return log0_1.default.parse(step, currentAddress);
        case "LOG1":
            return log1_1.default.parse(step, currentAddress);
        case "LOG2":
            return log2_1.default.parse(step, currentAddress);
        case "LOG3":
            return log3_1.default.parse(step, currentAddress);
        case "LOG4":
            return log4_1.default.parse(step, currentAddress);
        case "SLOAD":
            return sload_1.default.parse(step);
        case "SSTORE":
            return sstore_1.default.parse(step);
        case "REVERT":
            return revert_1.default.parse(step);
        default:
            return;
    }
}
exports.parse = parse;
async function format(item, dependencies) {
    switch (item.opcode) {
        case "CALL":
            return call_1.default.format(item, dependencies);
        case "DELEGATECALL":
            return delegatecall_1.default.format(item, dependencies);
        case "STATICCALL":
            return staticcall_1.default.format(item, dependencies);
        case "CREATE":
            return create_1.default.format(item, dependencies);
        case "CREATE2":
            return create2_1.default.format(item, dependencies);
        case "EXTCODESIZE":
            return extcodesize_1.default.format(item);
        case "EXTCODEHASH":
            return extcodehash_1.default.format(item);
        case "LOG0":
        case "LOG1":
        case "LOG2":
        case "LOG3":
        case "LOG4":
            return log_1.default.format(item, dependencies);
        case "SLOAD":
            return sload_1.default.format(item);
        case "SSTORE":
            return sstore_1.default.format(item);
        case "REVERT":
            return revert_1.default.format(item, dependencies);
        case "SELFDESTRUCT":
            return selfdestruct_1.default.format(item);
        case "EXCEPTION":
            return exception_1.default.format(item);
        default:
            return item.opcode + " not implemented";
    }
}
exports.format = format;
//# sourceMappingURL=index.js.map