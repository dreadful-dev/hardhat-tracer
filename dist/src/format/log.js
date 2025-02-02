"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLog = void 0;
const utils_1 = require("../utils");
const colors_1 = require("../utils/colors");
const param_1 = require("./param");
const result_1 = require("./result");
async function formatLog(log, currentAddress, dependencies) {
    let fragment;
    let result;
    let contractName;
    try {
        ({
            fragment,
            result,
            contractName,
        } = await dependencies.tracerEnv.decoder.decodeEvent(log.topics, log.data));
        // use just contract name
        contractName = contractName.split(":")[1];
    }
    catch { }
    // find a better contract name
    if (currentAddress) {
        const betterContractName = await (0, utils_1.getBetterContractName)(currentAddress, dependencies);
        if (betterContractName) {
            contractName = betterContractName;
        }
        else if (contractName) {
            dependencies.tracerEnv.nameTags[currentAddress] = contractName;
        }
    }
    const firstPart = `${(0, colors_1.colorContract)(contractName ? contractName : "UnknownContract")}${dependencies.tracerEnv.showAddresses || !contractName
        ? `(${currentAddress})`
        : ""}`;
    const secondPart = fragment && result
        ? `${(0, colors_1.colorEvent)(fragment.name)}(${(0, result_1.formatResult)(result, fragment.inputs, { decimals: -1, shorten: false }, dependencies)})`
        : `${(0, colors_1.colorEvent)("UnknownEvent")}(${(0, param_1.formatParam)(log.data, dependencies)}, ${(0, param_1.formatParam)(log.topics, dependencies)})`;
    return `${firstPart}.${secondPart}`;
}
exports.formatLog = formatLog;
//# sourceMappingURL=log.js.map