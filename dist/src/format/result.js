"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResult = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const colors_1 = require("../utils/colors");
const param_1 = require("./param");
function formatResult(result, params, { decimals, shorten }, dependencies) {
    decimals = decimals ?? -1;
    shorten = shorten ?? false;
    const stringifiedArgs = [];
    // const params = isInput
    //   ? fragment.inputs
    //   : (fragment as FunctionFragment)?.outputs;
    if (!params) {
        return "";
    }
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const name = param.name ?? `arg_${i}`;
        let value;
        if (decimals !== -1 && ethers_1.BigNumber.isBigNumber(result[i])) {
            value = (0, utils_1.formatUnits)(result[i], decimals);
        }
        else {
            value = (0, param_1.formatParam)(result[i], dependencies);
        }
        stringifiedArgs.push([
            name,
            value,
            // use decimals if available to format amount
            // decimals !== -1 && BigNumber.isBigNumber(result[i])
            //   ? formatUnits(result[i], decimals)
            //   : formatParam(result[i], param.components, dependencies),
        ]);
    }
    return `${stringifiedArgs
        .map((entry) => `${stringifiedArgs.length > 1 || !shorten
        ? (0, colors_1.colorKey)(`${entry[0]}: `)
        : ""}${entry[1]}`)
        .join(", ")}`;
}
exports.formatResult = formatResult;
//# sourceMappingURL=result.js.map