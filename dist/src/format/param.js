"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatParam = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const constants_1 = require("../constants");
const utils_2 = require("../utils");
function formatParam(value, dependencies) {
    if (value?._isBigNumber) {
        return (0, utils_2.colorValue)(ethers_1.BigNumber.from(value).toString());
    }
    else if (typeof value === "string" && value.slice(0, 2) !== "0x") {
        return (0, utils_2.colorValue)(`"${value}"`);
    }
    else if (typeof value === "string" &&
        value.slice(0, 2) === "0x" &&
        value.length === 42) {
        if ((0, utils_2.getFromNameTags)(value, dependencies)) {
            return (0, utils_2.colorNameTag)(`[${(0, utils_2.getFromNameTags)(value, dependencies)}]`);
        }
        else {
            if (dependencies.tracerEnv._internal.printNameTagTip === undefined) {
                dependencies.tracerEnv._internal.printNameTagTip = "print it";
            }
            return (0, utils_2.colorValue)((0, utils_1.getAddress)(value));
        }
    }
    else if (Array.isArray(value) &&
        (0, utils_2.removeNumericFromEthersResult)(value) === null) {
        return ("[" + value.map((v) => formatParam(v, dependencies)).join(", ") + "]");
    }
    else if (value?._isIndexed) {
        return `${(0, utils_2.colorIndexed)("[Indexed]")}${formatParam(value.hash, dependencies)}`;
    }
    else if (typeof value === "object" && value !== null) {
        const _value = (0, utils_2.removeNumericFromEthersResult)(value);
        return ("{" +
            Object.entries(_value)
                .map((entry) => {
                return `${(0, utils_2.colorKey)(entry[0] + constants_1.SEPARATOR)}${formatParam(entry[1], dependencies)}`;
            })
                .join(", ") +
            "}");
    }
    else {
        return value;
    }
}
exports.formatParam = formatParam;
//# sourceMappingURL=param.js.map